---
layout: post
title: "PostXING and interfaces"
description: ""
category: 
tags: []
---

I feel like I'm going nuts with interfaces in the next version of [PostXING](http://PostXING.url123.com/main). Interfaces are a language feature that is really powerful - you don't really start to appreciate it until you are faced with situations that would otherwise be impossible to deal with.

PostXING already uses interfaces to load plugins like the [NetSpellPlugin](http://PostXING.url123.com/nsv1.0.5005.1)for spell checking. So I thought hey, go with what you know for this plugin/provider idea that I've had stewing in my head for a while. I've already included [MikeDub's](http://mikedub.net/)awesome [IUI library](http://url123.com/a2nq7) (modified with - you guessed it, [interfaces](http://www.chrisfrazier.net/blog/archive/2004/09/11/593.aspx)!) so I figured I might as well milk that for all it's worth. And trust me, I am :)

The idea I have is to use IUI to set up a new/edit an existing "blog" (what PostXING sees as a blog) and let each plugin/provider take care of any special configuration they might need. But there's a problem - every provider should have common attributes defined within the interface, but there is also non-blog information that I would like to store (like ftp settings, whether or not you want media information to show up like below (I know, Alice in Chains again - I just write good code to that CD), and preview formatting).

So, how do I communicate that the custom IUI pages are done so that the rest of the configuration can continue? Well, I *could* use a vanilla EventHandler event, but how can I make sure that the main exe project will be able to handle the event without knowing which provider has been loaded? Furthermore, how can the provider send up an event for it to catch without having a reference to the main exe project (a circular dependency - nono!)?

Interfaces.

I create an interface that only the dialog that shows the configuration pages should implement. It could be a simple interface with only 1 to 3 methods defined for it (if I want to only expose moving forward to one page vs. moving to any available page thereafter)...see what I'm getting at? Maybe some code will better explain what I'm getting at:

```csharp
using System;
using System.Collections;

public interface IFoo{
	void HandleEvent(object sender, EventArgs e);
}

public class FooInstance : IFoo{
	public void HandleEvent(object sender, EventArgs e){
		System.Windows.Forms.MessageBox.Show("Handled! Booyakasha!");
	}
}

public class MyClass
{
	public static void Main()
	{
		IFoo thisfoo = new FooInstance();

		MyClass s = new MyClass();

		s.WireUpEvent(thisfoo);

		if(s.throwevent != null){
			s.throwevent(s, EventArgs.Empty);
		}
	}
	public event EventHandler throwevent;

	public void WireUpEvent(IFoo foo){
		this.throwevent += new EventHandler(foo.HandleEvent);
	}
}
```

This was a little POC that I coded up in snippet compiler - and yes, it compiles and runs wonderfully. Booyakasha indeed. Here, IFoo is the interface that is implemented by the dialog. Passing the concrete FooInstance (the dialog) to the method WireUpEvent of what will be the provider class works thanks to wonderful, wonderful interfaces.

*[ Currently Playing : Nutshell - Alice in Chains - Unplugged (4:57) ]*
