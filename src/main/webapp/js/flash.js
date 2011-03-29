/*global Ext */
Ext.operon.tutorials.Flash=Ext.extend(Ext.operon.tutorials.Resource,
{	
	constructor:function(tutorial,data)
	{	
		Ext.operon.tutorials.Flash.superclass.constructor.call(this);
		this.tutorial=tutorial;
		this.flash_id=data.id;
		//this.flash_id=data.flash_id;
		this.name=data.name;
		this.base=data.base;
		this.src=data.src;
		this.title=data.title;
		this.caption=data.caption;	
	},
	
	render:function()
	{
		var buffer=[];
		buffer.push('(FLASH)');		
		return buffer.join('');
	}
});
