package org.operon.tutorials;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.mongodb.core.MongoOperations;

public class TutorialServiceImpl implements TutorialService
{
	private static final Log log = LogFactory.getLog(TutorialServiceImpl.class);
	
	@Autowired
	private MongoOperations template;
	  
	@Autowired
	private TutorialRepository repository;
	  
	public void test()
	{
		Tutorial tut=new Tutorial("biol110_01");
		tut.findOrCreatePage("t01_p01");
		repository.save(tut);
		
		Page<Tutorial> page=repository.findAll(new PageRequest(1, 2));
		log.debug("total: "+page.getTotalElements()+" pages="+page.getTotalPages());
		for (Tutorial tutorial : page.getContent())
		{
			 log.debug("Repository findAll-paged: "+tutorial);
		}
		/*
		for (Tutorial tutorial : repository.findByName("biol110_01"))
		{
			 log.debug("Repository findByName: "+tutorial);
		}		
		*/
	}
	
	public Tutorial getTutorial(String tutorial_id)
	{
		return repository.findByName(tutorial_id);
	}
	
	public Tutorial findOrCreateTutorial(String tutorial_id)
	{
		Tutorial tutorial=getTutorial(tutorial_id);
		if (tutorial==null)
		{
			tutorial=new Tutorial(tutorial_id);
			updateTutorial(tutorial);
		}
		return tutorial;
	}
	
	public void updateTutorial(Tutorial tutorial)
	{
		repository.save(tutorial);
	}
}
