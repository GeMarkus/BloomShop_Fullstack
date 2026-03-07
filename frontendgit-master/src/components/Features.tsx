const Features: React.FC = () => (
  <section
    id="features"
    className="py-14 relative bg-transparent"
  >
    <div className="px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          icon: "🚚",
          title: "ส่งไวทั่วไทย",
          desc: "แพ็กกันกระแทกอย่างดี ส่งถึงมือปลอดภัย",
          badge: "ส่งด่วนทั่วประเทศ ภายใน 2-3 วัน",
          badgeColor: "bg-yellow-500",
        },
        {
          icon: "🌱",
          title: "คุณภาพคัดเกรด",
          desc: "เลือกต้นไม้สุขภาพดีจากฟาร์มโดยตรง",
          badge: "รับประกันต้นไม้สดใหม่ทุกวัน",
          badgeColor: "bg-emerald-600",
        },
        {
          icon: "💳",
          title: "ชำระเงินง่าย",
          desc: "รองรับโอน/บัตร/เก็บปลายทาง*",
          badge: "ระบบปลอดภัย รองรับทุกธนาคาร",
          badgeColor: "bg-indigo-600",
        },
        {
          icon: "🔒",
          title: "ปลอดภัย",
          desc: "ข้อมูลลูกค้าถูกเก็บอย่างเป็นความลับ",
          badge: "ระบบเข้ารหัสมาตรฐานสากล",
          badgeColor: "bg-rose-600",
        },
      ].map((f, i) => (
        <div
          key={i}
          className="relative group p-6 rounded-2xl
            bg-white/60 dark:bg-gray-900/60
            backdrop-blur-lg
            border border-white/40 dark:border-gray-800
            shadow-md hover:shadow-2xl
            transition duration-300
            hover:-translate-y-1"
        >
          {/* Icon */}
          <p className="text-3xl">{f.icon}</p>

          {/* Title */}
          <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
            {f.title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-sm text-gray-600 dark:text-white">
            {f.desc}
          </p>

          {/* Hover Badge */}
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2
            mb-3 opacity-0 translate-y-2
            group-hover:opacity-100 group-hover:translate-y-0
            transition duration-300"
          >
            <div
              className={`${f.badgeColor}
                text-white text-sm font-semibold
                rounded-lg px-4 py-2 shadow-xl
                whitespace-nowrap`}
            >
              {f.badge}
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Features;