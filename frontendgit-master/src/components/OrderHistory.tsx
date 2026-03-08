import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { products } from "../lib/data";

type OrderItem = {
  productId: number;
  name?: string;
  qty: number;
  unitPrice?: number;
  lineTotal?: number;
};

type Order = {
  _id: string;
  status: "pending" | "paid" | "cancelled";
  total: number;
  method: "visa" | "mastercard" | "paypal" | "promptpay";
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: string;
};

type Paged<T> = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: T[];
};

const fmtTHB = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(n);

const OrderHistory: React.FC = () => {
  const [data, setData] = useState<Paged<Order> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [printingId, setPrintingId] = useState<string | null>(null); // ✅ เก็บ ID ออเดอร์ที่จะพิมพ์ใบเดียว
  const navigate = useNavigate();

  const load = async (pg = 1) => {
    try {
      setLoading(true); setErr(null);
      const res = await api.get<Paged<Order>>("/orders/my", { params: { page: pg, limit: 10 } });
      setData(res.data);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "โหลดรายการไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);

  const canPrev = useMemo(() => (data?.page ?? 1) > 1, [data]);
  const canNext = useMemo(() => (data?.page ?? 1) < (data?.pages ?? 1), [data]);

  // 🖨️ ฟังก์ชันพิมพ์ใบเดียว
  const handlePrintSingle = (id: string) => {
    setPrintingId(id);
    setTimeout(() => {
      window.print();
      setPrintingId(null);
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-8 transition-colors print:bg-white print:p-0">
      
      {/* 🛠 สไตล์สำหรับการพิมพ์ (Single vs All) */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          
          /* ถ้าพิมพ์ใบเดียว ซ่อนอันอื่นให้หมด */
          ${printingId ? `
            .receipt-page:not(.print-active) { display: none !important; }
          ` : ''}

          .receipt-page { 
            page-break-after: always;
            margin: 0 !important;
            padding: 40px !important;
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto">
        {/* Header Section (no-print) */}
        <div className="flex items-center justify-between mb-8 no-print bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">คำสั่งซื้อของฉัน</h1>
            <p className="text-sm text-gray-500">จัดการออเดอร์และพิมพ์ใบเสร็จ</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-all">← กลับ</Link>
            <button 
              onClick={() => window.print()} 
              className="px-5 py-2 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none transition-all flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              พิมพ์ทั้งหมดในหน้านี้
            </button>
          </div>
        </div>

        {loading && <div className="text-center py-20 animate-pulse text-gray-400">กำลังโหลดรายการออเดอร์...</div>}
        {err && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center border border-red-100">{err}</div>}

        {!loading && data && (
          <div className="space-y-10">
            {data.items.map((o) => (
              <div 
                key={o._id} 
                className={`receipt-page bg-white dark:bg-gray-900 rounded-3xl shadow-xl border-t-[10px] border-emerald-500 overflow-hidden transition-all ${printingId === o._id ? 'print-active ring-4 ring-emerald-500' : ''}`}
              >
                
                {/* 🧾 Header ใบเสร็จ */}
                <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                  <div>
                    <h2 className="text-3xl font-black text-emerald-600 tracking-tighter">BLOOM SHOP</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Electronic Official Receipt</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block ${o.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {o.status}
                    </span>
                    <p className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 block">ID: #{o._id.toUpperCase()}</p>
                  </div>
                </div>

                <div className="p-10">
                  {/* Grid ข้อมูล */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div>
                      <h4 className="text-[11px] font-black text-emerald-600 uppercase mb-3 underline decoration-2 underline-offset-4">ที่อยู่จัดส่ง (Shipping)</h4>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        {o.shippingAddress || "ลูกค้าไม่ได้ระบุข้อมูลที่อยู่"}
                      </p>
                    </div>
                    <div className="md:text-right space-y-4">
                      <div>
                        <h4 className="text-[11px] font-black text-gray-400 uppercase mb-1">วันที่ออกใบเสร็จ</h4>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{new Date(o.createdAt).toLocaleString('th-TH')}</p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-gray-400 uppercase mb-1">ชำระผ่านช่องทาง</h4>
                        <p className="text-sm font-black text-emerald-600 uppercase tracking-wider">{o.method}</p>
                      </div>
                    </div>
                  </div>

                  {/* 🌿 ตารางรายการสินค้า */}
                  <div className="mb-10 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 text-[10px] text-gray-500 uppercase font-bold">
                          <th className="p-4">รายการ</th>
                          <th className="p-4 text-center">จำนวน</th>
                          <th className="p-4 text-right">หน่วยละ</th>
                          <th className="p-4 text-right">รวม</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {o.items.map((it, idx) => {
                          const pInfo = products.find((p) => p.id === it.productId);
                          return (
                            <tr key={idx} className="text-sm hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-4">
                                  {pInfo?.img && <img src={pInfo.img} className="w-10 h-10 rounded-xl object-cover print:hidden border border-gray-100" alt="" />}
                                  <span className="font-bold text-gray-800 dark:text-gray-100">{pInfo ? pInfo.name : `ต้นไม้ #${it.productId}`}</span>
                                </div>
                              </td>
                              <td className="p-4 text-center font-bold text-gray-400">x{it.qty}</td>
                              <td className="p-4 text-right font-mono text-gray-500">{fmtTHB(it.unitPrice || 0)}</td>
                              <td className="p-4 text-right font-black text-gray-900 dark:text-white font-mono">{fmtTHB(it.lineTotal ?? (it.unitPrice ?? 0) * it.qty)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* 💰 สรุปยอดเงิน */}
                  <div className="bg-emerald-600 rounded-3xl p-8 flex justify-between items-center text-white shadow-xl shadow-emerald-100 dark:shadow-none">
                    <div>
                      <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest">ยอดชำระสุทธิ (Total Amount)</p>
                      <p className="text-[10px] italic opacity-60">ชำระเงินเรียบร้อยแล้ว</p>
                    </div>
                    <div className="text-4xl font-black tracking-tighter">
                      {fmtTHB(o.total)}
                    </div>
                  </div>

                  {/* Footer ใบเสร็จ */}
                  <div className="mt-10 text-center border-t border-dashed border-gray-200 dark:border-gray-800 pt-8">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Bloom Shop - Green Space for Everyone</p>
                    
                    {/* ปุ่ม Print ใบนี้ใบเดียว (ซ่อนตอนพิมพ์) */}
                    <div className="flex justify-center gap-4 mt-6 no-print">
                      <button 
                        onClick={() => handlePrintSingle(o._id)} 
                        className="px-6 py-2.5 bg-white dark:bg-gray-800 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        พิมพ์เฉพาะใบนี้
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (no-print) */}
        {!loading && data && (
          <div className="flex items-center justify-between mt-12 mb-20 no-print px-6 py-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <button className="px-5 py-2 text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canPrev}>← ย้อนกลับ</button>
            <span className="text-sm font-black text-gray-500 uppercase tracking-widest">หน้า {data.page} / {data.pages}</span>
            <button className="px-5 py-2 text-sm font-bold rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all" onClick={() => setPage((p) => p + 1)} disabled={!canNext}>ถัดไป →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;