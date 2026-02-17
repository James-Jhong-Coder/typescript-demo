// 範例：函式重載（Function Overloads）
// 執行方式：tsc --strict 04-function-overloads.ts && node 04-function-overloads.js

// === 函式重載 ===
// 重載簽名（呼叫者看到的）
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// 實作簽名（呼叫者看不到）
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp - 1, d); // month 是 0-based
  } else {
    return new Date(mOrTimestamp);
  }
}

const d1 = makeDate(1700000000000);
const d2 = makeDate(2, 16, 2026);
// const d3 = makeDate(1, 3); // ❌ 沒有匹配的重載

console.log(`從 timestamp: ${d1.toLocaleDateString()}`);
console.log(`從 m/d/y:     ${d2.toLocaleDateString()}`);

// === 用聯合型別取代重載（更推薦） ===
function formatInput(input: string | number): string {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}

console.log(`\n格式化字串: ${formatInput("hello")}`);
console.log(`格式化數字: ${formatInput(3.14159)}`);
