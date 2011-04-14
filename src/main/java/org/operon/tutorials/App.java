package org.operon.tutorials;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.operon.setup.SetupService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.vardb.util.CMessageWriter;

public class App {

  private static final Log log = LogFactory.getLog(App.class);

  public static void main(String[] args)
  {
	ApplicationContext ctx = new ClassPathXmlApplicationContext("classpath:/META-INF/spring/applicationContext.xml");
	log.debug("contains bean: "+ctx.containsBean("tutorialService"));
	
	
	SetupService setupService=(SetupService)ctx.getBean("setupService");
	String folder="C:/workspace/vardb-tutorials.etc/tutorials/biol110/";
	setupService.loadXmlFromFile(folder+"NEWbiol110_02.xml", new CMessageWriter());
	
	//TutorialService tutorialService=(TutorialService)ctx.getBean("tutorialService");
	//tutorialService.test();
	
	
  }

}