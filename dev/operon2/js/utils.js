/*global Ext, window, alert */
Ext.define('vardb.util.Utils',
{	
	statics:
	{
		webapp:function()
		{
			var path=window.location.pathname;
			var webapp=path.substring(0,path.indexOf('/',1));
			return webapp;
		},
			
		//webapp: function(){return this.getWebapp()},
		
		gotoUrl:function(url,params)
		{
			var href=this.buildHref(url,params);
			document.location.href=href;
		},
		
		buildHref:function(url,params)
		{
			var qs=(params) ? Ext.urlEncode(params) : '';
			if (qs!=='')
				{qs='?'+qs;}
			return this.webapp+url+qs;
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
		},
	
		info:function(msg)
		{
			var win=new Ext.ux.window.MessageWindow(
			{
				title: 'Notification',
				html: msg,
				origin: {offY:-25,offX:-25},
				autoHeight: true,
				iconCls: 'icon-info',
				help: false,
				hideFx: {delay:1000, mode:'ghost'}
			});
			win.show(Ext.getDoc());
		},
		
		ajaxRequest:function(url,params,callback)
		{
			params=params || {};
			callback=callback || Ext.emptyFn;
			Ext.Ajax.request({
				url: this.webapp+url,
				params: params,
				method: 'post',
				failure: this.onFailure,
				success: function(response,options)
				{
					var json=Ext.decode(response.responseText);
					callback(json);
				}			
			});
		},
		ajaxRequestConfirm:function(message,url,params,callback)
		{
			Ext.MessageBox.confirm('Confirm', message, function(btn)
			{
				if (btn!=='yes')
					{return;}
				this.ajaxRequest(url,params,callback);
			});
		},
		
		createSpinner:function()
		{
			Ext.core.DomHelper.append(document.body,{id: 'spinner', tag: 'div', html: 'Loading...'});
		
			Ext.Ajax.on('beforerequest',function(conn,options)
			{
				Ext.get('spinner').show();
			},this);
		
			Ext.Ajax.on('requestcomplete',function(conn,response,options)
			{
				Ext.get('spinner').hide();
			},this);
		
			Ext.Ajax.on('requestexception',function(conn,response,options)
			{
				Ext.MessageBox.alert('Failed',response.responseText);
				Ext.get('spinner').hide();
			},this);
		},
		
		createReloadButton:function(handler)
		{
			var button=new Ext.Button({
				tooltip : 'Reload',
				iconCls : 'x-tbar-loading',
				handler : handler
			});
			return button;
		},
		
		/*
		createSelectList:function(data, fieldName, fieldLabel, value)
		{
			var combo=new Ext.form.ComboBox(
			{
				store: new Ext.data.ArrayStore(
				{
					fields: ['value', 'display'],
					data: data
				}),
				hiddenName: fieldName,
				fieldLabel: fieldLabel,
				valueField: 'value',
				displayField: 'display',
				width: 150,
				mode: 'local',
				triggerAction: 'all',
				value: value,
				selectOnFocus: true,
				forceSelection: true
			});
			return combo;
		},
		*/
		
		createSelectableTemplate:function()
		{
			var template=new Ext.Template(
				'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
				'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
				'</td>');
			 return template;
		},
		
		onFailure:function(response, options)
		{
			Ext.MessageBox.alert('Failed',response.responseText);
		},
		
		onFormFailure:function(form, action)
		{
			switch (action.failureType)
			{
				case Ext.form.Action.CLIENT_INVALID:
					Ext.Msg.alert("Failure", "Form fields may not be submitted with invalid values");
					break;
				case Ext.form.Action.CONNECT_FAILURE:
					Ext.Msg.alert("Failure", "Ajax communication failed");
					break;
				case Ext.form.Action.SERVER_INVALID:
				   Ext.Msg.alert("Failure", action.response.responseText);
			}
		},
		
		getRectPath: function(x, y, width, height)
		{
			var x1=x; x2=x+width; y1=y; y2=y+height;
			var path='M'+x1+' '+y1+
					'L'+x2+' '+y1+
					'L'+x2+' '+y2+
					'L'+x1+' '+y2+
					'L'+x1+' '+y1+'z';
			return path;
		},
		
		getLinePath: function(x1, y1, x2, y2)
		{
			var path='M'+x1+' '+y1+'L'+x2+' '+y2+'z';
			return path;
		},
		getQueryStringParam:function(name,dflt)
		{
			var pageParameters = Ext.urlDecode(window.location.search.substring(1));
			var value=pageParameters[name];
			if (!value)
				{value=dflt;}
			return value;
		},
		getRadioValue:function(form,name)
		{
			for (var index=0;index<form.elements[name].length;index++)
			{
				if (form.elements[name][index].checked)
					{return form.elements[name][index].value;}
			}
			//throw 'No value selected in radio button '+name';
			return null;
		},
		
		getArrayItem: function(arr, name, value)
		{
			var cur=null;
			arr.each(function(item)
			{
				if (item.get(name)===value)
				{
					cur=item;
					return false;
				}		
			});
			if (!cur)
				throw 'Item '+value+' not found';
			return cur;
		},
		
		spacer: function(width, height)
		{
			width=width || 1;
			height=height || 1;
			return '<img src="images/spacer.gif" width="'+width+'" height="'+height+'" border="0" alt="spacer"/>';
		}
	}
});

//var utils=vardb.util.Utils;
