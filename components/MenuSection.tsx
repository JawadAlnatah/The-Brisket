"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, Category, MenuItem } from "@/store/cartStore";
import { Plus, X, HelpCircle, Minus, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CATEGORIES: Category[] = ["Main Dishes", "Salads", "Appetizers", "Sauces", "Soft Drinks"];

interface DBProduct extends MenuItem {
    stock: number;
}

export default function MenuSection() {
    const [activeCategory, setActiveCategory] = useState<Category>('Main Dishes');
    const [menuItems, setMenuItems] = useState<DBProduct[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedProduct, setSelectedProduct] = useState<DBProduct | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    const addItem = useCartStore((state) => state.addItem);
    const cartItems = useCartStore((state) => state.items);

    // Refs for scrolling
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // ── Fetch Menu from Database ──
    // Runs once when the component mounts. Fetches all active menu items from Supabase,
    // orders them by 'sort_order', and updates the local state.
    useEffect(() => {
        async function fetchMenu() {
            const { data } = await supabase
                .from("menu_items")
                .select("*")
                .eq("is_available", true) // Only show items that are marked as available
                .order("sort_order");
            
            if (data) {
                setMenuItems(data as DBProduct[]);
            }
            setLoading(false);
        }
        fetchMenu();
    }, []);

    const filteredItems = menuItems.filter(item => item.category === activeCategory);

    // Initial scroll to Main Dishes tab on mount
    useEffect(() => {
        if (!loading && activeCategory === 'Main Dishes' && tabsRef.current[0]) {
            tabsRef.current[0].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [loading]);

    // ── Category Tab Interaction ──
    // Updates the active category and gracefully scrolls the screen so the user
    // is positioned perfectly at the top of the menu grid.
    const handleCategoryChange = (category: Category, index: number) => {
        setActiveCategory(category);
        
        // Scroll the tab bar horizontally so the clicked tab is in view
        if (tabsRef.current[index]) {
            tabsRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
        
        // Scroll the main window up/down to align with the section header
        if (headerRef.current) {
            const yOffset = -20;
            const y = headerRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // ── Quick Add (Directly from Grid) ──
    // Allows the user to bypass the modal and add an item directly to the cart.
    // It cross-references the cart state to ensure we don't exceed the available database stock.
    const handleQuickAdd = (e: React.MouseEvent, item: DBProduct) => {
        e.stopPropagation(); // Prevent opening the product detail modal
        
        const itemInCart = cartItems.find((i) => i.id === item.id);
        const currentCartQty = itemInCart ? itemInCart.quantity : 0;
        
        // Stock Validation
        if (currentCartQty + 1 > item.stock) {
            alert(`Cannot add to cart. Only ${item.stock} available in stock.`);
            return;
        }
        
        addItem(item); // Push to Zustand global store
    };

    // ── Modal Add (Detailed View) ──
    // Processes additions when the user opens an item to view details and adjusts the quantity.
    const handleModalAdd = () => {
        setError("");
        if (!selectedProduct) return;

        // Validation for manual quantity input
        if (quantity < 1 || isNaN(quantity)) {
            setError("Please enter a valid quantity of 1 or more.");
            return;
        }

        const itemInCart = cartItems.find((i) => i.id === selectedProduct.id);
        const currentCartQty = itemInCart ? itemInCart.quantity : 0;

        // Stock Validation (Cart amount + New requested amount)
        if (currentCartQty + quantity > selectedProduct.stock) {
            setError(`Cannot add ${quantity}. Only ${selectedProduct.stock - currentCartQty} more available.`);
            return;
        }

        // Loop to add multiple of the same item into the Zustand store
        for (let i = 0; i < quantity; i++) {
            addItem(selectedProduct);
        }
        
        setSelectedProduct(null); // Close the modal upon success
    };

    return (
        <section ref={sectionRef} id="menu" className="min-h-screen bg-[#050505] py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div ref={headerRef} className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">THE BRISKET COLLECTION</h2>
                    <div className="h-1 w-24 bg-orange-500 mx-auto" />
                </div>

                {/* Sticky Tabs */}
                <div className="sticky top-0 z-40 py-6 bg-black/80 backdrop-blur-xl mb-12 border-b border-white/10 shadow-lg">
                    <div className="flex items-center justify-start md:justify-center gap-8 overflow-x-auto no-scrollbar px-4">
                        {CATEGORIES.map((cat, index) => (
                            <button
                                key={cat}
                                ref={(el) => { tabsRef.current[index] = el }}
                                onClick={() => handleCategoryChange(cat, index)}
                                className={`relative text-sm font-medium tracking-widest uppercase transition-colors px-4 py-2 whitespace-nowrap ${activeCategory === cat ? 'text-orange-500' : 'text-gray-500 hover:text-white'}`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-mono tracking-widest">LOADING MENU...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={item.id}
                                onClick={() => {
                                    setSelectedProduct(item);
                                    setQuantity(1);
                                    setError("");
                                }}
                                className="group relative bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors cursor-pointer"
                            >
                                {/* Image Area */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-black/50">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.image || "/images/menu/placeholder.png"}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-orange-500 transition-colors">{item.name}</h3>
                                        <span className="text-orange-500 font-mono">${item.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">{item.description}</p>

                                        <button
                                            onClick={(e) => handleQuickAdd(e, item)}
                                            disabled={item.stock === 0 || (cartItems.find(i => i.id === item.id)?.quantity || 0) >= item.stock}
                                            className="w-full flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-3 px-4 rounded-xl hover:bg-orange-400 disabled:bg-gray-700 disabled:text-gray-400 active:scale-95 transition-all"
                                        >
                                            <Plus size={18} />
                                            {item.stock === 0 ? "SOLD OUT" : 
                                             ((cartItems.find(i => i.id === item.id)?.quantity || 0) >= item.stock ? "MAX IN CART" : "ADD TO CART")}
                                        </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#111] border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {/* Modal Image */}
                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-black relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={selectedProduct.image || "/images/menu/placeholder.png"}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#111] md:from-transparent via-transparent to-transparent opacity-80" />
                            </div>

                            {/* Modal Content */}
                            <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-orange-500 font-bold tracking-widest uppercase text-sm">{selectedProduct.category}</span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">{selectedProduct.name}</h3>
                                    <p className="text-gray-400 text-lg mb-6 leading-relaxed">{selectedProduct.description}</p>
                                    
                                    <div className="flex items-end gap-3 mb-6">
                                        <span className="text-4xl font-mono font-black text-white">${selectedProduct.price.toFixed(2)}</span>
                                        <span className="text-gray-500 mb-1">/ portion</span>
                                    </div>

                                    {/* Stock Indicator */}
                                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
                                        <div className={`w-3 h-3 rounded-full ${selectedProduct.stock > 0 ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
                                        <span className="text-gray-300 font-semibold tracking-wide">
                                            {selectedProduct.stock > 0 ? `${selectedProduct.stock} Available in stock` : "Out of stock"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest block">Quantity</label>
                                        <button 
                                            onClick={() => setShowHelp(true)}
                                            className="text-gray-400 hover:text-orange-500 transition-colors"
                                            title="Help"
                                        >
                                            <HelpCircle size={16} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                                            <button 
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <input 
                                                type="number"
                                                min="1"
                                                max={selectedProduct.stock}
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="w-16 h-12 bg-transparent text-center font-bold text-xl text-white outline-none no-arrows"
                                            />
                                            <button 
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-400 text-sm font-medium bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleModalAdd}
                                        disabled={selectedProduct.stock === 0 || (cartItems.find(i => i.id === selectedProduct.id)?.quantity || 0) + quantity > selectedProduct.stock}
                                        className="w-full flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black uppercase tracking-widest px-8 py-5 rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        <ShoppingBag size={24} />
                                        {selectedProduct.stock === 0 ? "Sold Out" : 
                                         ((cartItems.find(i => i.id === selectedProduct.id)?.quantity || 0) + quantity > selectedProduct.stock ? "Max in Cart" : "Add to Cart")}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Help Window Modal */}
            <AnimatePresence>
                {showHelp && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowHelp(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <h3 className="text-2xl font-black mb-4 flex items-center gap-2 text-white">
                                <HelpCircle className="text-orange-500" />
                                How to Order
                            </h3>
                            <div className="space-y-4 text-gray-300">
                                <p><strong>1. Check Stock:</strong> Ensure the item has enough available stock shown on the page.</p>
                                <p><strong>2. Set Quantity:</strong> Use the + / - buttons or type directly into the quantity input box.</p>
                                <p><strong>3. Add to Cart:</strong> Click the orange Add to Cart button. If you exceed the available stock, you will see a warning message.</p>
                            </div>
                            <button 
                                onClick={() => setShowHelp(false)}
                                className="mt-8 w-full bg-white text-black font-black uppercase tracking-widest py-3 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </section>
    );
}
