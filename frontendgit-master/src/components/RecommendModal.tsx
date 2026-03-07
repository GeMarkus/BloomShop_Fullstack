import type { Product } from "../lib/types";
import { formatTHB } from "../lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  plant: Product | null;
  reason: string;
};

const RecommendModal: React.FC<Props> = ({ open, onClose, plant, reason }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 items-center justify-center bg-black/50 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center dark:bg-gray-800">
        <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
          🌿 แนะนำต้นไม้สำหรับคุณ
        </h2>
        {plant && (
          <>
            <img
              src={plant.img}
              alt={plant.name}
              className="w-40 h-40 object-cover mx-auto rounded-lg shadow-md mb-3"
            />
            <p className="text-lg font-semibold dark:text-white">✨ {plant.name}</p>
            <p className="text-gray-700 dark:text-gray-300">
              ราคา: {formatTHB(plant.price)}
            </p>
            <p className="mt-3 text-sm text-gray-600 italic dark:text-gray-400">
              เหตุผล: {reason}
            </p>
          </>
        )}
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={onClose}
        >
          ปิด
        </button>
      </div>
    </div>
  );
};
export default RecommendModal;
