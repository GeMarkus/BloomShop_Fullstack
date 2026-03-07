import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
}

const AdminUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null); // เก็บข้อมูลตัวที่จะแก้ไข
  const [formData, setFormData] = useState({ username: '', email: '', phone: '' });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("ดึงข้อมูลพลาด");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ฟังก์ชันกดปุ่ม "แก้ไข"
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({ username: user.username, email: user.email, phone: user.phone });
  };

  // ฟังก์ชันส่งข้อมูลไป Update ใน DB
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await axios.patch(`http://localhost:4000/api/users/${editingUser._id}`, formData);
      alert("อัปเดตข้อมูลสำเร็จ!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert("อัปเดตไม่สำเร็จว่ะมึง");
    }
  };

  // พิ่มฟังก์ชันสำหรับลบ
  const handleDelete = async (id: string, username: string) => {
    if (window.confirm(`มึงแน่ใจนะว่าจะลบคุณ ${username}?`)) {
      try {
        // เรียกไปที่ DELETE /api/users/:id
        await axios.delete(`http://localhost:4000/api/users/${id}`);
        alert("ลบเรียบร้อยแล้วมึง!");
        fetchUsers(); // ดึงข้อมูลใหม่มาโชว์ทันที
      } catch (err) {
        alert("ลบไม่สำเร็จว่ะ มีอะไรพังแน่ๆ");
      }
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <h2>จัดการรายชื่อผู้ใช้งาน ({users.length} คน)</h2>
      
      {/* ส่วนของตารางข้อมูล */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '15px', textAlign: 'left' }}>ชื่อผู้ใช้</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>อีเมล</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>เบอร์โทรศัพท์</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>วันที่สมัคร</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '15px' }}>
                  <div style={{ fontWeight: 'bold' }}>{user.username}</div>
                  <small style={{ color: '#888' }}>ID: {user._id}</small>
                </td>
                <td style={{ padding: '15px' }}>{user.email}</td>
                <td style={{ padding: '15px' }}>{user.phone}</td>
                <td style={{ padding: '15px' }}>{new Date(user.createdAt).toLocaleDateString('th-TH')}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button 
                    onClick={() => handleEditClick(user)}
                    style={{ color: '#00B171', border: '1px solid #00B171', background: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    แก้ไข
                  </button>
                  <button 
                    onClick={() => handleDelete(user._id, user.username)} // 🌟 ปุ่มลบที่มึงขอ!
                    style={{ color: '#d9534f', border: '1px solid #d9534f', background: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🌟 Simple Modal สำหรับแก้ไขข้อมูล */}
      {editingUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleUpdate} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '400px' }}>
            <h3>แก้ไขข้อมูลคุณ {editingUser.username}</h3>
            <div style={{ marginBottom: '15px' }}>
              <label>ชื่อผู้ใช้:</label>
              <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>อีเมล:</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label>เบอร์โทรศัพท์:</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" onClick={() => setEditingUser(null)} style={{ padding: '8px 15px', cursor: 'pointer' }}>ยกเลิก</button>
              <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#00B171', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>บันทึก</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminUser;