
package com.example.stockmanager.service;

import com.example.stockmanager.entity.Stock;
import com.example.stockmanager.entity.User;
import com.example.stockmanager.entity.Watchlist;
import com.example.stockmanager.repository.StockRepository;
import com.example.stockmanager.repository.UserRepository;
import com.example.stockmanager.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchlistService {

    private final WatchlistRepository watchlistRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    public WatchlistService(
            WatchlistRepository watchlistRepository,
            StockRepository stockRepository,
            UserRepository userRepository) {
        this.watchlistRepository = watchlistRepository;
        this.stockRepository = stockRepository;
        this.userRepository = userRepository;
    }

    public List<Watchlist> getWatchlist(String email) {
        User user = getUser(email);
        return watchlistRepository.findByUserId(user.getId());
    }

    public Watchlist addStock(String email, Long stockId) {
        User user = getUser(email);

        if (watchlistRepository.findByUserIdAndStockId(user.getId(), stockId).isPresent()) {
            throw new RuntimeException("Stock already exists in watchlist");
        }

        Stock stock = stockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found"));

        Watchlist watchlist = new Watchlist();
        watchlist.setUser(user);
        watchlist.setStock(stock);

        return watchlistRepository.save(watchlist);
    }

    public void removeStock(String email, Long stockId) {
        User user = getUser(email);

        Watchlist watchlist = watchlistRepository
                .findByUserIdAndStockId(user.getId(), stockId)
                .orElseThrow(() -> new RuntimeException("Stock not found in watchlist"));

        watchlistRepository.delete(watchlist);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
