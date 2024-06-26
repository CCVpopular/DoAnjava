package com.hutech.doanjava.repositories;

import com.hutech.doanjava.model.Status;
import com.hutech.doanjava.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String > {
    List<User> findAllByStatus(Status status);
}
