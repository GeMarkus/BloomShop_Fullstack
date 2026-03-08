import React, { useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSubmit: (email: string, pass: string) => Promise<void>;
};

const LoginModal: React.FC<Props> = ({ isOpen, onClose, onLoginSubmit }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");
      await onLoginSubmit(email, pass);
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center transition-colors"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-gray-100
                   p-6 rounded-2xl w-96 shadow-xl 
                   space-y-3 transition-colors"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          เข้าสู่ระบบ
        </h3>

        <input
          className="w-full rounded-xl border 
                     border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700
                     text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-300
                     px-3 py-2 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500"
          placeholder="อีเมล"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full rounded-xl border 
                     border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700
                     text-gray-900 dark:text-white
                     placeholder-gray-400 dark:placeholder-gray-300
                     px-3 py-2 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500"
          placeholder="รหัสผ่าน"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        {err && (
          <p className="text-red-600 dark:text-red-400 text-sm">
            {err}
          </p>
        )}

        <Link
          onClick={() => onClose()}
          to="/register"
          className="block text-sm underline text-left
                     text-emerald-600 dark:text-emerald-400
                     hover:opacity-80"
        >
          สมัครสมาชิก
        </Link>

        <div className="flex gap-2 pt-2">
          <button
            disabled={loading}
            className="flex-1 rounded-xl 
                       bg-emerald-600 hover:bg-emerald-700
                       dark:bg-emerald-500 dark:hover:bg-emerald-600
                       text-white py-2 font-semibold 
                       transition disabled:opacity-60"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border 
                       border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-200
                       px-4 hover:bg-gray-100 dark:hover:bg-gray-700
                       transition"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginModal;