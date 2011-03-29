package org.operon.tutorials;

import java.util.ArrayList;
import java.util.List;

import com.google.code.morphia.annotations.Embedded;

@Embedded
public class Question
{
	protected String id;
	protected String text="text";
	@Embedded protected List<Choice> choices=new ArrayList<Choice>();
	
	public Question(){}
	
	public Question(String id)
	{
		this.id=id;
	}
	
	public String getId(){return this.id;}
	public void setId(String id){this.id=id;}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}

	public List<Choice> getChoices(){return this.choices;}
	public void setChoices(List<Choice> choices){this.choices=choices;}

	public void add(Choice choice)
	{
		this.choices.add(choice);
	}
	
	public Choice findOrCreateChoice(String choice_id)
	{
		for (Choice choice : choices)
		{
			if (choice.getId().equals(choice_id))
				return choice;
		}
		Choice choice=new Choice(choice_id);
		add(choice);
		return choice;
	}
}