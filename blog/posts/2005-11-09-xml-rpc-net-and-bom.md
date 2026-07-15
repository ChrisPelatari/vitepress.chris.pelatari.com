---
layout: post
title: xml-rpc.net and BOM
date: 2005-11-09 08:13
author: chrispelatari
---

I'm using [xml-rpc.net](http://xml-rpc.net) as the library that supports xml-rpc for the MetaWeblog api in [PostXING](http://PostXING.url123.com/main).

I recently ran into a service endpoint that included a [Byte Order Mark](http://en.wikipedia.org/wiki/Byte_Order_Mark) in the payload of the response. Something I haven't run into yet basically because the few blog engines that I have tested px with have not included this. It turns out that the XmlDocument.Load method that accepts a stream doesn't take this into account (or something:).

So this is what I did to workaround the problem: basically, if the first character is not <, the second must be otherwise the content is invalid anyways.

```csharp
//...the DeserializeResponse method that accepts a stream
StreamReader sr = new StreamReader(stm);

string content = sr.ReadToEnd();

if(content.Trim().Length > 0 && content[0] != '<'){
	content = content.Substring(1);
}

StringReader str = new StringReader(content);

try{
	xdoc.Load(str);
}
```

The other endpoints still work after this modification, so I guess it's okay.

**update**: there was an indexoutofrange exception just waiting to happen up there.
