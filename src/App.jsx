import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
    bg: "#F7F8FA", bgCard: "#FFFFFF", bgAlt: "#EEF1F6", surface: "#FFFFFF",
    surfaceHigh: "#F0F4FA", navBg: "#FFFFFF", border: "#DDE3EE", borderLight: "#EEF1F6",
    primary: "#1B4F8A", primaryLight: "#EBF1FA", primaryMid: "#3A6FAF",
    accent: "#2A7D4F", accentLight: "#EAF5EE", accentMid: "#3D9B66",
    warn: "#C96A00", warnLight: "#FFF4E6",
    danger: "#C0392B", dangerLight: "#FDECEA",
    purple: "#6B4FA8", purpleLight: "#F0EBF8",
    gold: "#B8860B", goldLight: "#FDF8EE",
    teal: "#1A7A80", tealLight: "#E6F6F7",
    text: "#1A2233", textMid: "#5A6880", textDim: "#A0AABB", white: "#FFFFFF",
    shadow: "0 2px 12px rgba(27,79,138,0.08)", shadowMd: "0 4px 24px rgba(27,79,138,0.12)",
    radius: 16, radiusSm: 10,
    mono: "'IBM Plex Mono', monospace", display: "'Playfair Display', Georgia, serif",
    body: "'Nunito', 'Segoe UI', sans-serif",
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════
const DB = {
    accounts: [
        { id: "acc_001", name: "Gmail", icon: "📧", status: "Active", lastSync: Date.now() - 120000, risk: "low", breached: false, sessions: 2, provider: "Google" },
        { id: "acc_002", name: "Instagram", icon: "📸", status: "Active", lastSync: Date.now() - 600000, risk: "medium", breached: false, sessions: 3, provider: "Meta" },
        { id: "acc_003", name: "Google Drive", icon: "☁️", status: "Secured", lastSync: Date.now() - 3600000, risk: "low", breached: false, sessions: 1, provider: "Google" },
        { id: "acc_004", name: "Netflix", icon: "🎬", status: "Monitored", lastSync: Date.now() - 7200000, risk: "medium", breached: true, sessions: 5, provider: "Netflix" },
        { id: "acc_005", name: "HDFC Bank", icon: "🏦", status: "Protected", lastSync: Date.now() - 300000, risk: "low", breached: false, sessions: 1, provider: "HDFC" },
        { id: "acc_006", name: "LinkedIn", icon: "💼", status: "Active", lastSync: Date.now() - 900000, risk: "low", breached: false, sessions: 2, provider: "Microsoft" },
    ],
    threats: [
        { id: "thr_001", time: Date.now() - 120000, type: "Suspicious Login Attempt", target: "Gmail", severity: "high", status: "blocked", details: "47 automated login attempts were blocked from overseas IP addresses (Russia, China). No data was accessed.", ip: "195.88.xx.xx", geo: "Moscow, RU" },
        { id: "thr_002", time: Date.now() - 3600000, type: "New Location Login", target: "HDFC Bank", severity: "medium", status: "resolved", details: "A login was detected from a new device in Chennai. The session was verified and resolved.", ip: "103.21.xx.xx", geo: "Chennai, IN" },
        { id: "thr_003", time: Date.now() - 10800000, type: "Data Breach Detected", target: "Netflix", severity: "high", status: "action_needed", details: "Your email and password for Netflix appeared in a public data breach database. Please change your password immediately.", ip: null, geo: null },
        { id: "thr_004", time: Date.now() - 86400000, type: "Password Reused", target: "Instagram", severity: "medium", status: "action_needed", details: "The same password is used across 3 different accounts. This increases your risk if one account is compromised.", ip: null, geo: null },
        { id: "thr_005", time: Date.now() - 172800000, type: "Phishing Email Blocked", target: "Email Inbox", severity: "high", status: "blocked", details: "A scam email pretending to be from HDFC Bank was intercepted before reaching your inbox.", ip: "41.77.xx.xx", geo: "Lagos, NG" },
        { id: "thr_006", time: Date.now() - 259200000, type: "Session Hijack Attempt", target: "Gmail", severity: "high", status: "blocked", details: "An attempt to steal your login session from an anonymous network was detected and blocked.", ip: "185.220.xx.xx", geo: "Anonymous Network" },
    ],
    subscriptions: [
        { id: "sub_001", name: "Netflix", icon: "🎬", amount: 649, category: "Entertainment", status: "Active", nextBill: "Mar 5", usageDays: 12, usagePercent: 40, color: "#E50914" },
        { id: "sub_002", name: "Spotify", icon: "🎵", amount: 119, category: "Music", status: "Active", nextBill: "Mar 1", usageDays: 28, usagePercent: 93, color: "#1DB954" },
        { id: "sub_003", name: "Google One", icon: "☁️", amount: 130, category: "Storage", status: "Active", nextBill: "Mar 12", usageDays: 30, usagePercent: 100, color: "#4285F4" },
        { id: "sub_004", name: "Adobe CC", icon: "🎨", amount: 1799, category: "Creativity", status: "Paused", nextBill: "—", usageDays: 3, usagePercent: 10, color: "#FF0000" },
        { id: "sub_005", name: "Amazon Prime", icon: "📦", amount: 299, category: "Shopping", status: "Active", nextBill: "Mar 20", usageDays: 18, usagePercent: 60, color: "#FF9900" },
        { id: "sub_006", name: "Notion Pro", icon: "📝", amount: 329, category: "Work", status: "Active", nextBill: "Mar 8", usageDays: 25, usagePercent: 83, color: "#6B48FF" },
    ],
    will: {
        version: "v3.2.1", sealed: "Feb 18, 2025",
        executor: "Priya Sharma (Daughter)", trustee: "Raj Patel (Attorney)",
        instructions: [
            { account: "Google Drive", action: "Transfer", heir: "Priya Sharma", timeline: "72 hours", note: "All documents and photos will be transferred" },
            { account: "HDFC Bank", action: "Secure Transfer", heir: "Priya Sharma", timeline: "Legal process", note: "Nominee already declared at bank" },
            { account: "Social Media", action: "Memorialize", heir: "Memorial Mode", timeline: "48 hours", note: "Private posts stay private" },
            { account: "Subscriptions", action: "Cancel All", heir: "Auto-terminated", timeline: "30 days", note: "Any refunds go to nominee bank account" },
            { account: "Crypto Wallet", action: "Key Transfer", heir: "Priya Sharma", timeline: "7 days", note: "Seed phrase stored in physical vault" },
        ],
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════════════════
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

function AppProvider({ children, user }) {
    const [accounts, setAccounts] = useState(DB.accounts);
    const [threats, setThreats] = useState(DB.threats);
    const [subscriptions, setSubscriptions] = useState(DB.subscriptions);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState({});

    const addNotification = useCallback((msg, type = "info") => {
        const id = Date.now();
        setNotifications(n => [...n, { id, msg, type }]);
        setTimeout(() => setNotifications(n => n.filter(x => x.id !== id)), 4000);
    }, []);

    const api = useCallback(async (action) => {
        setLoading(l => ({ ...l, [action]: true }));
        await new Promise(r => setTimeout(r, 700));
        setLoading(l => ({ ...l, [action]: false }));
        return { ok: true };
    }, []);

    const toggleSub = async (id) => {
        await api("toggleSub");
        const sub = subscriptions.find(x => x.id === id);
        setSubscriptions(s => s.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Paused" : "Active" } : x));
        addNotification(`${sub?.name} ${sub?.status === "Active" ? "paused" : "reactivated"} successfully`, "success");
    };

    const resolveThread = async (id) => {
        await api("resolveThread");
        setThreats(t => t.map(x => x.id === id ? { ...x, status: "resolved" } : x));
        addNotification("Issue marked as resolved and logged", "success");
    };

    return (
        <AppCtx.Provider value={{ user, accounts, threats, subscriptions, notifications, loading, addNotification, toggleSub, resolveThread }}>
            {children}
        </AppCtx.Provider>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════════════════════════════
function timeAgo(ts) {
    const d = Date.now() - ts;
    if (d < 60000) return "Just now";
    if (d < 3600000) return `${Math.floor(d / 60000)} min ago`;
    if (d < 86400000) return `${Math.floor(d / 3600000)} hr ago`;
    return `${Math.floor(d / 86400000)} days ago`;
}

function useAnimatedNumber(target, duration = 1200) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target]);
    return val;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SCREENS
// ═══════════════════════════════════════════════════════════════════════════════
function AuthScreen({ onAuth }) {
    const [mode, setMode] = useState("login"); // login | signup | forgot
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [animDir, setAnimDir] = useState(1);

    const switchMode = (m) => {
        setAnimDir(m === "signup" ? 1 : -1);
        setError("");
        setMode(m);
    };

    const handleSubmit = async () => {
        setError("");
        if (mode === "signup") {
            if (!form.name.trim()) return setError("Please enter your name.");
            if (!form.email.includes("@")) return setError("Please enter a valid email.");
            if (form.password.length < 6) return setError("Password must be at least 6 characters.");
            if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
        } else if (mode === "login") {
            if (!form.email.includes("@")) return setError("Please enter a valid email.");
            if (!form.password) return setError("Please enter your password.");
        } else {
            if (!form.email.includes("@")) return setError("Please enter a valid email.");
        }

        setLoading(true);
        await new Promise(r => setTimeout(r, 1200));
        setLoading(false);

        if (mode === "forgot") {
            setError("");
            setMode("forgotSent");
            return;
        }

        const initials = form.name
            ? form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
            : form.email.slice(0, 2).toUpperCase();

        onAuth({
            name: form.name || form.email.split("@")[0],
            email: form.email,
            avatar: initials,
            plan: "Guardian Pro",
            joined: "Feb 2025",
            mfa: true,
            trustScore: 94,
        });
    };

    if (mode === "forgotSent") {
        return (
            <div style={{ minHeight: "100%", background: `linear-gradient(145deg, #0D2545 0%, #1B4F8A 60%, #2A7D4F 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, gap: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>✉️</div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: T.white, fontFamily: T.display, fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Check your inbox</div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: T.body, fontSize: 14, lineHeight: 1.6 }}>We've sent password reset instructions to<br /><strong style={{ color: T.white }}>{form.email}</strong></div>
                </div>
                <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "12px 28px", color: T.white, fontFamily: T.body, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Back to Login
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100%", background: `linear-gradient(145deg, #0D2545 0%, #1B4F8A 60%, #2A7D4F 100%)`, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {/* Hero top */}
            <div style={{ padding: "48px 32px 32px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: 22, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 16px", backdropFilter: "blur(10px)" }}>🛡️</div>
                <div style={{ fontFamily: T.display, fontSize: 26, fontWeight: 700, color: T.white, marginBottom: 6 }}>Digital Guardian</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: T.body, fontSize: 13 }}>Your trusted security companion</div>
            </div>

            {/* Card */}
            <div style={{ flex: 1, background: T.white, borderRadius: "28px 28px 0 0", padding: "28px 24px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Tab */}
                {mode !== "forgot" && (
                    <div style={{ display: "flex", background: T.bgAlt, borderRadius: 12, padding: 4, gap: 4 }}>
                        {["login", "signup"].map(m => (
                            <button key={m} onClick={() => switchMode(m)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", background: mode === m ? T.white : "transparent", color: mode === m ? T.primary : T.textMid, fontFamily: T.body, fontSize: 14, fontWeight: mode === m ? 700 : 500, boxShadow: mode === m ? T.shadow : "none", textTransform: "capitalize", transition: "all 0.2s" }}>
                                {m === "login" ? "Log In" : "Sign Up"}
                            </button>
                        ))}
                    </div>
                )}

                {mode === "forgot" && (
                    <div>
                        <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 6 }}>Reset Password</div>
                        <div style={{ color: T.textMid, fontSize: 13, fontFamily: T.body }}>Enter your email and we'll send reset instructions.</div>
                    </div>
                )}

                {/* Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {mode === "signup" && (
                        <AuthField label="Full Name" type="text" placeholder="Arjun Sharma" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} icon="👤" />
                    )}
                    <AuthField label="Email Address" type="email" placeholder="you@email.com" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} icon="📧" />
                    {mode !== "forgot" && (
                        <AuthField label="Password" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} icon="🔑" rightEl={
                            <button onClick={() => setShowPass(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.primary, fontWeight: 600, fontFamily: T.body, padding: "0 2px" }}>{showPass ? "Hide" : "Show"}</button>
                        } />
                    )}
                    {mode === "signup" && (
                        <AuthField label="Confirm Password" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.confirmPassword} onChange={v => setForm(f => ({ ...f, confirmPassword: v }))} icon="🔒" />
                    )}
                </div>

                {/* Forgot link */}
                {mode === "login" && (
                    <button onClick={() => switchMode("forgot")} style={{ background: "none", border: "none", color: T.primary, fontFamily: T.body, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "right", padding: 0, marginTop: -8 }}>
                        Forgot password?
                    </button>
                )}

                {/* Error */}
                {error && (
                    <div style={{ background: T.dangerLight, border: `1px solid ${T.danger}30`, borderRadius: 10, padding: "10px 14px", color: T.danger, fontFamily: T.body, fontSize: 13, fontWeight: 600 }}>
                        ⚠ {error}
                    </div>
                )}

                {/* Submit */}
                <button onClick={handleSubmit} disabled={loading} style={{ background: loading ? T.primaryMid : `linear-gradient(135deg, ${T.primary}, ${T.primaryMid})`, border: "none", borderRadius: 14, padding: "15px 0", color: T.white, fontFamily: T.body, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "opacity 0.2s", boxShadow: "0 4px 16px rgba(27,79,138,0.3)" }}>
                    {loading ? (
                        <><span style={{ width: 18, height: 18, border: `2px solid rgba(255,255,255,0.4)`, borderTop: `2px solid white`, borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /></>
                    ) : (
                        mode === "login" ? "🔐 Log In Securely" : mode === "signup" ? "🛡️ Create Account" : "📨 Send Reset Link"
                    )}
                </button>

                {mode === "forgot" && (
                    <button onClick={() => switchMode("login")} style={{ background: "none", border: "none", color: T.textMid, fontFamily: T.body, fontSize: 13, cursor: "pointer", padding: 0 }}>
                        ← Back to Login
                    </button>
                )}

                {/* Trust badges */}
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
                    {["🔒 Encrypted", "✓ RBI Compliant", "🛡 ISO 27001"].map(b => (
                        <div key={b} style={{ color: T.textDim, fontFamily: T.body, fontSize: 11, fontWeight: 600 }}>{b}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AuthField({ label, type, placeholder, value, onChange, icon, rightEl }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: 13, fontSize: 16, pointerEvents: "none" }}>{icon}</span>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{ width: "100%", padding: `12px 42px 12px 40px`, border: `1.5px solid ${focused ? T.primary : T.border}`, borderRadius: 12, fontFamily: T.body, fontSize: 14, color: T.text, background: T.white, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", boxShadow: focused ? `0 0 0 3px ${T.primary}15` : "none" }}
                />
                {rightEl && <span style={{ position: "absolute", right: 12 }}>{rightEl}</span>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPLASH
// ═══════════════════════════════════════════════════════════════════════════════
function Splash({ onDone }) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);
    const steps = ["Verifying your identity...", "Loading your accounts...", "Checking for threats...", "Ready!"];
    useEffect(() => {
        const iv = setInterval(() => {
            setProgress(p => {
                const next = p + 2;
                if (next >= 100) { clearInterval(iv); setTimeout(onDone, 600); }
                setPhase(Math.floor((next / 100) * steps.length));
                return Math.min(next, 100);
            });
        }, 40);
        return () => clearInterval(iv);
    }, []);
    return (
        <div style={{ minHeight: "100%", background: `linear-gradient(145deg, #0D2545 0%, #1B4F8A 60%, #2A7D4F 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, padding: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, backdropFilter: "blur(10px)" }}>🛡️</div>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 700, color: T.white, marginBottom: 4 }}>Digital Guardian</div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontFamily: T.body, fontSize: 13 }}>Your trusted security companion</div>
            </div>
            <div style={{ width: "100%", maxWidth: 280 }}>
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, height: 6, overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ background: `linear-gradient(90deg, ${T.accentMid}, #5BC88A)`, width: `${progress}%`, height: "100%", borderRadius: 8, transition: "width 0.1s linear" }} />
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: T.body, fontSize: 13, textAlign: "center" }}>{steps[Math.min(phase, steps.length - 1)]}</div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {["🔒 Bank-level Encryption", "✓ RBI Compliant", "🛡 ISO 27001"].map(b => (
                    <div key={b} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "6px 14px", color: "rgba(255,255,255,0.8)", fontFamily: T.body, fontSize: 11, fontWeight: 600 }}>{b}</div>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════
function Toasts() {
    const { notifications } = useApp();
    const colors = { success: T.accent, danger: T.danger, info: T.primary, warning: T.warn };
    const icons = { success: "✓", danger: "!", info: "i", warning: "⚠" };
    return (
        <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, width: "calc(100% - 32px)", maxWidth: 380 }}>
            {notifications.map(n => (
                <div key={n.id} style={{ background: T.white, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, boxShadow: T.shadowMd, border: `1.5px solid ${colors[n.type]}30`, borderLeft: `4px solid ${colors[n.type]}`, animation: "slideDown 0.3s ease" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: colors[n.type], color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{icons[n.type]}</div>
                    <span style={{ fontFamily: T.body, fontSize: 13, color: T.text, fontWeight: 600 }}>{n.msg}</span>
                </div>
            ))}
        </div>
    );
}

function Card({ children, style = {}, onClick, accent }) {
    return (
        <div onClick={onClick} style={{ background: T.bgCard, borderRadius: T.radius, padding: 16, boxShadow: T.shadow, border: `1.5px solid ${accent ? accent + "30" : T.border}`, borderLeft: accent ? `4px solid ${accent}` : undefined, ...style }}>
            {children}
        </div>
    );
}

function Badge({ text, color = T.primary, bg }) {
    return (
        <span style={{ background: bg || color + "18", color, fontFamily: T.body, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{text}</span>
    );
}

function SectionLabel({ children }) {
    return <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 800, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{children}</div>;
}

function Spinner({ size = 18, color = T.primary }) {
    return <div style={{ width: size, height: size, border: `2px solid ${color}30`, borderTop: `2px solid ${color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ nav }) {
    const { accounts, threats, subscriptions, user } = useApp();
    const score = useAnimatedNumber(94);
    const actionNeeded = threats.filter(t => t.status === "action_needed").length;
    const monthlySpend = subscriptions.filter(s => s.status === "Active").reduce((a, s) => a + s.amount, 0);
    const firstName = user.name.split(" ")[0];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
                <div style={{ fontFamily: T.body, fontSize: 14, color: T.textMid }}>Good morning,</div>
                <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 700, color: T.text }}>{firstName} 👋</div>
            </div>

            <Card accent={T.primary} style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryMid} 100%)`, border: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontFamily: T.body, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>YOUR SAFETY SCORE</div>
                        <div style={{ color: T.white, fontFamily: T.display, fontSize: 52, fontWeight: 700, lineHeight: 1 }}>{score}</div>
                        <div style={{ color: "rgba(255,255,255,0.8)", fontFamily: T.body, fontSize: 12, marginTop: 6 }}>✓ Excellent — You're well protected</div>
                    </div>
                    <div style={{ fontSize: 48, opacity: 0.4 }}>🛡️</div>
                </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[{ v: `${accounts.length}`, l: "Accounts", icon: "🔗" }, { v: "12", l: "Threats Blocked", icon: "🚫" }, { v: `₹${monthlySpend.toLocaleString()}`, l: "Monthly Spend", icon: "💳" }].map(({ v, l, icon }) => (
                    <Card key={l} style={{ padding: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                        <div style={{ fontFamily: T.display, fontSize: 16, fontWeight: 700, color: T.text }}>{v}</div>
                        <div style={{ fontFamily: T.body, fontSize: 10, color: T.textMid, fontWeight: 600 }}>{l}</div>
                    </Card>
                ))}
            </div>

            {actionNeeded > 0 && (
                <div onClick={() => nav("threats")} style={{ background: T.warnLight, border: `1.5px solid ${T.warn}30`, borderLeft: `4px solid ${T.warn}`, borderRadius: T.radius, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <span style={{ fontSize: 22 }}>⚠️</span>
                    <div>
                        <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.text }}>{actionNeeded} issue{actionNeeded > 1 ? "s" : ""} need your attention</div>
                        <div style={{ fontFamily: T.body, fontSize: 12, color: T.textMid }}>Tap to see what needs to be fixed →</div>
                    </div>
                </div>
            )}

            <div>
                <SectionLabel>Quick Actions</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                        { icon: "⚖️", label: "Digital Will", sub: "Dual-control verified", color: T.gold, bg: T.goldLight, to: "will" },
                        { icon: "💳", label: "Subscriptions", sub: `₹${monthlySpend.toLocaleString()} per month`, color: T.purple, bg: T.purpleLight, to: "subscriptions" },
                        { icon: "🛡️", label: "Threats", sub: `${actionNeeded} pending action${actionNeeded !== 1 ? "s" : ""}`, color: T.primary, bg: T.primaryLight, to: "threats" },
                        { icon: "👤", label: "Profile", sub: "Settings & security", color: T.accent, bg: T.accentLight, to: "profile" },
                    ].map(({ icon, label, sub, color, bg, to }) => (
                        <div key={to} onClick={() => nav(to)} style={{ background: bg, border: `1.5px solid ${color}20`, borderRadius: T.radius, padding: 14, cursor: "pointer" }}>
                            <div style={{ fontSize: 24, marginBottom: 6 }}>{icon}</div>
                            <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.text }}>{label}</div>
                            <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid, marginTop: 2 }}>{sub}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <SectionLabel>Your Accounts</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {accounts.slice(0, 4).map(a => {
                        const riskColor = { low: T.accent, medium: T.warn, high: T.danger }[a.risk];
                        return (
                            <Card key={a.id}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ fontSize: 24, width: 42, height: 42, background: T.bgAlt, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{a.icon}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.text }}>{a.name}</div>
                                        <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid }}>{a.sessions} session{a.sessions !== 1 ? "s" : ""} · {timeAgo(a.lastSync)}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        {a.breached && <Badge text="Breached" color={T.danger} />}
                                        <div style={{ fontFamily: T.body, fontSize: 11, color: riskColor, fontWeight: 700, marginTop: 2 }}>{a.risk} risk</div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <Card accent={T.warn} style={{ background: T.warnLight }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20 }}>💡</span>
                    <div>
                        <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: 800, color: T.warn, letterSpacing: "0.08em", marginBottom: 4 }}>SECURITY TIP</div>
                        <div style={{ fontFamily: T.body, fontSize: 13, color: T.text, lineHeight: 1.5 }}>Your Netflix account was involved in a data breach. Change your password today to keep your account safe.</div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIGITAL WILL — DUAL CONTROL (replaces SOS)
// ═══════════════════════════════════════════════════════════════════════════════
const PIPELINE_STEPS = [
    {
        id: 1, label: "Nominee", icon: "👤", color: "#00BFFF",
        desc: "Initiates action: delete, cancel, or transfer request",
        detail: "The designated nominee submits a request via the secure app portal, authenticated by biometric or 2FA. All actions are logged with timestamp and device ID."
    },
    {
        id: 2, label: "Dual Alert", icon: "🔔", color: "#8B5CF6",
        desc: "Email + app push notification sent to main account owner",
        detail: "Simultaneously, an encrypted email and app push notification are dispatched to the primary account holder. The notification includes the nominee's identity, requested action, and a 48–72 hr countdown."
    },
    {
        id: 3, label: "Owner", icon: "✅", color: "#F59E0B",
        desc: "Approves or rejects action within set window (48–72 hrs)",
        detail: "The owner reviews the request from any device. Approval or rejection is signed with their biometric or 6-digit OTP. A rejection triggers the Reject Lock protocol immediately."
    },
    {
        id: 4, label: "Auto", icon: "⚙️", color: "#10B981",
        desc: "No response = action auto-executes per pre-authorized will",
        detail: "If the owner does not respond within the defined window, the system auto-executes according to the pre-authorized will instructions. This ensures continuity without requiring manual intervention."
    },
    {
        id: 5, label: "Reject Lock", icon: "🔒", color: "#EF4444",
        desc: "Owner rejects = nominee locked out for 7-day cooldown window",
        detail: "If rejected, the nominee is locked out for a mandatory 7-day cooldown period. A security alert is sent to both parties. Multiple rejections escalate to the trustee and legal team."
    },
    {
        id: 6, label: "Audit Log", icon: "📋", color: "#06B6D4",
        desc: "Full event chain immutably recorded — tamper-proof trail",
        detail: "Every action, notification, approval, and rejection is cryptographically hashed and recorded in an immutable blockchain-backed ledger — GDPR-compliant and legally admissible."
    },
];

const TRUST_BADGES = [
    { icon: "🔒", label: "Zero-trust execution" },
    { icon: "🎛️", label: "Role-gated action control" },
    { icon: "🇪🇺", label: "GDPR-compliant" },
    { icon: "🔗", label: "Immutable audit trail" },
];

function DualControlWill({ nav }) {
    const [activeStep, setActiveStep] = useState(null);
    const [animatingStep, setAnimatingStep] = useState(null);
    const [triggerDemo, setTriggerDemo] = useState(false);
    const [demoPhase, setDemoPhase] = useState(-1);
    const { addNotification } = useApp();

    const runDemo = () => {
        setTriggerDemo(true);
        setDemoPhase(0);
        let step = 0;
        const iv = setInterval(() => {
            step++;
            if (step >= PIPELINE_STEPS.length) {
                clearInterval(iv);
                setDemoPhase(-1);
                setTriggerDemo(false);
                addNotification("Demo complete — all 6 steps verified ✓", "success");
                return;
            }
            setDemoPhase(step);
        }, 800);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, #0D1F3C 0%, #1B3A6B 60%, #0F3D2B 100%)`, margin: "-16px -16px 0", padding: "24px 20px 20px", borderBottom: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ background: "rgba(0,191,255,0.15)", border: "1px solid rgba(0,191,255,0.4)", borderRadius: 8, padding: "4px 10px", fontFamily: T.body, fontSize: 10, fontWeight: 800, color: "#00BFFF", letterSpacing: "0.12em" }}>DUAL-CONTROL SYSTEM</div>
                </div>
                <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 700, color: T.white, marginBottom: 4, lineHeight: 1.3 }}>Digital Will Protocol<br />Dual-Control Verification</div>
                <div style={{ color: "rgba(255,255,255,0.55)", fontFamily: T.body, fontSize: 12, lineHeight: 1.5 }}>Zero-trust execution with role-gated action control and GDPR-compliant audit trail.</div>
            </div>

            {/* Pipeline — horizontal scroll */}
            <div style={{ background: "#0D1F3C", margin: "0 -16px", padding: "20px 16px" }}>
                <div style={{ overflowX: "auto", paddingBottom: 8 }}>
                    <div style={{ display: "flex", gap: 0, minWidth: "max-content", alignItems: "flex-start" }}>
                        {PIPELINE_STEPS.map((s, i) => {
                            const isActive = activeStep === s.id;
                            const isDemoLit = demoPhase >= i;
                            const borderColor = s.color;
                            return (
                                <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                                    <div
                                        onClick={() => setActiveStep(isActive ? null : s.id)}
                                        style={{
                                            width: 110, cursor: "pointer",
                                            background: isActive ? `${borderColor}22` : isDemoLit ? `${borderColor}15` : "rgba(255,255,255,0.04)",
                                            border: `2px solid ${isActive ? borderColor : isDemoLit ? borderColor + "80" : borderColor + "35"}`,
                                            borderRadius: 14, padding: "14px 10px 12px",
                                            transition: "all 0.3s",
                                            boxShadow: isActive ? `0 0 16px ${borderColor}40` : isDemoLit ? `0 0 8px ${borderColor}25` : "none",
                                        }}
                                    >
                                        {/* Step number */}
                                        <div style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: borderColor, textAlign: "right", marginBottom: 6, opacity: 0.8 }}>{i + 1}</div>
                                        {/* Icon circle */}
                                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${borderColor}25`, border: `2px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 10px" }}>
                                            {isDemoLit && demoPhase === i ? <Spinner size={20} color={borderColor} /> : s.icon}
                                        </div>
                                        <div style={{ fontFamily: T.body, fontSize: 11, fontWeight: 800, color: isActive ? borderColor : T.white, textAlign: "center", marginBottom: 6 }}>{s.label}</div>
                                        <div style={{ fontFamily: T.body, fontSize: 9.5, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 1.4 }}>{s.desc}</div>
                                    </div>

                                    {/* Arrow */}
                                    {i < PIPELINE_STEPS.length - 1 && (
                                        <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <div style={{ color: isDemoLit ? PIPELINE_STEPS[i].color : "rgba(255,255,255,0.2)", fontSize: 14, fontWeight: 700, transition: "color 0.4s" }}>›</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Tap hint */}
                <div style={{ color: "rgba(255,255,255,0.35)", fontFamily: T.body, fontSize: 10, textAlign: "center", marginTop: 8 }}>Tap any step to learn more</div>
            </div>

            {/* Expanded detail */}
            {activeStep && (() => {
                const step = PIPELINE_STEPS.find(s => s.id === activeStep);
                return (
                    <div style={{ background: step.color + "12", border: `1.5px solid ${step.color}40`, borderRadius: 14, padding: "14px 16px", margin: "0 0 0 0", animation: "slideDown 0.25s ease" }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: step.color + "25", border: `1.5px solid ${step.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{step.icon}</div>
                            <div>
                                <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 800, color: T.text, marginBottom: 4 }}>Step {activeStep}: {step.label}</div>
                                <div style={{ fontFamily: T.body, fontSize: 12.5, color: T.textMid, lineHeight: 1.6 }}>{step.detail}</div>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Demo button */}
            <div style={{ padding: "0" }}>
                <button
                    onClick={runDemo}
                    disabled={triggerDemo}
                    style={{ width: "100%", background: triggerDemo ? "rgba(0,191,255,0.1)" : `linear-gradient(135deg, #0D2545, #1B4F8A)`, border: `2px solid #00BFFF40`, borderRadius: 14, padding: "13px 0", color: triggerDemo ? "#00BFFF" : T.white, fontFamily: T.body, fontWeight: 700, fontSize: 13, cursor: triggerDemo ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.3s" }}
                >
                    {triggerDemo ? <><Spinner size={16} color="#00BFFF" /> Running simulation…</> : "▶  Simulate Dual-Control Flow"}
                </button>
            </div>

            {/* Your will status */}
            <Card>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 24 }}>⚖️</div>
                    <div>
                        <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.text }}>Your Digital Will</div>
                        <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid }}>Sealed {DB.will.sealed} · {DB.will.version}</div>
                    </div>
                    <Badge text="Active" color={T.accent} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[{ l: "Executor", v: DB.will.executor }, { l: "Trustee", v: DB.will.trustee }].map(({ l, v }) => (
                        <div key={l} style={{ background: T.bgAlt, borderRadius: 10, padding: "10px 12px" }}>
                            <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 800, color: T.textDim, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                            <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.text }}>{v}</div>
                        </div>
                    ))}
                </div>
                <button onClick={() => nav("will")} style={{ width: "100%", marginTop: 12, background: T.goldLight, border: `1.5px solid ${T.gold}30`, borderRadius: 10, padding: "10px 0", color: T.gold, fontFamily: T.body, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    View Will Instructions →
                </button>
            </Card>

            {/* Trust badges */}
            <div style={{ background: "rgba(27,79,138,0.04)", border: `1.5px solid ${T.border}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {TRUST_BADGES.map(({ icon, label }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{icon}</div>
                            <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, color: T.textMid }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIGITAL WILL — INSTRUCTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function Will({ nav }) {
    const [expandedItem, setExpandedItem] = useState(null);
    const [step, setStep] = useState(2);
    const pipeline = [
        { label: "Set Up Instructions", icon: "⚙️", desc: "Your preferences are saved and encrypted" },
        { label: "Vault Sealed", icon: "🔒", desc: "Locked with military-grade encryption on Feb 18" },
        { label: "Monitoring Inactivity", icon: "⏱️", desc: "Watching for 90 days of inactivity" },
        { label: "Waiting for Confirmation", icon: "📋", desc: "Official death certificate verification" },
        { label: "Trustee Review", icon: "👥", desc: "Executor and attorney must both confirm" },
        { label: "Instructions Carried Out", icon: "✅", desc: "Your wishes are automatically executed" },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card accent={T.gold} style={{ background: T.goldLight }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 32 }}>⚖️</div>
                    <div>
                        <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, color: T.text }}>Your Digital Will</div>
                        <div style={{ fontFamily: T.body, fontSize: 12, color: T.textMid, marginTop: 2 }}>Last updated: {DB.will.sealed}</div>
                    </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
                    {[{ l: "Your Executor", v: DB.will.executor }, { l: "Legal Trustee", v: DB.will.trustee }].map(({ l, v }) => (
                        <div key={l} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "10px 12px" }}>
                            <div style={{ fontFamily: T.body, fontSize: 9, fontWeight: 800, color: T.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{l}</div>
                            <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.text }}>{v}</div>
                        </div>
                    ))}
                </div>
            </Card>

            <div>
                <SectionLabel>How it works — Step by step</SectionLabel>
                <div style={{ position: "relative" }}>
                    {pipeline.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: i < pipeline.length - 1 ? 16 : 0 }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div onClick={() => setStep(i)} style={{ width: 34, height: 34, borderRadius: "50%", cursor: "pointer", background: i < step ? T.accent : i === step ? T.primary : T.bgAlt, border: `2px solid ${i < step ? T.accent : i === step ? T.primary : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i < step ? 14 : 15, color: i < step ? T.white : i === step ? T.white : T.textMid, transition: "all 0.3s", boxShadow: i === step ? `0 0 0 4px ${T.primary}15` : "none", flexShrink: 0 }}>
                                    {i < step ? "✓" : s.icon}
                                </div>
                                {i < pipeline.length - 1 && <div style={{ width: 2, height: 16, background: i < step ? T.accent + "60" : T.border, marginTop: 4 }} />}
                            </div>
                            <div style={{ paddingTop: 4 }}>
                                <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: i === step ? T.primary : T.text }}>{s.label}</div>
                                <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid }}>{s.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <SectionLabel>What happens to each account</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {DB.will.instructions.map((item, i) => (
                        <Card key={i} onClick={() => setExpandedItem(expandedItem === i ? null : i)} style={{ border: `1px solid ${expandedItem === i ? T.gold + "50" : T.border}`, cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.text }}>{item.account}</div>
                                    <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid, marginTop: 2 }}>Goes to: {item.heir} · {item.timeline}</div>
                                </div>
                                <div style={{ fontSize: 16, color: T.textDim, transition: "transform 0.2s", transform: expandedItem === i ? "rotate(90deg)" : "none" }}>›</div>
                            </div>
                            {expandedItem === i && (
                                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, fontFamily: T.body, fontSize: 12, color: T.textMid, lineHeight: 1.5 }}>
                                    📋 {item.note}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>

            <Card accent={T.primary} style={{ background: T.primaryLight }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20 }}>🔐</span>
                    <div>
                        <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 800, color: T.primary, marginBottom: 4 }}>HOW YOUR WILL IS PROTECTED</div>
                        <div style={{ fontFamily: T.body, fontSize: 12, color: T.textMid, lineHeight: 1.6 }}>Nothing happens automatically. Both your executor and trustee must confirm before any action is taken — or a 48–72 hour waiting period applies. Every step is recorded in an unalterable audit log.</div>
                    </div>
                </div>
            </Card>

            <button onClick={() => nav("dualcontrol")} style={{ background: `linear-gradient(135deg, #0D2545, #1B4F8A)`, border: "none", borderRadius: 14, padding: "13px 0", color: T.white, fontFamily: T.body, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                View Dual-Control Verification Flow →
            </button>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════════════════
function Subscriptions() {
    const { subscriptions, toggleSub, loading } = useApp();
    const active = subscriptions.filter(s => s.status === "Active");
    const paused = subscriptions.filter(s => s.status === "Paused");
    const total = active.reduce((a, s) => a + s.amount, 0);
    const saved = paused.reduce((a, s) => a + s.amount, 0);
    const [view, setView] = useState("all");
    const displayed = view === "active" ? active : view === "paused" ? paused : subscriptions;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card accent={T.purple} style={{ background: T.purpleLight }}>
                <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 700, color: T.purple, marginBottom: 4 }}>MONTHLY SUBSCRIPTIONS</div>
                <div style={{ fontFamily: T.display, fontSize: 36, fontWeight: 700, color: T.text }}>₹{total.toLocaleString()}</div>
                {saved > 0 && (
                    <div style={{ background: T.accentLight, borderRadius: 8, padding: "6px 10px", marginTop: 8, fontFamily: T.body, fontSize: 11, color: T.accent, fontWeight: 600 }}>
                        You're saving ₹{saved.toLocaleString()}/mo by pausing {paused.length} subscription{paused.length > 1 ? "s" : ""}
                    </div>
                )}
                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: T.body, fontSize: 11, color: T.textMid }}>Yearly forecast</span>
                    <span style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.text }}>₹{(total * 12).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", height: 8, borderRadius: 8, overflow: "hidden", marginTop: 10, gap: 2 }}>
                    {active.map(s => (
                        <div key={s.id} style={{ flex: s.amount, background: s.color, transition: "flex 0.4s" }} />
                    ))}
                </div>
            </Card>

            <div style={{ display: "flex", background: T.bgAlt, borderRadius: 12, padding: 4, gap: 4 }}>
                {["all", "active", "paused"].map(v => (
                    <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", background: view === v ? T.white : "transparent", color: view === v ? T.primary : T.textMid, fontFamily: T.body, fontSize: 13, fontWeight: view === v ? 700 : 500, boxShadow: view === v ? T.shadow : "none", textTransform: "capitalize", transition: "all 0.2s" }}>{v}</button>
                ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {displayed.map(s => {
                    const usageColor = s.usagePercent > 70 ? T.accent : s.usagePercent > 30 ? T.warn : T.danger;
                    return (
                        <Card key={s.id}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.text }}>{s.name}</div>
                                    <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid }}>{s.category} · Next: {s.nextBill}</div>
                                    <div style={{ marginTop: 6, background: T.bgAlt, borderRadius: 4, height: 5, overflow: "hidden" }}>
                                        <div style={{ width: `${s.usagePercent}%`, height: "100%", background: usageColor, borderRadius: 4, transition: "width 0.5s" }} />
                                    </div>
                                    <div style={{ fontFamily: T.body, fontSize: 10, color: usageColor, fontWeight: 600, marginTop: 2 }}>{s.usagePercent}% used</div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <div style={{ fontFamily: T.body, fontSize: 14, fontWeight: 700, color: T.text }}>₹{s.amount}</div>
                                    {loading["toggleSub"] ? <Spinner size={22} /> : (
                                        <div onClick={() => toggleSub(s.id)} style={{ width: 46, height: 26, borderRadius: 13, cursor: "pointer", background: s.status === "Active" ? T.accent : T.textDim, position: "relative", transition: "background 0.3s", marginTop: 6, border: `1px solid ${s.status === "Active" ? T.accentMid : T.textDim}` }}>
                                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: T.white, position: "absolute", top: 2, left: s.status === "Active" ? 23 : 3, transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {subscriptions.find(s => s.name === "Adobe CC" && s.usagePercent < 20) && (
                <Card accent={T.accent} style={{ background: T.accentLight }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 20 }}>💡</span>
                        <div>
                            <div style={{ fontFamily: T.body, fontSize: 12, fontWeight: 800, color: T.accent, marginBottom: 4 }}>SAVE MONEY</div>
                            <div style={{ fontFamily: T.body, fontSize: 12, color: T.text, lineHeight: 1.5 }}>You've used Adobe CC for only 3 days this month. Pausing it could save you ₹1,799/month (₹21,588/year).</div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// THREATS
// ═══════════════════════════════════════════════════════════════════════════════
function Threats() {
    const { threats, resolveThread, loading } = useApp();
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("all");
    const sevColor = { high: T.danger, medium: T.warn, low: T.accent };
    const pending = threats.filter(t => t.status === "action_needed").length;
    const displayed = filter === "all" ? threats : threats.filter(t => t.status === filter || t.severity === filter);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[{ v: pending, l: "Need Action", c: T.danger, bg: T.dangerLight }, { v: threats.filter(t => t.status === "blocked").length, l: "Blocked", c: T.accent, bg: T.accentLight }, { v: threats.filter(t => t.status === "resolved").length, l: "Resolved", c: T.primary, bg: T.primaryLight }].map(({ v, l, c, bg }) => (
                    <div key={l} style={{ background: bg, borderRadius: 12, padding: "12px 10px", textAlign: "center", border: `1.5px solid ${c}20` }}>
                        <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 700, color: c }}>{v}</div>
                        <div style={{ fontFamily: T.body, fontSize: 10, color: c, fontWeight: 700 }}>{l}</div>
                    </div>
                ))}
            </div>

            {pending > 0 && (
                <div style={{ background: T.dangerLight, border: `1.5px solid ${T.danger}30`, borderLeft: `4px solid ${T.danger}`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.danger }}>Action required: {pending} issue{pending > 1 ? "s" : ""}</div>
                    <div style={{ fontFamily: T.body, fontSize: 12, color: T.textMid, marginTop: 2 }}>Please review and resolve the alerts below.</div>
                </div>
            )}

            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                {[{ v: "all", l: "All" }, { v: "action_needed", l: "Action Needed" }, { v: "high", l: "High Risk" }, { v: "blocked", l: "Blocked" }].map(({ v, l }) => (
                    <button key={v} onClick={() => setFilter(v)} style={{ background: filter === v ? T.primary : T.bgCard, border: `1.5px solid ${filter === v ? T.primary : T.border}`, borderRadius: 20, padding: "7px 14px", color: filter === v ? T.white : T.textMid, fontFamily: T.body, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0 }}>{l}</button>
                ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {displayed.map(t => {
                    const isOpen = selected === t.id;
                    const statusColor = t.status === "blocked" ? T.accent : t.status === "resolved" ? T.primary : T.danger;
                    const statusLabel = { blocked: "✓ Blocked", resolved: "✓ Resolved", action_needed: "⚠ Action Needed" }[t.status];
                    return (
                        <Card key={t.id} onClick={() => setSelected(isOpen ? null : t.id)} style={{ border: `1px solid ${isOpen ? sevColor[t.severity] + "40" : T.border}`, cursor: "pointer" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.text }}>{t.type}</div>
                                    <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid, marginTop: 2 }}>{t.target} · {timeAgo(t.time)}</div>
                                </div>
                                <Badge text={statusLabel} color={statusColor} />
                            </div>
                            {isOpen && (
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                                    <div style={{ fontFamily: T.body, fontSize: 12, color: T.textMid, lineHeight: 1.6, marginBottom: 10 }}>{t.details}</div>
                                    {t.geo && (
                                        <div style={{ background: T.bgAlt, borderRadius: 8, padding: "8px 12px", fontFamily: T.mono, fontSize: 11, color: T.textMid, marginBottom: 10 }}>
                                            📍 {t.geo} · IP: {t.ip}
                                        </div>
                                    )}
                                    {t.status === "action_needed" && (
                                        <button onClick={(e) => { e.stopPropagation(); resolveThread(t.id); }} style={{ background: T.accent, border: "none", borderRadius: 10, padding: "10px 16px", color: T.white, fontFamily: T.body, fontWeight: 700, fontSize: 13, cursor: "pointer", width: "100%" }}>
                                            {loading["resolveThread"] ? "Resolving…" : "✓ Mark as Resolved"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function Profile({ onSignOut }) {
    const { addNotification, user } = useApp();
    const settings = [
        { icon: "🔔", label: "Notifications", value: "Push & Email", color: T.primary },
        { icon: "🔐", label: "Two-Factor Authentication", value: "Authenticator App — Active", color: T.accent },
        { icon: "📡", label: "Data Sync", value: "Real-time monitoring", color: T.primary },
        { icon: "🌍", label: "Region", value: "South Asia", color: T.primary },
        { icon: "👆", label: "Biometric Lock", value: "Fingerprint enabled", color: T.accent },
        { icon: "⏱️", label: "Auto Logout", value: "After 30 minutes", color: T.warn },
    ];
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryMid})`, color: T.white, fontFamily: T.display, fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{user.avatar}</div>
                <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 700, color: T.text }}>{user.name}</div>
                <div style={{ fontFamily: T.body, fontSize: 13, color: T.textMid }}>{user.email}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.accentLight, borderRadius: 20, padding: "4px 12px", marginTop: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
                    <span style={{ fontFamily: T.body, fontSize: 11, fontWeight: 700, color: T.accent }}>✓ 2FA Active</span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[{ v: "94", l: "Safety Score", c: T.accent, bg: T.accentLight }, { v: "12", l: "Blocked", c: T.primary, bg: T.primaryLight }, { v: user.joined || "Feb '25", l: "Member Since", c: T.purple, bg: T.purpleLight }].map(({ v, l, c, bg }) => (
                    <div key={l} style={{ background: bg, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                        <div style={{ fontFamily: T.display, fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                        <div style={{ fontFamily: T.body, fontSize: 10, color: c, fontWeight: 700 }}>{l}</div>
                    </div>
                ))}
            </div>

            <div>
                <SectionLabel>Security Settings</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {settings.map(({ icon, label, value, color }) => (
                        <Card key={label} style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.text }}>{label}</div>
                                    <div style={{ fontFamily: T.body, fontSize: 11, color: T.textMid }}>{value}</div>
                                </div>
                                <span style={{ color: T.textDim, fontSize: 16 }}>›</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <button onClick={() => { addNotification("You've been signed out safely", "success"); setTimeout(onSignOut, 800); }} style={{ background: T.dangerLight, border: `1.5px solid ${T.danger}25`, borderRadius: 14, padding: "13px", color: T.danger, fontFamily: T.body, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Sign Out</button>

            <div style={{ textAlign: "center", fontFamily: T.body, fontSize: 11, color: T.textDim, lineHeight: 1.6 }}>Digital Guardian v3.2.1 · ISO 27001 Certified · RBI Compliant<br />Your data is encrypted and never sold.</div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════════════
function NavBar({ screen, nav }) {
    const { threats } = useApp();
    const pending = threats.filter(t => t.status === "action_needed").length;
    const tabs = [
        { id: "dashboard", icon: "🏠", label: "Home" },
        { id: "threats", icon: "🛡️", label: "Safety", badge: pending },
        { id: "dualcontrol", icon: "⚖️", label: "Will", highlight: false },
        { id: "subscriptions", icon: "💳", label: "Subscriptions" },
        { id: "profile", icon: "👤", label: "Profile" },
    ];
    return (
        <div style={{ position: "sticky", bottom: 0, background: T.navBg, borderTop: `1px solid ${T.border}`, display: "flex", zIndex: 100, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            {tabs.map(({ id, icon, label, badge, highlight }) => {
                const active = screen === id || (id === "dualcontrol" && screen === "will");
                return (
                    <button key={id} onClick={() => nav(id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 0 8px", background: "transparent", border: "none", cursor: "pointer", position: "relative" }}>
                        {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 3, borderRadius: "0 0 3px 3px", background: T.primary }} />}
                        <div style={{ fontSize: 20, position: "relative" }}>
                            {icon}
                            {badge > 0 && <div style={{ position: "absolute", top: -4, right: -6, background: T.danger, color: T.white, fontFamily: T.body, fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</div>}
                            {highlight && <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: T.danger, border: `2px solid ${T.white}` }} />}
                        </div>
                        <div style={{ fontFamily: T.body, fontSize: 10, fontWeight: active ? 800 : 500, color: active ? T.primary : T.textDim }}>{label}</div>
                    </button>
                );
            })}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCREEN TITLES
// ═══════════════════════════════════════════════════════════════════════════════
const screenTitles = {
    dashboard: "Digital Guardian",
    dualcontrol: "Dual-Control System",
    will: "Digital Will",
    subscriptions: "My Subscriptions",
    threats: "Safety Monitor",
    profile: "My Account",
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
function AppInner({ user, onSignOut }) {
    const [booted, setBooted] = useState(false);
    const [screen, setScreen] = useState("dashboard");
    const nav = (s) => setScreen(s);

    const renderScreen = () => {
        switch (screen) {
            case "dashboard": return <Dashboard nav={nav} />;
            case "dualcontrol": return <DualControlWill nav={nav} />;
            case "will": return <Will nav={nav} />;
            case "subscriptions": return <Subscriptions />;
            case "threats": return <Threats />;
            case "profile": return <Profile onSignOut={onSignOut} />;
            default: return <Dashboard nav={nav} />;
        }
    };

    return (
        <div style={{ minHeight: "100%", background: T.bg, display: "flex", flexDirection: "column" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: #1A2233; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

            {!booted ? (
                <Splash onDone={() => setBooted(true)} />
            ) : (
                <>
                    <Toasts />
                    {/* Header */}
                    <div style={{ background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "14px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50 }}>
                        <div>
                            <div style={{ fontFamily: T.display, fontSize: 18, fontWeight: 700, color: T.text }}>{screenTitles[screen]}</div>
                            <div style={{ fontFamily: T.body, fontSize: 11, color: T.accent, fontWeight: 600 }}>✓ All systems secure</div>
                        </div>
                        <div onClick={() => nav("profile")} style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryMid})`, color: T.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.display, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{user.avatar}</div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflowY: "auto", padding: 16, paddingBottom: 8 }}>
                        {renderScreen()}
                    </div>

                    <NavBar screen={screen} nav={nav} />
                </>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
    const [user, setUser] = useState(null);

    const handleSignOut = () => setUser(null);

    if (!user) {
        return (
            <div style={{ minHeight: "100vh", background: "#1A2233", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Nunito:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
          * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
          ::-webkit-scrollbar { display: none; }
        `}</style>
                <div style={{ width: "100%", maxWidth: 430, height: "100vh", overflow: "hidden", position: "relative" }}>
                    <div style={{ height: "100%", overflowY: "auto" }}>
                        <AuthScreen onAuth={setUser} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#1A2233", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 430, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <AppProvider user={user}>
                    <AppInner user={user} onSignOut={handleSignOut} />
                </AppProvider>
            </div>
        </div>
    );
}