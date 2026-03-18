import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { snappyTransition } from "@/lib/motion";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={snappyTransition}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            AUX<span className="text-brand">ERA</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Master the markets with zero risk.</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-depth">
          <div className="flex gap-1 mb-6 bg-muted rounded-md p-0.5">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                  mode === m ? "bg-brand/20 text-brand" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-label block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-muted rounded-md px-3 py-2.5 text-sm text-foreground border border-border focus:border-brand focus:outline-none transition-colors"
                placeholder="trader@auxera.com"
              />
            </div>
            <div>
              <label className="text-label block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-muted rounded-md px-3 py-2.5 text-sm text-foreground border border-border focus:border-brand focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              transition={snappyTransition}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-brand text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Virtual trading platform for educational purposes only.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
