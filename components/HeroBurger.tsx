"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useSpring, motion, useMotionValueEvent, MotionValue } from "framer-motion";

export default function HeroBurger() {
    // Animation sequence settings
    const FRAME_COUNT = 191;
    const IMAGES_PATH = '/brisket-sequence/frame_';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [maxScroll, setMaxScroll] = useState(800);

    const { scrollY } = useScroll();

    // Dynamically set scroll range based on device
    useEffect(() => {
        const updateScrollRange = () => {
            // If desktop (md breakpoint is usually 768px), use larger range because container is taller
            if (window.innerWidth >= 768) {
                setMaxScroll(1500); // Adjusted to be faster: 2000 -> 1500
            } else {
                setMaxScroll(800);  // Fast/Snap animation on mobile
            }
        };

        updateScrollRange();
        window.addEventListener('resize', updateScrollRange);
        return () => window.removeEventListener('resize', updateScrollRange);
    }, []);

    // 1. Progress for Text Overlays
    const progress = useTransform(scrollY, [0, maxScroll], [0, 1]);
    const smoothProgress = useSpring(progress, { stiffness: 200, damping: 20, mass: 0.2 });

    // 2. Frame Index for Canvas
    const frameIndex = useTransform(scrollY, [0, maxScroll], [0, FRAME_COUNT]);
    const smoothFrameIndex = useSpring(frameIndex, { stiffness: 200, damping: 20, mass: 0.2 });

    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];

            // Helper to load a single image
            const loadImage = (index: number) => {
                return new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    const paddedIndex = index.toString().padStart(3, '0');
                    img.src = `${IMAGES_PATH}${paddedIndex}.webp`;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                });
            };

            try {
                // Load all frames
                // Note: For 192 images, this might take a moment. 
                // In production, you might want to load batches or show a loader.
                // However, for immediate fast scrolling, we try to load all.
                const promises = Array.from({ length: FRAME_COUNT + 1 }, (_, i) => loadImage(i));
                const results = await Promise.all(promises);



                setImages(results);
                setImagesLoaded(true);
            } catch (error) {
                console.error("Failed to load animation sequence", error);
            }
        };

        loadImages();
    }, []);

    // Draw frame to canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !imagesLoaded || !images[index]) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = images[index];

        // Handle High DPI
        const dpr = window.devicePixelRatio || 1;

        // Canvas dimensions (visual)
        const rect = canvas.getBoundingClientRect();
        const targetWidth = Math.floor(rect.width * dpr);
        const targetHeight = Math.floor(rect.height * dpr);

        // Only resize/scale if dimensions differ (prevents expensive resets on every frame)
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.scale(dpr, dpr);
        }

        // Clear (using logical dimensions)
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Draw image "cover" style (fill the screen)
        let scale = Math.max(rect.width / img.width, rect.height / img.height);

        // Adjust zoom on mobile (width < 768px)
        if (window.innerWidth < 768) {
            scale *= 0.85; // Zoom out slightly on mobile as requested
        }

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        // Center the image
        const x = (rect.width - drawWidth) / 2;
        let y = (rect.height - drawHeight) / 2;

        // Force top alignment on mobile to prevent top gap
        if (window.innerWidth < 768) {
            y = 0;
        }

        ctx.drawImage(img, x, y, drawWidth, drawHeight);
    };

    // Listen to scroll changes and paint
    useMotionValueEvent(smoothFrameIndex, "change", (latest) => {
        const frame = Math.floor(latest as number);
        if (frame >= 0 && frame <= FRAME_COUNT) {
            renderFrame(frame);
        }
    });

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            const currentFrame = Math.floor(smoothFrameIndex.get());
            renderFrame(currentFrame);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [imagesLoaded, smoothFrameIndex]); // Re-bind when images load

    // Initial paint when images load
    useEffect(() => {
        if (imagesLoaded) {
            renderFrame(0);
        }
    }, [imagesLoaded]);

    return (
        <section className="h-[150vh] md:h-[250vh] relative z-20 bg-[#050505]">
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">

                {/* Brand Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="absolute top-[15%] md:top-[12%] text-[10vw] md:text-[8vw] z-30 font-black text-white uppercase tracking-tighter leading-none text-center pointer-events-none"
                >
                    THE<br />BRISKET
                </motion.h1>

                {/* Subtext */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 md:bottom-16 text-white z-30 flex flex-col items-center gap-2"
                >
                    <span className="text-sm md:text-base font-medium tracking-[0.5em] uppercase text-orange-500">Premium Smoked Meat</span>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-orange-500 to-transparent" />
                </motion.div>

                {/* Scrollytelling Text Overlays */}
                <OverlayText progress={smoothProgress} />

                {/* Animation Container */}
                <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>
        </section>
    );
}

function OverlayText({ progress }: { progress: MotionValue<number> }) {
    // Adjust these ranges to match the pacing [0, 1]
    const y1 = useTransform(progress, [0.2, 0.3, 0.4], [50, 0, -50]);
    const op1 = useTransform(progress, [0.2, 0.3, 0.4], [0, 1, 0]);

    const y2 = useTransform(progress, [0.5, 0.6, 0.7], [50, 0, -50]);
    const op2 = useTransform(progress, [0.5, 0.6, 0.7], [0, 1, 0]);

    return (
        <div className="absolute inset-0 pointer-events-none z-30">
            {/* Text 1: SLOW SMOKED */}
            <motion.div
                style={{ y: y1, opacity: op1 }}
                className="absolute inset-0 flex flex-col items-start justify-center pl-6 md:pl-32"
            >
                <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter text-white drop-shadow-lg">SLOW<br />SMOKED</h2>
                <p className="text-orange-500 text-lg md:text-xl font-bold mt-4 bg-black/50 px-4 py-2 rounded-lg">18 Hours Low & Slow</p>
            </motion.div>

            {/* Text 2: TEXAS STYLE */}
            <motion.div
                style={{ y: y2, opacity: op2 }}
                className="absolute inset-0 flex flex-col items-end justify-center pr-6 md:pr-32 text-right"
            >
                <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter text-white drop-shadow-lg">TEXAS<br />STYLE</h2>
                <p className="text-orange-500 text-lg md:text-xl font-bold mt-4 bg-black/50 px-4 py-2 rounded-lg">Authentic Oak Wood</p>
            </motion.div>
        </div>
    );
}
