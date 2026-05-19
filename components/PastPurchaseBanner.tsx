"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function PastPurchaseBanner() {
    const [pastPurchase, setPastPurchase] = useState<string | null>(null);

    useEffect(() => {
        // ============================================================================
        // READING THE COOKIE (As required by CIS 311 Rubric Task 12):
        // ============================================================================
        // When a user visits the home page, the website has no idea who they are.
        // However, this code acts like a bouncer checking their ID. 
        // 1. `document.cookie` grabs all the "receipts" (cookies) saved in the browser.
        // 2. We search through them specifically looking for one named `last_purchase`.
        // 3. If we find it, we know this user has bought from us before! 
        // 4. We decode the text (the order summary) and save it to React state so 
        //    we can display it on the screen, creating a personalized experience.
        // ============================================================================
        const cookies = document.cookie.split("; ");
        const pastPurchaseCookie = cookies.find((row) => row.startsWith("last_purchase="));
        if (pastPurchaseCookie) {
            setPastPurchase(decodeURIComponent(pastPurchaseCookie.split("=")[1]));
        }
    }, []);

    if (!pastPurchase) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-orange-600 border-b border-orange-500/30 py-3 px-6 z-50 relative"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                <Clock className="text-white shrink-0 w-5 h-5" />
                <p className="text-white font-medium text-sm md:text-base">
                    <span className="font-bold tracking-widest uppercase mr-2">Welcome Back! Your Last Order:</span>
                    {pastPurchase}
                </p>
            </div>
        </motion.div>
    );
}
