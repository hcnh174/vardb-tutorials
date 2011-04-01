/*global Ext, operon */
Ext.define('operon.tutorials.Score',
{
	constructor: function(tutorial)
	{	
		this.numcorrect=0;
		this.numincorrect=0;
		this.numcompleted=0;
		this.questions=tutorial.questions;
		
		this.spacer='<img src="images/spacer.gif" width="1" height="1" border="0" alt="spacer"/>';
		
		this.update=function()
		{
			Ext.core.DomHelper.overwrite('score',this.render());
		}
		
		this.render=function()
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
		}
	}
});
