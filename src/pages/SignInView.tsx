import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AnchorIcon } from "lucide-react";
import { toast } from "react-toastify";
import { login } from "../redux/actions/auth";
import { AppDispatch, RootState } from "../redux/store";
import { BrandSpinner } from "../components/common/SkeletonLoader";

export function SignInView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate("/dashboard");
    } catch {
      // Error toast is already fired inside the login action
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* ── Brand gradient base ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #012627 0%, #023d3e 50%, #024a4c 100%)",
        }}
      />

      {/* ── Animated brand-colour orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary teal — top-left */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full"
          style={{ background: "#058789", filter: "blur(80px)", opacity: 0.18 }}
          animate={{ y: [0, 60, 0], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Secondary gold — bottom-right */}
        <motion.div
          className="absolute -bottom-48 -right-48 w-[480px] h-[480px] rounded-full"
          style={{ background: "#ba9d20", filter: "blur(90px)", opacity: 0.15 }}
          animate={{ y: [0, -70, 0], x: [0, -50, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Accent light-teal — top-right */}
        <motion.div
          className="absolute top-10 -right-24 w-72 h-72 rounded-full"
          style={{ background: "#5fc4eb", filter: "blur(80px)", opacity: 0.1 }}
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Gold accent — bottom-left */}
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
          style={{ background: "#b7b065", filter: "blur(70px)", opacity: 0.08 }}
          animate={{ y: [0, 50, 0], x: [0, 60, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Central soft glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(5,135,137,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Depth overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(1,38,39,0.4) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ── Card ── */}
      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-3xl shadow-2xl"
          style={{
            background: "rgba(1,44,45,0.82)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(5,135,137,0.35)",
          }}
        >
          {/* Top accent stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background:
                "linear-gradient(90deg, #058789, #ba9d20, #5fc4eb, #058789)",
            }}
          />

          <div className="px-7 pt-8 pb-7">
            {/* ── Brand header ── */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #058789, #5fc4eb)",
                }}
              >
                <AnchorIcon size={26} className="text-white" />
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                ANCHOR Africa
              </h2>
              <p
                className="text-sm mt-1.5 font-medium"
                style={{ color: "#5fc4eb" }}
              >
                Mental &amp; Behavioral Health Administration
              </p>
            </div>

            {/* ── Email ── */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#5fc4eb" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
                placeholder="your.email@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white placeholder-white/30 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed"
                style={{
                  background: "rgba(5,135,137,0.12)",
                  border: "1px solid rgba(5,135,137,0.30)",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(5,135,137,0.75)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(5,135,137,0.18)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(5,135,137,0.30)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* ── Password ── */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#5fc4eb" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm text-white placeholder-white/30 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(5,135,137,0.12)",
                    border: "1px solid rgba(5,135,137,0.30)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(5,135,137,0.75)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(5,135,137,0.18)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(5,135,137,0.30)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(95,196,235,0.6)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "#5fc4eb")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.color =
                      "rgba(95,196,235,0.6)")
                  }
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ── Forgot password ── */}
            <div className="flex justify-end mb-6">
              <a
                href="/forgot-password"
                className="text-xs font-semibold transition-colors"
                style={{ color: "#5fc4eb" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#ba9d20")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#5fc4eb")
                }
              >
                Forgot password?
              </a>
            </div>

            {/* ── Submit ── */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              className="w-full py-3 px-6 rounded-xl text-sm font-bold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #058789 0%, #5fc4eb 100%)",
                boxShadow: "0 4px 16px rgba(5,135,137,0.35)",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {isLoading ? (
                  <>
                    <BrandSpinner size="sm" />
                    Signing In…
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </motion.button>

            {/* ── Footer ── */}
            <p
              className="mt-5 text-center text-xs"
              style={{ color: "rgba(95,196,235,0.60)" }}
            >
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-semibold transition-colors"
                style={{ color: "#5fc4eb" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#ba9d20")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    "#5fc4eb")
                }
              >
                Contact Administrator
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
