"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setAdminSession } from "@/lib/adminAuth";
import { Lock, User, Eye, EyeOff, ChefHat } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ── JS Form Validation ──
    function validate(): string {
        if (!username.trim()) return "Username is required.";
        if (!password.trim()) return "Password is required.";
        if (password.length < 4) return "Password must be at least 4 characters.";
        return "";
    }

    // ── Help popup ──
    function showHelp() {
        window.alert(
            "Admin Login Help\n\n" +
            "• Enter your admin username and password.\n" +
            "• Credentials are provided by the system administrator.\n" +
            "• Contact: 054 146 0722 if you have lost access.\n" +
            "• Session expires when you close the browser tab."
        );
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            // Check credentials against admins table in Supabase
            const { data, error: dbError } = await supabase
                .from("admins")
                .select("id, username, name, password")
                .eq("username", username.trim())
                .single();

            if (dbError || !data) {
                setError("Invalid username or password.");
                setLoading(false);
                return;
            }

            if (data.password !== password) {
                setError("Invalid username or password.");
                setLoading(false);
                return;
            }

            // Save session and redirect to admin dashboard
            setAdminSession({ id: data.id, username: data.username, name: data.name });
            router.push("/admin/dashboard");
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-600/30">
                            <ChefHat size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">THE BRISKET</h1>
                        <p className="text-gray-500 text-sm mt-1 tracking-widest uppercase">Admin Portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label htmlFor="admin-username" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Username
                            </label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="admin-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label htmlFor="admin-password" className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div role="alert" className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20"
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    {/* Help + back links */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={showHelp}
                            className="text-xs text-gray-500 hover:text-orange-500 transition-colors underline underline-offset-2"
                        >
                            Need help?
                        </button>
                        <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors">
                            ← Back to site
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
