/*global Ext, operon */
Ext.define('operon.tutorials.Link',
{	
	extend: 'operon.tutorials.Resource',
	
	constructor:function(tutorial,data)
	{	
		//operon.tutorials.Link.superclass.constructor.call(this);
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

