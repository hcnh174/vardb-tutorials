/*global Ext */
Ext.operon.tutorials.Resource=Ext.extend(Ext.util.Observable,
{
	number: null,
	page_id: null,
	
	constructor:function(config)
	{	
		Ext.operon.tutorials.Resource.superclass.constructor.call(this);	
	}
});
