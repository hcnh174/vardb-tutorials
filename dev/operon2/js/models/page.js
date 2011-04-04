/*global Ext, operon */
Ext.regModel('Page',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'title'},
	 	{name: 'required', type: 'boolean'},
	 	{name: 'printed', type: 'boolean'},
	 	{name: 'text'},
	 	{name: 'number', type: 'int', defaultValue: 0}
	],
	belongsTo: 'Tutorial',
	
 	visited: false,
 	complete: false,
 	enabled: true,
 	current: false,
 	
	showback: true,
	shownext: true,
	prevpage: null,
	nextpage: null,
	
	tagregex: /\[([a-zA-Z]+):([^\]]*)\]/g,
	
	update:function()//page)
	{
		this.visited=true;
		Ext.core.DomHelper.overwrite('page_title',this.formatTitle());
		Ext.core.DomHelper.overwrite('page_text',this.render());
		this.showBackButton(this.showback);
		this.showNextButton(this.shownext);
		if (this.shownext)
			{this.complete=true;}
	},
	
	formatTitle: function()
	{
		return this.get('number')+'. '+this.get('title');
	},
	
	render:function()
	{
		var html=this.parseTags(this.get('text'));
		html=this.parseTags(html);
		return html;
	},	

	printPage:function()
	{
		var str='<h2>'+this.formatTitle()+'</h2>\n';
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
		console.log('parseTag: '+type+'='+value);
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
	
	getCssClass: function()
	{
		if (this.current)
			{return 'current';}
		else if (this.complete)
			{return 'completed';}
		else {return 'future';}
		//else if (tocpage.enabled)
		//	{return 'future';}				
	},
	
	indexResources:function(tutorial)
	{
		this.tutorial=tutorial;
		var arr, resource, type, name;
		var page=this;
		while ((arr = this.tagregex.exec(this.get('text'))) !== null)
		{
			type=arr[1];
			name=arr[2];
			resource=tutorial.getResource(type,name);
			if (resource)
				{resource.indexResources(tutorial,page);}
		}
	}
});

