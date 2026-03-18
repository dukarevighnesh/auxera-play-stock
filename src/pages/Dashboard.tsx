import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getStocks, formatCurrency } from "@/lib/stockData";
import type { Stock, PortfolioHolding } from "@/lib/stockData";
import { toast } from "sonner";
import MarketPulse from "@/components/MarketPulse";
import AppSidebar from "@/components/Sidebar";
import Navigation from "@/components/Navigation";
import StockCard from "@/components/StockCard";
import PriceChart from "@/components/PriceChart";
import TradePanel from "@/components/TradePanel";
import PortfolioView from "@/components/PortfolioView";
import DailyReward from "@/components/DailyReward";
import { AnimatePresence } from "framer-motion";

type Tab = "market" | "portfolio" | "rewards" | "profile";

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("market");
  const [stocks, setStocks] = useState<Stock[]>(getStocks());
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showTrade, setShowTrade] = useState(false);
  const [balance, setBalance] = useState(100000);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Simulate stock price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(getStocks());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update holdings with current prices
  useEffect(() => {
    setHoldings((prev) =>
      prev.map((h) => {
        const stock = stocks.find((s) => s.symbol === h.symbol);
        return stock ? { ...h, currentPrice: stock.price } : h;
      })
    );
  }, [stocks]);

  const handleTrade = useCallback(
    (symbol: string, shares: number, type: "buy" | "sell", price: number) => {
      if (type === "buy") {
        setBalance((b) => b - shares * price);
        setHoldings((prev) => {
          const existing = prev.find((h) => h.symbol === symbol);
          if (existing) {
            const totalShares = existing.shares + shares;
            const avgPrice = (existing.avgPrice * existing.shares + price * shares) / totalShares;
            return prev.map((h) => h.symbol === symbol ? { ...h, shares: totalShares, avgPrice } : h);
          }
          const stock = stocks.find((s) => s.symbol === symbol)!;
          return [...prev, { symbol, name: stock.name, shares, avgPrice: price, currentPrice: price }];
        });
      } else {
        setBalance((b) => b + shares * price);
        setHoldings((prev) =>
          prev
            .map((h) => h.symbol === symbol ? { ...h, shares: h.shares - shares } : h)
            .filter((h) => h.shares > 0)
        );
      }
    },
    [stocks]
  );

  const handleClaimReward = () => {
    setBalance((b) => b + 15000);
    setDailyClaimed(true);
    toast.success("Daily Capital Allotted: 15,000 AUX");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSelectStock = (symbol: string) => {
    const stock = stocks.find((s) => s.symbol === symbol);
    if (stock) {
      setSelectedStock(stock);
      setShowTrade(false);
      setTab("market");
    }
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const ownedShares = selectedStock
    ? holdings.find((h) => h.symbol === selectedStock.symbol)?.shares || 0
    : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MarketPulse />
      <AppSidebar active={tab} onChange={setTab} onLogout={handleLogout} />
      <Navigation active={tab} onChange={setTab} />

      <main className="md:ml-[240px] pb-20 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="md:hidden">
              <h1 className="text-lg font-bold tracking-tight text-foreground">
                AUX<span className="text-brand">ERA</span>
              </h1>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="text-foreground">{user.email}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DailyReward onClaim={handleClaimReward} claimed={dailyClaimed} />
              <div className="bg-card rounded-lg px-3 py-2 shadow-soft-border">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Balance</p>
                <p className="font-mono-data text-sm font-semibold text-foreground">
                  {formatCurrency(balance)} <span className="text-brand text-xs">AUX</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-6 py-4">
          {tab === "market" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Stock List */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search stocks..."
                    className="flex-1 bg-card rounded-lg px-4 py-2.5 text-sm text-foreground border border-border focus:border-brand focus:outline-none transition-colors shadow-soft-border"
                  />
                </div>

                {selectedStock ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => { setSelectedStock(null); setShowTrade(false); }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      ← Back to Market
                    </button>
                    <div className="bg-card rounded-lg p-5 shadow-soft-border">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="font-mono-data text-2xl font-bold text-foreground">{selectedStock.symbol}</h2>
                          <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono-data text-2xl font-bold text-foreground">
                            {formatCurrency(selectedStock.price)}
                          </p>
                          <p className={`font-mono-data text-sm ${selectedStock.change >= 0 ? 'text-up' : 'text-down'}`}>
                            {selectedStock.change >= 0 ? '+' : ''}{formatCurrency(selectedStock.change)} ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent}%)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div><span className="text-label">Vol</span> <span className="font-mono-data text-foreground">{selectedStock.volume}</span></div>
                        <div><span className="text-label">MCap</span> <span className="font-mono-data text-foreground">{selectedStock.marketCap}</span></div>
                      </div>
                    </div>
                    <PriceChart basePrice={selectedStock.price} symbol={selectedStock.symbol} />
                    {!showTrade ? (
                      <button
                        onClick={() => setShowTrade(true)}
                        className="w-full py-3 rounded-lg bg-brand text-primary-foreground font-medium text-sm shadow-active-glow hover:opacity-90 transition-opacity"
                      >
                        Trade {selectedStock.symbol}
                      </button>
                    ) : (
                      <AnimatePresence>
                        <TradePanel
                          stock={selectedStock}
                          balance={balance}
                          onTrade={handleTrade}
                          onClose={() => setShowTrade(false)}
                          ownedShares={ownedShares}
                        />
                      </AnimatePresence>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredStocks.map((stock) => (
                      <StockCard
                        key={stock.symbol}
                        stock={stock}
                        onClick={() => setSelectedStock(stock)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Watchlist / Quick View */}
              <div className="hidden lg:block space-y-3">
                <h3 className="text-label px-1">Top Movers</h3>
                {[...stocks]
                  .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                  .slice(0, 5)
                  .map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className="w-full bg-card rounded-lg p-3 shadow-soft-border hover:shadow-depth transition-shadow text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-data text-sm font-semibold text-foreground">{stock.symbol}</span>
                        <span className={`font-mono-data text-xs ${stock.change >= 0 ? 'text-up' : 'text-down'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                        </span>
                      </div>
                      <p className="font-mono-data text-xs text-muted-foreground mt-0.5">{formatCurrency(stock.price)}</p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {tab === "portfolio" && (
            <PortfolioView
              holdings={holdings}
              balance={balance}
              onSelectStock={handleSelectStock}
            />
          )}

          {tab === "rewards" && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-card rounded-lg p-6 shadow-depth text-center">
                <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand text-2xl">◆</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Daily Capital Injection</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Receive 15,000 AUX daily to fuel your trading strategies.
                </p>
                {dailyClaimed ? (
                  <div className="bg-muted rounded-lg py-3 px-4">
                    <p className="text-sm text-muted-foreground">Already claimed today</p>
                    <p className="text-xs text-muted-foreground mt-1">Come back tomorrow for more capital.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleClaimReward}
                    className="relative overflow-hidden w-full py-3 rounded-lg bg-brand text-primary-foreground font-medium shadow-active-glow"
                  >
                    <div className="shimmer absolute inset-0" />
                    <span className="relative">Claim 15,000 AUX</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-card rounded-lg p-6 shadow-depth">
                <h2 className="text-lg font-semibold text-foreground mb-4">Profile</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-label">Email</p>
                    <p className="text-sm text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-label">Balance</p>
                    <p className="font-mono-data text-foreground">{formatCurrency(balance)} AUX</p>
                  </div>
                  <div>
                    <p className="text-label">Holdings</p>
                    <p className="font-mono-data text-foreground">{holdings.length} positions</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-6 w-full py-2.5 rounded-md border border-down/30 text-down text-sm font-medium hover:bg-down/10 transition-colors md:hidden"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
