import { BarChart3, Briefcase, Gift, User, LogOut } from "lucide-react";

type Tab = "market" | "portfolio" | "rewards" | "profile";

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  onLogout: () => void;
}

const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "market", label: "Market", icon: BarChart3 },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "rewards", label: "Rewards", icon: Gift },
  { id: "profile", label: "Profile", icon: User },
];

const AppSidebar = ({ active, onChange, onLogout }: SidebarProps) => {
  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen bg-panel border-r border-border fixed left-0 top-0 pt-4">
      <div className="px-5 mb-8">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          AUX<span className="text-brand">ERA</span>
        </h1>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Paper Trading Terminal</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
              active === id
                ? "bg-brand/10 text-brand"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-down hover:bg-down/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
