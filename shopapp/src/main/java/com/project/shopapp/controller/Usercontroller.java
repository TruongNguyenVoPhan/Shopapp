package com.project.shopapp.controller;

import com.project.shopapp.dtos.*;
import com.project.shopapp.models.User;
import com.project.shopapp.responses.LoginResponse;
import com.project.shopapp.responses.RegisterRespone;
import com.project.shopapp.responses.UserResponse;
import com.project.shopapp.services.UserService;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.ultils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class Usercontroller {
    private final UserService userService;
    private final LocalizationUtils localizationUtils;
    //Can we register as a admin
    @PostMapping("/register")
    public ResponseEntity<RegisterRespone> createUser(
            @Valid @RequestBody UserDTO useDTO,
            BindingResult result
    ){
            RegisterRespone registerRespone = new RegisterRespone();
            if (result.hasErrors()){
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                registerRespone.setMessage(errorMessages.toString());
                return ResponseEntity.badRequest().body(registerRespone);
            }
            if(!useDTO.getPassword().equals(useDTO.getRetypePassword())) {
                return ResponseEntity.badRequest().body(RegisterRespone.builder()
                        .message(localizationUtils.getLocalizedMessage(MessageKeys.PASSWORD_NOT_MATCH))
                        .build());
            }
                try {
                    User user = userService.createUser(useDTO);
                    registerRespone.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.REGISTER_SUCCESSFULLY));
                    registerRespone.setUser(user);
                    return ResponseEntity.ok(registerRespone);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(RegisterRespone.builder()
                            .message(localizationUtils.getLocalizedMessage(MessageKeys.REGISTER_FAILED, e.getMessage()))
                            .build());
                }
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody UserLoginDTO userLoginDTO
    ){
        //Kien tra thong tin dang nhap va sinh Token
        try {
            String token = userService.login(
                    userLoginDTO.getPhoneNumber(),
                    userLoginDTO.getPassword(),
                    userLoginDTO.getRoleId() == null ? 1 : userLoginDTO.getRoleId());
            return ResponseEntity.ok(LoginResponse.builder()
                            .message(localizationUtils.getLocalizedMessage(MessageKeys.LOGIN_SUCCESSFULLY))
                            .token(token)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(LoginResponse.builder()
                            .message(localizationUtils.getLocalizedMessage(MessageKeys.LOGIN_FAILED, e.getMessage()))
                    .build());
        }
        //Tra ve token trong response

    }
    @PostMapping("/details")
    public ResponseEntity<UserResponse> getUserDetails(
            @RequestHeader("Authorization") String authorizationHeader
    ){
        try {
            String extractedToken = authorizationHeader.substring(7); // Loại bỏ "Bearer " từ chuỗi token
            User user = userService.getUseDetailsFromToken(extractedToken);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PutMapping("/details/{userId}")
    public ResponseEntity<UserResponse> updateUserDetails(
            @PathVariable Long userId,
            @RequestBody UpdateUserDTO updateUserDTO,
            @RequestHeader("Authorization") String authorizationHeader
    ){
        try {
            String extractedToken = authorizationHeader.substring(7); // Loại bỏ "Bearer " từ chuỗi token
            User user = userService.getUseDetailsFromToken(extractedToken);
            if (user.getId() != null){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            User updateUserDetails = userService.updateUser(userId, updateUserDTO);
            return ResponseEntity.ok(UserResponse.fromUser(updateUserDetails));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
