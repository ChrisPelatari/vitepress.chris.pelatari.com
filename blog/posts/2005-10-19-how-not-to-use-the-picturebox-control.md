---
layout: post
title: How not to use the PictureBox control.
date: 2005-10-19 21:04
author: chrispelatari
---

I was having this problem in an application that I've been working on where I was drawing data points onto a PictureBox control - kind of like a canvas. The problem only showed up when a lot of data was thrown at the PictureBox: instead of seeing my data, I would see a loverly **big red x**.

So I did some chasing down a few rabbit holes (apparently this is a difficult issue to pinpoint - I found loads of unanswered forum/newsgroup posts about a red x) and found [Bob Powell's GDI+ faq](http://www.bobpowell.net/faqmain.htm). Specifically, I found a good overview of [How not to use the PictureBox control.](http://www.bobpowell.net/pictureboxhowto.htm) After a few trials of throwing largish datasets at my picturebox canvas (that had yeilded those nasty red x's after a few screen refreshes just minutes before) it seems like the advice in that article just may have solved the problem.

We had been drawing to a Graphics object, then using that to spit out an image to the PictureBox's .Image property:

```csharp
Graphics g = pbxCanvas.CreateGraphics();

//draw to graphics

pbxCanvas.Image = GetCanvasImage();
```

instead, now we create the Graphics object off of the .Image in the first place. It takes a little bit more setup, but I have yet to run into the red x again since implementing this code:

```csharp
if(pbxCanvas.Image == null){
	pbxCanvas.Image = new Bitmap(pbxCanvas.Width, pbxCanvas.Height);
}

Graphics g = Graphics.FromImage(pbxCanvas.Image);

//draw to graphics

pbxCanvas.Image = GetCanvasImage();
pbxCanvas.Invalidate();
```

Who would have thought that a call to Control.CreateGraphics would be so harmful?
