package org.operon.tutorials;

import com.google.code.morphia.annotations.Embedded;

@Embedded
public class Page
{	
	private String id;
	private String title="";
	private Boolean required=false;
	private Boolean printed=false;
	private String text="";
	
	public Page(){}
	
	public Page(String id)
	{
		this.id=id;
	}

	public String getId(){return this.id;}
	public void setId(final String id){this.id=id;}

	public String getTitle(){return this.title;}
	public void setTitle(String title){this.title=title;}

	public Boolean getRequired(){return this.required;}
	public void setRequired(Boolean required){this.required=required;}

	public Boolean getPrinted(){return this.printed;}
	public void setPrinted(Boolean printed){this.printed=printed;}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}
}
