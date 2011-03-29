/*global Ext */
Ext.operon.tutorials.Image=Ext.extend(Ext.operon.tutorials.Resource,
{
	thumbnail:
	{
		width: 100,
		height: 100
	},

	constructor:function(tutorial,data)
	{	
		Ext.operon.tutorials.Image.superclass.constructor.call(this);
		this.image_id=data.id;
		//this.image_id=data.image_id;
		this.src=data.src;
		this.width=data.width;
		this.height=data.height;
		this.title=data.title;
		this.caption=data.caption;
		
		this.src='images/biol110/bacterial_cell_walls.jpg'; // hack!
	},
	
	render:function()
	{		
		var template = new Ext.XTemplate(
			'<div id="div:image:{imageid}" class="thumbnail">',
				'<div>',
					'<a href="{src}" rel="lightbox" title="{title}">',
					//'<a href="#" onclick="tutorial.blowupImage(\'{imageid}\')">',					
					//'<img src="/operon/tutorials/thumbnail.html?id={imageid}"',
					'<img src="{src}"',
						' alt="{title}"',
						' width="{width}"',
						' height="{height}"',
						' border="0"',
						' class="thumbnail"/>',
					'</a>',
				'</div>',
				'<div>Figure {number}</div>',
			'</div>'
		);
		var html=template.apply(this);
		return html;
	}
});
