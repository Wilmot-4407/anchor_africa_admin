import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader } from "lucide-react";
import { login } from "../redux/actions/auth";
import { AppDispatch, RootState } from "../redux/store";

export function SignInView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error: authError } = useSelector(
    (state: RootState) => state.auth,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(login({ email, password })).unwrap();

      if (result) {
        navigate("/dashboard");
      }
    } catch (err) {
      setFormError((err as string) || "Invalid email or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const displayError = formError || authError;

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary-dark to-slate-900" />

      {/* Advanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Teal Orb - Top Left */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary rounded-full filter blur-3xl opacity-20"
          animate={{
            y: [0, 60, 0],
            x: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary Gold Orb - Bottom Right */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary rounded-full filter blur-3xl opacity-25"
          animate={{
            y: [0, -80, 0],
            x: [0, -50, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Accent Teal Orb - Top Right */}
        <motion.div
          className="absolute top-20 -right-32 w-64 h-64 bg-primary-light rounded-full filter blur-3xl opacity-15"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle Gold Accent - Bottom Left */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary rounded-full filter blur-2xl opacity-10"
          animate={{
            y: [0, 50, 0],
            x: [0, 60, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Central Glow - Premium Feel */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary via-primary-light to-secondary rounded-full filter blur-3xl opacity-10" />

        {/* Top Accent Light */}
        <motion.div
          className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-5"
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Overlay gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/30" />
      </div>

      {/* Sign In Form Card */}
      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 backdrop-blur-xl border border-primary/40 p-6 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary opacity-100" />

          {/* Header */}
          <div className="text-center mb-5 relative z-10">
            <div className="inline-flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-1 text-white">
              ANCHOR Africa
            </h2>
            <p className="text-slate-400 text-sm">
              Mental & Behavioral Health Administration
            </p>
          </div>

          {/* Error Message */}
          {displayError && (
            <motion.div
              className="mb-4 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-xs"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {displayError}
            </motion.div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label
              className="block text-xs font-medium mb-1.5 text-primary-light"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2.5 bg-slate-800/50 border border-primary/30 rounded-lg text-sm text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 hover:border-primary/50"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              className="block text-xs font-medium mb-1.5 text-primary-light"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2.5 bg-slate-800/50 border border-primary/30 rounded-lg text-sm text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 hover:border-primary/50 pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary transition-colors duration-200"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-5 text-right">
            <a
              href="/forgot-password"
              className="text-xs text-primary-light hover:text-secondary transition-colors duration-200 font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </span>
          </motion.button>

          {/* Footer text */}
          <p className="mt-4 text-center text-xs text-primary-light/70">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-primary-light hover:text-secondary transition-colors duration-200 font-medium"
            >
              Contact Administrator
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
