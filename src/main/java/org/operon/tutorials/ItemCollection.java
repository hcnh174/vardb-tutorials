package org.operon.tutorials;

import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Collection;

import org.vardb.util.CException;

import com.google.common.base.Predicate;
import com.google.common.collect.Collections2;

@SuppressWarnings("serial")
public class ItemCollection<T extends Item> extends ArrayList<T>
{
	public T addItem(T item)
	{
		add(item);
		return item;
	}
	
	public T findItem(final String id)
	{
		Collection<T> list=Collections2.filter(this, new Predicate<T>()
		{
			public boolean apply(final T item)
			{
				return item.getId().equals(id);
			}
		});
		if (list.isEmpty())
			return null;
		return list.iterator().next();
	}

	// http://stackoverflow.com/questions/75175/create-instance-of-generic-type-in-java
	public T findOrCreate(final String id)
	{
		try
		{
			T item=findItem(id);
			if (item==null)
			{
				item = (T)((Class)((ParameterizedType)this.getClass().getGenericSuperclass()).getActualTypeArguments()[0]).newInstance();
				item.setId(id);
				add(item);
			}
			return item;
		}
		catch (InstantiationException e)
		{
			throw new CException(e);
		} catch (IllegalAccessException e)
		{
			throw new CException(e);
		}
	}
}
