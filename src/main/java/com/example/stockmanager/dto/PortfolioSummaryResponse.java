
package com.example.stockmanager.dto;

import java.math.BigDecimal;

public record PortfolioSummaryResponse(
        BigDecimal totalInvested,
        BigDecimal currentValue,
        BigDecimal profitLoss,
        BigDecimal profitLossPercentage,
        int totalHoldings,
        int pricedHoldings,
        int unpricedHoldings) {
}
