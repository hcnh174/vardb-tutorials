package org.operon.tutorials;

public class Page extends Item
{	
	private String title="";
	private Boolean required=false;
	private Boolean printed=false;
	private String text="";
	
	public Page(){}
	
	public Page(String id)
	{
		super(id);
	}
	
	public String getTitle(){return this.title;}
	public void setTitle(String title){this.title=title;}

	public Boolean getRequired(){return this.required;}
	public void setRequired(Boolean required){this.required=required;}

	public Boolean getPrinted(){return this.printed;}
	public void setPrinted(Boolean printed){this.printed=printed;}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}
}
