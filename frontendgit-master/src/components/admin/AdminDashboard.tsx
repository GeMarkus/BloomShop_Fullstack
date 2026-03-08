// src/components/admin/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUser from "./AdminUser";

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- 📊 State สำหรับเก็บข้อมูลสรุป ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalPlantsSold: 0,
    totalRevenue: 0
  });

  // ฟังก์ชันดึงข้อมูลมาสรุป
  const fetchSummary = async () => {
    try {
      const [userRes, orderRes] = await Promise.all([
        axios.get('http://localhost:4000/api/users'), // สมมติว่ามี endpoint นี้
        axios.get('http://localhost:4000/api/orders/admin/all')
      ]);

      const users = userRes.data;
      const orders = orderRes.data;

      // คำนวณจำนวนต้นไม้ที่ขายได้ทั้งหมด (บวก qty จากทุก item ในทุก order)
      const plantsSold = orders.reduce((sum: number, order: any) => {
        const itemsQty = order.items?.reduce((iSum: number, item: any) => iSum + (item.qty || 0), 0) || 0;
        return sum + itemsQty;
      }, 0);

      // คำนวณยอดขายรวม
      const revenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalPlantsSold: plantsSold,
        totalRevenue: revenue
      });
    } catch (err) {
      console.error("Error fetching summary stats:", err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/admin') {
      fetchSummary();
    }
  }, [location.pathname]);

  // --- ส่วนสไตล์และฟังก์ชันเดิมของมึง ---
  const isActive = (path: string) => location.pathname === path;

  const handleLogoutHome = () => {
    if (window.confirm("ต้องการออกจากระบบ Admin และกลับสู่หน้าหลักใช่ไหม?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
      window.location.reload();
    }
  };

  const linkStyle = (path: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    borderRadius: '10px',
    transition: '0.3s',
    marginBottom: '8px'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: "'Kanit', sans-serif" }}>
      
      {/* Sidebar (เหมือนเดิม) */}
      <aside style={{ width: '280px', backgroundColor: '#00B171', color: 'white', padding: '30px 20px', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', margin: 0 }}>🌿 Bloom Admin</h2>
          <p style={{ fontSize: '12px', opacity: 0.8 }}>ระบบจัดการหลังบ้าน</p>
        </div>
        <nav style={{ flex: 1 }}>
          <Link to="/admin" style={linkStyle('/admin')}><span>📊</span> ภาพรวม</Link>
          <Link to="/admin/products" style={linkStyle('/admin/products')}><span>🌿</span> จัดการสินค้า</Link>
          <Link to="/admin/orders" style={linkStyle('/admin/orders')}><span>📦</span> จัดการคำสั่งซื้อ</Link>
          <Link to="/admin/users" style={linkStyle('/admin/users')}><span>👥</span> จัดการผู้ใช้งาน</Link>
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
          <button onClick={handleLogoutHome} style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.1)', color: 'white', border: '1px solid white', borderRadius: '10px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🏠</span> Logout & กลับหน้าหลัก
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', minHeight: '80vh' }}>
          <Routes>
            <Route index element={
              <div>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ fontSize: '60px' }}>👋</div>
                  <h1 style={{ margin: '10px 0' }}>ยินดีต้อนรับสู่ Bloom Shop</h1>
                  <p style={{ color: '#777' }}>นี่คือสรุปภาพรวมของร้านค้าในขณะนี้</p>
                </div>

                {/* --- 🃏 Summary Cards Section --- */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', // เปลี่ยนจาก 4 เป็น 2 เพื่อให้มันตัดลงข้างล่าง
                  gap: '30px', // เพิ่มช่องว่างระหว่างการ์ดให้ดูโปร่งขึ้น
                  marginTop: '40px',
                  maxWidth: '1000px', // คุมความกว้างสูงสุดไว้ไม่ให้มันยืดจนน่าเกลียดบนจอใหญ่
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                  <StatCard title="ผู้ใช้งานทั้งหมด" value={stats.totalUsers} unit="คน" icon="👥" color="#4e73df" />
                  <StatCard title="ออเดอร์ทั้งหมด" value={stats.totalOrders} unit="รายการ" icon="📦" color="#1cc88a" />
                  <StatCard title="ต้นไม้ที่ขายได้" value={stats.totalPlantsSold} unit="ต้น" icon="🌿" color="#36b9cc" />
                  <StatCard title="รายได้รวม" value={stats.totalRevenue.toLocaleString()} unit="฿" icon="💰" color="#f6c23e" />
                </div>
              </div>
            } />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUser />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// --- 🧩 Component ย่อยสำหรับการ์ดสรุป ---
const StatCard = ({ title, value, unit, icon, color }: any) => (
  <div style={{
    padding: '24px',
    borderRadius: '20px', // มนๆ แบบในรูป
    backgroundColor: 'white',
    borderLeft: `6px solid ${color}`,
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)', // เงาฟุ้งๆ ดูทันสมัย
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    cursor: 'default'
  }}
  
  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div>
      <p style={{ 
        fontSize: '13px', 
        fontWeight: 'bold', 
        color: color, 
        textTransform: 'uppercase', 
        margin: '0 0 8px 0',
        letterSpacing: '0.5px'
      }}>
        {title}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        {unit === '฿' && <span style={{ fontSize: '20px', fontWeight: '800', color: '#333' }}>฿</span>}
        <p style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: '#333' }}>
          {value}
        </p>
        {unit !== '฿' && <span style={{ fontSize: '15px', color: '#888', marginLeft: '4px' }}>{unit}</span>}
      </div>
    </div>
    <div style={{ 
      fontSize: '32px', 
      backgroundColor: `${color}15`, // สีจางๆ เป็นพื้นหลังไอคอน
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
      opacity: 0.8
    }}>
      {icon}
    </div>
  </div>
);