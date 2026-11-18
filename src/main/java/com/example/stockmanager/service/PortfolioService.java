
package com.example.stockmanager.service;

import com.example.stockmanager.dto.PortfolioRequest;
import com.example.stockmanager.dto.PortfolioResponse;
import com.example.stockmanager.dto.PortfolioSummaryResponse;
import com.example.stockmanager.entity.PortfolioHolding;
import com.example.stockmanager.entity.Stock;
import com.example.stockmanager.entity.User;
import com.example.stockmanager.repository.PortfolioRepository;
import com.example.stockmanager.repository.StockRepository;
import com.example.stockmanager.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    public PortfolioService(
            PortfolioRepository portfolioRepository,
            StockRepository stockRepository,
            UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
    }

    public List<PortfolioResponse> getPortfolio(String email) {
        User user = getUser(email);

        return portfolioRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public PortfolioResponse addHolding(String email, PortfolioRequest request) {
        User user = getUser(email);

        if (portfolioRepository.findByUserIdAndStockId(
                user.getId(), request.stockId()).isPresent()) {
            throw new RuntimeException("Stock already exists in portfolio");
        }

        Stock stock = getStock(request.stockId());

        PortfolioHolding holding = new PortfolioHolding();
        holding.setUser(user);
        holding.setStock(stock);
        holding.setQuantity(request.quantity());
        holding.setAveragePurchasePrice(request.averagePurchasePrice());

        return convertToResponse(portfolioRepository.save(holding));
    }

    @Transactional
    public PortfolioResponse updateHolding(
            String email, Long holdingId, PortfolioRequest request) {

        User user = getUser(email);

        PortfolioHolding holding = portfolioRepository
                .findByIdAndUserId(holdingId, user.getId())
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        Stock stock = getStock(request.stockId());

        if (!holding.getStock().getId().equals(stock.getId())
                && portfolioRepository.findByUserIdAndStockId(
                        user.getId(), stock.getId()).isPresent()) {
            throw new RuntimeException("Stock already exists in portfolio");
        }

        holding.setStock(stock);
        holding.setQuantity(request.quantity());
        holding.setAveragePurchasePrice(request.averagePurchasePrice());

        return convertToResponse(portfolioRepository.save(holding));
    }

    public void deleteHolding(String email, Long holdingId) {
        User user = getUser(email);

        PortfolioHolding holding = portfolioRepository
                .findByIdAndUserId(holdingId, user.getId())
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        portfolioRepository.delete(holding);
    }

    private PortfolioResponse convertToResponse(PortfolioHolding holding) {
        BigDecimal quantity = holding.getQuantity();
        BigDecimal purchasePrice = holding.getAveragePurchasePrice();

        BigDecimal investedValue = quantity.multiply(purchasePrice);

        BigDecimal currentPrice = holding.getStock().getCurrentPrice();

        BigDecimal currentValue = null;
        BigDecimal profitLoss = null;
        BigDecimal profitLossPercentage = null;

        if (currentPrice != null) {
            currentValue = quantity.multiply(currentPrice);
            profitLoss = currentValue.subtract(investedValue);

            profitLossPercentage = profitLoss
                    .multiply(BigDecimal.valueOf(100))
                    .divide(investedValue, 2, RoundingMode.HALF_UP);
        }

        return new PortfolioResponse(
                holding.getId(),
                holding.getStock().getId(),
                holding.getStock().getSymbol(),
                holding.getStock().getCompanyName(),
                quantity,
                purchasePrice,
                investedValue,
                currentPrice,
                currentValue,
                profitLoss,
                profitLossPercentage);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Stock getStock(Long stockId) {
        return stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
    }


public PortfolioSummaryResponse getPortfolioSummary(String email) {

    User user = getUser(email);

    List<PortfolioHolding> holdings =
            portfolioRepository.findByUserId(user.getId());

    BigDecimal totalInvested = BigDecimal.ZERO;
    BigDecimal currentValue = BigDecimal.ZERO;

    int pricedHoldings = 0;
    int unpricedHoldings = 0;

    for (PortfolioHolding holding : holdings) {

        BigDecimal invested = holding.getQuantity()
                .multiply(holding.getAveragePurchasePrice());

        totalInvested = totalInvested.add(invested);

        BigDecimal price = holding.getStock().getCurrentPrice();

        if (price != null) {
            BigDecimal value = holding.getQuantity().multiply(price);
            currentValue = currentValue.add(value);
            pricedHoldings++;
        } else {
            unpricedHoldings++;
        }
    }

    BigDecimal profitLoss = null;
    BigDecimal profitLossPercentage = null;
    BigDecimal finalCurrentValue = null;

    if (unpricedHoldings == 0) {

        finalCurrentValue = currentValue;
        profitLoss = currentValue.subtract(totalInvested);

        if (totalInvested.compareTo(BigDecimal.ZERO) > 0) {
            profitLossPercentage = profitLoss
                    .multiply(BigDecimal.valueOf(100))
                    .divide(totalInvested, 2, RoundingMode.HALF_UP);
        }
    }

    return new PortfolioSummaryResponse(
            totalInvested,
            finalCurrentValue,
            profitLoss,
            profitLossPercentage,
            holdings.size(),
            pricedHoldings,
            unpricedHoldings
    );
}

}
