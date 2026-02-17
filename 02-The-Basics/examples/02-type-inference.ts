// 範例：型別推斷（Type Inference）
// TypeScript 會自動推斷變數的型別，不需要手動標註
// 執行方式：tsc 02-type-inference.ts && node 02-type-inference.js

let msg = "hello there!"; // TypeScript 推斷為 string
let count = 42;           // TypeScript 推斷為 number
let isActive = true;      // TypeScript 推斷為 boolean

console.log(`msg 的值: ${msg}`);
console.log(`count 的值: ${count}`);
console.log(`isActive 的值: ${isActive}`);

// 如果你嘗試賦值錯誤的型別，TypeScript 會報錯：
// msg = 123;  // ❌ Type 'number' is not assignable to type 'string'
