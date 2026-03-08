import React, { useEffect, useState } from 'react';

import api from "../../lib/api";

interface Product {
  _id: string;
  id: number;
  name: string;
  price: number;
  img: string;
  tag: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [formData, setFormData] = useState({ name: '', price: '', img: '', tag: 'ทั่วไป' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddClick = () => {
    setIsEditMode(false);
    setFormData({ name: '', price: '', img: '', tag: 'ทั่วไป' });
    setIsModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setIsEditMode(true);
    setCurrentId(product._id);
    setFormData({ name: product.name, price: String(product.price), img: product.img, tag: product.tag });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const baseUrl = "/products";
    const payload = {
      id: isEditMode ? undefined : Math.floor(Math.random() * 10000) + 100,
      name: formData.name,
      price: Number(formData.price),
      imageUrl: formData.img,
      tag: formData.tag || "ทั่วไป",
      description: "สินค้าใหม่จากระบบผู้ดูแล",
      stock: 10
    };

    try {
      if (isEditMode) {
        const productToEdit = products.find(p => p._id === currentId);
        if (!productToEdit) return;
        await api.patch(`${baseUrl}/${productToEdit.id}`, payload);
        alert("🎉 แก้ไขข้อมูลสำเร็จ!");
      } else {
        await api.post(baseUrl, payload);
        alert("🚀 เพิ่มสินค้าใหม่แล้ว!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ติดต่อแอดมินระบบ"));
    }
  };

  const handleDelete = async (numericId: number, name: string) => {
    if (window.confirm(`ยืนยันการลบสินค้า "${name}"?`)) {
      try {
        await api.delete(`/products/${numericId}`);
        fetchProducts();
      } catch (err) {
        alert("ลบไม่สำเร็จมึง!");
      }
    }
  };

  // Helper สำหรับสีของ Tag
  const getTagStyle = (tag: string) => {
    switch(tag) {
      case 'ยอดนิยม': return { bg: '#FFF9E6', color: '#D4A017' };
      case 'แนะนำ': return { bg: '#E6F4FF', color: '#1890FF' };
      default: return { bg: '#F5F5F5', color: '#666' };
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>正在加载... (กำลังโหลด...)</div>;

  return (
    <div>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>🌿 จัดการสินค้าคลัง</h2>
          <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>คุณมีสินค้าทั้งหมด {products.length} รายการในระบบ</p>
        </div>
        <button
          onClick={handleAddClick}
          style={{
            padding: '12px 24px',
            backgroundColor: '#00B171',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,177,113,0.2)',
            transition: '0.3s'
          }}
        >
          + เพิ่มต้นไม้ใหม่
        </button>
      </div>

      {/* Table Container */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#FAFAFA', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '18px', textAlign: 'left', color: '#666', fontWeight: 600 }}>รูปสินค้า</th>
              <th style={{ padding: '18px', textAlign: 'left', color: '#666', fontWeight: 600 }}>ชื่อสินค้า</th>
              <th style={{ padding: '18px', textAlign: 'left', color: '#666', fontWeight: 600 }}>แท็ก</th>
              <th style={{ padding: '18px', textAlign: 'left', color: '#666', fontWeight: 600 }}>ราคา</th>
              <th style={{ padding: '18px', textAlign: 'center', color: '#666', fontWeight: 600 }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const tagStyle = getTagStyle(p.tag);
              return (
                <tr key={p._id} className="table-row" style={{ borderBottom: '1px solid #f9f9f9', transition: '0.2s' }}>
                  <td style={{ padding: '15px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>
                  <td style={{ padding: '15px', fontWeight: 500, color: '#333' }}>{p.name}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '12px', 
                      backgroundColor: tagStyle.bg, 
                      color: tagStyle.color,
                      fontWeight: 600
                    }}>
                      {p.tag}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: '#00B171' }}>฿{p.price.toLocaleString()}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <button onClick={() => handleEditClick(p)} style={{ background: '#E6F7EF', color: '#00B171', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontWeight: 600 }}>แก้ไข</button>
                    <button onClick={() => handleDelete(p.id, p.name)} style={{ background: '#FFF1F0', color: '#FF4D4F', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>ลบ</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modern Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '22px', textAlign: 'center' }}>{isEditMode ? '📝 แก้ไขข้อมูลต้นไม้' : '🌱 เพิ่มต้นไม้ใหม่'}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>ชื่อสินค้า</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none' }} placeholder="เช่น มอนสเตอร่า..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>ราคา (บาท)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>แท็ก</label>
                <select value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}>
                  <option value="ทั่วไป">ทั่วไป</option>
                  <option value="ยอดนิยม">ยอดนิยม</option>
                  <option value="แนะนำ">แนะนำ</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#555' }}>URL รูปภาพ</label>
              <input value={formData.img} onChange={(e) => setFormData({ ...formData, img: e.target.value })} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} placeholder="https://..." />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 2, padding: '14px', backgroundColor: '#00B171', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>บันทึกข้อมูล</button>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '14px', backgroundColor: '#f0f0f0', color: '#666', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>ยกเลิก</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;