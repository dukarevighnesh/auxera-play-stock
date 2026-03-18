import { motion } from "framer-motion";
import type { Stock } from "@/lib/stockData";
import { formatCurrency } from "@/lib/stockData";

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
}

const transition = { type: "tween" as const, ease: [0.2, 0.8, 0.2, 1], duration: 0.2 };

const StockCard = ({ stock, onClick }: StockCardProps) => {
  const isUp = stock.change >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={transition}
      onClick={onClick}
      className="bg-card rounded-lg p-4 cursor-pointer shadow-soft-border hover:shadow-depth transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono-data font-semibold text-foreground">{stock.symbol}</span>
            <span className="text-label">{stock.sector}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate mt-0.5">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="font-mono-data font-semibold text-foreground">{formatCurrency(stock.price)}</p>
          <p className={`font-mono-data text-sm ${isUp ? 'text-up' : 'text-down'}`}>
            {isUp ? '+' : ''}{formatCurrency(stock.change)} ({isUp ? '+' : ''}{stock.changePercent}%)
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StockCard;
