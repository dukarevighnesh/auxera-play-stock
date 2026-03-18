import { BarChart3, Briefcase, Gift, User } from "lucide-react";

type Tab = "market" | "portfolio" | "rewards" | "profile";

interface NavigationProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "profile", label: "Profile", icon: User },
];

const Navigation = ({ active, onChange }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-panel/95 backdrop-blur-md border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around h-16 px-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg transition-colors ${
              active === id
                ? "text-brand"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
