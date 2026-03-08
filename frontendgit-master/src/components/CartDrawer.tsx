// src/components/CartDrawer.tsx
import React from "react";
import type { Cart, Product } from "../lib/types";
import { formatTHB } from "../lib/utils";
import CartItem from "./CartItem";

type Props = {
  open: boolean;
  onClose: () => void;
  cart: Cart;
  products: Product[];
  onChangeQty: (id: number, delta: number) => void;
  onSetQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void; // รับฟังก์ชันมาจากไฟล์แม่
};

const CartDrawer: React.FC<Props> = ({
  open,
  onClose,
  cart,
  products,
  onChangeQty,
  onSetQty,
  onRemove,
  onCheckout,
}) => {
  const entries = Object.entries(cart);

  const total = entries.reduce((sum, [id, qty]) => {
    const p = products.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  return (
    <>
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[420px]
        bg-white dark:bg-gray-900
        shadow-2xl border-l border-emerald-100/70 dark:border-gray-800
        transition-transform duration-300 z-50 flex flex-col
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-100/70 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            🛒 ตะกร้าสินค้า
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Body (Items) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {entries.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
              <span className="text-5xl">🪴</span>
              <p>ยังไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            entries.map(([id, qty]) => {
              const p = products.find((x) => x.id === Number(id));
              if (!p) return null;
              const sub = p.price * qty;

              return (
                <CartItem
                  key={id}
                  product={p}
                  qty={qty}
                  subtotal={sub}
                  onChangeQty={(d) => onChangeQty(p.id, d)}
                  onSetQty={(q) => onSetQty(p.id, q)}
                  onRemove={() => onRemove(p.id)}
                />
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-100/70 dark:border-gray-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              ยอดรวม
            </span>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">
              {formatTHB(total)}
            </span>
          </div>

          <button
            disabled={entries.length === 0}
            className={`w-full rounded-xl py-3 font-semibold text-white transition
            ${entries.length === 0 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            }`}
            onClick={onCheckout} // เรียกใช้ฟังก์ชันที่ส่งมาจากไฟล์แม่
          >
            ชำระเงิน
          </button>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
    </>
  );
};

export default CartDrawer;