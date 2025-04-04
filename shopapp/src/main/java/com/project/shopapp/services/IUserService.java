package com.project.shopapp.services;

import com.project.shopapp.dtos.UpdateUserDTO;
import com.project.shopapp.dtos.UserDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.User;

import java.util.List;

public interface IUserService {
    User createUser(UserDTO useDTO) throws Exception;

    String login(String phoneNumber, String password, Long roleId) throws Exception;

    User getUseDetailsFromToken(String token) throws Exception;

    User updateUser(Long userId, UpdateUserDTO updateUserDTO) throws Exception;
}
