---
layout: post
title: Woe unto the COM-referencing VS2005 Winforms Designer
date: 2005-11-10 22:06
author: chrispelatari
---
<b><font face="Arial" size="2">One or more errors encountered 
while loading the designer. The errors are listed below. Some errors can be 
fixed by rebuilding your project, while others may require code 
changes.</font><font face="Arial" size="2"></font></b> 
<div class="ErrorStyle" id="div1"><span style="font-weight:600;"><br />The designer loader did not provide a root 
component but has not indicated why. </span><br /><a id="details0" href=""><u><font color="#0000ff">Hide</font></u></a><font color="#0000ff">    </font></div>
<div class="StackStyleVisible" id="div20"><br />at 
System.ComponentModel.Design.DesignSurface.get_View()<br />at 
Microsoft.VisualStudio.Shell.Design.<br />WindowPaneProviderService.CreateWindowPane(DesignSurface 
surface)<br />at 
Microsoft.VisualStudio.Design.Serialization.CodeDom.<br />DeferrableWindowPaneProviderService.CreateWindowPane(DesignSurface 
surface)<br />at 
Microsoft.VisualStudio.Design.VSDesignSurface.Microsoft.VisualStudio.<br />Designer.Interfaces.IVSMDDesigner.get_View()</div>
<p> It looks like there are a lot of people that got this error when going 
from beta2 -&gt; RC1, but this was on the RTM version. The thing that's tricky 
is that now the designer is so nice for us, it adds default values to public 
properties. Well, since the code that was being called was basically a wrapper 
for mshtml, I guess you could say COM was involved (like a third cousin). In 
order to find this bug (in my code, but my code generated by VS2005.) I had to 
fire up another devenv.exe instance and set it to attach to the first devenv's 
process for debugging. I don't know the exact workaround for this yet...maybe 
making the particular property that was causing trouble readonly w/ an 
accompanying SetProperty(value) method that would still let the underlying value 
be set. See the problem is that VS regenerates all that goodness for me, so 
whenever a change is made and saved in the designer I would be facing the same 
problem, have to hunt down one line of code, and start over again. Boo. </p>
<p>Is there a way to turn off the designer's new behavior?</p>
