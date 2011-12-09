package org.operon.tutorials;

import java.util.List;

public class TutorialDaoImpl implements TutorialDao
{	
	/*
	protected Mongo mongo;
	protected Morphia morphia;	
	protected String dbname;
	protected DB db;
	protected Datastore datastore;
	private TutorialDao tutorialDao;
	
	public TutorialDaoImpl(Mongo mongo, Morphia morphia, String dbname)
	{
		//super(mongo,morphia,dbname);
		this.mongo=mongo;
		this.morphia=morphia;		
		this.dbname=dbname;
		tutorialDao=new TutorialDao();
	}
	
	public Mongo getMongo(){return this.mongo;}
	public void setMongo(final Mongo mongo){this.mongo=mongo;}
	
	public Morphia getMorphia(){return this.morphia;}
	public void setMorphia(final Morphia morphia){this.morphia=morphia;}

	public String getDbname(){return this.dbname;}
	public void setDbname(final String dbname){this.dbname=dbname;}
	
	public TutorialDao getTutorialDao()
	{
		return tutorialDao;
	}
	
	public Datastore getDatastore()
	{
		if (datastore==null)
			datastore=morphia.createDatastore(dbname);
		return datastore;
	}
	
	/////////////////////////////////////////////
	
	public class TutorialDao extends DAO<Tutorial, String>
	{
	    public TutorialDao()
	    {
	        super(Tutorial.class, mongo, morphia, dbname);
	    }
	}
	
	public Tutorial getTutorial(String tutorial_id)
	{
		return tutorialDao.get(tutorial_id);
	}
	
	public void addTutorial(Tutorial tutorial)
	{
		tutorialDao.save(tutorial);
	}
	
	public void updateTutorial(Tutorial tutorial)
	{
		tutorialDao.save(tutorial);
	}
	
	////////////////////////////////
	
	public List<Tutorial> getTutorials()
	{
		return tutorialDao.find().asList();
	}
	*/
}
