import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency } from "@/lib/stockData";
import { snappyTransition } from "@/lib/motion";
import { useState } from "react";

interface DailyRewardProps {
  onClaim: () => void;
  claimed: boolean;
}

const DailyReward = ({ onClaim, claimed }: DailyRewardProps) => {
  const [animating, setAnimating] = useState(false);

  const handleClaim = () => {
    if (claimed || animating) return;
    setAnimating(true);
    setTimeout(() => {
      onClaim();
      setAnimating(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {!claimed && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={snappyTransition}
          onClick={handleClaim}
          disabled={animating}
          className="relative overflow-hidden bg-card border border-brand/30 rounded-lg px-4 py-2.5 flex items-center gap-3 shadow-active-glow hover:border-brand/60 transition-colors"
        >
          <div className="shimmer absolute inset-0" />
          <div className="relative flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-brand/20 flex items-center justify-center">
              <span className="text-brand text-xs font-bold">◆</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Daily Capital</p>
              <p className="font-mono-data text-sm text-foreground font-semibold">
                +{formatCurrency(15000)} AUX
              </p>
            </div>
            <span className="text-xs text-brand font-medium ml-2">Claim</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default DailyReward;
