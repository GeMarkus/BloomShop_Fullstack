// src/components/Delivery.tsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const fmt = (n: number) => new Intl.NumberFormat("th-TH", { 
  style: "currency", 
  currency: "THB" 
}).format(n);

const Delivery: React.FC = () => {
  const navigate = useNavigate();

  // ---------- ดึงข้อมูลจาก LocalStorage ----------
  const { draft, token, orderId } = useMemo(() => {
    const rawDraft = localStorage.getItem("orderDraft");
    // ดึง orderId และล้างเครื่องหมายคำพูด (ถ้ามี)
    const rawOrderId = localStorage.getItem("orderId");
    const cleanOrderId = rawOrderId ? rawOrderId.replace(/['"]/g, "") : null;

    return {
      draft: rawDraft ? JSON.parse(rawDraft) : null,
      token: localStorage.getItem("token"),
      orderId: cleanOrderId
    };
  }, []);

  const [shippingText, setShippingText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState({ id: "standard", cost: 50, time: "5-7 Days" });

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // ---------- คำนวณราคาสรุป ----------
  const stats = useMemo(() => {
    if (!draft?.items) return { subtotal: 0, taxes: 0, total: 0 };
    const sub = draft.subtotal ?? draft.items.reduce((s: number, it: any) => s + it.price * it.qty, 0);
    const tax = Math.round(sub * 0.07 * 100) / 100;
    return { subtotal: sub, taxes: tax, total: sub + tax + selected.cost };
  }, [draft, selected.cost]);

  // ---------- ฟังก์ชันบันทึกที่อยู่จัดส่ง (เชื่อมกับ Backend) ----------
  const handleSaveAddress = async () => {
    if (!orderId || orderId === "undefined") return alert("❌ ไม่พบหมายเลขคำสั่งซื้อ");

    // --- ตรวจสอบความครบถ้วน (Validation) ---
    if (!shippingText.trim()) return alert("⚠️ กรุณากรอกที่อยู่โดยละเอียด");
    
    // ตรวจสอบเบอร์โทร (ต้องมี 10 หลัก)
    if (!/^\d{10}$/.test(phone)) return alert("⚠️ กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก");
    
    // ตรวจสอบอีเมล
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("⚠️ รูปแบบอีเมลไม่ถูกต้อง");
    
    // ตรวจสอบรหัสไปรษณีย์ (5 หลัก)
    if (!/^\d{5}$/.test(postalCode)) return alert("⚠️ รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก");

    try {
      setSubmitting(true);
      // รวมข้อมูลเป็นก้อนเดียวส่งไป Backend
      const fullAddress = `ที่อยู่: ${shippingText} | เบอร์โทร: ${phone} | อีเมล: ${email} | รหัสไปรษณีย์: ${postalCode}`;

      const res = await fetch(`http://localhost:4000/api/orders/${orderId}/shipping`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
        shippingAddress: fullAddress,
        shippingFee: selected.cost, 
        total: stats.total 
        }),
      });
      
      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      
      setIsAddressSaved(true);
      alert("✅ บันทึกข้อมูลการจัดส่งครบถ้วน!");
    } catch (err: any) { 
      alert("❌ Error: " + err.message); 
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalConfirm = () => {
    if (!isAddressSaved) return alert("⚠️ กรุณากดปุ่ม 'บันทึกที่อยู่จัดส่ง' ก่อนยืนยันขั้นสุดท้าย");
    setShowSuccess(true);
    // ล้างข้อมูลหลังจบบริบูรณ์
    localStorage.removeItem("orderDraft");
    localStorage.removeItem("orderId");
  };

  
  // กรณีไม่มีข้อมูล Order ให้ไล่กลับหน้าแรก
  if (!draft?.items?.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-xl font-bold text-gray-400">ไม่พบข้อมูลการสั่งซื้อ</h2>
      <Link to="/" className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
        กลับไปหน้าหลัก
      </Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 pb-12">
      {/* Modal แจ้งสำเร็จ */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900">สั่งซื้อสำเร็จ!</h3>
            <p className="text-gray-500 mt-2">ขอบคุณที่เลือกช้อปต้นไม้กับ Bloom <br/>เราจะรีบจัดส่งให้เร็วที่สุดครับ</p>
            <button 
              onClick={() => navigate("/")} 
              className="mt-8 w-full bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition"
            >
              กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-sm h-20 flex items-center px-6 lg:px-12 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-emerald-600">
          <span className="bg-emerald-500 text-white px-3 py-1 rounded-2xl shadow-sm">B</span> Bloom Shop
        </div>
        <Link to="/" className="text-sm font-bold text-gray-400 hover:text-emerald-500 transition-colors">
          ESC TO SHOP
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Delivery Method</h1>
            <p className="text-gray-400">เลือกรูปแบบการจัดส่งที่เหมาะกับคุณ</p>
          </div>
          
          <div className="grid gap-4">
            {[
              { id: "standard", name: "Standard Delivery", cost: 50, time: "5-7 Business Days" },
              { id: "express", name: "Express Shipping", cost: 150, time: "2-3 Business Days" }
            ].map(o => (
              <div 
                key={o.id} 
                onClick={() => setSelected(o)} 
                className={`p-6 bg-white border-2 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${
                  selected.id === o.id ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected.id === o.id ? "border-emerald-500" : "border-gray-300"}`}>
                    {selected.id === o.id && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{o.name}</h3>
                    <p className="text-sm text-gray-400">{o.time}</p>
                  </div>
                </div>
                <span className="font-black text-xl text-emerald-600">{fmt(o.cost)}</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <label className="block text-lg font-black mb-2 flex items-center gap-2">
              <span className="bg-gray-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              ข้อมูลการจัดส่ง
            </label>

            {/* ช่องกรอกที่อยู่หลัก */}
            <textarea 
              value={shippingText} 
              onChange={(e) => setShippingText(e.target.value)} 
              disabled={isAddressSaved}
              className="w-full border-2 rounded-2xl p-4 h-24 focus:border-emerald-500 outline-none" 
              placeholder="บ้านเลขที่, ถนน, แขวง, เขต..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* เบอร์โทรศัพท์ */}
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} // พิมพ์ได้เฉพาะตัวเลข
                maxLength={10}
                disabled={isAddressSaved}
                placeholder="เบอร์โทรศัพท์ (0XXXXXXXXX)"
                className="border-2 rounded-xl p-3 focus:border-emerald-500 outline-none"
              />
              {/* รหัสไปรษณีย์ */}
              <input 
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                maxLength={5}
                disabled={isAddressSaved}
                placeholder="รหัสไปรษณีย์"
                className="border-2 rounded-xl p-3 focus:border-emerald-500 outline-none"
              />
            </div>

            {/* อีเมลสำหรับรับใบเสร็จ */}
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isAddressSaved}
              placeholder="อีเมลสำหรับติดต่อ"
              className="w-full border-2 rounded-xl p-3 focus:border-emerald-500 outline-none"
            />

            <button 
              onClick={handleSaveAddress}
              disabled={isAddressSaved || submitting}
              className={`w-full py-4 rounded-xl font-black transition-all ${
                isAddressSaved ? "bg-green-500 text-white" : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              {submitting ? "กำลังตรวจสอบ..." : isAddressSaved ? "✓ บันทึกข้อมูลสำเร็จ" : "บันทึกข้อมูลและที่อยู่"}
            </button>
          </div>
        </div>

        {/* Sidebar สรุปยอด */}
        <aside className="relative">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 sticky top-28">
            <h2 className="text-2xl font-black mb-8 border-b pb-4">Order Summary</h2>
            <div className="space-y-5 border-b pb-6 text-sm">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>ยอดรวมสินค้า</span>
                <span className="text-gray-900">{fmt(stats.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>ภาษีมูลค่าเพิ่ม (7%)</span>
                <span className="text-gray-900">{fmt(stats.taxes)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>ค่าจัดส่ง ({selected.name})</span>
                <span>{fmt(selected.cost)}</span>
              </div>
            </div>
            <div className="flex justify-between items-end pt-6 mb-8">
              <span className="text-gray-500 font-bold">Total</span>
              <span className="text-4xl font-black text-emerald-600 leading-none">{fmt(stats.total)}</span>
            </div>
            
            <button 
              onClick={handleFinalConfirm}
              className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                isAddressSaved 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200 hover:-translate-y-1" 
                  : "bg-gray-800 text-white hover:bg-gray-900 cursor-not-allowed"
              }`}
            >
              ยืนยันการสั่งซื้อ
            </button>
            {!isAddressSaved && (
              <p className="text-[11px] text-center text-rose-500 mt-4 font-bold uppercase tracking-wider animate-pulse">
                * กรุณาบันทึกที่อยู่จัดส่งก่อน
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Delivery;