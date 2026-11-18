StockPilot API endpoints

Authentication
POST http://localhost:8081/api/users/register
POST http://localhost:8081/api/users/login

Stocks
POST http://localhost:8081/api/stocks
GET http://localhost:8081/api/stocks
GET http://localhost:8081/api/stocks/{id}
PUT http://localhost:8081/api/stocks/{id}
DELETE http://localhost:8081/api/stocks/{id}

Market Data
GET http://localhost:8081/api/market-data/{symbol}?from={date}&to={date}

Watchlist
POST http://localhost:8081/api/watchlist/{stockId}
GET http://localhost:8081/api/watchlist
DELETE http://localhost:8081/api/watchlist/{stockId}

Portfolio
POST http://localhost:8081/api/portfolio
GET http://localhost:8081/api/portfolio
GET http://localhost:8081/api/portfolio/summary
PUT http://localhost:8081/api/portfolio/{id}
DELETE http://localhost:8081/api/portfolio/{id}
