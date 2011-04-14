package org.operon.tutorials;

import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly=true)
public interface TutorialService
{
	Tutorial getTutorial(String tutorial_id);
	Tutorial findOrCreateTutorial(String tutorial_id);
	void updateTutorial(Tutorial tutorial);
	
	void test();
}
