package org.operon.tutorials;

import java.util.ArrayList;
import java.util.List;

import com.google.code.morphia.annotations.Embedded;
import com.google.code.morphia.annotations.Entity;
import com.google.code.morphia.annotations.Id;

@Entity("tutorials")
public class Tutorial
{
	@Id private String id;
	private String name=null;
	private Integer number;
	private String title="";

	@Embedded private List<Page> pages=new ArrayList<Page>();
	@Embedded private List<Question> questions=new ArrayList<Question>();
	@Embedded private List<Image> images=new ArrayList<Image>();
	@Embedded private List<Link> links=new ArrayList<Link>();
	@Embedded private List<Flash> flashs=new ArrayList<Flash>();
	
	public Tutorial(){}
	
	public Tutorial(String id)
	{
		this.id=id;
		this.name=id;
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
	public void setPages(List<Page> pages){this.pages=pages;}

	public List<Image> getImages(){return this.images;}
	public void setImages(List<Image> images){this.images=images;}
	
	public List<Link> getLinks(){return this.links;}
	public void setLinks(List<Link> links){this.links=links;}

	public List<Flash> getFlashs(){return this.flashs;}
	public void setFlashs(List<Flash> flashs){this.flashs=flashs;}

	public List<Question> getQuestions(){return this.questions;}
	public void setQuestions(List<Question> questions){this.questions=questions;}
	
	public void add(Page page)
	{
		this.pages.add(page);
	}
	
	public void add(Question question)
	{
		this.questions.add(question);
	}
	
	public void add(Image image)
	{
		this.images.add(image);
	}
	
	public void add(Link link)
	{
		this.links.add(link);
	}
	
	public void add(Flash flash)
	{
		this.flashs.add(flash);
	}
	
	public Page findOrCreatePage(String page_id)
	{
		for (Page page : pages)
		{
			if (page.getId().equals(page_id))
				return page;
		}
		Page page=new Page(page_id);
		add(page);
		return page;
	}
	
	public Question findOrCreateQuestion(String question_id)
	{
		for (Question question : questions)
		{
			if (question.getId().equals(question_id))
				return question;
		}
		Question question=new Question(question_id);
		add(question);
		return question;
	}
	
	public Image findOrCreateImage(String image_id)
	{
		for (Image image : images)
		{
			if (image.getId().equals(image_id))
				return image;
		}
		Image image=new Image(image_id);
		add(image);
		return image;
	}
	
	public Link findOrCreateLink(String link_id)
	{
		for (Link link : links)
		{
			if (link.getId().equals(link_id))
				return link;
		}
		Link link=new Link(link_id);
		add(link);
		return link;
	}
	
	public Flash findOrCreateFlash(String flash_id)
	{
		for (Flash flash : flashs)
		{
			if (flash.getId().equals(flash_id))
				return flash;
		}
		Flash flash=new Flash(flash_id);
		add(flash);
		return flash;
	}
}

