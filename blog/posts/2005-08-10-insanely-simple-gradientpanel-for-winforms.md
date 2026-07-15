---
layout: post
title: Insanely simple GradientPanel for WinForms
date: 2005-08-10 21:01
author: chrispelatari
---

This has probably been done a hundred times already, but I couldn't find one in the first few pages of google results, so I wrote my own in ~40 lines of C#:

```csharp
using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PostXING.Controls
{
	/// <summary>
	/// GradientPanel is just like a regular panel except it optionally
	/// shows a gradient.
	/// </summary>
	[ToolboxBitmap(typeof(Panel))]
	public class GradientPanel : Panel
	{
		/// <summary>
		/// Property GradientColor (Color)
		/// </summary>
		private Color _gradientColor;
		public Color GradientColor {
			get { return this._gradientColor;}
			set { this._gradientColor = value;}
		}

		/// <summary>
		/// Property Rotation (float)
		/// </summary>
		private float _rotation;
		public float Rotation {
			get { return this._rotation;}
			set { this._rotation = value;}
		}

		protected override void OnPaint(PaintEventArgs e) {
                        if(e.ClipRectangle.IsEmpty) return; //why draw if non-visible?

			using(LinearGradientBrush lgb = new
                           LinearGradientBrush(this.ClientRectangle,
		              this.BackColor,
		              this.GradientColor,
		              this.Rotation)){
				e.Graphics.FillRectangle(lgb, this.ClientRectangle);
			}

                        base.OnPaint (e); //right, want anything handled to be drawn too.

		}
	}
}
```

There it is. Enjoy!

*[ Currently Playing : New Way Home - Foo Fighters - The Colour And The Shape (5:42) ]*
