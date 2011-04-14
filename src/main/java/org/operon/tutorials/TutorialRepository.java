package org.operon.tutorials;

import java.util.List;

import org.springframework.data.document.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TutorialRepository extends MongoRepository<Tutorial, String>
{
	Tutorial findByName(String name);
}