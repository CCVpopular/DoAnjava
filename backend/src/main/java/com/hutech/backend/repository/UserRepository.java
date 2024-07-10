package com.hutech.backend.repository;


import com.hutech.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingAndNameNot(String name, String myName);
    List<User> findByNameContainingAndNameNotAndIdNotIn(String nameFind, String nameNot, List<Integer> idsNotIn);
    List<User> findByNameContainingAndIdNotIn(String nameFind, List<Integer> idsNotIn);
}
