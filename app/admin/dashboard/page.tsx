"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getAdminSession, clearAdminSession, AdminSession } from "@/lib/adminAuth";
import {
    LogOut, Plus, Pencil, Trash2, Search, X, ChefHat,
    CheckCircle, AlertCircle, ImageIcon, Package, ShoppingBag
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    is_available: boolean;
}

const EMPTY_PRODUCT = { name: "", description: "", price: "", category: "Main Dishes", image: "", stock: "", is_available: true };
const CATEGORIES = ["Main Dishes", "Salads", "Appetizers", "Sauces", "Soft Drinks"];

// ── Helpers ────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
    return (
        <div className={`fixed top-6 right-6 z-[999] flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all
            ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {msg}
        </div>
    );
}

// ── Main Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
    const router = useRouter();
    const [admin, setAdmin] = useState<AdminSession | null>(null);
    const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
    
    // Product State
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Order State
    const [orders, setOrders] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_PRODUCT);
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // ── Auth Guard ─────────────────────────────────────────────────────
    useEffect(() => {
        const session = getAdminSession();
        if (!session) {
            router.replace("/admin");
            return;
        }
        setAdmin(session);
        fetchData();
    }, []);

    // ── Data fetching ──────────────────────────────────────────────────
    /**
     * Fetches all products and orders from the Supabase database.
     * Orders are joined with their respective 'order_items' to display complete receipts.
     */
    async function fetchData() {
        setLoading(true);
        
        // Fetch Products
        const { data: prodData } = await supabase
            .from("menu_items")
            .select("*")
            .order("category")
            .order("sort_order");
        setProducts(prodData ?? []);
        setFiltered(prodData ?? []);

        // Fetch Orders
        const { data: ordData } = await supabase
            .from("orders")
            .select(`*, order_items(*)`)
            .order("created_at", { ascending: false });
        setOrders(ordData ?? []);

        setLoading(false);
    }

    /**
     * Updates the status of an order (e.g., pending -> completed)
     * and immediately refreshes the UI to show the new state.
     */
    async function updateOrderStatus(id: string, status: string) {
        await supabase.from("orders").update({ status }).eq("id", id);
        showToast("Order status updated!", "success");
        fetchData();
    }

    // ── Search ─────────────────────────────────────────────────────────
    function handleSearch(q: string) {
        setSearchQuery(q);
        const lower = q.toLowerCase();
        setFiltered(
            products.filter(
                (p) =>
                    p.name.toLowerCase().includes(lower) ||
                    p.category.toLowerCase().includes(lower) ||
                    p.description?.toLowerCase().includes(lower)
            )
        );
    }

    // ── Toast helper ───────────────────────────────────────────────────
    function showToast(msg: string, type: "success" | "error") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    // ── Logout ─────────────────────────────────────────────────────────
    function handleLogout() {
        clearAdminSession();
        router.push("/admin");
    }

    // ── Open Add modal ─────────────────────────────────────────────────
    function openAdd() {
        setEditingProduct(null);
        setForm(EMPTY_PRODUCT);
        setFormError("");
        setModalOpen(true);
    }

    // ── Open Edit modal ────────────────────────────────────────────────
    function openEdit(p: Product) {
        setEditingProduct(p);
        setForm({
            name: p.name,
            description: p.description ?? "",
            price: String(p.price),
            category: p.category,
            image: p.image ?? "",
            stock: String(p.stock),
            is_available: p.is_available,
        });
        setFormError("");
        setModalOpen(true);
    }

    // ── JS Form Validation ─────────────────────────────────────────────
    function validateForm(): string {
        if (!form.name.trim()) return "Product name is required.";
        if (!form.category) return "Category is required.";
        const price = parseFloat(form.price as string);
        if (isNaN(price) || price < 0) return "Price must be a positive number.";
        const stock = parseInt(form.stock as string, 10);
        if (isNaN(stock) || stock < 0) return "Stock must be 0 or more.";
        if (!form.image.trim()) return "Image filename is required (e.g. brisket.png).";
        return "";
    }

    // ── Handle image file input ────────────────────────────────────────
    /**
     * Task 18 Requirement: Uploads an actual image file to the Supabase Storage bucket.
     * It uses the file name, uploads it, and then retrieves the public URL 
     * to save in the database so the website can display it.
     */
    async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            
            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from('menu-images')
                .upload(file.name, file, { upsert: true });
                
            if (error) {
                showToast("Failed to upload image.", "error");
                console.error(error);
                return;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('menu-images')
                .getPublicUrl(file.name);
                
            setForm((f) => ({ ...f, image: urlData.publicUrl }));
            showToast("Image uploaded successfully!", "success");
        } catch (err) {
            showToast("An error occurred during upload.", "error");
        } finally {
            setUploadingImage(false);
        }
    }

    // ── Save (Add or Edit) ─────────────────────────────────────────────
    /**
     * Validates the form data and either inserts a brand new product
     * or updates an existing one if the user clicked the 'Edit' button.
     */
    async function handleSave(e: FormEvent) {
        e.preventDefault();
        const err = validateForm();
        if (err) { setFormError(err); return; }

        setSaving(true);
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: parseFloat(form.price as string),
            category: form.category,
            image: form.image.trim(),
            stock: parseInt(form.stock as string, 10),
            is_available: form.is_available,
        };

        if (editingProduct) {
            const { error } = await supabase.from("menu_items").update(payload).eq("id", editingProduct.id);
            if (error) { showToast("Failed to update product.", "error"); }
            else { showToast("Product updated!", "success"); }
        } else {
            const { error } = await supabase.from("menu_items").insert(payload);
            if (error) { showToast("Failed to add product.", "error"); }
            else { showToast("Product added!", "success"); }
        }

        setSaving(false);
        setModalOpen(false);
        fetchData();
    }

    // ── Delete ─────────────────────────────────────────────────────────
    async function handleDelete(p: Product) {
        if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
        const { error } = await supabase.from("menu_items").delete().eq("id", p.id);
        if (error) showToast("Failed to delete product.", "error");
        else { showToast("Product deleted.", "success"); fetchData(); }
    }

    // ── Render Orders Tab ──────────────────────────────────────────────
    const renderOrders = () => {
        if (loading) return <div className="text-center py-24 text-gray-600">Loading orders…</div>;
        if (orders.length === 0) return <div className="text-center py-24 text-gray-600">No orders found.</div>;

        return (
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-xl font-bold font-mono text-white">{order.order_number}</h3>
                                <div className="text-sm text-gray-400 mt-1">
                                    {new Date(order.created_at).toLocaleString()} • <span className="text-orange-500 uppercase tracking-widest text-xs font-bold">{order.order_type}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select 
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl outline-none transition-colors border cursor-pointer ${
                                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                        order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                                        'bg-white/5 text-gray-400 border-white/10'
                                    }`}
                                >
                                    <option value="pending" className="bg-[#111]">Pending</option>
                                    <option value="completed" className="bg-[#111]">Completed</option>
                                    <option value="cancelled" className="bg-[#111]">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Customer Details</h4>
                                <div className="bg-black/30 rounded-xl p-4 text-sm text-gray-300 whitespace-pre-line leading-relaxed h-full">
                                    <div className="font-bold text-white mb-2">{order.customer_phone}</div>
                                    {order.notes}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Order Items</h4>
                                <div className="bg-black/30 rounded-xl p-4 space-y-3">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-300">
                                                <span className="text-orange-500 font-bold mr-2">{item.quantity}x</span> 
                                                {item.item_name}
                                            </span>
                                            <span className="font-mono text-gray-400">${Number(item.item_price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="h-px bg-white/10 my-3" />
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="font-mono">${Number(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Delivery Fee</span>
                                        <span className="font-mono">${Number(order.delivery_fee).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center font-bold mt-2 pt-2 border-t border-white/5">
                                        <span className="text-white">Total</span>
                                        <span className="text-orange-500 font-mono">${Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // ── Render Products Tab ────────────────────────────────────────────
    const renderProducts = () => (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="relative w-full max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        id="admin-search"
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                    {searchQuery && (
                        <button onClick={() => handleSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                            <X size={15} />
                        </button>
                    )}
                </div>
                <button
                    id="admin-add-product-btn"
                    onClick={openAdd}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-600/20 whitespace-nowrap"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {loading ? (
                <div className="text-center py-24 text-gray-600">Loading products…</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-gray-600">No products found.</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-500 uppercase text-xs tracking-widest">
                                <th className="text-left px-6 py-4">Product</th>
                                <th className="text-left px-6 py-4 hidden md:table-cell">Category</th>
                                <th className="text-right px-6 py-4">Price</th>
                                <th className="text-right px-6 py-4 hidden sm:table-cell">Stock</th>
                                <th className="text-center px-6 py-4 hidden sm:table-cell">Status</th>
                                <th className="text-right px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr
                                    key={p.id}
                                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={p.image || "/images/menu/placeholder.png"}
                                                alt={p.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-white/5"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                            <div>
                                                <div className="font-semibold text-white">{p.name}</div>
                                                <div className="text-gray-500 text-xs truncate max-w-[160px]">{p.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{p.category}</td>
                                    <td className="px-6 py-4 text-right font-mono text-orange-500">${p.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right hidden sm:table-cell">
                                        <span className={p.stock < 5 ? "text-red-400 font-bold" : "text-gray-400"}>{p.stock}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.is_available ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                                            {p.is_available ? "Available" : "Hidden"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-orange-600/20 hover:text-orange-400 transition-colors"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p)}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-red-600/20 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    if (!admin) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {toast && <Toast msg={toast.msg} type={toast.type} />}

            {/* ── Top Nav ── */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center">
                            <ChefHat size={18} className="text-white" />
                        </div>
                        <div>
                            <span className="font-black text-white tracking-tight">THE BRISKET</span>
                            <span className="text-gray-500 text-xs ml-2">Admin Dashboard</span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
                        <button 
                            onClick={() => setActiveTab("products")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "products" ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"}`}
                        >
                            <Package size={16} /> Products
                        </button>
                        <button 
                            onClick={() => setActiveTab("orders")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "orders" ? "bg-orange-600 text-white" : "text-gray-500 hover:text-white"}`}
                        >
                            <ShoppingBag size={16} /> Orders
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 hover:bg-red-600/20 text-gray-400 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        >
                            <LogOut size={15} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {activeTab === "products" ? renderProducts() : renderOrders()}
            </main>

            {/* ── Add / Edit Modal ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
                    <div
                        className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} noValidate className="space-y-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label htmlFor="prod-name" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Name *</label>
                                <input id="prod-name" type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Smoked Brisket"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" />
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <label htmlFor="prod-desc" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                <textarea id="prod-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    rows={2} placeholder="Short description…"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors resize-none" />
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label htmlFor="prod-price" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price ($) *</label>
                                    <input id="prod-price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="prod-stock" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock *</label>
                                    <input id="prod-stock" type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                                        placeholder="0"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-1">
                                <label htmlFor="prod-cat" className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category *</label>
                                <select id="prod-cat" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors">
                                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                                </select>
                            </div>

                            {/* Image upload */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Image *</label>
                                <div className="flex gap-2">
                                    <input id="prod-image" type="text" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                                        placeholder="/images/menu/filename.png"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 transition-colors" />
                                    <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}
                                        className="flex items-center justify-center min-w-[48px] gap-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-3 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                                        {uploadingImage ? <span className="text-xs font-bold uppercase">...</span> : <ImageIcon size={16} />}
                                    </button>
                                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                                </div>
                                <p className="text-gray-600 text-xs">Enter filename or click 📁 to pick a file (sets path automatically)</p>
                            </div>

                            {/* Available toggle */}
                            <div className="flex items-center gap-3">
                                <input id="prod-available" type="checkbox" checked={form.is_available as boolean}
                                    onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))}
                                    className="w-4 h-4 accent-orange-600" />
                                <label htmlFor="prod-available" className="text-sm text-gray-300">Show this product on the menu</label>
                            </div>

                            {/* Form error */}
                            {formError && (
                                <div role="alert" className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                                    {formError}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setModalOpen(false)}
                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 font-semibold py-3 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button id="prod-save-btn" type="submit" disabled={saving}
                                    className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase tracking-wider py-3 rounded-xl transition-all">
                                    {saving ? "Saving…" : editingProduct ? "Save Changes" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
