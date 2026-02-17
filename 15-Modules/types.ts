// =============================================
// 型別匯出 — 這些編譯後會被完全移除
// =============================================

export type User = {
  id: number;
  name: string;
  email: string;
};

export interface Product {
  id: number;
  name: string;
  price: number;
}

export type Role = "admin" | "editor" | "viewer";

export interface ApiResponse<T> {
  status: number;
  data: T;
  error: string | null;
}
