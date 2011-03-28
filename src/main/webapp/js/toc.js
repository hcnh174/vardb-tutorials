/*global Ext */
Ext.operon.tutorials.Toc=Ext.extend(Ext.util.Observable,
{
	spacer: '<img src="images/spacer.gif" width="1" height="1" border="0" alt="spacer"/>',
	
	constructor:function(tutorial)
	{
		this.tutorial=tutorial;
		this.pages=tutorial.pages;
		Ext.operon.tutorials.Toc.superclass.constructor.call(this);
	},
	
	update:function()
	{		
		var str=document.getElementById('tocTemplate').value;
		var template=new Ext.XTemplate(str,
		{
			getCssClass:function(tocpage)
			{
				if (tocpage.current)
					{return 'current';}
				else if (tocpage.complete)
					{return 'completed';}
				else {return 'future';}
				//else if (tocpage.enabled)
				//	{return 'future';}				
			}
		});
		var html=template.apply(this);
		Ext.DomHelper.overwrite('west-content',html);
	}
});
