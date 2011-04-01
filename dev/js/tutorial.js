/*global Ext, operon */
Ext.define('operon.tutorials.Tutorial',
{
	extend: 'Ext.panel.Panel',
	
	// panel config
	layout:
	{
        type: 'table',
        columns: 2
    },
	defaults: {border: false},//true
	renderTo: 'maindiv',

	number: 1,
	tutorial_title: 'Title',
	
	constructor: function(data)
	{
		var config=
		{
			border: false,
			items: 
			[
				{
					id: 'north',
					colspan: 2,
					cellCls: 'td-north',
					contentEl: 'north-content'
				},
				{
					id: 'west',
					cellCls: 'td-west',
					contentEl: 'west-content',
					height: 400
				},
				{
					id: 'center',
					cellCls: 'td-center',
					contentEl: 'center-content',
					height: 400
				},
				{
					id: 'south',
					colspan: 2,
					cellCls: 'td-south',
					contentEl: 'south-content'
				}
			]
		};
		
		//this.callParent(config);
		operon.tutorials.Tutorial.superclass.constructor.call(this,config);
		
		this.pages=[];
		this.questions=[];
		this.images=[];
		this.links=[];
		this.flashs=[];
		this.questionnumber=1;
		this.imagenumber=1;
		this.linknumber=1;
		this.flashnumber=1;

//		this.addEvents(
//		{
//			load: true,
//			pagechanged: true,
//			complete: true
//		});
		
		this.tutorial_id=data._id;
		//this.tutorial_id=data.tutorial_id;
		this.number=data.number;
		this.tutorial_title=data.title;
		var index,page,question,image,link,flash;
		for (index=0;index<data.pages.length;index++)
		{
			this.pages.push(new operon.tutorials.Page(this,data.pages[index]));
		}

		if (data.questions)
		{
			for (index=0;index<data.questions.length;index++)
			{
				this.questions.push(new operon.tutorials.Question(this,data.questions[index]));
			}
		}
		if (data.images)
		{
			for (index=0;index<data.images.length;index++)
			{
				this.images.push(new operon.tutorials.Image(this,data.images[index]));
			}
		}
		if (data.links)
		{
			for (index=0;index<data.links.length;index++)
			{
				this.links.push(new operon.tutorials.Link(this,data.links[index]));
			}
		}
		if (data.flashs)
		{
			for (index=0;index<data.flashs.length;index++)
			{
				this.flashs.push(new operon.tutorials.Flash(this,data.flashs[index]));
			}
		}
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
		//Ext.core.DomHelper.overwrite('tutorial_date',new Date());
		//this.toc.update();
		
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

		// sort resources
		this.questions.sort(this.sortByNumber);
		this.images.sort(this.sortByNumber);
		this.links.sort(this.sortByNumber);
		this.flashs.sort(this.sortByNumber);
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