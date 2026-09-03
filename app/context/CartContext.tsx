"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  attributes: string;
  quantity: number;
  stockQuantity?: number; // تخزين المخزون المتاح مع العنصر
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "hola-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // قراءة الـ localStorage مباشرة عند أول بداية للـ State
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
      return [];
    }
  });

  // حفظ أي تغييرات في السلة تلقائياً
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  function addItem(item: Omit<CartItem, "quantity">, quantity: number) {
    setItems((current) => {
      // التحقق من وجود نفس المنتج بنفس اللون (attributes)
      const existing = current.find(
        (i) => i.id === item.id && i.attributes === item.attributes
      );
      const maxStock = item.stockQuantity ?? Infinity;

      if (existing) {
        const newQuantity = existing.quantity + quantity;
        if (newQuantity > maxStock) {
          return current.map((i) =>
            i.id === item.id && i.attributes === item.attributes
              ? { ...i, quantity: maxStock, stockQuantity: maxStock }
              : i
          );
        }
        return current.map((i) =>
          i.id === item.id && i.attributes === item.attributes
            ? { ...i, quantity: newQuantity, stockQuantity: maxStock }
            : i
        );
      }

      const initialQuantity = Math.min(quantity, maxStock);
      return [...current, { ...item, quantity: initialQuantity, stockQuantity: maxStock }];
    });
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((i) => i.id !== id));
  }

  function updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return;
    setItems((current) =>
      current.map((i) => {
        if (i.id === id) {
          const maxStock = i.stockQuantity ?? Infinity;
          return { ...i, quantity: Math.min(quantity, maxStock) };
        }
        return i;
      })
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}