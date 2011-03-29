package org.operon.tutorials;

import com.google.code.morphia.annotations.Embedded;

@Embedded
public class Flash
{	
	protected String id;
	protected String base="biol110/animations/";
	protected String src="flash.swf";
	protected String title="";
	protected String caption="";
	
	public Flash(){}
	
	public Flash(String id)
	{
		this.id=id;
	}
	
	public String getId(){return this.id;}
	public void setId(String id){this.id=id;}
	
	public String getBase(){return this.base;}
	public void setBase(String base){this.base=base;}

	public String getSrc(){return this.src;}
	public void setSrc(String src){this.src=src;}
	
	public String getTitle(){return this.title;}
	public void setTitle(String title){this.title=title;}

	public String getCaption(){return this.caption;}
	public void setCaption(String caption){this.caption=caption;}
}
