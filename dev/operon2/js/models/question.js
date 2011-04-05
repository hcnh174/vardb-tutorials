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
	page_number: null,
	
	// state
	complete: false,
	correct: null,
	tries: 0,
	score: null,
	
	showscore: true,
	interactive: true,
	started: false,
	starttime: null,
	lasttime: null,
	times: [],
	
	indexResources:function(tutorial, page)
	{
		this.tutorial=tutorial;
		this.page=page;
		//this.page_id=page.get('id');
		this.page_number=page.get('number');
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
			return null;
		}
		return vardb.util.Utils.getArrayItem(this.choices(),"id",choice_id);
	},
	
	onLoad: function()
	{
		if (!this.started)
		{
			this.started=true;
			this.starttime=new Date();
			this.lasttime=this.starttime;
		}		
	},
	
	submitAnswer:function(choice_id)
	{
		var choice=this.getChoice(choice_id);
		if (choice==null)
			{return;}
		
		this.tries++;
		
		var now=new Date();
		var elapsed=now-this.lasttime;
		this.times.push(elapsed);
		this.lasttime=now;
		
		choice.showresponse=true;
		choice.selected=true;
		if (choice.isCorrect())
		{
			this.setComplete();
			if (this.tries==1)
			{
				this.setCorrect();
				this.tutorial.score.addCorrect();
			}
			else
			{
				this.tutorial.score.addIncorrect();
			}			
		}
		else
		{
			this.setIncorrect();
		}
		this.page.update();
	},
	
	setCorrect: function()
	{
		this.correct=true;
		this.score=1;
	},
	
	setIncorrect: function()
	{
		this.correct=false;
		this.score=0;
	},

	setComplete: function()
	{
		this.complete=true;
		this.interactive=false;
		this.page.shownext=true;
		this.elapsed=new Date()-this.starttime;
		alert(this.elapsed);
		alert(this.times.join(', '));
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
		this.onLoad();
		return html;
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
		else if (choice.isCorrect())
			{return 'correct_feedback';}
		else {return 'feedback';}
	},
	
	getShowSubmit:function()
	{
		return !this.complete && this.interactive;
	}
});
