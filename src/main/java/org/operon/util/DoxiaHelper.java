package org.operon.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.Reader;

import org.apache.maven.doxia.module.confluence.ConfluenceParser;
import org.apache.maven.doxia.module.fo.FoSink;
import org.apache.maven.doxia.module.fo.FoSinkFactory;
import org.apache.maven.doxia.module.xhtml.XhtmlSink;
import org.apache.maven.doxia.module.xhtml.XhtmlSinkFactory;
import org.apache.maven.doxia.parser.Parser;
import org.codehaus.plexus.util.ReaderFactory;
import org.vardb.util.CException;

public class DoxiaHelper
{
	public static String convertHtml(String text)
	{
		ByteArrayInputStream in=new ByteArrayInputStream(text.getBytes());
		ByteArrayOutputStream out=new ByteArrayOutputStream();
		
		Parser parser = new ConfluenceParser();
		Reader reader;
		try
		{
			reader = ReaderFactory.newReader(in, "UTF-8" );
			XhtmlSink sink=(XhtmlSink)new XhtmlSinkFactory().createSink(out, "UTF-8");
			parser.parse(reader, sink);
			String html=out.toString();
			html=extractBody(html);
			return html;
		}
		catch (Exception e)
		{
			 throw new CException(e);
		}
		
	}
	
	public static String convertFo(String text)
	{
		ByteArrayInputStream in=new ByteArrayInputStream(text.getBytes());
		ByteArrayOutputStream out=new ByteArrayOutputStream();
		
		Parser parser = new ConfluenceParser();
		Reader reader;
		try
		{
			reader = ReaderFactory.newReader(in, "UTF-8" );
			FoSink sink=(FoSink)new FoSinkFactory().createSink(out, "UTF-8");
			parser.parse(reader, sink);
			String fo=out.toString();
			return fo;
		}
		catch (Exception e)
		{
			 throw new CException(e);
		}
		
	}
	
	public static String extractBody(String xml)
	{
		int index=xml.indexOf("<body>");
		if (index==-1)
			return xml;
		xml=xml.substring(index+6);
		index=xml.indexOf("</body>");
		xml=xml.substring(0,index);
		return xml.trim();
	}
	

		/*
		try
		{
			//"ISO-8859-1"
		    //InputFileWrapper input = InputFileWrapper.valueOf( in, from, "UTF-8", converter.getInputFormats() );
		    //OutputFileWrapper output = OutputFileWrapper.valueOf( out, to, "UTF-8", converter.getOutputFormats() );
			
			Converter converter = new DefaultConverter();
			
			System.out.println("input formats: "+CStringHelper.join(converter.getInputFormats(),", "));
			System.out.println("output formats: "+CStringHelper.join(converter.getOutputFormats(),", "));
	
			
			//converter.setFormatOutput(true);
			StringReader in=new StringReader(text);
			ByteArrayOutputStream out=new ByteArrayOutputStream();
			InputReaderWrapper input = InputReaderWrapper.valueOf(in,"fml", converter.getInputFormats());
			OutputStreamWrapper output = OutputStreamWrapper.valueOf(out, "xhtml", "UTF-8", converter.getOutputFormats() );
		    converter.convert( input, output );
		    return output.toString();
		}
		catch ( UnsupportedFormatException e )
		{
		    throw new CException(e);
		}
		catch ( ConverterException e )
		{
			throw new CException(e);
		}
		*/
	
	/*
	public static String convert2(String text)
	{
		File userDir = new File( System.getProperty ( "user.dir" ) );
		  File inputFile = new File( userDir, "test.apt" );
		  File outputFile = new File( userDir, "test.html" );

		  SinkFactory sinkFactory=new 
		  SinkFactory sinkFactory = (SinkFactory) lookup( SinkFactory.ROLE, "html" ); // Plexus lookup

		  Sink sink = sinkFactory.createSink( outputFile.getParentFile(), outputFile.getName() ) );

		  Parser parser = new AptParser();
		  //Parser parser = (AptParser) lookup( Parser.ROLE, "apt" ); // Plexus lookup

		  Reader reader = ReaderFactory.newReader( inputFile, "UTF-8" );

		  parser.parse( reader, sink );
	}
	
	Parser parser = new TWikiParser();
Reader reader = ReaderFactory.newReader( new
File("/home/jllort/Escritorio/TWikiParserTest.twiki"), "UTF-8" );
OutputStream out = new BufferedOutputStream(new
FileOutputStream("/home/jllort/Escritorio/out.html"));
parser.parse(reader, new TWikiSinkFactory().createSink(out, "UTF-8")); 
	*/
}