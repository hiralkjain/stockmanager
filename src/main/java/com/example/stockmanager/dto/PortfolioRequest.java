
package com.example.stockmanager.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PortfolioRequest(

        @NotNull Long stockId,

        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal quantity,

        @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal averagePurchasePrice

) {
}
