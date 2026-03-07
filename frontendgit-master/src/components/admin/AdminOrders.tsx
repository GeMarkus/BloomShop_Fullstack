// src/components/admin/AdminOrders.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// 🌿 1. นำเข้าข้อมูลสินค้าจาก data.ts (เช็ค path ให้ถูกนะมึง)
import { products } from "../../lib/data"; 

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/orders/admin/all');
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("จะลบออเดอร์นี้จริงๆ เหรอ?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchOrders();
    } catch (err) { alert("ลบไม่สำเร็จมึง"); }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`ยืนยันการเปลี่ยนสถานะเป็น ${newStatus} ใช่ไหม?`)) return;
    try {
      await axios.patch(`http://localhost:4000/api/orders/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchOrders();
    } catch (err) { alert("อัปเดตสถานะไม่สำเร็จ"); }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '25px', fontWeight: 'bold', color: '#333' }}>📦 จัดการคำสั่งซื้อ ({orders.length})</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {orders.map((order) => (
          <div key={order._id} style={{ padding: '25px', border: 'none', borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#aaa', letterSpacing: '1px' }}>ORDER ID</span>
                <p style={{ fontWeight: 'bold', margin: 0, color: '#444' }}>{order._id}</p>
              </div>
              <span style={{ 
                backgroundColor: order.status === 'paid' ? '#d4edda' : order.status === 'cancelled' ? '#f8d7da' : '#fff3cd', 
                color: order.status === 'paid' ? '#155724' : order.status === 'cancelled' ? '#721c24' : '#856404', 
                padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
              }}>
                {order.status}
              </span>
            </div>

            <div style={{ backgroundColor: '#f9f9f9', borderRadius: '12px', padding: '15px', marginBottom: '15px' }}>
              <p style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', color: '#666' }}>รายการต้นไม้ที่สั่ง:</p>
              
              {order.items?.map((item: any, idx: number) => {
                // 🔍 2. ค้นหาข้อมูลสินค้าจากไฟล์ products
                // ต้องเช็คว่า productId ใน DB เป็น String หรือ Number (ถ้าใน data.ts เป็น Number ต้องใช้ Number(item.productId))
                const pInfo = products.find((p) => String(p.id) === String(item.productId));

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', borderBottom: idx !== order.items.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '10px' }}>
                    <img 
                      // 📸 3. แสดงรูปจาก pInfo ถ้าไม่มีให้ใช้รูปเดิมใน item หรือ placeholder
                      src={pInfo?.img || item.productId?.img || 'https://via.placeholder.com/50?text=Plant'} 
                      alt="plant" 
                      style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #eee' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#333' }}>
                        {/* 🌿 4. แสดงชื่อจากไฟล์ข้อมูล (pInfo) */}
                        {pInfo ? pInfo.name : (item.productId?.name || `สินค้าไอดี: ${item.productId}`)}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>
                        จำนวน: {item.qty} ชิ้น | ราคาต่อหน่วย: ฿{item.unitPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '13px', color: '#555' }}>
                <p style={{ margin: '3px 0' }}>👤 ลูกค้า: <b>{order.userId?.username || 'ไม่ทราบชื่อ'}</b></p>
                <p style={{ margin: '3px 0' }}>📍 ที่อยู่: <span style={{ color: '#888' }}>{order.shippingAddress || 'ยังไม่ระบุที่อยู่'}</span></p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>ยอดรวมสุทธิ</p>
                <p style={{ fontSize: '24px', color: '#00B171', fontWeight: '900', margin: 0 }}>฿{order.total?.toLocaleString()}</p>
              </div>
            </div>

            <hr style={{ margin: '20px 0', border: '0', borderTop: '1px solid #f0f0f0' }} />

            <div style={{ display: 'flex', gap: '12px' }}>
              {order.status === 'pending' ? (
                <button 
                  onClick={() => handleUpdateStatus(order._id, 'paid')}
                  style={{ flex: 2, padding: '12px', backgroundColor: '#00B171', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ✅ ยืนยันการชำระเงิน
                </button>
              ) : (
                <div style={{ flex: 2, padding: '12px', textAlign: 'center', backgroundColor: '#f1f3f5', color: '#adb5bd', borderRadius: '10px' }}>
                  {order.status === 'paid' ? '✨ ชำระเงินเรียบร้อยแล้ว' : '❌ ยกเลิกแล้ว'}
                </div>
              )}
              <button 
                onClick={() => handleDelete(order._id)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#ff6b6b', border: '1px solid #ff6b6b', borderRadius: '10px' }}
              >
                ลบทิ้ง
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;