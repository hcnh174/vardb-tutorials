package org.operon.tutorials;

import org.springframework.data.mongodb.repository.MongoRepository;


public interface TutorialRepository extends MongoRepository<Tutorial, String>
{
	Tutorial findByName(String name);
}