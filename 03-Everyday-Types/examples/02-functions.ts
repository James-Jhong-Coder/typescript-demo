// 範例：函式型別
// 執行方式：tsc 02-functions.ts && node 02-functions.js

// --- 參數型別註記 ---
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}

greet("Alice");
// greet(42); // ❌ Argument of type 'number' is not assignable to parameter of type 'string'

// --- 回傳型別註記 ---
function add(a: number, b: number): number {
  return a + b;
}

console.log(`3 + 5 = ${add(3, 5)}`);

// --- 上下文推斷（Contextual Typing） ---
const names = ["Alice", "Bob", "Eve"];

// TypeScript 自動推斷 s 是 string，不需要手動標註
names.forEach((s) => {
  console.log(`${s} → ${s.toUpperCase()}`);
});

// --- 箭頭函式 ---
const multiply = (a: number, b: number): number => a * b;
console.log(`4 * 7 = ${multiply(4, 7)}`);
