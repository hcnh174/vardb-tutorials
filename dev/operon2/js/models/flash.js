/*global Ext, operon */
Ext.regModel('Flash',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'base'},
	 	{name: 'src'},
	 	{name: 'title'},
	 	{name: 'caption'}	
	],
	belongsTo: 'Tutorial',
	
	number: null,
	page_number: null,
	
	indexResources:function(tutorial, page)
	{
		this.tutorial=tutorial;
		this.page=page;
		this.page_number=page.get('number');
		this.number=tutorial.flashnumber++;
	},
	
	render:function()
	{
		var buffer=[];
		buffer.push('(FLASH)');		
		return buffer.join('');
	}
});
