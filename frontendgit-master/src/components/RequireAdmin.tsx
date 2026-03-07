// src/components/RequireAdmin.tsx
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireAdmin() {
  // ดึงข้อมูล user จาก localStorage (หรือถ้าคุณใช้ Context/Zustand ให้เปลี่ยนไปใช้ hook ของคุณแทนนะครับ)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 1. ถ้ายังไม่ได้ Login ให้เด้งไปหน้าแรก
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. ถ้า Login แล้ว แต่ไม่ใช่ admin ให้เด้งไปหน้าแรก
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />; // หรือจะเด้งไปหน้า 403 / 404 ก็ได้
  }

  // 3. ถ้าเป็น admin ให้ผ่านเข้าไปดูข้างใน (Outlet) ได้
  return <Outlet />;
}