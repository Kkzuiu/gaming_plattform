"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gamepad2, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Step1Data {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Step2Data {
  country: string;
  birthYear: string;
  preferredLanguage: string;
  discordTag: string;
  bio: string;
}

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i + 1 < current
                ? "bg-primary text-primary-foreground"
                : i + 1 === current
                ? "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {i + 1 < current ? <Check className="w-3 h-3" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-px w-8 transition-colors ${
                i + 1 < current ? "bg-primary" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const { login, register } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [step, setStep] = useState<1 | 2>(1);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Step 1 state
  const [s1, setS1] = useState<Step1Data>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 state
  const [s2, setS2] = useState<Step2Data>({
    country: "",
    birthYear: "",
    preferredLanguage: "",
    discordTag: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(loginEmail, loginPassword);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid email or password.");
    }
    setLoading(false);
  }

  function handleStep1Next(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!s1.username.trim()) return setError("Username is required.");
    if (!s1.email.trim()) return setError("Email is required.");
    if (!s1.password) return setError("Password is required.");
    if (s1.password.length < 6) return setError("Password must be at least 6 characters.");
    if (s1.password !== s1.confirmPassword) return setError("Passwords do not match.");

    setStep(2);
  }

  async function handleRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      username: s1.username.trim(),
      email: s1.email.trim(),
      password: s1.password,
      ...(s2.country && { country: s2.country.trim() }),
      ...(s2.birthYear && { birthYear: parseInt(s2.birthYear, 10) }),
      ...(s2.preferredLanguage && { preferredLanguage: s2.preferredLanguage.trim() }),
      ...(s2.discordTag && { discordTag: s2.discordTag.trim() }),
      ...(s2.bio && { bio: s2.bio.trim() }),
    };

    const result = await register(payload);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
    setLoading(false);
  }

  function switchTab(t: "login" | "register") {
    setTab(t);
    setStep(1);
    setError("");
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Gamepad2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gaming Platform</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {tab === "login"
                ? "Welcome back. Sign in to continue."
                : step === 1
                ? "Create your account — Step 1 of 2"
                : "Almost there! — Step 2 of 2"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex rounded-xl bg-secondary p-1 gap-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* ── LOGIN ── */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Field>
                <FieldLabel className="text-foreground text-sm">Email</FieldLabel>
                <Input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </Field>
              <Field>
                <FieldLabel className="text-foreground text-sm">Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-1"
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          )}

          {/* ── REGISTER STEP 1 ── */}
          {tab === "register" && step === 1 && (
            <form onSubmit={handleStep1Next} className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Account Details
                </span>
                <StepIndicator current={1} total={2} />
              </div>

              <Field>
                <FieldLabel className="text-foreground text-sm">Username</FieldLabel>
                <Input
                  value={s1.username}
                  onChange={(e) => setS1((p) => ({ ...p, username: e.target.value }))}
                  placeholder="your_username"
                  required
                  autoComplete="username"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </Field>

              <Field>
                <FieldLabel className="text-foreground text-sm">Email</FieldLabel>
                <Input
                  type="email"
                  value={s1.email}
                  onChange={(e) => setS1((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </Field>

              <Field>
                <FieldLabel className="text-foreground text-sm">Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showRegPassword ? "text" : "password"}
                    value={s1.password}
                    onChange={(e) => setS1((p) => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    required
                    autoComplete="new-password"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel className="text-foreground text-sm">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={s1.confirmPassword}
                    onChange={(e) => setS1((p) => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat your password"
                    required
                    autoComplete="new-password"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          {/* ── REGISTER STEP 2 ── */}
          {tab === "register" && step === 2 && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Profile <span className="text-muted-foreground/60">(optional)</span>
                </span>
                <StepIndicator current={2} total={2} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel className="text-foreground text-sm">Country</FieldLabel>
                  <Input
                    value={s2.country}
                    onChange={(e) => setS2((p) => ({ ...p, country: e.target.value }))}
                    placeholder="Germany"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-foreground text-sm">Birth Year</FieldLabel>
                  <Input
                    type="number"
                    value={s2.birthYear}
                    onChange={(e) => setS2((p) => ({ ...p, birthYear: e.target.value }))}
                    placeholder="1995"
                    min={1900}
                    max={2010}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel className="text-foreground text-sm">Preferred Language</FieldLabel>
                <Input
                  value={s2.preferredLanguage}
                  onChange={(e) => setS2((p) => ({ ...p, preferredLanguage: e.target.value }))}
                  placeholder="en"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </Field>

              <Field>
                <FieldLabel className="text-foreground text-sm">Discord Tag</FieldLabel>
                <Input
                  value={s2.discordTag}
                  onChange={(e) => setS2((p) => ({ ...p, discordTag: e.target.value }))}
                  placeholder="username#1234"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </Field>

              <Field>
                <FieldLabel className="text-foreground text-sm">Bio</FieldLabel>
                <textarea
                  value={s2.bio}
                  onChange={(e) => setS2((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell the community about yourself…"
                  rows={3}
                  className="w-full rounded-md bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </Field>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 mt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setStep(1); setError(""); }}
                  className="flex items-center gap-2 border-border text-foreground hover:bg-secondary"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
