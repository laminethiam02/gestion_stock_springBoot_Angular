package com.example.gestion_stock.controllers;


import com.example.gestion_stock.dtos.AuthRequest;
import com.example.gestion_stock.dtos.AuthResponse;
import com.example.gestion_stock.dtos.RegisterRequest;
import com.example.gestion_stock.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest authRequest) {
        return authService.login(authRequest);
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }

    @GetMapping("/check-username/{username}")
    public boolean checkUsername(@PathVariable String username) {
        return authService.checkUsername(username);
    }

    @GetMapping("/check-email/{email}")
    public boolean checkEmail(@PathVariable String email) {
        return authService.checkEmail(email);
    }
}


