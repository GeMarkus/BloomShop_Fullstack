import React from "react";

// ✅ Icon สำหรับปุ่มติดต่อ
const MessageCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
  </svg>
);

const Newsletter: React.FC = () => {
  // 🔗 ใส่ลิงก์ LINE หรือ Messenger ของมึงตรงนี้
  const contactLink = "https://line.me/ti/p/YOUR_ID"; 

  return (
    <section className="py-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-10 shadow-xl 
                        grid lg:grid-cols-2 gap-8 items-center relative overflow-hidden">
          
          {/* ตกแต่งพื้นหลังเล็กน้อยให้ดูแพง */}
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2 italic">มีคำถามเรื่องต้นไม้? 🌿</h3>
            <p className="text-white/90 text-lg">
              ปรึกษาผู้เชี่ยวชาญของเราได้ฟรี! ไม่ว่าจะเป็นการเลือกต้นไม้ หรือวิธีการดูแล
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <a
              href={contactLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-white text-emerald-700 
                         font-bold text-xl px-8 py-4 hover:bg-emerald-50 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <MessageCircleIcon />
              แชทเลย (LINE)
            </a>
            
            <div className="flex flex-col justify-center text-center sm:text-left">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-200">เวลาทำการ</span>
              <span className="font-medium text-sm">ทุกวัน: 09:00 - 20:00 น.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;