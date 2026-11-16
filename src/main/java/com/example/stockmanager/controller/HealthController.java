package com.example.stockmanager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.stockmanager.service.HealthService;
import java.util.Map;

@RestController
@RequestMapping ("/api")
public class HealthController {
    private final HealthService healthService;

    public HealthController(HealthService healthService) {
        this.healthService = healthService;
    }

    @RequestMapping("/health")
    public Map<String,String> health() {
        return healthService.getStatus();
    }
}

