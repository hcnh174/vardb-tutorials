/*global Ext, operon */
Ext.define('operon.tutorials.Choice',
{	
	constructor: function(question,data)
	{	
		//operon.tutorials.Choice.superclass.constructor.call(this);
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
