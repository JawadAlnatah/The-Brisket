"use client";

import { motion } from "framer-motion";

const REVIEWS = [
    "Best brisket I've ever had.",
    "The bark is perfection.",
    "Flavor explosion.",
    "Pure luxury.",
    "Worth the wait.",
    "A masterpiece.",
    "S tier smoked meat.",
    "Tender as butter.",
    "Gastronomic heaven.",
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-[#050505] overflow-hidden border-y border-white/5 relative z-10">
            <div className="flex whitespace-nowrap">
                <MarqueeItem />
                <MarqueeItem />
            </div>
        </section>
    );
}

function MarqueeItem() {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex gap-16 px-8"
        >
            {REVIEWS.map((review, i) => (
                <span
                    key={i}
                    className="text-4xl md:text-6xl font-black text-transparent uppercase opacity-80 shrink-0"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
                >
                    {review}
                </span>
            ))}
        </motion.div>
    );
}
