package org.operon.tutorials;


public abstract class Item
{
	protected String id;
	
	public Item(){}
	
	public Item(String id)
	{
		this.id=id;
	}
	
	public String getId(){return this.id;}
	public void setId(final String id){this.id=id;}
}
