package org.operon.tutorials;

public enum StandardPageEnum
{	
	QUESTIONS("Questions",0,"8F5D1BAD-1E17-46A5-995E-EC448BFD6A0F","[questions:]"),
	ANSWERS("Answers",0,"80C1E6E9-A8A3-408C-A1A7-E9E7B12C89BB","[answers:]"),
	SCORE("Score",0,"51992708-5D1E-4009-A111-AD0033F4EED0","[score:]"),
	IMAGES("Images",0,"D1AC4AAC-1F7B-4DBE-B8D0-75735993C4C7","[images:]"),
	LINKS("Links",0,"10420857-3164-4A7C-B7DF-5EA9BEEDA0D2","[links:]"),
	FLASHS("Animations",0,"96E6B652-5F82-4A9F-BD2F-54C732BF3CE1","[flashs:]"),
	TERMS("Terms",0,"C6981FF8-53A0-4F45-9EA8-5B6C7703A95E","[terms:]"),
	CREDITS("Credits",0,"28137FF0-22D1-4DEB-85F9-F1FE6EAA7D86","[credits:]");

	private final String m_title;
	private final Integer m_number;
	private final String m_pageid;
	private final String m_template;

	StandardPageEnum(String title, Integer number, String pageid, String template)
	{
		this.m_title=title;
		this.m_number=number;
		this.m_pageid=pageid;
		this.m_template=template;
	}

	public String getTitle(){return m_title;}
	public Integer getNumber(){return m_number;}
	public String getPageid(){return m_pageid;}
	public String getTemplate(){return m_template;}

	public static StandardPageEnum findByPageid(String pageid)
	{
		for (StandardPageEnum page : StandardPageEnum.values())
		{
			if (page.getPageid().equals(pageid))
				return page;
		}
		return null;
	}
}
