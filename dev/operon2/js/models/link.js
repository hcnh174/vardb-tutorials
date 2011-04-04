/*global Ext, operon */
Ext.regModel('Link',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'href'},
	 	{name: 'text'}	
	],
	belongsTo: 'Tutorial',
	
	number: null,
	page_id: null,
	
	indexResources:function(tutorial, page)
	{
		this.tutorial=tutorial;
		this.page=page;
		this.page_id=page.get('id');
		this.number=tutorial.linknumber++;
	},
	
	render:function()
	{
		var buffer=[];
		buffer.push('<a href="'+this.get('href')+'" target="_blank">'+this.get('text')+'</a>');	
		return buffer.join('');
	}
});
