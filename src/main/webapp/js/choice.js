/*global Ext */
Ext.operon.tutorials.Choice=Ext.extend(Ext.util.Observable,
{
	constructor:function(question,data)
	{	
		Ext.operon.tutorials.Choice.superclass.constructor.call(this);
		this.choice_id=data.id;
		//this.choice_id=data.choice_id;
		this.letter=null;
		this.text=data.text;
		this.response=data.response;
		this.correct=data.correct;
		
		// state
		this.showresponse=false;	
		this.selected=false;
		this.current=false;
		
		// stats
		/*
		stats:
		{
			count: 0,
			fraction: '10/500'
		}
		*/
	}
});
