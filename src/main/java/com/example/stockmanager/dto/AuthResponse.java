package com.example.stockmanager.dto;

public record AuthResponse(
        String token,
        String tokenType) {
}