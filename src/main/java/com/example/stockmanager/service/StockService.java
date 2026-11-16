
package com.example.stockmanager.service;

import com.example.stockmanager.entity.Stock;
import com.example.stockmanager.repository.StockRepository;
import com.example.stockmanager.dto.StockRequest;
import com.example.stockmanager.dto.StockResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StockService {

    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public StockResponse addStock(StockRequest request) {
        Stock stock = new Stock();
        stock.setSymbol(request.getSymbol());
        stock.setCompanyName(request.getCompanyName());
        stock.setExchange(request.getExchange());
        stock.setCurrentPrice(request.getCurrentPrice());

        return convertToResponse(stockRepository.save(stock));
    }

    public List<StockResponse> getAllStocks() {
        return stockRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public StockResponse getStockById(Long id) {
        return convertToResponse(
                stockRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Stock not found")));
    }

    public StockResponse updateStock(Long id, StockRequest request) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        stock.setSymbol(request.getSymbol());
        stock.setCompanyName(request.getCompanyName());
        stock.setExchange(request.getExchange());
        stock.setCurrentPrice(request.getCurrentPrice());

        return convertToResponse(stockRepository.save(stock));
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    private StockResponse convertToResponse(Stock stock) {
        return new StockResponse(
                stock.getId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                stock.getExchange(),
                stock.getCurrentPrice());
    }
}
