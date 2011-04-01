/*global Ext, alert, window */
Ext.define('operon.Operon',
{	
	statics:
	{
		onReady:function()
		{
			Ext.tip.QuickTips.init();
			//Ext.ux.Lightbox.register('a[rel^=lightbox]');
			//this.createSpinner();
		},


		courses:function()
		{
			alert('Todo');
		},
		
		tutorials:function()
		{
			Ext.regModel('Tutorial', {
			    fields: [
			        {name: '_id'},
					{name: 'name'},
					{name: 'number', type: 'int'},
					{name: 'title'}
			    ]
			});

			//idProperty: 'name',
			var store = new Ext.data.Store({
			    model: 'Tutorial',
			    proxy: {
			        type: 'ajax',
			        url : vardb.util.Utils.webapp()+'/tutorials/tutorials.json',
			        reader: {
			            type: 'json',
			            root: 'tutorials'
			        }
			    },
			    autoLoad: true
			});
			
			
//			var store=new Ext.data.JsonStore(
//			{
//				url: vardb.util.Utils.webapp()+'/tutorials/tutorials.json',
//				root: 'tutorials',
//				idProperty: 'name',
//				fields:
//				[
//					{name: '_id'},
//					{name: 'name'},
//					{name: 'number', type: 'int'},
//					{name: 'title'}
//				]			
//			});
	
			function renderTitle(value, p, r)
			{
				//return String.format('<a href="javascript:void(0)" onclick="operon.tutorial(\'{0}\')" style="text-decoration:none">{1}. {2}</a>',r.data.name, r.data.number, value); 
				return String.format('<a href="tutorial.html?id={0}" style="text-decoration:none">{1}. {2}</a>',
					r.data.name, r.data.number, value);
			}
			
			var sm=new Ext.grid.CheckboxSelectionModel({
				sortable: true,
				width: 20
			});
			
			var grid=new Ext.grid.GridPanel(
			{
				sm: sm,
				stripeRows: true,
				viewConfig: {forceFit:true},
				autoExpandColumn: 'title',
				autoHeight: true,
				autoWidth: true,
				//height: 350,
				//width: 600,
				store: store,
				columns:
				[
					sm,
					//{header: 'Number', width: 40, sortable: true, dataIndex: 'number'},
					{header: 'Title', sortable: true, dataIndex: 'title', id: 'title', renderer: renderTitle}//width: 160, 
				]			
			});
			
			var win = new Ext.Window(
			{
				title: 'Select a tutorial',
				//layout:'fit',
				width:500,
				height:300,
				closeAction:'hide',
				plain: true,
				autoScroll: true,
				items: [grid]
				/*
				buttons:
	            [
					{
						text: 'Close',
						handler: function(){win.hide();}
					}
				]
				*/
			});
			//store.load({params: {start: 0, limit: 100}});
			store.load({});
			win.show();
		},
		tutorial:function(tutorial_id)
		{
			Ext.Ajax.request(
			{
				url: vardb.util.Utils.webapp()+'/tutorials/'+tutorial_id+'.json',
				//params: {tutorial_id: tutorial_id},
				method: 'POST',
				failure: vardb.util.Utils.onFailure,
				success: function(response, options)
				{
					var data=Ext.decode(response.responseText);
					tutorial=new operon.tutorials.Tutorial(data);
				}
			});
		}
	}
});

/*
		selectAll:function(grid)
		{
			grid.getSelectionModel().selectAll();
		},	
		unselectAll:function(grid)
		{
			grid.getSelectionModel().clearSelections();
		},
		invertSelection:function(grid)
		{
			var rows=grid.getSelections();
			var indexes=[],index, i;
			for (i=0;i<rows.length;i++)
			{
				indexes.push(grid.getStore().indexOf(rows[i]));
			}
			this.selectAll(grid);
			for (i=0;i<indexes.length;i++)
			{
				index=indexes[i];
				grid.getSelectionModel().deselectRow(index);
			}
		},
		getSelected:function(grid)
		{
			var rows=grid.getSelections();
			var ids=[],index;
			for (index=0;index<rows.length;index++)
			{
				ids.push(rows[index].id);
			}
			return ids;
		},
		
		gotoUrl:function(url,params)
		{
			var href=this.buildHref(url,params);
			document.location.href=href;
		},
		buildHref:function(url,params)
		{
			var qs=this.buildQueryString(params);
			if (qs!=='')
				{qs='?'+qs;}
			var href=this.webapp+url+qs;
			return href;
		},	
		buildQueryString:function(params)
		{
			if (!params)
				{return '';}
			return Ext.urlEncode(params);
		},
		openWindow:function(url,title,options)
		{
			if (!title)
				{title='Operon';}
			if (!options)
				{options="scrollbars=1,resizable=1";}
			var win=window.open(url,title,options);
			if (!win)
		    {
				win = window.open('',title, options);
				win.location.href = url;
		    }	
			if (window.focus)
			{
				win.focus();
			}
			return win;
		},
*/
