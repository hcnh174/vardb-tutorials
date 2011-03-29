package org.operon.tutorials;

import com.google.code.morphia.annotations.Embedded;

@Embedded
public class Link
{	
	protected String id;
	protected String href="http://www.psu.edu";
	protected String text="click here";
	
	public Link(){}
	
	public Link(String linkid)
	{
		this.id=linkid;
	}
	
	public String getId(){return this.id;}
	public void setId(String id){this.id=id;}
	
	public String getHref(){return this.href;}
	public void setHref(String href){this.href=href;}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}
}
