package org.operon.tutorials;

public class Flash extends Resource
{	
	protected String base="biol110/animations/";
	protected String src="flash.swf";
	protected String title="";
	protected String caption="";
	
	public Flash(){}
	
	public Flash(String id)
	{
		super(id);
	}
	
	public String getBase(){return this.base;}
	public void setBase(String base){this.base=base;}

	public String getSrc(){return this.src;}
	public void setSrc(String src){this.src=src;}
	
	public String getTitle(){return this.title;}
	public void setTitle(String title){this.title=title;}

	public String getCaption(){return this.caption;}
	public void setCaption(String caption){this.caption=caption;}
}
