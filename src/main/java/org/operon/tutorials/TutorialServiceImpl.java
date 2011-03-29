package org.operon.tutorials;

import org.springframework.beans.factory.annotation.Required;

public class TutorialServiceImpl implements TutorialService
{
	protected TutorialDao dao;
	
	public TutorialDao getDao(){return dao;}
	@Required public void setDao(TutorialDao dao){this.dao=dao;}
	
	///////////////////////////////////////////////////////////
	
	public Tutorial getTutorial(String tutorial_id)
	{
		return getDao().getTutorial(tutorial_id);
	}
	
	public Tutorial findOrCreateTutorial(String tutorial_id)
	{
		Tutorial tutorial=getDao().getTutorial(tutorial_id);
		if (tutorial==null)
		{
			tutorial=new Tutorial(tutorial_id);
			getDao().addTutorial(tutorial);
		}
		return tutorial;
	}
	
	/*
	//////////////////////////////////////////////////
	
	public CPage getPage(String page_id)
	{
		CPage page=getDao().getPage(page_id);
		page.initialize();
		return page;
	}
	
	public CPage findOrCreatePage(Tutorial tutorial, String page_id)
	{
		CPage page=getDao().getPage(page_id);
		if (page==null)
		{
			page=new CPage(page_id);
			tutorial.add(page);
			getDao().addPage(page);
		}
		return page;
	}
	
	///////////////////////////////////////////////////
	
	public CQuestion getQuestion(String question_id)
	{
		CQuestion question=getDao().getQuestion(question_id);
		question.initialize();
		return question;
	}
	
	public CQuestion findOrCreateQuestion(Tutorial tutorial, String question_id)
	{
		CQuestion question=getDao().getQuestion(question_id);
		if (question==null)
		{
			question=new CQuestion(question_id);
			tutorial.add(question);
			getDao().addQuestion(question);
		}
		return question;
	}
	
	/////////////////////////////////////////////////////////////////
	
	public CChoice getChoice(String choice_id)
	{
		CChoice choice=getDao().getChoice(choice_id);
		choice.initialize();
		return choice;
	}
	
	public CChoice findOrCreateChoice(CQuestion question, String choice_id)
	{
		CChoice choice=getDao().getChoice(choice_id);
		if (choice==null)
		{
			choice=new CChoice(choice_id);
			question.add(choice);
			getDao().addChoice(choice);
		}
		return choice;
	}
	
	/////////////////////////////////////////////////////////////////
	
	public CImage getImage(String image_id)
	{
		CImage image=getDao().getImage(image_id);
		image.initialize();
		return image;
	}
	
	public CImage findOrCreateImage(Tutorial tutorial, String image_id)
	{
		CImage image=getDao().getImage(image_id);
		if (image==null)
		{
			image=new CImage(image_id);
			tutorial.add(image);
			getDao().addImage(image);
		}
		return image;
	}
	
	/////////////////////////////////////////////////////////////////
	
	public CLink getLink(String link_id)
	{
		CLink link=getDao().getLink(link_id);
		link.initialize();
		return link;
	}
	
	public CLink findOrCreateLink(Tutorial tutorial, String link_id)
	{
		CLink link=getDao().getLink(link_id);
		if (link==null)
		{
			link=new CLink(link_id);
			tutorial.add(link);
			getDao().addLink(link);
		}
		return link;
	}
	
	/////////////////////////////////////////////////////////////////
	
	public CFlash getFlash(String flash_id)
	{
		CFlash flash=getDao().getFlash(flash_id);
		flash.initialize();
		return flash;
	}
	
	public CFlash findOrCreateFlash(Tutorial tutorial, String flash_id)
	{
		CFlash flash=getDao().getFlash(flash_id);
		if (flash==null)
		{
			flash=new CFlash(flash_id);
			tutorial.add(flash);
			getDao().addFlash(flash);
		}
		return flash;
	}
	*/
}
