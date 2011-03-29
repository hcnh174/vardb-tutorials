package org.operon.tutorials;

import java.util.List;

import com.google.code.morphia.DAO;
import com.google.code.morphia.Datastore;
import com.google.code.morphia.Morphia;
import com.mongodb.DB;
import com.mongodb.Mongo;

//@Transactional(readOnly=false)
public interface TutorialDao
{	
	Tutorial getTutorial(String tutorial_id);
	void addTutorial(Tutorial tutorial);
	void updateTutorial(Tutorial tutorial);
	public List<Tutorial> getTutorials();
	
	//public DB getDB();
	public Datastore getDatastore();
	
	public Mongo getMongo();	
	public Morphia getMorphia();	
	public DAO getTutorialDao();
	
	/*
	@Transactional(readOnly=true)
	public List<Tutorial> getTutorials();
	@Transactional(readOnly=true)
	public List<Tutorial> getTutorials(String course_id);
	@Transactional(readOnly=true)
	public List<CLesson> getLessons(String course_id);
	@Transactional(readOnly=true)
	public List<CUnit> getUnits(String course_id);
	@Transactional(readOnly=true)
	public List<CPage> getPages();

	@Transactional(readOnly=true)
	public CLesson getLesson(String lesson_id);
	@Transactional(readOnly=true)
	public CLesson findLesson(String course_id, String tutorial_id);
	@Transactional(readOnly=true)
	public CUnit getUnit(String unit_id);
	@Transactional(readOnly=true)
	
	@Transactional(readOnly=true)
	public CPage getPage(String page_id);
	
	public void addLesson(CLesson lesson);
	public void updateLesson(CLesson lesson);
	public void deleteLesson(String lesson_id);
	
	public void addUnit(CUnit unit);
	public void updateUnit(CUnit unit);
	public void deleteUnit(String unit_id);
	
	
	
	public void deleteTutorial(String tutorial_id);
	public void resetTutorial(String tutorial_id);

	public void addPage(CPage page);
	public void updatePage(CPage page);
	public String deletePage(String page_id);
	
	@Transactional(readOnly=true)
	public CQuestion getQuestion(String question_id);
	
	@Transactional(readOnly=true)
	public CChoice getChoice(String choice_id);

	public void addQuestion(CQuestion bean);
	public void updateQuestion(CQuestion bean);
	public String deleteQuestion(String question_id);
	public void addChoice(CChoice bean);
	public void updateChoice(CChoice choice);
	public String deleteChoice(String choice_id);
	
	@Transactional(readOnly=true)
	public List<CImage> getImages();	
	@Transactional(readOnly=true)
	public CImage getImage(String image_id);	
	public void addImage(CImage image);
	public void updateImage(CImage bean);
	public String deleteImage(String image_id);
	
	@Transactional(readOnly=true)
	public List<CLink> getLinks();	
	@Transactional(readOnly=true)
	public CLink getLink(String link_id);	
	public void addLink(CLink link);
	public void updateLink(CLink bean);
	public String deleteLink(String link_id);
	
	@Transactional(readOnly=true)
	public List<CFlash> getFlashs();
	@Transactional(readOnly=true)
	public CFlash getFlash(String flash_id);
	public void addFlash(CFlash flash);
	public void updateFlash(CFlash bean);
	public String deleteFlash(String flash_id);
	*/
}
