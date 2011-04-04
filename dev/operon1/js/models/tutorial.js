/*global Ext */
Ext.regModel('Tutorial',
{
	fields:
	[
	 	{name: '_id'},
	 	{name: 'name'},
	 	{name: 'number', type: 'int'},
	 	{name: 'title'}
	],
	hasMany:
	[
	 	{model: 'Page', name : 'pages'},
	 	{model: 'Question', name : 'questions'},
		{model: 'Image', name : 'images'},
		{model: 'Links', name : 'links'},
		{model: 'Flashs', name : 'flashs'}
	],
	proxy:
	{
		 type: 'rest',
		 url: '/json',
		 reader: 'json'
	},
 	questionnumber: 1,
	imagenumber: 1,
	linknumber: 1,
	flashnumber: 1,
	
	init: function()
	{
		this.toc=new operon.tutorials.Toc(this);
		this.score=new operon.tutorials.Score(this);
		this.indexResources();
		
		// render
		var self=this;
		var backbutton = Ext.get('backbutton');
		backbutton.on('click',function(evt,t,o)
		{
			self.previousPage();
		});
		
		var nextbutton = Ext.get('nextbutton');
		nextbutton.on('click',function(evt,t,o)
		{
			self.nextPage();			
		});
		
		document.title=this.number+'. '+this.tutorial_title;
		Ext.core.DomHelper.overwrite('tutorial_title',this.number+'. '+this.tutorial_title);
		
		this.curpage=this.pages[0];
		this.gotoPage(this.curpage.page_id);
	},
	
	gotoPage:function(page_id)
	{
		this.curpage.current=false;
		var page=this.getPageById(page_id);
		this.curpage=page;
		page.current=true;
		page.enabled=true;
		page.update();		
		this.toc.update();
	},
	
	previousPage:function()
	{
		var page=this.curpage;
		if (!page.prevpage)
			{return;}
		this.gotoPage(page.prevpage.page_id);
	},
	
	nextPage:function()
	{
		var page=this.curpage;
		if (!page.nextpage)
			{return;}
		this.gotoPage(page.nextpage.page_id);
	},

	getPageById:function(page_id)
	{
		var index,page;
		for (index=0;index<this.pages.length;index++)
		{
			page=this.pages[index];
			if (page.page_id===page_id)
				{return page;}
		}
		throw 'Page '+page_id+' not found';
	},
	
	getPageByNumber:function(number)
	{
		var index,page;
		for (index=0;index<this.pages.length;index++)
		{
			page=this.pages[index];
			if (page.number===number)
				{return page;}
		}
		throw 'Page '+number+' not found';
	},
	
	getQuestion:function(question_id)
	{
		var index,question;
		for (index=0;index<this.questions.length;index++)
		{
			question=this.questions[index];
			if (question.question_id===question_id)
				{return question;}
		}
		alert('can\'t find question: '+question_id);
		throw 'Question '+question_id+' not found';
	},
	
	getImage:function(image_id)
	{
		var index,image;
		for (index=0;index<this.images.length;index++)
		{
			image=this.images[index];
			if (image.image_id===image_id)
				{return image;}
		}
		throw 'Image '+image_id+' not found';
	},
	
	getLink:function(link_id)
	{
		var index,link;
		for (index=0;index<this.links.length;index++)
		{
			link=this.links[index];
			if (link.link_id===link_id)
				{return link;}
		}
		throw 'Link '+link_id+' not found';
	},
	
	getFlash:function(flash_id)
	{
		var index,flash;
		for (index=0;index<this.flashs.length;index++)
		{
			flash=this.flashs[index];
			if (flash.flash_id===flash_id)
				{return flash;}
		}
		throw 'Flash '+flash_id+' not found';
	},
	
	submitAnswer:function(question_id,choice_id)
	{
		//alert('question_id='+question_id+', choice_id='+choice_id);
		var question=this.getQuestion(question_id);
		if (!choice_id)
			{return;}
		question.submitAnswer(choice_id);
	},
	
	indexResources:function()
	{
		var index,page;
		for (index=0;index<this.pages.length;index++)
		{
			page=this.pages[index];
			page.number=index+1;
			page.indexResources();
			if (index==0)
				{page.showback=false;}
			else {page.prevpage=this.pages[index-1];}
			if (index==this.pages.length-1)
				{page.shownext=false;}
			else {page.nextpage=this.pages[index+1];}
		}

		/*
		// sort resources
		this.questions.sort(this.sortByNumber);
		this.images.sort(this.sortByNumber);
		this.links.sort(this.sortByNumber);
		this.flashs.sort(this.sortByNumber);
		*/
	},
	
	getScore:function()
	{
		return this.score;
	},
	
	sortByNumber:function(a,b)
	{
		return a.number-b.number;
	},
	
	printTutorial:function()
	{
		var win=this.openWindow('about:blank');
		
		var index,page;
		var str='<h1>'+this.number+'. '+this.tutorial_title+'</h1>\n';
		for (index=0;index<this.pages.length;index++)
		{
			page=this.pages[index];
			if (page.complete)
				{str+=page.printPage();}
		}
		win.document.write(str);
		win.document.close();
	},
	
	openWindow:function(url,title,options)
	{
		title=title || url;
		options=options || 'scrollbars=1,resizable=1';
		var win=window.open(url,title,options);
		if (!win)
		{
			win = window.open('',title, options);
			win.location.href = url;
		}	
		if (window.focus)
			{win.focus();}
		return win;
	}
});



Ext.regModel('Question',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'text'}	
	],
	hasMany: {model: 'Choice', name : 'choices'},
	belongsTo: 'Tutorial'
});

Ext.regModel('Choice',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'text'},
	 	{name: 'response'},
	 	{name: 'correct', type: 'boolean'}
	],
	belongsTo: 'Question'
});

Ext.regModel('Image',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'src'},
	 	{name: 'width', type: 'int'},
	 	{name: 'height', type: 'int'},
	 	{name: 'title'},
	 	{name: 'caption'}
	],
	belongsTo: 'Tutorial'
});

Ext.regModel('Link',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'href'},
	 	{name: 'text'}	
	],
	belongsTo: 'Tutorial'
});

Ext.regModel('Flash',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'base'},
	 	{name: 'src'},
	 	{name: 'title'},
	 	{name: 'caption'}	
	],
	belongsTo: 'Tutorial'
});


/*
{
    "id": "82F2F6BC-1482-4878-978B-52953A82AA83",
    "name": "biol110_02",
    "number": 2,
    "title": "Heredity and Life Cycles",
    "pages": [{
        "id": "47B99126-86A8-482B-944F-B3226DE5D0BD",
        "title": "Welcome",
        "required": false,
        "printed": false,
        "text": "This tutorial is designed to help you."
    }, {
        "id": "78CA1B40-15FE-4723-8AAC-EF7197E84A42",
        "title": "Exercises",
        "required": false,
        "printed": false,
        "text": "In this tutorial, you will have the opportunity."
    }, {
        "id": "3EC70CA0-9783-442E-89B0-44501BA28986",
        "title": "Terms",
        "required": false,
        "printed": false,
        "text": "You should have a working knowledge"
    }],
    "questions": [],
    "images": [{
        "id": "A63A846B-F8ED-4439-8852-0805EA47B222",
        "src": "biol110/figure_13_9.gif",
        "width": 715,
        "height": 295,
        "title": "The results of crossing over during meiosis",
        "caption": "The results of crossing over during meiosis"
    }],
    "links":[],
    "flashs":[]    
}
*/

