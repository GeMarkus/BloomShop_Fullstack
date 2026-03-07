import React from "react";

const Hero: React.FC = () => (
  <section className="relative overflow-hidden bg-transparent">
    {/* 🌫️ เพิ่ม Blur จางๆ ทั่วบริเวณเผื่อข้างหลังมีสีสัน */}
    <div className="absolute inset-0 backdrop-blur-[2px] -z-20" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* --- LEFT CONTENT --- */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-wide
            text-emerald-700 bg-emerald-100/60 dark:text-emerald-300 dark:bg-emerald-900/30
            rounded-full px-4 py-1.5 backdrop-blur-md border border-emerald-200/30">
            🌿 คอลเลกชันใหม่ Spring 2026
          </span>

          <h1 className="mt-6 text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            แต่งบ้านให้สดชื่น <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500">
              ด้วยต้นไม้ฟีลมินิมอล
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-700 dark:text-gray-200 leading-relaxed max-w-lg font-medium">
            "Bloom" คัดสรรต้นไม้ฟอร์มสวยที่เปลี่ยนบ้านของคุณให้กลายเป็นโอเอซิสแห่งความสุข 
            เติมเต็มไลฟ์สไตล์มินิมอลด้วยธรรมชาติที่ดูแลรักษาง่าย
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#products" className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg hover:bg-emerald-700 transition-all active:scale-95">
              เลือกซื้อเลย
            </a>

            <a href="#features" className="inline-flex items-center justify-center rounded-2xl bg-white/20 dark:bg-gray-900/20 border-2 border-white/30 dark:border-gray-800 px-8 py-4 font-bold text-gray-800 dark:text-white backdrop-blur-md hover:bg-white/40 transition-all active:scale-95">
              ดูฟีเจอร์
            </a>
          </div>

          <div className="mt-10 flex items-center gap-8 pt-8 border-t border-emerald-500/10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">จัดส่งภายใน 48 ชม.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">การันตี 7 วัน</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE (เหมือนเดิมเป๊ะ) --- */}
        <div className="relative lg:ml-auto">
          {/* Main Image Container */}
          <div className="relative z-10 aspect-[1.5/1] w-full max-w-[700px] ml-auto rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 group">
            <img
              src="https://images7.alphacoders.com/878/thumb-1920-878137.jpg"
              alt="Plant hero"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Floating Glass Card */}
          <div className="absolute -bottom-8 -left-8 z-20 animate-float
            bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl
            rounded-3xl shadow-2xl border border-white/40 dark:border-gray-800
            p-5 flex items-center gap-4 max-w-[280px]">
            
            <div className="relative h-16 w-16 shrink-0">
              <img
                src="https://www.harmony-plants.com/cdn/shop/products/5BCD4C1A-3AC6-4651-87A5-4E3B4E534A39.jpg?v=1759247854&width=1500"
                className="h-full w-full rounded-2xl object-cover shadow-md"
                alt="Mini plant"
              />
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                Best Seller
              </div>
            </div>

            <div>
              <p className="font-black text-gray-900 dark:text-white leading-tight">
                Monstera Adansonii
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default Hero;