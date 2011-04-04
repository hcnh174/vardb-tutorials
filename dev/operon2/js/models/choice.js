/*global Ext, operon */
Ext.regModel('Choice',
{
	fields:
	[
	 	{name: 'id'},
	 	{name: 'text'},
	 	{name: 'response'},
	 	{name: 'correct', type: 'boolean'},
	 	{name: 'letter'}
	],
	belongsTo: 'Question',
		
	showresponse: false,	
	selected: false,
	current: false
});
