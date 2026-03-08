// src/main.tsx
import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Payment from "./components/Payment";
import { products as initialProducts } from "./lib/data";
import { loadLocalStorage, useLocalStorage } from "./hooks/useLocalStorage";
import type { Cart } from "./lib/types";
import PlantDictionary from "./components/PlantDictionary";
import "./index.css";
import Delivery from "./components/Delivery";
import Register from "./components/Register";
import OrderHistory from "./components/OrderHistory";
import RequireAuth from "./components/RequireAuth";
import AdminDashboard from "./components/admin/AdminDashboard";
import RequireAdmin from "./components/RequireAdmin";


// eslint-disable-next-line react-refresh/only-export-components
function RootRoutes() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cart] = useState<Cart>(() =>
    loadLocalStorage<Cart>("cart", {})
  );
  useLocalStorage("cart", cart);

  const productList = useMemo(() => initialProducts, []);

  return (
    <Routes>
      <Route path="/*" element={<App />} />
      <Route
        path="/payment"
        element={<Payment cart={cart} products={productList} />}
      />
      <Route path="/dictionary" element={<PlantDictionary />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/app" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/orders" element={<RequireAuth><OrderHistory /></RequireAuth>}/>
      <Route element={<RequireAdmin />}>
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Route>



      {/* เส้นทางอื่น ๆ ที่ไม่ต้องใช้ props ใส่เพิ่มได้ */}
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <RootRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
