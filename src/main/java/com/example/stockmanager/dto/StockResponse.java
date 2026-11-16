
package com.example.stockmanager.dto;

import java.math.BigDecimal;

public record StockResponse(
        Long id,
        String symbol,
        String companyName,
        String exchange,
        BigDecimal currentPrice) {
}
