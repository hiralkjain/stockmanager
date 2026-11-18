package com.example.stockmanager.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record HistoricalCandleResponse(
        LocalDate date,
        BigDecimal open,
        BigDecimal high,
        BigDecimal low,
        BigDecimal close,
        BigDecimal last,
        BigDecimal prev_close,
        Long volume,
        BigDecimal turnover,
        Long trades) {
}