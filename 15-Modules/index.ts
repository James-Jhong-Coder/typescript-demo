// =============================================
// Re-export — barrel file（統一匯出入口）
// =============================================

// 從各個模組 re-export
export { add, subtract, multiply, PI } from "./math";
export { default as greet, farewell } from "./greeting";
export { UserService } from "./user-service";

// 只 re-export 型別
export type { User, Product, Role, ApiResponse } from "./types";
export type { UserDTO } from "./user-service";
