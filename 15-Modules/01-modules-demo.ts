// =============================================
// Modules Demo — 模組匯入匯出示範
// =============================================

// --- 1. Named Import — 具名匯入 ---

import { add, subtract, PI } from "./math";

console.log(add(1, 2));      // 3
console.log(subtract(10, 3)); // 7
console.log(PI);               // 3.14159

// --- 2. 重新命名（as） ---

import { multiply as mul } from "./math";

console.log(mul(3, 4)); // 12

// --- 3. Namespace Import — 整個模組匯入 ---

import * as math from "./math";

console.log(math.add(5, 6));  // 11
console.log(math.PI);          // 3.14159

// --- 4. Default Import ---

import greet from "./greeting";
// default import 不用大括號，名字可以自訂
console.log(greet("TypeScript")); // "Hello, TypeScript!"

// default + named 同時匯入
import myGreet, { farewell } from "./greeting";
console.log(myGreet("World"));    // "Hello, World!"
console.log(farewell("World"));   // "Goodbye, World!"

// --- 5. import type — 只匯入型別 ---

import type { User, Product, ApiResponse } from "./types";

// ✅ 用在型別位置
const user: User = { id: 1, name: "Alice", email: "alice@example.com" };
const product: Product = { id: 1, name: "Book", price: 299 };

const response: ApiResponse<User> = {
  status: 200,
  data: user,
  error: null,
};

console.log(response);

// ❌ import type 匯入的不能用在值的位置
// const u = new User(); // Error

// --- 6. Inline type import — 混合匯入 ---

import { UserService, type UserDTO } from "./user-service";
//                      ^^^^
//                      只有 UserDTO 是 type-only

const service = new UserService();       // ✅ 值可以使用
const users: UserDTO[] = service.getAll(); // ✅ 型別可以使用
console.log(users);

// --- 7. 從 barrel file 統一匯入 ---

// 透過 index.ts 統一入口匯入
// import { add, greet, UserService } from "./index";
// import type { User, Product } from "./index";

// --- 8. Dynamic Import — 動態匯入 ---

async function loadMath() {
  // 動態 import 回傳 Promise
  const mathModule = await import("./math");
  console.log(mathModule.add(100, 200)); // 300
}

loadMath();

// 實際應用：根據條件動態載入
async function loadFeature(feature: string) {
  switch (feature) {
    case "math":
      return await import("./math");
    case "greeting":
      return await import("./greeting");
    default:
      throw new Error(`Unknown feature: ${feature}`);
  }
}

// --- 9. typeof import — 取得模組型別 ---

type MathModule = typeof import("./math");
// MathModule = {
//   add: (a: number, b: number) => number;
//   subtract: (a: number, b: number) => number;
//   multiply: (a: number, b: number) => number;
//   PI: number;
// }

// --- 10. export 的各種寫法彙整 ---

// 宣告時直接匯出
export const myValue = 42;
export function myFunction() { return "hello"; }
export type MyType = { x: number };
export interface MyInterface { y: string; }

// 先宣告，再統一匯出
const a = 1;
const b = 2;
type C = string;
export { a, b, type C };

// 重新命名後匯出
export { a as valueA, b as valueB };

// --- 11. 萬用字元模組宣告（通常寫在 .d.ts 中） ---

// declare module "*.css" {
//   const content: Record<string, string>;
//   export default content;
// }

// declare module "*.png" {
//   const src: string;
//   export default src;
// }

// 使用：
// import styles from "./app.css";
// import logo from "./logo.png";
