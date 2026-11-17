import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { StockRequest, StockResponse } from '../../types';

interface StockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockRequest) => Promise<void>;
  initialStock?: StockResponse | null;
  isLoading: boolean;
}

export const StockFormModal: React.FC<StockFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStock,
  isLoading,
}) => {
  const [symbol, setSymbol] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [exchange, setExchange] = useState('NASDAQ');
  const [currentPrice, setCurrentPrice] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialStock) {
      setSymbol(initialStock.symbol);
      setCompanyName(initialStock.companyName);
      setExchange(initialStock.exchange);
      setCurrentPrice(initialStock.currentPrice.toString());
    } else {
      setSymbol('');
      setCompanyName('');
      setExchange('NASDAQ');
      setCurrentPrice('');
    }
    setErrors({});
  }, [initialStock, isOpen]);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!symbol.trim()) {
      errs.symbol = 'Stock symbol is required (e.g. AAPL)';
    } else if (symbol.trim().length > 10) {
      errs.symbol = 'Symbol cannot exceed 10 characters';
    }

    if (!companyName.trim()) {
      errs.companyName = 'Company name is required';
    }

    if (!exchange.trim()) {
      errs.exchange = 'Exchange is required';
    }

    const priceNum = parseFloat(currentPrice);
    if (!currentPrice || isNaN(priceNum) || priceNum <= 0) {
      errs.currentPrice = 'Price must be a valid positive number greater than 0';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      symbol: symbol.trim().toUpperCase(),
      companyName: companyName.trim(),
      exchange: exchange.trim().toUpperCase(),
      currentPrice: parseFloat(currentPrice),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialStock ? 'Edit Stock' : 'Add New Stock'}
      description="Stock records are stored in the Spring Boot database."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Ticker Symbol"
          placeholder="e.g. NVDA"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          error={errors.symbol}
          autoFocus
        />

        <Input
          label="Company Name"
          placeholder="e.g. NVIDIA Corporation"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          error={errors.companyName}
        />

        <div className="w-full">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Exchange
          </label>
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
          >
            <option value="NASDAQ">NASDAQ</option>
            <option value="NYSE">NYSE</option>
            <option value="AMEX">AMEX</option>
            <option value="LSE">LSE</option>
            <option value="TSX">TSX</option>
          </select>
          {errors.exchange && (
            <p className="mt-1 text-xs text-rose-600">{errors.exchange}</p>
          )}
        </div>

        <Input
          label="Current Price (USD)"
          type="number"
          step="0.01"
          placeholder="e.g. 142.50"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          error={errors.currentPrice}
        />

        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialStock ? 'Save Changes' : 'Create Stock'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
