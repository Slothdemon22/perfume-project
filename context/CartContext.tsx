"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  fragrance: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, fragrance: string) => void;
  updateQuantity: (id: number, fragrance: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on first client render
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('shali_cart') : null;
      if (stored) {
        const parsed = JSON.parse(stored) as Array<CartItem & { size?: string }>;
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((item) => ({
            ...item,
            fragrance: item.fragrance ?? item.size ?? 'Signature Blend',
          }));
          setItems(normalized);
        }
      }
    } catch {
      // ignore corrupted local storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist cart to localStorage whenever it changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem('shali_cart', JSON.stringify(items));
    } catch {
      // ignore storage write errors (e.g., private mode)
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.fragrance === item.fragrance);
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.fragrance === item.fragrance
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number, fragrance: string) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.fragrance === fragrance)));
  }, []);

  const updateQuantity = useCallback((id: number, fragrance: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => !(i.id === id && i.fragrance === fragrance)));
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.id === id && i.fragrance === fragrance ? { ...i, quantity } : i
      )
    );
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = parseFloat(i.price.replace(/[^\d.]/g, ''));
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, addItem, removeItem, updateQuantity, openCart, closeCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
