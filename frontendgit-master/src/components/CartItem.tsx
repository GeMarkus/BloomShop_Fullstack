/* eslint-disable no-irregular-whitespace */
import React from "react";
import type { Product } from "../lib/types";
import { formatTHB } from "../lib/utils";

type Props = {
  product: Product;
  qty: number;
  subtotal: number;
  onChangeQty: (delta: number) => void;
  onSetQty: (qty: number) => void;
  onRemove: () => void;
};

const CartItem: React.FC<Props> = ({
  product,
  qty,
  subtotal,
  onChangeQty,
  onSetQty,
  onRemove,
}) => {
  
  const handleSetQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const newQty = parseInt(value, 10);

    if (isNaN(newQty) || newQty < 1) {
      onSetQty(1);
    } else {
      onSetQty(newQty);
    }
  };

  return (
    <div className="flex gap-3 items-center p-3 rounded-xl border border-emerald-100/70 dark:border-gray-800 bg-white dark:bg-gray-900 transition">
      <img
        src={product.imageUrl ?? product.img ?? ""}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md"
      />

      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          {product.name}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatTHB(product.price)}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <button
            className="px-2 rounded border border-gray-300 dark:border-gray-700
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => onChangeQty(-1)}
            aria-label="Decrease quantity"
          >
            -
          </button>

          <input
            className="w-12 text-center rounded border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={qty}
            onChange={handleSetQtyChange}
            type="number"
            min="1"
          />

          <button
            className="px-2 rounded border border-gray-300 dark:border-gray-700
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => onChangeQty(1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-900 dark:text-white">
          {formatTHB(subtotal)}
        </p>

        <button
          className="text-sm text-red-600 dark:text-red-400 hover:underline mt-1"
          onClick={onRemove}
        >
          ลบ
        </button>
      </div>
    </div>
  );
};

export default CartItem;