/*global Ext, operon */
Ext.define('operon.tutorials.Toc',
{
	constructor: function(tutorial)
	{
		this.tutorial=tutorial;
	},
	
	update: function()
	{		
		var str=document.getElementById('tocTemplate').value;
		
		var pages=[];
		this.tutorial.pages().each(function(page)
		{
			pages.push(
			{
				title: page.get('number')+'. '+page.get('title'),
				cls: page.getCssClass(),
				number: page.get('number'),
				enabled: page.enabled
			});
		});
		
		var template=new Ext.XTemplate(str);
		var html=template.apply(
		{
			spacer: vardb.util.Utils.spacer(),
			pages: pages
		});
		Ext.core.DomHelper.overwrite('toc',html); //
	}
});
