---
  layout: post
  title: "AdjustResize lies: rescuing a WebView editor from the Android keyboard"
  date: 2026-06-05
  categories: [dotnet, maui, android]
  author: chrispelatari
  excerpt: A keyboard-handling fix that was already in my repo and had never worked, two Android APIs that lie about the soft keyboard, and the WebView remote-debugging trick that proved it.
---

# AdjustResize lies: rescuing a WebView editor from the Android keyboard

When you tap into a text field on your phone, you expect to see what you type. In [PostXING](https://github.com/BlueFenixProductions/PostXING), the Markdown blog editor I'm building in .NET MAUI, you didn't — on Android. The bottom third of the editor sat behind the soft keyboard, so anything you typed near the end of a document went invisible until you swiped the keyboard away. You could feel your way through it, sort of, the way you'd type with your eyes shut. Not exactly the writing experience I was going for.

I went in expecting to spend twenty minutes wiring up keyboard handling. Instead I spent the afternoon discovering that the keyboard handling was already there — and had never once worked. That's the part worth writing down, because the bug was easy and the lie underneath it was not.

## The setup

PostXING's editor is a MAUI `HybridWebView` hosting a little `contenteditable` page with my own syntax highlighting. The Android manifest already had the textbook incantation:

```xml
android:windowSoftInputMode="adjustResize"
```

And the page already had the other half — a height pinned to `window.visualViewport.height`, a `visualViewport.resize` listener, and a `scrollCaretIntoView()` that nudged the caret back into view on every edit. Whoever wrote that (me, months ago) clearly knew the drill. Keyboard opens, window shrinks, viewport shrinks, editor resizes, caret stays put.

Except it didn't do any of that. So the question wasn't "how do I handle the soft keyboard." It was the more annoying one: why does the perfectly reasonable keyboard code already sitting in my repo do absolutely nothing?

## Two platform facts, both of which I learned the hard way

**`adjustResize` is dead under edge-to-edge.** PostXING targets Android SDK 36. As of SDK 35, Android forces edge-to-edge on you, and under edge-to-edge `adjustResize` stops shrinking your window for the keyboard — the window stays full height and the keyboard just paints on top of it. There's an opt-out flag, `windowOptOutEdgeToEdgeEnforcement`, and I got briefly excited about it, right up until I read that it's ignored the moment you target SDK 36. So that door is bricked over. You're expected to consume the IME inset yourself via `WindowInsets`, like an adult.

**`visualViewport` can't see the keyboard inside a WebView.** This is the one that got me, and the one I flat-out refused to believe at first. In a regular mobile browser, the keyboard resizes the browser's viewport, `visualViewport.height` drops, your JS reacts, everyone's happy. Inside a `HybridWebView` embedded in an edge-to-edge native window, none of that happens. The keyboard is the host app's business, the WebView's bounds never move, and the page is blissfully unaware that two-thirds of it just got covered.

Put those together and the existing fix was blind in both eyes. `adjustResize` wasn't shrinking the window, and `visualViewport` wasn't reporting the keyboard, so my clever viewport-driven sizing was faithfully setting the editor to full height, every single time.

## I stopped guessing and measured

I had a theory by this point, but theories about WebView viewport behavior are wrong about half the time, and I'd already burned an hour. So I did the thing I should have done first: I read the actual numbers off the running page. You can, because a debug MAUI build leaves the Android WebView wide open to Chrome's remote debugging protocol.

```bash
# find the pid (adb shell pidof <pkg>), then forward to the WebView's devtools socket
adb forward tcp:9222 localabstract:webview_devtools_remote_<pid>
# GET http://localhost:9222/json/list  ->  grab the webSocketDebuggerUrl
# then Runtime.evaluate over that socket:
```

```js
JSON.stringify({
  dpr:     devicePixelRatio,
  innerH:  innerHeight,
  vvH:     visualViewport.height,
  editorH: document.querySelector('#editor').clientHeight,
})
```

Keyboard up:

```
dpr 3.125 | innerH 644 | visualViewport.height 644 | editorH 644
```

Keyboard down:

```
dpr 3.125 | innerH 644 | visualViewport.height 644 | editorH 644
```

Identical. Down to the pixel. The visual viewport never so much as flinched when the keyboard came up. That one comparison is the entire bug: the page can't see the keyboard, so the editor stays 644 pixels tall, and `scrollCaretIntoView()` cheerfully decides the caret is "visible" while it's hiding behind the keyboard.

It handed me the missing number, too. The native side, which *can* see the keyboard, reports an IME inset of 970 device pixels. 970 / 3.125 = 310 CSS pixels, and 644 − 310 = 334, the actual height I had to work with. The host knew the number the page needed the whole time. It just wasn't about to snitch.

## The fix: native owns the number, JavaScript owns the layout

Say it that way and it more or less writes itself. The native layer is the only one that can see the keyboard, so it reads the inset and shoves it into the page. The page is the only one that can lay out the editor, so it takes the number and resizes.

Native side → an inset listener scoped to the WebView, firing the keyboard height into the page whenever it changes:

```csharp
ViewCompat.SetOnApplyWindowInsetsListener(webView, new ImeListener(insets =>
{
    var imeBottom = insets.GetInsets(WindowInsetsCompat.Type.Ime())?.Bottom ?? 0;
    // fire-and-forget host -> JS, the one channel that actually works on Android
    webView.EvaluateJavaScriptAsync($"window.editor?.setKeyboardInsetPx({imeBottom})");
}));
```

Page side → size to the visible area, keep the caret honest:

```js
let keyboardPx = 0; // device px, pushed from native; 0 = hidden

function sizeEditor() {
  const visible = keyboardPx > 0
    ? innerHeight - keyboardPx / devicePixelRatio
    : (visualViewport ? visualViewport.height : innerHeight);
  editor.style.height = visible + 'px';
}

window.editor.setKeyboardInsetPx = (px) => {
  keyboardPx = px;
  sizeEditor();
  scrollCaretIntoView();
};

// keep the caret visible on every caret move — even mid IME composition
document.addEventListener('selectionchange', () => scrollCaretIntoView());
```

Two things in there earn their keep. The `selectionchange` listener is what actually fixes *typing*. My `input` handler deliberately holds off while the IME is composing, so it doesn't murder predictive text and voice input mid-word, but that same deferral lets the caret drift behind the keyboard while you compose. `selectionchange` fires on every caret move no matter what the IME is doing, so the caret stays pinned. And on desktop, all of this is a no-op: `keyboardPx` stays 0, the code falls back to the visual viewport, and Windows behaves exactly as it did before.

The best part: the same remote-debugging harness that found the bug verified the fix. Keyboard up, editor height drops 644 → 334. Type fourteen lines and the editor scrolls to follow the caret, newest line riding just above the keyboard. Keyboard down, back to 644. The diagnostic *was* the test.

## What I took away

**A fix that's already in the code plus a bug that's still open means a false assumption, not missing code.** The `visualViewport` sizing had been sitting there for ages precisely *because* it looks right. And that's exactly why nobody noticed it did nothing. The useful question was never "what should I add," it was "why does what's here do nothing," and the answer was a platform assumption that simply isn't true on this surface.

**Measure the web layer instead of arguing with it.** For any WebView question on a device you can plug in, `adb forward` to the devtools socket and read `innerHeight` / `visualViewport.height` / your element sizes off the live page. It turned "but `adjustResize` is *supposed* to handle this" into "here are the numbers, the viewport is 644 with the keyboard up, stop." Five minutes of measurement beat an afternoon of confident theories. Ask me how I know.

**One number, one owner.** The clean version has native owning the keyboard height and the page owning the layout, meeting at exactly one call. The first version I tried — native padding the WebView *and* JS sizing, neither aware of the other — looked fixed in a screenshot and broke the instant I typed. The cleanest fix usually deletes the second source of truth instead of trying to keep two in sync.
