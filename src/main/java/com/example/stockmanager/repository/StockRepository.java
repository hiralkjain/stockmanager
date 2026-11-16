
package com.example.stockmanager.repository;

import com.example.stockmanager.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {

}
