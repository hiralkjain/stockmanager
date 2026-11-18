
package com.example.stockmanager.controller;

import com.example.stockmanager.dto.PortfolioRequest;
import com.example.stockmanager.dto.PortfolioResponse;
import com.example.stockmanager.dto.PortfolioSummaryResponse;
import com.example.stockmanager.service.PortfolioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<List<PortfolioResponse>> getPortfolio(
            Authentication authentication) {

        return ResponseEntity.ok(
                portfolioService.getPortfolio(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<PortfolioResponse> addHolding(
            @Valid @RequestBody PortfolioRequest request,
            Authentication authentication) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                portfolioService.addHolding(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioResponse> updateHolding(
            @PathVariable Long id,
            @Valid @RequestBody PortfolioRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                portfolioService.updateHolding(
                        authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHolding(
            @PathVariable Long id,
            Authentication authentication) {

        portfolioService.deleteHolding(authentication.getName(), id);

        return ResponseEntity.noContent().build();
    }


@GetMapping("/summary")
public ResponseEntity<PortfolioSummaryResponse> getPortfolioSummary(
        Authentication authentication) {

    return ResponseEntity.ok(
            portfolioService.getPortfolioSummary(authentication.getName())
    );
}

}
