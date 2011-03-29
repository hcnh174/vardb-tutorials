/*global Ext */
Ext.operon.tutorials.Page=Ext.extend(Ext.util.Observable,
{
	tagregex: /\[([a-zA-Z]+):([^\]]*)\]/g,
	
	constructor:function(tutorial,data)
	{
		this.tutorial=tutorial;
		this.page_id=data.id;
		this.number=0;
		this.title=data.title;
		this.text=data.text;
		this.required=data.required;
		this.printed=data.printed;
		this.visited=false;
		this.complete=false;
		//this.enabled=false;
		this.enabled=true; // hack!
		this.current=false;
		this.showback=true;
		this.shownext=true;
		this.prevpage=null;
		this.nextpage=null;
		
		this.addEvents(
		{
			start: true,
			complete: true
		});
		
		//this.listeners = data.listeners;
		Ext.operon.tutorials.Page.superclass.constructor.call(this);
	},
	
	update:function()//page)
	{
		this.visited=true;
		Ext.DomHelper.overwrite('page_title',this.number+'. '+this.title);
		Ext.DomHelper.overwrite('page_text',this.render());
		this.showBackButton(this.showback);
		this.showNextButton(this.shownext);
		if (this.shownext)
			{this.complete=true;}
	},
	
	render:function()
	{
		var html=this.parseTags(this.text);
		html=this.parseTags(html);
		return html;
	},	

	printPage:function()
	{
		var str='<h2>'+this.number+'. '+this.title+'</h2>\n';
		str+=this.render();
		str+='<hr >\n';
		return str;
	},
	
	showBackButton:function(visible)
	{
		if (visible)
			{Ext.get("backbutton").show();}
		else {Ext.get("backbutton").hide();}
	},
	
	showNextButton:function(visible)
	{
		if (visible)
			{Ext.get("nextbutton").show();}
		else {Ext.get("nextbutton").hide();}
	},


	parseTags:function(str)
	{
		var arr, html='', last=0, buffer=[];
		while ((arr = this.tagregex.exec(str)) !== null)
		{
			var html=this.parseTag(arr[1],arr[2]);
			if (!html)
				{html=arr[0];}
			buffer.push(str.substring(last,arr.index));
			buffer.push(html);
			last=this.tagregex.lastIndex;
		}
		buffer.push(str.substring(last));
		return buffer.join('');
	},
	
	parseTag:function(type,value)
	{
		if (type==='question')
			{return this.tutorial.getQuestion(value).render();}
		else if (type==='score')
			{return this.tutorial.getScore().render();}
		else if (type==='image')
			{return this.tutorial.getImage(value).render();}
		else if (type==='imageref')
			{return this.renderImageref(value);}
		else if (type==='link')
			{return this.tutorial.getLink(value).render();}
		else if (type==='flash')
			{return this.tutorial.getFlash(value).render();}
		else if (type==='paragraph')
			{return this.renderParagraph();}
		else if (type==='break')
			{return this.renderBreak();}
		else if (type==='term')
			{return '<span class="term">'+value+'</span>';}
		else if (type==='tutorialref')
			{return this.renderTutorialref(value);}
		else if (type==='fraction')
			{return this.renderFraction(value);}
		else if (type==='formula')
			{return this.renderFormula(value);}
		else if (type==='super')
			{return this.renderSuper(value);}
		else if (type==='heading')
			{return this.renderHeading(value);}
		else if (type==='italics')
			{return this.renderItalics(value);}
		else if (type==='bold')
			{return this.renderBold(value);}
		else return null;
	},
	
	renderTutorialref:function(str)
	{
		return '<a href="" target="_new">Tutorial '+value+'</a>';
	},
	
	renderImageref:function(str)
	{
		var image=tutorial.getImage(name);
		return '<a href="" target="_new">Image ref '+name+'</a>';
	},
	
	renderSuper:function(str)
	{
		return '<sup>'+str+'</sup>';
	},

	renderFormula:function(str)
	{
		str=str.trim();
		var regex=/([a-zA-Z]+)([0-9]*)([+-])?/;
		var arr, buffer=[];
		var counter=0;
		while ((arr = regex.exec(str)) !== null)
		{
			if (counter>10)
				{return str;}
			buffer.push(arr[1]);
			if (arr.length>=3)
				{buffer.push('<sub>'+arr[2]+'</sub>');}
			if (arr.length>=4)
				{buffer.push('<sup>'+arr[3]+'</sup>');}
			counter++;
		}
		var html=buffer.join('');
		html=html.replace(" ","");
		return '<span class="formula">'+html+'</span>';
	},

	renderFraction:function(str)
	{
		var regex=/([0-9]+)\/([0-9]+)/;
		var arr, buffer=[];
		var counter=0;
		while ((arr = regex.exec(str)) !== null)
		{
			if (counter>10)
				{return str;}
			buffer.push('<sup>'+arr[1]+'</sup>/<sub>'+arr[2]+'</sub>');
			counter++;
		}
		return buffer.join('');
	},

	renderHeading:function(str)
	{
		return '<h2 class="heading">'+str+'</h2>';
	},

	renderBreak:function()
	{
		return '<br />';
	},
	
	renderParagraph:function()
	{
		return '<br /><br />';
	},
	
	renderBold:function(str)
	{
		return '<b>'+str+'</b>';
	},
	
	renderTerm:function(str)
	{
		return this.renderBold(str);
	},
	
	renderItalics:function(str)
	{
		return '<i>'+str+'</i>';
	},
	
	indexResources:function()
	{
		var arr, resource, type, name;
		while ((arr = this.tagregex.exec(this.text)) !== null)
		{
			type=arr[1];
			name=arr[2];			
			if (type==='question')
			{
				resource=this.tutorial.getQuestion(name);
				if (resource)
				{
					resource.page_id=this.page_id;
					resource.page=this;
					resource.number=this.tutorial.questionnumber++;
					// prevent next button from showing on pages with questions
					this.shownext=false;
				}
			}
			else if (type==='image')
			{
				resource=this.tutorial.getImage(name);
				if (resource)
				{
					resource.page_id=this.page_id;
					resource.page=this;
					resource.number=this.tutorial.imagenumber++;
				}
			}
			else if (type==='link')
			{
				resource=this.tutorial.getLink(name);
				if (resource)
				{
					resource.page_id=this.page_id;
					resource.page=this;
					resource.number=this.tutorial.linknumber++;
				}
			}
			else if (type==='flash')
			{
				resource=this.tutorial.getFlash(name);
				if (resource)
				{
					resource.page_id=this.page_id;
					resource.page=this;
					resource.number=this.tutorial.flashnumber++;
				}
			}
		}
	}
});
