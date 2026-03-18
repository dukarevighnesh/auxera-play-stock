import type { PortfolioHolding } from "@/lib/stockData";
import { formatCurrency } from "@/lib/stockData";
import MiniChart from "./MiniChart";

interface PortfolioViewProps {
  holdings: PortfolioHolding[];
  balance: number;
  onSelectStock: (symbol: string) => void;
}

const PortfolioView = ({ holdings, balance, onSelectStock }: PortfolioViewProps) => {
  const totalValue = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.shares * h.avgPrice, 0);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-5 shadow-soft-border">
        <p className="text-label mb-1">Portfolio Value</p>
        <p className="text-display font-mono-data text-foreground">
          {formatCurrency(totalValue + balance)}
          <span className="text-sm ml-2 text-muted-foreground">AUX</span>
        </p>
        <div className="flex items-center gap-4 mt-3">
          <div>
            <p className="text-label">Cash</p>
            <p className="font-mono-data text-sm text-foreground">{formatCurrency(balance)}</p>
          </div>
          <div>
            <p className="text-label">Invested</p>
            <p className="font-mono-data text-sm text-foreground">{formatCurrency(totalValue)}</p>
          </div>
          <div>
            <p className="text-label">P&L</p>
            <p className={`font-mono-data text-sm ${totalPnL >= 0 ? 'text-up' : 'text-down'}`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)} ({totalPnLPercent >= 0 ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      {holdings.length === 0 ? (
        <div className="bg-card rounded-lg p-8 shadow-soft-border text-center">
          <p className="text-muted-foreground">No holdings yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Start trading to build your portfolio.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-label px-1">Holdings</h3>
          {holdings.map((h) => {
            const pnl = (h.currentPrice - h.avgPrice) * h.shares;
            const isUp = pnl >= 0;
            return (
              <button
                key={h.symbol}
                onClick={() => onSelectStock(h.symbol)}
                className="w-full bg-card rounded-lg p-4 shadow-soft-border hover:shadow-depth transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-mono-data font-semibold text-foreground">{h.symbol}</p>
                        <p className="text-xs text-muted-foreground">{h.shares} shares</p>
                      </div>
                      <div className="w-20">
                        <MiniChart basePrice={h.currentPrice} isUp={isUp} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-sm text-foreground">{formatCurrency(h.currentPrice * h.shares)}</p>
                    <p className={`font-mono-data text-xs ${isUp ? 'text-up' : 'text-down'}`}>
                      {isUp ? '+' : ''}{formatCurrency(pnl)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
