
package com.example.stockmanager.controller;

import com.example.stockmanager.entity.Watchlist;
import com.example.stockmanager.service.WatchlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService watchlistService;

    public WatchlistController(WatchlistService watchlistService) {
        this.watchlistService = watchlistService;
    }

    @GetMapping
    public ResponseEntity<List<Watchlist>> getWatchlist(Authentication authentication) {
        return ResponseEntity.ok(
                watchlistService.getWatchlist(authentication.getName()));
    }

    @PostMapping("/{stockId}")
    public ResponseEntity<Watchlist> addStock(
            @PathVariable Long stockId,
            Authentication authentication) {

        return ResponseEntity.ok(
                watchlistService.addStock(authentication.getName(), stockId));
    }

    @DeleteMapping("/{stockId}")
    public ResponseEntity<Void> removeStock(
            @PathVariable Long stockId,
            Authentication authentication) {

        watchlistService.removeStock(authentication.getName(), stockId);
        return ResponseEntity.noContent().build();
    }
}
