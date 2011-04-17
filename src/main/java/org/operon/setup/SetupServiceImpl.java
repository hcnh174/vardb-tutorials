package org.operon.setup;

import java.util.List;

import org.operon.tutorials.TutorialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.vardb.util.CException;
import org.vardb.util.CFileHelper;
import org.vardb.util.CMessageWriter;
import org.vardb.util.CXmlHelper;
import org.vardb.util.CXmlValidationException;

public class SetupServiceImpl implements SetupService
{	
	@Autowired
	private TutorialService tutorialService;
	
	public String echo(String message)
	{
		return message.toUpperCase();
	}
		
	public void loadXml(String xml, CMessageWriter writer)
	{
		try
		{
			CXmlDataReader xmlloader=new CXmlDataReader(tutorialService,writer);
			xmlloader.loadXml(xml);
		}
		catch(Exception e)
		{
			//CFileHelper.writeFile("c:/setup.xml",xml);
			throw new CException(e);
		}
	}

	public void loadXmlFromFile(String filename, CMessageWriter writer)
	{
		loadXml(CFileHelper.readFile(filename),writer);
		writer.message("Finished loading resources from file: "+filename);
	}
	
	public void loadXmlFromFolder(String folder, CMessageWriter writer)
	{
		writer.message("Loading resources from folder: "+folder);
		List<String> filenames=CFileHelper.listFilesRecursively(folder,".xml");
		for (String filename : filenames)
		{
			System.out.println("loading file "+filename);
			loadXmlFromFile(filename,writer);
		}		
		//String xml=CXmlHelper.mergeXmlFiles(folder,CXmlDataReader.ROOT);
		//loadXml(xml,writer);
		writer.message("Finished loading resources from folder: "+folder);
	}
	
	public void validate(String xml, String schema, CMessageWriter writer)
	{
		try
		{
			String xsd=CFileHelper.getResource(schema);
			CXmlHelper.validate(xml,xsd);
		}
		catch(CXmlValidationException e)
		{
			writer.message(e.getMessage());
		}
	}
	
	public void validateFolder(String folder, String schema, CMessageWriter writer)
	{
		List<String> filenames=CFileHelper.listFilesRecursively(folder,".xml");
		for (String filename : filenames)
		{
			String xml=CFileHelper.readFile(filename);
			validate(xml,schema,writer);
		}
	}
}
