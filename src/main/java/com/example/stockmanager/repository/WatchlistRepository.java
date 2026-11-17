
package com.example.stockmanager.repository;

import com.example.stockmanager.entity.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    List<Watchlist> findByUserId(Long userId);

    Optional<Watchlist> findByUserIdAndStockId(Long userId, Long stockId);

    void deleteByUserIdAndStockId(Long userId, Long stockId);
}
