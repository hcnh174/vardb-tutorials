package org.operon.setup;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.Element;
import org.operon.tutorials.Choice;
import org.operon.tutorials.Flash;
import org.operon.tutorials.Image;
import org.operon.tutorials.Link;
import org.operon.tutorials.Page;
import org.operon.tutorials.Question;
import org.operon.tutorials.Tutorial;
import org.operon.tutorials.TutorialService;
import org.vardb.util.CBeanHelper;
import org.vardb.util.CDom4jHelper;
import org.vardb.util.CException;
import org.vardb.util.CFileHelper;
import org.vardb.util.CMessageWriter;
import org.vardb.util.CXmlHelper;

public class CXmlDataReader
{
	public static final String ROOT="tutorial";
	protected CMessageWriter writer;
	protected CBeanHelper beanhelper=new CBeanHelper();
	
	protected TutorialService tutorialService;
	//protected IUserService userService;
	protected List<Tutorial> tutorials=new ArrayList<Tutorial>();
	private String curfilename=null;
	
	public CXmlDataReader(CMessageWriter writer)
	{
		this.writer=writer;
	}
	
	public void loadXmlFromFolder(String folder)
	{		
		List<String> filenames=CFileHelper.listFilesRecursively(folder,".xml");
		for (String filename : filenames)
		{
			System.out.println("loading file "+filename);
			curfilename=filename;
			String xml=CFileHelper.readFile(filename);
			xml=CXmlHelper.removePI(xml,ROOT);
			xml="<operon>\n"+xml+"</operon>\n";
			//CFileHelper.writeFile("c:/temp/tutorial.xml",xml);
			Document document=CDom4jHelper.parse(xml);
			Element root=document.getRootElement();
			loadXml(root);
		}
	}
	
	public void loadXml(String xml)
	{	
		xml=CXmlHelper.removeRootElement(xml,ROOT);
		xml=CXmlHelper.addRootElement(xml,ROOT);
		Document document=CDom4jHelper.parse(xml);
		Element root=document.getRootElement();
		System.out.println("root="+root.getName());
		if (!root.getName().equals(ROOT))
			throw new CException("Expecting ["+ROOT+"] as the root element.  found ["+root.getName()+"]");
		loadXml(root);
	}
	
	protected void loadXml(Element root)
	{
		for (Object node : selectNodes(root,"tutorial"))
		{
			loadTutorial((Element)node);
		}
	}
	
	protected void saveOrUpdateAttributes()
	{
		/*
		for (Tutorial tutorial : tutorials)
		{
			tutorialService.getDao().updateTutorial(tutorial);
		}
		*/
	}

	/////////////////////////////////////////////////////////
	
