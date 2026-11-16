package com.example.stockmanager.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;

@Service
public class HealthService {

    public HashMap<String, String> getStatus() {
        HashMap<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "Stock Manager is running smoothly.");
        return status;
    }
}
