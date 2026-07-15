---
layout: post
title: Object cannot be stored in an array of this type.
date: 2005-07-07 05:45
author: chrispelatari
---

This was the error that was biting me on PostXING v2 for almost a week (I usually only get insomnia hours to debug. That can be frustrating.)

The first thing that I noticed was that the wonderful interfaces that I was using would end up null after my first visit to a particular configuration page. It's something about the way that a "Page" is saved and loaded - it requires ViewState! Forreal! I'd gotten so used to having state within my smart clients that I had almost forgot about reconstructing state.

Now that I had that taken care of, I was getting an exception returned from what seemed to be the service endpoint of the metablog api. But wait a second - I'm using nearly the same code in v1. So I think, hey, I'll go ahead and use exactly the same code from v1 and put that in there - that'll surely work, right?

```csharp
using System;
using CookComputing.XmlRpc;

namespace PostXING.MetaBlogProvider
{
	/// <summary>
	/// BlogRequest wraps the blogger api getUsersBlog xml-rpc method.
	/// </summary>
	public class BlogRequest : XmlRpcClientProtocol
	{
		public BlogRequest(){	}

		[XmlRpcMethod("blogger.getUsersBlogs",
			 Description="Returns information on all the blogs a given user "
			 + "is a member.")]
		public bgBlogInfo[] getUsersBlogs(string appKey,string username,string password) {
			return (bgBlogInfo[])Invoke("getUsersBlogs",new object[]{appKey,username,password});
		}
	}
}
```

Nope, same exception (the title of this post). After the dent in my head grew to about three inches, I decided to look at the version of [xml-rpc.net](http://xml-rpc.net) that I was using. Hmm, 0.8. What version was the endpoint using? Double hmm, 0.9. Could it be a simple version mismatch that was my problem giving me this cryptic error?

Yep.
