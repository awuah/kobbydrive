"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ArrowRight,
  X,
  Send,
  Loader2,
  Star,
  MapPin,
  Package,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "Apparel" | "Safety Gear" | "Driver Learning" | "Car Accessories";
  price: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  iconBg: string;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-01",
    name: "KobbyDrive Signature Driver Polo Shirt",
    category: "Apparel",
    price: 85,
    rating: 4.9,
    reviewsCount: 68,
    badge: "Official Wear",
    description: "Breathable 100% pique cotton polo with embroidered KobbyDrive crest on the chest. Available in S, M, L, XL, XXL.",
    iconBg: "from-brand-500 to-indigo-600",
  },
  {
    id: "prod-02",
    name: "High-Visibility Reflective Safety Vest (DVLA Spec)",
    category: "Safety Gear",
    price: 45,
    rating: 4.95,
    reviewsCount: 112,
    badge: "Road Mandatory",
    description: "Certified day/night reflective strips with heavy-duty zipper and dual mic tabs for roadside safety and roadside emergencies.",
    iconBg: "from-amber-500 to-yellow-600",
  },
  {
    id: "prod-03",
    name: "KobbyDrive Embroidered Trucker Cap",
    category: "Apparel",
    price: 35,
    rating: 4.85,
    reviewsCount: 44,
    badge: "Popular",
    description: "Breathable mesh back with premium structured front crown and adjustable snapback closure. Shields direct glare while driving.",
    iconBg: "from-slate-800 to-slate-950",
  },
  {
    id: "prod-04",
    name: "Magnetic 'L' Learner Plates (Front & Rear Pair)",
    category: "Safety Gear",
    price: 40,
    rating: 4.9,
    reviewsCount: 89,
    badge: "Best Seller",
    description: "Ultra-strong scratch-resistant magnetic backing that adheres firmly at highway speeds without scratching car paintwork.",
    iconBg: "from-rose-500 to-red-600",
  },
  {
    id: "prod-05",
    name: "Ghana Highway Code & 2026 Traffic Signs Handbook",
    category: "Driver Learning",
    price: 30,
    rating: 5.0,
    reviewsCount: 175,
    badge: "Essential Study",
    description: "Comprehensive illustrated guide covering all Ghanaian road signs, speed limits, right-of-way junctions, and DVLA theory questions.",
    iconBg: "from-emerald-500 to-teal-600",
  },
  {
    id: "prod-06",
    name: "Compact Vehicle First Aid & Emergency Trauma Kit",
    category: "Safety Gear",
    price: 120,
    rating: 4.92,
    reviewsCount: 53,
    badge: "Certified Kit",
    description: "Equipped with sterile bandages, burn gel, antiseptic wipes, scissors, tourniquet, and emergency thermal blanket in a sturdy zip pouch.",
    iconBg: "from-red-600 to-rose-700",
  },
  {
    id: "prod-07",
    name: "360° Magnetic Dashboard Phone Mount & GPS Grip",
    category: "Car Accessories",
    price: 50,
    rating: 4.88,
    reviewsCount: 76,
    badge: "Hands-Free",
    description: "Heavy-duty neodymium magnets with 360-degree swivel ball for hands-free navigation viewing without blocking windshield vision.",
    iconBg: "from-indigo-600 to-purple-700",
  },
  {
    id: "prod-08",
    name: "Insulated Stainless Steel Driver Travel Tumbler (500ml)",
    category: "Car Accessories",
    price: 65,
    rating: 4.9,
    reviewsCount: 39,
    badge: "Premium Gear",
    description: "Double-wall vacuum insulation keeps coffee hot for 8 hours or water icy cold for 18 hours. Fits standard car cup holders.",
    iconBg: "from-teal-600 to-cyan-700",
  },
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MerchandiseStorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("Pickup at Amanful West Digital Library (Free)");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MTN Mobile Money");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderConfirmedRef, setOrderConfirmedRef] = useState<string | null>(null);

  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    return true;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = deliveryOption.includes("Pickup") ? 0 : 20;
  const grandTotal = cartSubtotal + deliveryFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    try {
      const res = await fetch("/api/store/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          deliveryOption,
          deliveryAddress,
          paymentMethod,
          items: cart.map((it) => ({
            id: it.product.id,
            name: it.product.name,
            price: it.product.price,
            quantity: it.quantity,
          })),
          totalAmountGHS: grandTotal,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderConfirmedRef(data.orderRef);
        setCart([]);
      } else {
        alert(data.error || "Failed to place order.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold tracking-wide">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-400" />
              Official Driver Gear & Learning Supplies
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              KobbyDrive Official Merchandise Store
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Equip yourself with official road safety gear, DVLA learner essentials, high-visibility protective apparel, and driver accessories. Proceeds directly support the Kobby Free Driving School program.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                View Cart ({cartTotalCount})
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Merchandise" },
              { id: "Safety Gear", label: "Safety Gear" },
              { id: "Apparel", label: "Apparel" },
              { id: "Driver Learning", label: "Driver Learning" },
              { id: "Car Accessories", label: "Car Accessories" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors shadow-xs"
          >
            <ShoppingCart className="w-4 h-4 text-brand-600" />
            <span>Cart:</span>
            <span className="font-extrabold text-brand-700 font-mono">
              GH₵ {cartSubtotal} ({cartTotalCount} items)
            </span>
          </button>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Product Visual Header */}
              <div className="relative p-6 bg-slate-100 flex items-center justify-center h-48 border-b border-slate-100">
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${product.iconBg} text-white flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Package className="w-12 h-12 text-white/90" />
                </div>

                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/95 text-slate-900 shadow-xs border border-slate-200">
                    {product.badge}
                  </span>
                )}

                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/70 text-white backdrop-blur">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Price</span>
                    <span className="font-mono text-lg font-black text-slate-900">
                      GH₵ {product.price}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer / Slide-Over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-brand-600" />
                  <h3 className="font-black text-base text-slate-900">Your Shopping Cart</h3>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-700">
                    {cartTotalCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-700">Your cart is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Add branded driver polos, reflective vests, and study materials to proceed.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="pt-3 flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-slate-900">{item.product.name}</h4>
                        <span className="text-[11px] font-mono text-brand-700 font-bold block mt-0.5">
                          GH₵ {item.product.price} each
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                        >
                          <Minus className="w-3 h-3 text-slate-700" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold"
                        >
                          <Plus className="w-3 h-3 text-slate-700" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 transition-colors ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-slate-900">GH₵ {cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Pickup Point</span>
                    <span className="font-bold text-emerald-700">Amanful West (Free)</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="text-sm font-bold text-slate-900">Total Amount:</span>
                  <span className="text-2xl font-black font-mono text-brand-700">GH₵ {cartSubtotal}</span>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 transition-all cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="h-2 bg-gradient-to-r from-brand-500 to-emerald-500" />

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {orderConfirmedRef ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                    Thank you for supporting KobbyDrive. Your order has been registered. You can collect your items or track local delivery with this order reference:
                  </p>
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xl font-black text-brand-700">
                    {orderConfirmedRef}
                  </div>
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setOrderConfirmedRef(null);
                    }}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
                  >
                    Done Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Checkout & Order Placement</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Provide contact and delivery details to complete your order.
                    </p>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Samuel K. Mensah"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (SMS Notifications) *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 055 123 4567"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Collection / Delivery Method</label>
                      <select
                        value={deliveryOption}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="Pickup at Amanful West Digital Library (Free)">
                          Self-Pickup: Amanful West Digital Library (Free)
                        </option>
                        <option value="Takoradi Metropolitan Delivery (+GH₵20)">
                          Local Dispatch: Takoradi Metropolitan Delivery (+GH₵ 20)
                        </option>
                      </select>
                    </div>

                    {deliveryOption.includes("Delivery") && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address & Landmark *</label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. Beach Road, near Shell Station"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Payment Method</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                        <option value="Telecel Cash">Telecel Cash</option>
                        <option value="Cash on Pickup">Pay Cash on Collection / Pickup</option>
                        <option value="Debit Card / Bank Transfer">Debit Card / Bank Transfer</option>
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-mono font-bold">GH₵ {cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Delivery Fee:</span>
                        <span className="font-mono font-bold">GH₵ {deliveryFee}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-extrabold pt-1 border-t border-slate-200 text-sm">
                        <span>Grand Total:</span>
                        <span className="font-mono text-brand-700">GH₵ {grandTotal}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingOrder}
                      className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submittingOrder ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Confirm & Place Order (GH₵ {grandTotal})
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
