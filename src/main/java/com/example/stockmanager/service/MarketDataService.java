package com.example.stockmanager.service;

import com.example.stockmanager.dto.HistoricalCandleResponse;
import com.example.stockmanager.dto.TejHqResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.List;

@Service
public class MarketDataService {

    private final RestClient restClient;

    public MarketDataService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.tejhq.dev")
                .build();
    }

    public List<HistoricalCandleResponse> getHistoricalData(
            String symbol, LocalDate from, LocalDate to) {

        TejHqResponse response = restClient.get()
                .uri("/v1/ohlcv/nse/{symbol}?from={from}&to={to}",
                        symbol, from, to)
                .retrieve()
                .body(TejHqResponse.class);

        return response != null ? response.data() : List.of();
    }
}