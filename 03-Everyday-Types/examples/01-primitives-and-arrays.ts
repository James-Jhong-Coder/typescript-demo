// 範例：原始型別 & 陣列
// 執行方式：tsc 01-primitives-and-arrays.ts && node 01-primitives-and-arrays.js

// --- 原始型別（Primitives） ---
let userName: string = "Alice";
let age: number = 30;
let isStudent: boolean = true;

console.log(`名字: ${userName}`);
console.log(`年齡: ${age}`);
console.log(`是否為學生: ${isStudent}`);

// --- 陣列（Arrays） ---
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

console.log(`數字陣列: ${numbers}`);
console.log(`名字陣列: ${names}`);

// 陣列方法也會有型別檢查
numbers.push(6);        // ✅
// numbers.push("hello"); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'

console.log(`push 後: ${numbers}`);
