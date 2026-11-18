
package com.example.stockmanager.repository;

import com.example.stockmanager.entity.PortfolioHolding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<PortfolioHolding, Long> {

    List<PortfolioHolding> findByUserId(Long userId);

    Optional<PortfolioHolding> findByUserIdAndStockId(Long userId, Long stockId);

    Optional<PortfolioHolding> findByIdAndUserId(Long id, Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}
