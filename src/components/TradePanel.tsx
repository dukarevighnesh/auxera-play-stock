import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Stock } from "@/lib/stockData";
import { formatCurrency } from "@/lib/stockData";
import { toast } from "sonner";
import { snappyTransition } from "@/lib/motion";

interface TradePanelProps {
  stock: Stock;
  balance: number;
  onTrade: (symbol: string, shares: number, type: "buy" | "sell", price: number) => void;
  onClose: () => void;
  ownedShares?: number;
}



const TradePanel = ({ stock, balance, onTrade, onClose, ownedShares = 0 }: TradePanelProps) => {
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [executed, setExecuted] = useState(false);

  const shares = parseInt(quantity) || 0;
  const total = shares * stock.price;
  const canBuy = type === "buy" && total <= balance && shares > 0;
  const canSell = type === "sell" && shares > 0 && shares <= ownedShares;
  const canExecute = type === "buy" ? canBuy : canSell;

  const handleExecute = () => {
    if (!canExecute) return;
    onTrade(stock.symbol, shares, type, stock.price);
    setExecuted(true);
    toast.success(`${type === "buy" ? "Bought" : "Sold"} ${shares} ${stock.symbol} @ ${formatCurrency(stock.price)}`);
    setTimeout(() => {
      setExecuted(false);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={transition}
      className="bg-card rounded-lg p-5 shadow-depth"
    >
      <AnimatePresence mode="wait">
        {executed ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 rounded-full bg-up/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-up" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-foreground font-medium">Trade Executed</p>
            <p className="text-muted-foreground text-sm mt-1">
              {shares} {stock.symbol} @ {formatCurrency(stock.price)}
            </p>
          </motion.div>
        ) : (
          <motion.div key="form">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-mono-data font-semibold text-lg text-foreground">{stock.symbol}</h3>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-1 mb-4 bg-muted rounded-md p-0.5">
              {(["buy", "sell"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-sm font-medium rounded transition-colors capitalize ${
                    type === t
                      ? t === "buy" ? "bg-up/20 text-up" : "bg-down/20 text-down"
                      : "text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-label mb-1 block">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full bg-muted rounded-md px-3 py-2.5 font-mono-data text-foreground border border-border focus:border-brand focus:outline-none transition-colors"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per share</span>
                <span className="font-mono-data text-foreground">{formatCurrency(stock.price)} AUX</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-mono-data text-foreground font-semibold">{formatCurrency(total)} AUX</span>
              </div>
              {type === "buy" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-mono-data text-brand">{formatCurrency(balance)} AUX</span>
                </div>
              )}
              {type === "sell" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Owned</span>
                  <span className="font-mono-data text-foreground">{ownedShares} shares</span>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={transition}
              onClick={handleExecute}
              disabled={!canExecute}
              className={`w-full py-3 rounded-md font-medium text-sm transition-all ${
                canExecute
                  ? type === "buy"
                    ? "bg-up text-success-foreground shadow-active-glow"
                    : "bg-down text-destructive-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {type === "buy" ? "Buy" : "Sell"} {stock.symbol}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TradePanel;
