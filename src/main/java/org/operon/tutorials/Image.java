package org.operon.tutorials;

import javax.persistence.Id;

public class Image extends Resource
{
	protected String src="";
	protected Integer width=100;
	protected Integer height=100;
	protected String title="";
	protected String caption="";
	
	protected String thumbsrc=null;
	protected Integer thumbwidth=null;
	protected Integer thumbheight=null;
	
	protected byte[] img;
	protected byte[] thumbnail;
	
	public Image(){}
	
	public Image(String id)
	{
		super(id);
	}

	public String getSrc(){return this.src;}
	public void setSrc(String src){this.src=src;}
	
	public Integer getWidth(){return this.width;}
	public void setWidth(Integer width){this.width=width;}

	public Integer getHeight(){return this.height;}
	public void setHeight(Integer height){this.height=height;}
	
	public String getTitle(){return this.title;}
	public void setTitle(String title){this.title=title;}

	public String getCaption(){return this.caption;}
	public void setCaption(String caption){this.caption=caption;}
	
	public String getThumbsrc(){return this.thumbsrc;}
	public void setThumbsrc(String thumbsrc){this.thumbsrc=thumbsrc;}

	public Integer getThumbwidth(){return this.thumbwidth;}
	public void setThumbwidth(Integer thumbwidth){this.thumbwidth=thumbwidth;}

	public Integer getThumbheight(){return this.thumbheight;}
	public void setThumbheight(Integer thumbheight){this.thumbheight=thumbheight;}

	public byte[] getImg(){return this.img;}
	public void setImg(byte[] img){this.img=img;}
	
	public byte[] getThumbnail(){return this.thumbnail;}
	public void setThumbnail(byte[] thumbnail){this.thumbnail=thumbnail;}
}
