package com.project.shopapp.controller;

import com.project.shopapp.dtos.*;
import com.project.shopapp.models.User;
import com.project.shopapp.responses.LoginResponse;
import com.project.shopapp.responses.RegisterRespone;
import com.project.shopapp.services.UserService;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.ultils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