	private Tutorial loadTutorial(Element node)
	{
		String tutorial_id=getId(node);
		Tutorial tutorial=this.tutorialService.findOrCreateTutorial(tutorial_id);
		tutorial.setName(getTutorialName());
		tutorial.setNumber(getNumber(tutorial.getName()));
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("title"))
				tutorial.setTitle(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("pages"))
				loadPages(child,tutorial);
			else if (name.equals("questions"))
				loadQuestions(child,tutorial);
			else if (name.equals("images"))
				loadImages(child,tutorial);
			else if (name.equals("links"))
				loadLinks(child,tutorial);
			else if (name.equals("flashs"))
				loadFlashs(child,tutorial);
			else setProperty(tutorial,name,text);
		}
		this.writer.message("updating tutorial: ["+tutorial.getId()+"]");
		this.tutorialService.getDao().updateTutorial(tutorial);
		return tutorial;
	}
	
	private String getTutorialName()
	{
		String name=CFileHelper.stripPath(curfilename);
		name=CFileHelper.stripFiletype(name);
		if (name.startsWith("NEW"))
			name=name.substring(3);
		return name;
	}
	
	private Integer getNumber(String name)
	{
		return Integer.valueOf(name.substring(name.indexOf("_")+1));
	}
	
	////////////////////////////////
	
	private void loadPages(Element node, Tutorial tutorial)
	{
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			if (name.equals("page"))
				loadPage(child,tutorial);
		}
	}	
	
	private void loadQuestions(Element node, Tutorial tutorial)
	{
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			if (name.equals("question"))
				loadQuestion(child,tutorial);
		}
	}
	
	private void loadImages(Element node, Tutorial tutorial)
	{
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			if (name.equals("image"))
				loadImage(child,tutorial);
		}
	}
	
	private void loadLinks(Element node, Tutorial tutorial)
	{
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			if (name.equals("link"))
				loadLink(child,tutorial);
		}
	}
	
	private void loadFlashs(Element node, Tutorial tutorial)
	{
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			if (name.equals("flash"))
				loadFlash(child,tutorial);
		}
	}
	
	////////////////////////////////////////
	
	private void loadPage(Element node, Tutorial tutorial)
	{
		String page_id=getId(node);
		Page page=tutorial.findOrCreatePage(page_id);
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("title"))
				page.setTitle(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("text"))
				page.setText(CDom4jHelper.getChildrenAsXml(child));
			else setProperty(tutorial,name,text);
		}
		this.writer.message("updating page: ["+page.getId()+"]");
	}	
	
	///////////////////////////////////////////////////////

	private void loadQuestion(Element node, Tutorial tutorial)
	{
		String question_id=getId(node);
		Question question=tutorial.findOrCreateQuestion(question_id);
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("text"))
				question.setText(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("choice"))
				loadChoice(child,question);
			else setProperty(question,name,text);
		}
		this.writer.message("updating question: ["+question.getId()+"]");
	}
	
	private void loadChoice(Element node, Question question)
	{
		String choice_id=getId(node);
		Choice choice=question.findOrCreateChoice(choice_id);
		choice.setCorrect(CDom4jHelper.getBoolAttribute(node,"correct",false));
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("text"))
				choice.setText(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("response"))
				choice.setResponse(CDom4jHelper.getChildrenAsXml(child));
			else setProperty(choice,name,text);
		}
		this.writer.message("updating choice: ["+choice.getId()+"]");
	}
	
	///////////////////////////////////////////////////////

	private void loadImage(Element node, Tutorial tutorial)
	{
		String image_id=getId(node);
		Image image=tutorial.findOrCreateImage(image_id);		
		image.setSrc(CDom4jHelper.getAttribute(node,"src"));
		image.setWidth(CDom4jHelper.getIntAttribute(node,"width"));
		image.setHeight(CDom4jHelper.getIntAttribute(node,"height"));
		//image.setThumbnail(CDom4jHelper.getAttribute(node,"thumbnail"));
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("title"))
				image.setTitle(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("caption"))
				image.setCaption(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("alt"))
				doNothing();//image.setAlt(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("description"))
				doNothing();//image.setDescription(CDom4jHelper.getChildrenAsXml(child));
			else setProperty(image,name,text);
		}
		this.writer.message("updating image: ["+image.getId()+"]");
	}
	
	private void loadLink(Element node, Tutorial tutorial)
	{
		String link_id=getId(node);
		Link link=tutorial.findOrCreateLink(link_id);		
		link.setHref(CDom4jHelper.getAttribute(node,"href"));
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("text"))
				link.setText(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("description"))
				doNothing();
			else setProperty(link,name,text);
		}
		this.writer.message("updating link: ["+link.getId()+"]");
	}
	
	private void loadFlash(Element node, Tutorial tutorial)
	{
		String flash_id=getId(node);
		Flash flash=tutorial.findOrCreateFlash(flash_id);
		flash.setBase(CDom4jHelper.getAttribute(node,"base"));
		flash.setSrc(CDom4jHelper.getAttribute(node,"src"));
		for (Iterator<?> iter=node.elementIterator();iter.hasNext();)
		{
			Element child=(Element)iter.next();
			String name=child.getName();
			String text=CDom4jHelper.getTrimmedText(child);
			if (name.equals("title"))
				flash.setTitle(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("caption"))
				flash.setCaption(CDom4jHelper.getChildrenAsXml(child));
			else if (name.equals("alt"))
				doNothing();
			else if (name.equals("description"))
				doNothing();
			else setProperty(flash,name,text);
		}
		this.writer.message("updating flash: ["+flash.getId()+"]");
	}
	
	///////////////////////////////////////////////////
	
	private String getId(Element node)
	{
		return CDom4jHelper.getAttribute(node,"id");
	}
	
	protected List<Element> selectNodes(Element root, String... names)
	{
		return CDom4jHelper.selectNodes(root,names);
	}
	
	protected void setProperty(Object obj, String property, String value)
	{	
		beanhelper.setPropertyFromString(obj,property,value);
	}
	
	protected void doNothing(){}
}