/*global Ext */
Ext.operon.tutorials.Link=Ext.extend(Ext.operon.tutorials.Resource,
{	
	constructor:function(tutorial,data)
	{	
		Ext.operon.tutorials.Link.superclass.constructor.call(this);
		this.link_id=data.id;
		//this.link_id=data.link_id;
		this.href=data.href;
		this.text=data.text;
	},
	
	render:function()
	{
		var buffer=[];
		buffer.push('<a href="'+this.href+'" target="_blank">'+this.text+'</a>');	
		return buffer.join('');
	}
});

