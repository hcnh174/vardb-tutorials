package org.operon.tutorials;

public class Link extends Resource
{
	protected String href="http://www.psu.edu";
	protected String text="click here";
	
	public Link(){}
	
	public Link(String linkid)
	{
		super(linkid);
	}

	public String getHref(){return this.href;}
	public void setHref(String href){this.href=href;}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}
}
