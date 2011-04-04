/*global Ext, operon */
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
	belongsTo: 'Tutorial',
	
	number: null,
	page_id: null,
	thumbnail:
	{
		width: 100,
		height: 100
	},
	
	indexResources:function(tutorial, page)
	{
		this.tutorial=tutorial;
		this.page=page;
		this.page_id=page.get('id');
		this.number=tutorial.imagenumber++;
		
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
