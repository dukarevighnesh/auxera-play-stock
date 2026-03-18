export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  sector: string;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

const BASE_STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 2.34, changePercent: 1.33, volume: "52.3M", marketCap: "2.78T", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.28, change: -12.45, changePercent: -1.40, volume: "41.8M", marketCap: "2.16T", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.56, change: 5.12, changePercent: 1.25, volume: "22.1M", marketCap: "3.09T", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 155.72, change: -0.89, changePercent: -0.57, volume: "25.6M", marketCap: "1.94T", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.07, change: 3.21, changePercent: 1.76, volume: "48.2M", marketCap: "1.92T", sector: "Consumer" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -8.73, changePercent: -3.39, volume: "98.4M", marketCap: "790B", sector: "Automotive" },
  { symbol: "META", name: "Meta Platforms", price: 502.30, change: 7.85, changePercent: 1.59, volume: "18.9M", marketCap: "1.28T", sector: "Technology" },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.45, change: 1.23, changePercent: 0.62, volume: "8.7M", marketCap: "571B", sector: "Finance" },
  { symbol: "V", name: "Visa Inc.", price: 279.31, change: -1.45, changePercent: -0.52, volume: "6.2M", marketCap: "573B", sector: "Finance" },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.82, change: 0.34, changePercent: 0.22, volume: "7.1M", marketCap: "378B", sector: "Healthcare" },
];

export function getStocks(): Stock[] {
  return BASE_STOCKS.map(stock => {
    const fluctuation = (Math.random() - 0.5) * stock.price * 0.02;
    const newPrice = +(stock.price + fluctuation).toFixed(2);
    const change = +(newPrice - stock.price + stock.change).toFixed(2);
    const changePercent = +((change / (newPrice - change)) * 100).toFixed(2);
    return { ...stock, price: newPrice, change, changePercent };
  });
}

export function generateChartData(basePrice: number, points: number = 48): { time: string; price: number }[] {
  const data: { time: string; price: number }[] = [];
  let price = basePrice * (0.95 + Math.random() * 0.05);
  for (let i = 0; i < points; i++) {
    const drift = (Math.random() - 0.48) * basePrice * 0.008;
    price = Math.max(price * 0.9, price + drift);
    const hour = Math.floor((i / points) * 24);
    const min = Math.floor(((i / points) * 24 - hour) * 60);
    data.push({
      time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
      price: +price.toFixed(2),
    });
  }
  return data;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
