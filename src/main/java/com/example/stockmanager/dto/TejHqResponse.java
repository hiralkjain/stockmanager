package com.example.stockmanager.dto;

import java.util.List;

public record TejHqResponse(
        List<HistoricalCandleResponse> data) {
}