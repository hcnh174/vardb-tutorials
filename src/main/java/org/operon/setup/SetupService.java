package org.operon.setup;

import org.vardb.util.CMessageWriter;

public interface SetupService
{	
	void loadXml(String xml, CMessageWriter writer);
	void loadXmlFromFile(String filename, CMessageWriter writer);
	void loadXmlFromFolder(String folder, CMessageWriter writer);
	void validate(String xml, String schema, CMessageWriter writer);
	void validateFolder(String folder, String schema, CMessageWriter writer);
}
