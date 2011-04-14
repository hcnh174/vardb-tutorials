package org.operon.tutorials;

import java.util.List;

import javax.persistence.Id;

//@Document //(collection="tutorials")
public class Tutorial
{
	@Id private String id;
	private String name=null;
	private Integer number;
	private String title="";

	private ItemCollection<Page> pages=new ItemCollection<Page>();
	private ItemCollection<Question> questions=new ItemCollection<Question>();
	private ItemCollection<Image> images=new ItemCollection<Image>();
	private ItemCollection<Link> links=new ItemCollection<Link>();
	private ItemCollection<Flash> flashs=new ItemCollection<Flash>();
	
	public Tutorial(){}
	
	public Tutorial(String name)
	{
		this.name=name;
	}

	public String getId(){return this.id;}
	public void setId(final String id){this.id=id;}
	
	public String getName(){return this.name;}
	public void setName(String name){this.name=name;}

	public Integer getNumber(){return this.number;}
	public void setNumber(Integer number){this.number=number;}

	public String getTitle(){return this.title;}
	public void setTitle(String title){this.title=title;}
	public List<Page> getPages(){return this.pages;}
	public List<Image> getImages(){return this.images;}	
	public List<Link> getLinks(){return this.links;}
	public List<Flash> getFlashs(){return this.flashs;}
	public List<Question> getQuestions(){return this.questions;}
	
	public Page add(Page page)
	{
		return this.pages.addItem(page);
	}
	
	public Question add(Question question)
	{
		return this.questions.addItem(question);
	}
	
	public Image add(Image image)
	{
		return this.images.addItem(image);
	}
	
	public Link add(Link link)
	{
		return this.links.addItem(link);
	}
	
	public Flash add(Flash flash)
	{
		return this.flashs.addItem(flash);
	}
	
	public Page findOrCreatePage(final String page_id)
	{
		Page page=this.pages.findItem(page_id);
		if (page==null)
			return add(new Page(page_id));
		return page;
	}
	
	public Question findOrCreateQuestion(String question_id)
	{
		Question question=this.questions.findItem(question_id);
		if (question==null)
			return add(new Question(question_id));
		return question;
	}
	
	public Image findOrCreateImage(String image_id)
	{
		Image image=this.images.findItem(image_id);
		if (image==null)
			return add(new Image(image_id));
		return image;
	}
	
	public Link findOrCreateLink(String link_id)
	{
		Link link=this.links.findItem(link_id);
		if (link==null)
			return add(new Link(link_id));
		return link;
	}
	
	public Flash findOrCreateFlash(String flash_id)
	{
		Flash flash=this.flashs.findItem(flash_id);
		if (flash==null)
			return add(new Flash(flash_id));
		return flash;
	}
}

