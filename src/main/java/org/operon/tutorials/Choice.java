package org.operon.tutorials;

import com.google.code.morphia.annotations.Embedded;

@Embedded
public class Choice
{
	private String id;
	private String text="text";
	private String response="response";
	private Boolean correct=false;

	public Choice(){}
	
	public Choice(String id)
	{
		this.id=id;
	}

	public String getId(){return this.id;}
	public void setId(final String id){this.id=id;}

	public String getText(){return this.text;}
	public void setText(String text){this.text=text;}

	public String getResponse(){return this.response;}
	public void setResponse(String response){this.response=response;}

	public Boolean getCorrect(){return this.correct;}
	public void setCorrect(Boolean correct){this.correct=correct;}
}
