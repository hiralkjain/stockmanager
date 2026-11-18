
package com.example.stockmanager.dto;

import java.math.BigDecimal;

public record PortfolioResponse(
        Long id,
        Long stockId,
        String symbol,
        String companyName,
        BigDecimal quantity,
        BigDecimal averagePurchasePrice,
        BigDecimal investedValue,
        BigDecimal currentPrice,
        BigDecimal currentValue,
        BigDecimal profitLoss,
        BigDecimal profitLossPercentage) {
}
