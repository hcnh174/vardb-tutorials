/*global Ext */
Ext.operon.tutorials.Question=Ext.extend(Ext.operon.tutorials.Resource,
{
	constructor:function(tutorial,data)
	{	
		Ext.operon.tutorials.Question.superclass.constructor.call(this);
		this.tutorial=tutorial;
		this.question_id=data.id;
		//this.question_id=data.question_id;
		this.text=data.text;
		this.choices=[];
		
		// state
		this.complete=false;
		this.correct=null;
		this.tries=0;
		this.score=null;
		this.started=false;
		this.showscore=true;
		this.interactive=true;
		
		var index, choice;
		var letters='ABCDEFGHIJK';
		for (index=0;index<data.choices.length;index++)
		{
			choice=new Ext.operon.tutorials.Choice(this,data.choices[index]);
			choice.letter=letters[index];
			this.choices.push(choice);
		}
		//console.log('choices.length='+this.choices.length);
	},

	getChoice:function(choice_id)
	{
		if (!choice_id || choice_id==='')
		{
			alert('Please select a choice');
			return;
		}
		var index,choice;
		for (index=0;index<this.choices.length;index++)
		{
			choice=this.choices[index];
			if (choice.choice_id===choice_id)
				{return choice;}
		}
		alert('can\'t find choice: '+choice_id);
		return null;
	},
	
	submitAnswer:function(choice_id)
	{
		var choice=this.getChoice(choice_id);
		if (choice==null)
			{return;}
		this.started=true;
		this.tries++;
		choice.showresponse=true;
		choice.selected=true;
		if (choice.correct)
		{
			this.complete=true;
			if (this.tries==1)
			{
				this.correct=true;
				this.score=1;
				this.tutorial.score.numcorrect++;
			}
			else
			{
				this.tutorial.score.numincorrect++;
			}
			this.tutorial.score.numcompleted++;
			this.interactive=false;			
			this.page.shownext=true;
		}
		else
		{
			this.correct=false;
			this.score=0;
		}
		//Ext.DomHelper.overwrite('page_text',this.render());
		this.page.update();
	},

	render:function()
	{
		var str=document.getElementById('questionTemplate').value;
		var template=new Ext.XTemplate(str,
		{
			spacer: '<img src="images/spacer.gif" width="1" height="1" border="0" alt="spacer"/>',
			getBorder:function(type)
			{
				var src='images/q_'+type+'.gif';
				return '<img src="'+src+'" alt="border" width="30" height="30" border="0"/>';
			},
			getQuestionImage:function(question)
			{
				var src='question';
				//if (!question.started)// || !question.showscore)
				//	{src='question';}
				if (question.correct==true)
					{src='correct';}
				else if (question.correct==false)
					{src='wrong';}
				return 'images/q_'+src+'.gif';
			},
			getQuestionStats:function(question)
			{
				if (!question.stats)
					{return '';}
				var buffer=[];
				buffer.push('<div class="question_stats">');	
				buffer.push('Average score: '+question.stats.avescore+'%<br/>');
				buffer.push('Average tries: '+question.stats.avetries);
				buffer.push('</div>');
				return buffer.join('');
			},
			getChoiceStats:function(choice)
			{
				if (!choice.stats)
					{return '';}
				var cls='choice_stats'+(choice.correct ? ' correct' : '');
				var buffer=[];
				buffer.push('<td width="4%" valign="top" align="right">');
				buffer.push('<div class="'+cls+'">');
				buffer.push(choice.stats.count+'&nbsp;('+choice.stats.fraction+')');
				buffer.push('</div>');
				buffer.push('</td>');
				return buffer.join('');
			},
			getRadioId:function(choice)
			{
				if (!this.complete && this.interactive && !choice.selected)
					{return 'name="choice_id"';}
				else {return '';}
			},
			getRadioChecked:function(choice)
			{
				if (choice.current)
					{return 'checked="true"';}
				else {return '';}
			},
			getRadioDisabled:function(choice)
			{
				if (this.complete || choice.selected)
					{return 'disabled="disabled"';}
				else {return '';}
			},
			getChoiceClass:function(question,choice)
			{
				if (this.showscore && choice.selected && choice.correct)
					{return 'choicecorrect';}
				else {return 'choice';}
			},
			getResponseClass:function(choice)
			{
				if (!choice.selected)
					{return 'other_feedback';}
				else if (choice.correct)
					{return 'correct_feedback';}
				else {return 'feedback';}
			}
		});
		return template.apply(this);
	}
});
