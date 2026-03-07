import type { Product } from "../lib/types";
import { formatTHB } from "../lib/utils";

type Props = { product: Product; onAddToCart: (id: number) => void; };

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => (
  <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-emerald-100/70 dark:border-gray-700 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition">
    
    <div
      className="w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
      style={{ aspectRatio: '4 / 3' }}
    >
      <img
        src={product.imageUrl ?? product.img ?? ''}
        alt={product.name}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>

    <div className="p-3 space-y-1">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
          {product.name}
        </h4>

        <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full px-2 py-0.5">
          {product.tag}
        </span>
      </div>

      <p className="font-bold text-gray-900 dark:text-white">
        {formatTHB(product.price)}
      </p>

      <button
        className="w-full rounded-xl bg-emerald-600 text-white py-2 font-semibold hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition"
        onClick={() => onAddToCart(product.id)}
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  </div>
);

export default ProductCard;