package org.operon.tutorials;

import java.util.ArrayList;
import java.util.List;

public class Question extends Resource
{
	protected String text="text";
	protected ItemCollection<Choice> choices=new ItemCollection<Choice>();
	
	public Question(){}
	
	public Question(String id)
	{
		super(id);
	}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}

	public List<Choice> getChoices(){return this.choices;}

	public Choice add(Choice choice)
	{
		return this.choices.addItem(choice);
	}
	
	public Choice findOrCreateChoice(String choice_id)
	{
		Choice choice=this.choices.findItem(choice_id);
		if (choice==null)
			return add(new Choice(choice_id));
		return choice;
	}
}