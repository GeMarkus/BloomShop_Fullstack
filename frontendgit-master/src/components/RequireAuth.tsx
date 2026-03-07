// src/components/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

type Props = { children: React.ReactElement };

const RequireAuth: React.FC<Props> = ({ children }) => {
  // ปรับ logic ให้ตรงกับที่คุณเก็บ token
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // ถ้ายังไม่ล็อกอิน → ส่งกลับหน้าแรก (หรือ /register ก็ได้)
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  return children;
};

export default RequireAuth;
