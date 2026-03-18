import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { snappyTransition } from "@/lib/motion";
import MarketPulse from "@/components/MarketPulse";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketPulse />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...snappyTransition, duration: 0.4 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-3">
            AUX<span className="text-brand">ERA</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-md mx-auto mb-2">
            Master the markets with zero risk.
          </p>
          <p className="text-muted-foreground/60 text-sm max-w-sm mx-auto mb-10">
            A high-fidelity stock market simulator for aspiring investors.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={snappyTransition}
              onClick={() => navigate("/auth")}
              className="px-8 py-3 rounded-lg bg-brand text-primary-foreground font-medium text-sm shadow-active-glow hover:opacity-90 transition-opacity"
            >
              Start Trading
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={snappyTransition}
              onClick={() => navigate("/auth")}
              className="px-8 py-3 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-card transition-colors"
            >
              Sign In
            </motion.button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 text-center max-w-sm mx-auto">
            <div>
              <p className="font-mono-data text-2xl font-bold text-foreground">15K</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Daily AUX</p>
            </div>
            <div>
              <p className="font-mono-data text-2xl font-bold text-foreground">10+</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Stocks</p>
            </div>
            <div>
              <p className="font-mono-data text-2xl font-bold text-foreground">0</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Risk</p>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="text-center py-6">
        <p className="text-xs text-muted-foreground/40">Virtual trading platform for educational purposes only.</p>
      </footer>
    </div>
  );
};

export default Index;
