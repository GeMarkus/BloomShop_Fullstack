import type { User } from "../lib/types";
import { Link } from "react-router-dom";

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onRecommend: () => void;
  onOpenCart: () => void;
  cartCount: number;
  currentUser: User | null;
  onLoginOpen: () => void;
  onLogout: () => void;
};

const Header: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  onRecommend,
  onOpenCart,
  cartCount,
  currentUser,
  onLoginOpen,
  onLogout,
}) => (
  <header className="sticky top-0 z-40 backdrop-blur-md 
    bg-white/70 dark:bg-gray-950/70
    border-b border-emerald-100/70 dark:border-gray-800
    transition-colors duration-300">

    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center 
            rounded-2xl bg-emerald-500 text-white font-bold shadow-lg">
            B
          </span>
          <span className="font-extrabold text-xl tracking-tight 
            text-gray-900 dark:text-white">
            Bloom
          </span>
        </Link>

        {/* SEARCH */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="ค้นหาสินค้า…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl 
                border border-emerald-200/70 dark:border-gray-700
                bg-white/70 dark:bg-gray-800/70
                text-gray-800 dark:text-gray-200
                px-4 py-2 pl-10
                focus:outline-none focus:ring-2 focus:ring-emerald-400
                shadow-sm transition"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 
                text-gray-500 dark:text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.4 5.4a7.5 7.5 0 0011.3 11.3z"
              />
            </svg>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">

          {/* Dictionary */}
          <Link
            to="/dictionary"
            className="hidden sm:inline-flex items-center justify-center
              rounded-xl bg-emerald-500 text-white
              px-4 py-2 font-semibold shadow-md
              hover:bg-emerald-600 transition"
          >
            🌿 พจนานุกรมต้นไม้
          </Link>

          {/* Orders */}
          <Link
            to="/orders"
            className="hidden sm:inline-flex items-center justify-center
              rounded-xl
              bg-white/70 dark:bg-gray-800/70
              border border-emerald-200/70 dark:border-gray-700
              text-gray-800 dark:text-gray-200
              px-4 py-2 font-semibold
              hover:bg-emerald-100 dark:hover:bg-gray-700
              transition"
          >
            🧾 คำสั่งซื้อของฉัน
          </Link>

          {/* Recommend */}
          <button
            onClick={onRecommend}
            className="rounded-xl px-3 py-2
              border border-emerald-200/70 dark:border-gray-700
              bg-white/70 dark:bg-gray-800/70
              text-gray-800 dark:text-gray-200
              hover:bg-emerald-100 dark:hover:bg-gray-700
              transition font-semibold"
          >
            🌱 แนะนำต้นไม้
          </button>

          {/* USER SECTION */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* 🟢 User Badge & Avatar */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl 
                              bg-emerald-50/80 dark:bg-emerald-900/20 
                              border border-emerald-100 dark:border-emerald-800/50
                              transition-all hover:shadow-sm">
                  
                  {/* Avatar วงกลมชื่อตัวแรก */}
                  <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 
                                flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col leading-tight hidden lg:flex">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">
                      Member
                    </span>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {currentUser.username}
                    </span>
                  </div>
                  
                  {/* สำหรับจอเล็ก โชว์แค่ชื่อพอ */}
                  <span className="sm:hidden lg:hidden text-sm font-bold text-gray-800 dark:text-gray-200">
                    {currentUser.username}
                  </span>
                </div>

                {/* 🔴 ปุ่ม Logout แบบ Minimal */}
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
                            rounded-xl transition-all duration-200"
                  title="ออกจากระบบ"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              /* 🔒 ปุ่ม Login แบบมีมิติ */
              <button
                onClick={onLoginOpen}
                className="flex items-center gap-2 rounded-xl px-5 py-2
                          bg-white dark:bg-gray-800
                          text-gray-700 dark:text-gray-200
                          border border-gray-200 dark:border-gray-700
                          hover:border-emerald-400 dark:hover:border-emerald-500
                          hover:text-emerald-600 dark:hover:text-emerald-400
                          transition-all duration-300 font-bold shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </button>
            )}
          </div>

          {/* CART */}
          <button
            onClick={onOpenCart}
            aria-label="Open cart"
            className="relative rounded-xl px-3 py-2
              border border-emerald-200/70 dark:border-gray-700
              bg-white/70 dark:bg-gray-800/70
              hover:shadow-md transition"
          >
            <svg
              className="w-5 h-5 text-gray-800 dark:text-gray-200"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l3-8H6.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a2 2 0 100-4 2 2 0 000 4zm8 2a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>

            <span className="absolute -top-2 -right-2 text-xs
              bg-emerald-500 dark:bg-emerald-400
              text-white rounded-full px-1.5 py-0.5 shadow">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

export default Header;