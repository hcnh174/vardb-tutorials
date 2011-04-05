/*global Ext, operon */
Ext.define('operon.tutorials.Score',
{
	constructor: function(tutorial)
	{	
		this.numcorrect=0;
		this.numincorrect=0;
		this.numcompleted=0;
		this.tutorial=tutorial;
		this.spacer=vardb.util.Utils.spacer();
		//this.spacer='<img src="images/spacer.gif" width="1" height="1" border="0" alt="spacer"/>';	
	},

	update: function()
	{
		Ext.core.DomHelper.overwrite('score',this.render());
	},
	
	render: function()
	{		
		var str=document.getElementById('scoreTemplate').value;
		var self=this;
		
		var questions=[];
		this.tutorial.questions().each(function(question)
		{
			questions.push(
			{
				page_number: question.page_number,
				number: question.number,
				complete: question.complete,
				tries: question.tries,
				score: question.score,
				scoreimage: self.scoreimage(question)
			});
		});
		
		var template=new Ext.XTemplate(str);
		var html=template.apply(
		{
			spacer: this.spacer,
			scorebar1: this.scorebar(this.numcorrect,'#009966'),
			scorebar2: this.scorebar(this.numincorrect,'red'),
			numcorrect: this.numcorrect,
			numincorrect: this.numincorrect,
			numcompleted: this.numcompleted,
			questions: questions
		});
		return html;
	},
	
	scoreimage:function(question)
	{
		var image='spacer.gif';
		if (question.complete && question.correct)
	        {image='check_sm15.gif';}
		else if (question.complete && !question.correct)
			{image='x_sm15.gif';}
		return 'images/'+image;
	},
	
	scorebar:function(max,color)
	{
		var buffer=[], number;
		if (this.numcompleted>0)
		{
			for (number=1;number<=this.numcompleted;number++)
			{
				buffer.push('<td');
				if (number<=max) //this.numcorrect
					{buffer.push(' bgcolor="'+color+'"');} //#009966
				buffer.push('>');
				buffer.push(this.spacer);
				buffer.push('</td>');
			}
		}
		else
		{
			buffer.push('<td>');
			buffer.push(this.spacer);
			buffer.push('</td>');
		}
		return buffer.join('');
	},
	
	
	/*
	render: function()
	{
		var str=document.getElementById('scoreTemplate').value;
		var template=new Ext.XTemplate(str,
		{
			scoreimage:function(question)
			{
				var image='spacer.gif';
				if (question.complete && question.correct)
			        {image='check_sm15.gif';}
				else if (question.complete && !question.correct)
					{image='x_sm15.gif';}
				return 'images/'+image;
			},
			scorebar:function(question,max,color)
			{
				var buffer=[], number;
				if (question.numcompleted>0)
				{
					for (number=1;number<=question.numcompleted;number++)
					{
						buffer.push('<td');
						if (number<=max) //this.numcorrect
							{buffer.push(' bgcolor="'+color+'"');} //#009966
						buffer.push('>');
						buffer.push(this.spacer);
						buffer.push('</td>');
					}
				}
				else
				{
					buffer.push('<td>');
					buffer.push(this.spacer);
					buffer.push('</td>');
				}
				return buffer.join('');
			}
		});
		return template.apply(this);
	},
	*/
	
	addCorrect: function()
	{
		this.numcorrect++;
		this.numcompleted++;
	},
	
	addIncorrect: function()
	{
		this.numincorrect++;
		this.numcompleted++;
	}
});
