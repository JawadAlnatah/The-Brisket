"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import NextLink from "next/link";

export default function StickyCart() {
    const { totalItems, totalPrice } = useCartStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Hero is 200vh. We want to show it roughly when we pass the main hero visual.
            // Let's set it to 150vh (1.5 * innerHeight).
            const threshold = window.innerHeight * 1.5;
            if (window.scrollY > threshold) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between backdrop-blur-xl">
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-xs uppercase tracking-wider">Total</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-white font-bold text-xl">${totalPrice().toFixed(2)}</span>
                                <span className="text-gray-500 text-sm">({totalItems()} items)</span>
                            </div>
                        </div>

                        <NextLink
                            href="/cart"
                            className="bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors active:scale-95"
                        >
                            <ShoppingBag size={18} />
                            VIEW CART
                        </NextLink>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
