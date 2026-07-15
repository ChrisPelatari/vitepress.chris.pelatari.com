---
layout: post
title: Forcing the DataGridView to do my bidding - a tale of ComboBox hackery
date: 2005-12-07 20:38
author: chrispelatari
---

***sigh* **Winforms team, winforms team, when will you start making my life easier? As [others have said](http://angrypets.com/blog/posts/554.aspx) (and I [completely agree](http://www.chrisfrazier.net/blog/archive/2005/09/07/1318.aspx)) windowsforms.net is pretty useless. Well, there's some new ~~Whidbey~~ .NET 2.0 content, but all of the things I enjoyed when starting w/ v1 of .NET (like, erm, QuickStarts? What happened to installing those locally?) seem to be gone. To be fair, they do have a presence over on [forums.microsoft.com](http://forums.microsoft.com/MSDN/default.aspx?ForumGroupID=2&SiteID=1) where there are a few PM's and devs answering questions. I even found a ~~hack~~ fix for my dilemma via one of the posts that links to a [download](http://download.microsoft.com/download/c/8/b/c8bc8bfe-30e6-417d-8c42-1bbf714bf976/VS05-01MacDonald.exe) from Beta 2 or somewhere close.

At first I was optimistic about the DataGridView samples ([overview](http://www.windowsforms.net/WhidbeyFeatures/default.aspx?PageID=2&ItemID=13&Cat=Controls&tabindex=5))([Download The DataGridView samples](http://www.windowsforms.net/Samples/download.aspx?PageId=1&ItemId=220&tabindex=4)), but I didn't see anything that did what I wanted to do: take an enum value and represent it in the grid with a combobox. So, here's how I did it.

First, I just plopped a DataGridView onto a form and gave it a BindingSource. The bindingSource gets its DataSource property set via a call into my DAL that returns a DataTable:

```csharp
//CF: set to null before setting it to the current to
//clear out previous results
this.bindingSource1.DataSource = null;

this.bindingSource1.DataSource = MyDal.GetDataTable();
```

Then comes the hackery. Since I have about 20 columns in this DataTable, all of interest as far as values but not all needing to be visible, directly after (like the line after) setting the datasource, I call a method to format the grid. This method looks something like this:

```csharp
private void _formatGrid(){
	this.dataGridView1.Columns["ID"].Visible = false;
	this.dataGridView1.Columns.Remove("Status");//CF: this is where we want enums.
	...
	this._formatStatusColumn();
}
```

Then the _formatStatusColumn method is where the magick happens:

```csharp
DataTable dt = new DataTable("Status");

//CF: actually how it's stored in the db.
dt.Columns.Add("Status", typeof(int));
dt.Columns.Add("Status_Name", typeof(string));

//CF: this way I can add or remove enum values, and
//the combo will always reflect the correct values.
foreach(int index in Enum.GetValues(typeof(Status)){
	dt.Rows.Add(index, Enum.GetName(typeof(Status), index));
}

//CF: now for the UI column
DataGridViewComboBoxColumn statusColumn =
	new DataGridViewComboBoxColumn();

//CF: seems to control where the column is placed.
statusColumn.DisplayIndex = 3;
statusColumn.HeaderText = "Status";

statusColumn.DataPropertyName = "Status";
statusColumn.DataSource = dt;
statusColumn.DisplayMember = "Status_Name";
statusColumn.ValueMember = "Status";

this.dataGridView1.Columns.Add(statusColumn);
```

I was *hoping* that there would be some way to predefine columns so I don't have to filter and rebuild every time I get data from the database, but I couldn't find anything on it. There is no SelectedIndex member of the DataGridViewComboBoxCell, either.

I really hope this helps someone else out there: I tried for a day and a half to get this to work, and I still think it looks like a hack.
