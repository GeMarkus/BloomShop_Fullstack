// src/common/jwt.util.ts
import type { SignOptions } from 'jsonwebtoken';

/** รับค่าจาก ENV แล้วแปลงให้ตรง type ของ jsonwebtoken */
export function resolveExpires(v?: string): SignOptions['expiresIn'] {
  if (!v || !v.trim()) return '7d'; // default
  const n = Number(v);
  return Number.isFinite(n) ? n : (v as SignOptions['expiresIn']);
}