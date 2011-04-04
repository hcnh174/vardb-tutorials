/*global Ext */
Ext.regModel('Tutorial',
{
	idProperty: '_id',
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
		{model: 'Link', name : 'links'},
		{model: 'Flash', name : 'flashs'}
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
	
	start: function()
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
		
		document.title=this.get('number')+'. '+this.get('title');
		Ext.core.DomHelper.overwrite('tutorial_title',document.title);

		//var page=this.pages().first();
		var page=this.getPageByNumber(6); //hack
		this.gotoPage(page);
	},

	gotoPage:function(page)
	{
		if (this.curpage)
			this.curpage.current=false;
		this.curpage=page;
		page.set('current',true);
		page.set('enabled',true);
		page.update();
		this.toc.update();
	},
	
	indexResources:function()
	{
		var self=this;
		var number=1;
		this.pages().each(function(page)
		{
			page.set('number',number);
			page.indexResources(self);
			page.prevpage=number-1;
			page.nextpage=number+1;
			number++;
		});
		
		var page=this.pages().first();
		page.showback=false;
		page.prevpage=null;
		
		page=this.pages().last();
		page.shownext=false;
		page.nextpage=null;

		// sort resources
//		this.questions.sort(this.sortByNumber);
//		this.images.sort(this.sortByNumber);
//		this.links.sort(this.sortByNumber);
//		this.flashs.sort(this.sortByNumber);
	},

	getPageById:function(page_id)
	{
		return vardb.util.Utils.getArrayItem(this.pages(),"id",page_id);
	},
	
	getPageByNumber:function(number)
	{
		return vardb.util.Utils.getArrayItem(this.pages(),"number",number);
	},
	
	getQuestion:function(question_id)
	{
		return vardb.util.Utils.getArrayItem(this.questions(),"id",question_id);
	},
	
	getImage:function(image_id)
	{
		return vardb.util.Utils.getArrayItem(this.images(),"id",image_id);
	},
	
	getLink:function(link_id)
	{
		return vardb.util.Utils.getArrayItem(this.links(),"id",link_id);
	},
	
	getFlash:function(flash_id)
	{
		return vardb.util.Utils.getArrayItem(this.flashs(),"id",flash_id);
	},

	gotoPageId:function(page_id)
	{
		var page=this.getPageById(page_id);
		this.gotoPage(page);
	},
	
	gotoPageNumber:function(page_id)
	{
		var page=this.getPageByNumber(page_id);
		this.gotoPage(page);
	},
	
	previousPage:function()
	{
		var page=this.curpage;
		if (!page.prevpage)
			{return;}
		this.gotoPageNumber(page.prevpage);
	},
	
	nextPage:function()
	{
		var page=this.curpage;
		if (!page.nextpage)
			{return;}
		this.gotoPageNumber(page.nextpage);
	},

	submitAnswer:function(question_id,choice_id)
	{
		//alert('question_id='+question_id+', choice_id='+choice_id);
		var question=this.getQuestion(question_id);
		if (!choice_id)
			{return;}
		question.submitAnswer(choice_id);
	},
		
	getScore:function()
	{
		return this.score;
	},
	
	sortByNumber:function(a,b)
	{
		return a.number-b.number;
	},
	
	getResource:function(type, name)
	{
		if (type==='question')
			{return this.getQuestion(name);}
		else if (type==='image')
			{return this.getImage(name);}
		else if (type==='link')
			{return this.getLink(name);}
		else if (type==='flash')
			{return this.getFlash(name);}
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
