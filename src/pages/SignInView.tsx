import React, { useState } from "react";
import { Anchor, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions/auth";
import { AppDispatch, RootState } from "../redux/store";

export function SignInView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0f1a2a] p-4 font-sans text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #5fc4eb 1px, transparent 1px), linear-gradient(to bottom, #5fc4eb 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Floating glow blobs */}
        <motion.div
          className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/25 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-accent-blue/20 blur-[130px]"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-secondary/15 blur-[110px]"
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Concentric ripple rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-accent-blue/10"
              style={{
                width: `${360 + i * 220}px`,
                height: `${360 + i * 220}px`,
              }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] bg-[#1b2940]/90 backdrop-blur-xl rounded-3xl p-7 shadow-2xl border border-white/10 overflow-hidden"
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent-blue to-secondary opacity-80" />

        <div className="flex flex-col items-center mb-6 mt-1">
          <div className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-accent-blue/30">
            <Anchor className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">
            ANCHOR Africa
          </h1>
          <p className="text-accent-blue text-sm font-medium text-center">
            Mental &amp; Behavioral Health Administration
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#0f1a2a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* <div className="flex justify-end">
            <a href="#" className="text-sm font-medium text-accent-blue hover:text-white transition-colors">
              Forgot password?
            </a>
          </div> */}

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-blue hover:bg-[#4ab0d6] disabled:opacity-60 disabled:cursor-not-allowed text-[#0f1a2a] font-bold rounded-xl py-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent-blue/20"
            style={{ marginTop: "2rem" }}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* <div className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <a href="#" className="text-accent-blue hover:text-white font-medium transition-colors">
            Contact Administrator
          </a>
        </div> */}
      </motion.div>
    </div>
  );
}
