/*global Ext, operon */
Ext.regModel('Question',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'text'}
	],
	hasMany: {model: 'Choice', name : 'choices'},
	belongsTo: 'Tutorial',
	
	number: null,
	page_id: null,
	
	// state
	complete: false,
	correct: null,
	tries: 0,
	score: null,
	started: false,
	showscore: true,
	interactive: true,
	
	indexResources:function(tutorial, page)
	{
		this.tutorial=tutorial;
		this.page=page;
		this.page_id=page.get('id');
		this.number=tutorial.questionnumber++;
		page.shownext=false;
		
		var letters='ABCDEFGHIJK';
		var index=0;
		this.choices().each(function(choice)
		{
			choice.set('letter',letters[index++]);
		});
	},
	
	getChoice:function(choice_id)
	{
		if (!choice_id || choice_id==='')
		{
			alert('Please select a choice');
			return;
		}
		return vardb.util.Utils.getArrayItem(this.choices(),"id",choice_id);
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
		//Ext.core.DomHelper.overwrite('page_text',this.render());
		this.page.update();
	},

	getBorder:function(type)
	{
		var src='images/q_'+type+'.gif';
		return '<img src="'+src+'" alt="border" width="30" height="30" border="0"/>';
	},
	
	render:function()
	{
		var str=document.getElementById('questionTemplate').value;

		var self=this;
		var choices=[];
		this.choices().each(function(choice)
		{
			choices.push(
			{
				choice_id: choice.get('id'),
				radioId: self.getRadioId(choice),
				radioChecked: self.getRadioChecked(choice),
				radioDisabled: self.getRadioDisabled(choice),
				choiceClass: self.getChoiceClass(choice),
				responseClass: self.getResponseClass(choice),
				text: choice.get('text'),
				response: choice.get('response'),
				showresponse: choice.showresponse
			});
		});
		
		
		var str=document.getElementById('questionTemplate').value;
		var template=new Ext.XTemplate(str);
		var html=template.apply(
		{
			spacer: vardb.util.Utils.spacer(),
			tutorial_id: this.tutorial.get('_id'),
			page_id: this.page.get('id'),
			question_id: this.get('id'),
			qimage: this.getQuestionImage(this),
			number: this.number,
			text: this.get('text'),
			tl: this.getBorder('tl'),
			tr: this.getBorder('tr'),
			bl: this.getBorder('bl'),
			br: this.getBorder('br'),
			choices: choices,
			showsubmit: this.getShowSubmit()
		});
		return html;
	},
	
	getShowSubmit:function()
	{
		return !this.complete && this.interactive;
	},
	
	getQuestionImage:function()
	{
		var src='question';
		//if (!question.started)// || !question.showscore)
		//	{src='question';}
		if (this.correct==true)
			{src='correct';}
		else if (this.correct==false)
			{src='wrong';}
		return 'images/q_'+src+'.gif';
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
	
	getChoiceClass:function(choice)
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
	
	/*
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
	*/
	
});
