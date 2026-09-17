import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'trailhead_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) => (i.product === product._id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.images?.[0]?.url,
          imageAlt: product.images?.[0]?.alt,
          qty,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    setItems((prev) => prev.map((i) => (i.product === productId ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product !== productId));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    return { items, addItem, updateQty, removeItem, clearCart, subtotal, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
