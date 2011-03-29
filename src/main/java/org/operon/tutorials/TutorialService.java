package org.operon.tutorials;

import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly=true)
public interface TutorialService
{
	Tutorial getTutorial(String tutorial_id);
	Tutorial findOrCreateTutorial(String tutorial_id);
	
	/*
	public CPage getPage(String pageid);
	public CPage findOrCreatePage(Tutorial tutorial, String page_id);
	
	public CQuestion getQuestion(String questionid);
	public CQuestion findOrCreateQuestion(Tutorial tutorial, String question_id);
	
	public CChoice getChoice(String choice_id);
	public CChoice findOrCreateChoice(CQuestion question, String choice_id);
	
	public CImage getImage(String image_id);
	public CImage findOrCreateImage(Tutorial tutorial, String image_id);
	
	public CLink getLink(String link_id);
	public CLink findOrCreateLink(Tutorial tutorial, String link_id);

	public CFlash getFlash(String flash_id);
	public CFlash findOrCreateFlash(Tutorial tutorial, String flash_id);
	*/
	
	public TutorialDao getDao();
}
