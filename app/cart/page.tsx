"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle, Clock, MapPin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Dynamically import the map to prevent Server-Side Rendering errors (Leaflet needs window)
const DeliveryMap = dynamic(() => import("@/components/DeliveryMap"), { 
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-black/50 text-gray-400 font-bold tracking-widest text-sm">LOADING MAP...</div>
});

export default function CartPage() {
    const { items, addItem, decreaseItem, removeItem, clearCart, totalPrice } = useCartStore();
    const [mounted, setMounted] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
    
    // UI States
    const [formError, setFormError] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [pastPurchase, setPastPurchase] = useState<string | null>(null);
    const [showMapModal, setShowMapModal] = useState(false);

    // ── Prevent Hydration Mismatch & Load Cookies ──
    // This runs only on the client side after the initial render.
    // It specifically looks for the 'last_purchase' cookie to display the user's past order history.
    useEffect(() => {
        setMounted(true);
        
        // Task 12: Load Past Purchase from Cookie
        // We split the document cookies and find the specific one for this project.
        const cookies = document.cookie.split("; ");
        const pastPurchaseCookie = cookies.find(row => row.startsWith("last_purchase="));
        if (pastPurchaseCookie) {
            setPastPurchase(decodeURIComponent(pastPurchaseCookie.split("=")[1]));
        }
    }, []);

    if (!mounted) return null;

    const total = totalPrice();
    const deliveryFee = total > 0 && orderType === "delivery" ? 15 : 0;
    const grandTotal = total + deliveryFee;

    /**
     * ── handleCheckout ──
     * This is the core transaction function. It handles form validation, 
     * stock verification, database insertions, and cookie management.
     */
    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        // 1. Client-Side JavaScript Form Validation
        // Ensures the user provides valid inputs before making any database requests.
        if (!name.trim()) {
            setFormError("Please enter your full name.");
            return;
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            setFormError("Name must contain only letters and spaces.");
            return;
        }
        if (!phone.trim()) {
            setFormError("Please enter your phone number.");
            return;
        }
        if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
            setFormError("Phone number must be at least 10 digits.");
            return;
        }
        if (orderType === "delivery" && !address.trim()) {
            setFormError("Please enter your delivery address.");
            return;
        }

        setIsCheckingOut(true);

        try {
            // 2. Pre-Check Stock Availability
            // We verify that EVERY item in the cart is still in stock before we start saving the order.
            // This prevents "partial orders" where only half the items are bought if something goes out of stock.
            for (const item of items) {
                const { data } = await supabase.from('menu_items').select('stock').eq('id', item.id).single();
                if (!data || data.stock < item.quantity) {
                    throw new Error(`Sorry, we only have ${data?.stock || 0} portions of ${item.name} left!`);
                }
            }

            // 3. Create the Main Order Record
            // Generates a random order number and saves the total cost, status, and customer details.
            const { data: orderData, error: orderError } = await supabase.from('orders').insert({
                order_number: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                order_type: orderType,
                customer_phone: phone,
                subtotal: total,
                delivery_fee: deliveryFee,
                total: grandTotal,
                status: 'pending',
                notes: `Name: ${name}\nAddress: ${orderType === "delivery" ? address : "Pickup"}`
            }).select().single();

            if (orderError) throw new Error("Failed to create order.");

            // 4. Save Order Items & Update Inventory
            // Task 13: Loop through the cart, reduce the stock in the database, and link the items to the new order.
            for (const item of items) {
                const { data } = await supabase.from('menu_items').select('stock').eq('id', item.id).single();
                if (data) {
                    // Decrement stock in the menu_items table
                    await supabase.from('menu_items')
                        .update({ stock: data.stock - item.quantity })
                        .eq('id', item.id);
                    
                    // Insert the specific item into the order_items linking table
                    await supabase.from('order_items').insert({
                        order_id: orderData.id,
                        menu_item_id: item.id,
                        item_name: item.name,
                        item_price: item.price,
                        quantity: item.quantity,
                        subtotal: item.price * item.quantity
                    });
                }
            }

            // 5. Save Past Purchase to Cookies
            // ============================================================================
            // EXPLANATION OF COOKIES (As required by CIS 311 Rubric Task 12):
            // ============================================================================
            // A "Cookie" is like a physical receipt that the website slips into the user's 
            // browser. Unlike "Sessions" (which forget everything when you close the tab),
            // a Cookie is saved permanently on the user's hard drive for a set amount of time.
            // 
            // Here, when the user successfully checks out, we generate a text summary of their order.
            // We then create a cookie named `last_purchase` and save that text inside it.
            // We set `max-age=31536000`, which tells the browser to keep this receipt 
            // safe for exactly 1 year. This allows us to remember guest users when they return!
            // ============================================================================
            const orderSummary = `Ordered ${items.length} items for $${grandTotal.toFixed(2)} by ${name} on ${new Date().toLocaleDateString()}`;
            document.cookie = `last_purchase=${encodeURIComponent(orderSummary)}; path=/; max-age=31536000`; // 1 year expiry

            // 6. Finalize Success State
            // Clear the global cart state and show the success screen.
            clearCart();
            setIsSuccess(true);
        } catch (error: any) {
            setFormError(error.message || "An error occurred during checkout.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (isSuccess) {
        return (
            <main className="bg-[#050505] min-h-screen flex items-center justify-center text-white p-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-12 max-w-lg w-full text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-4xl font-black mb-4">Order Placed!</h1>
                    <p className="text-gray-400 mb-8">
                        Thank you, {name}. Your smoked barbecue is being prepared. 
                        {orderType === "delivery" ? ` It will be delivered to ${address} shortly.` : " It will be ready for pickup soon."}
                    </p>
                    <Link href="/" className="bg-orange-600 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-orange-500 transition-colors">
                        Return Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#050505] min-h-screen text-white font-sans selection:bg-orange-500 selection:text-white pb-24">
            <div className="max-w-7xl mx-auto px-6 pt-32">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-4">
                        <Link href="/#menu" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Your Order</h1>
                        <span className="bg-orange-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                            {items.reduce((a, b) => a + b.quantity, 0)} Items
                        </span>
                    </div>

                    {/* Task 8: Empty Cart Button */}
                    {items.length > 0 && (
                        <button 
                            onClick={clearCart}
                            className="flex items-center justify-center gap-2 px-6 py-2 border border-red-500/30 text-red-500 rounded-full hover:bg-red-500/10 font-bold uppercase tracking-widest text-sm transition-colors"
                        >
                            <Trash2 size={16} /> Empty Cart
                        </button>
                    )}
                </div>

                {/* Task 12: Display Past Purchases */}
                {pastPurchase && items.length === 0 && (
                    <div className="mb-12 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 flex items-start gap-4 max-w-2xl mx-auto">
                        <Clock className="text-orange-500 shrink-0 mt-1" />
                        <div>
                            <h3 className="font-bold text-orange-500 uppercase tracking-widest text-sm mb-1">Your Last Order</h3>
                            <p className="text-gray-300">{pastPurchase}</p>
                        </div>
                    </div>
                )}

                {items.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <ShoppingBag size={64} className="text-gray-700 mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Your bag is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added any of our delicious smoked meat to your cart yet.</p>
                        <Link
                            href="/#menu"
                            className="bg-orange-600 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full hover:bg-orange-700 transition-all hover:scale-105"
                        >
                            Browse Menu
                        </Link>
                    </motion.div>
                ) : (
                    /* Cart Content */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white/5 border border-white/5 rounded-3xl hover:border-white/10 transition-colors"
                                    >
                                        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-black/20 rounded-2xl overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={item.image || "/images/menu/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                            <div className="text-orange-500 font-mono font-bold">${item.price.toFixed(2)}</div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center gap-6">
                                            <div className="flex items-center gap-4 bg-black/30 p-1.5 rounded-full">
                                                <button onClick={() => decreaseItem(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                <button 
                                                    onClick={() => addItem(item)} 
                                                    disabled={item.quantity >= item.stock}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-orange-600 transition-colors text-white disabled:opacity-50 disabled:hover:bg-white/10"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2" title="Remove Item">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary & Checkout Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                                <h3 className="text-2xl font-black uppercase mb-8">Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-white font-mono">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Delivery Fee</span>
                                        <span className="text-white font-mono">${deliveryFee.toFixed(2)}</span>
                                    </div>
                                    <div className="h-px bg-white/10 my-4" />
                                    <div className="flex justify-between text-xl font-bold">
                                        <span>Total</span>
                                        <span className="text-orange-500 font-mono">${grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-4">
                                    {/* Order Type Toggle */}
                                    <div className="flex bg-black/50 border border-white/10 rounded-xl p-1 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setOrderType("delivery")}
                                            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase rounded-lg transition-colors ${orderType === "delivery" ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"}`}
                                        >
                                            Delivery
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOrderType("pickup")}
                                            className={`flex-1 py-3 text-sm font-bold tracking-widest uppercase rounded-lg transition-colors ${orderType === "pickup" ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"}`}
                                        >
                                            Pickup
                                        </button>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="05XXXXXXXX"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors"
                                        />
                                    </div>

                                    {orderType === "delivery" && (
                                        <div className="space-y-4 pt-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Delivery Location</label>
                                            
                                            <button 
                                                type="button"
                                                onClick={() => setShowMapModal(true)}
                                                className="w-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-500 font-bold uppercase tracking-widest py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <MapPin size={20} /> Choose Location on Map
                                            </button>
                                            
                                            <textarea 
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="Or type your exact street name, building, apartment manually..."
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors min-h-[80px]"
                                            />
                                        </div>
                                    )}

                                    {formError && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium p-3 rounded-lg mt-4">
                                            {formError}
                                        </div>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={isCheckingOut}
                                        className="w-full bg-orange-600 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-orange-500 disabled:bg-orange-600/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
                                    >
                                        {isCheckingOut ? "Processing..." : "Place Order"}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* Map Modal */}
            <AnimatePresence>
                {showMapModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#111] border border-white/10 w-full max-w-5xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-4 sm:p-6 flex items-center justify-between bg-black/50 border-b border-white/10">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Pinpoint Location</h3>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Tap anywhere on the map to automatically extract the exact address.</p>
                                </div>
                                <button 
                                    onClick={() => setShowMapModal(false)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 relative">
                                <DeliveryMap onAddressSelect={(addr) => {
                                    setAddress(addr);
                                    setShowMapModal(false);
                                }} />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
