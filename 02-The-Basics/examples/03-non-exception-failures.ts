// 範例：非例外失敗（Non-Exception Failures）
// TypeScript 會抓到 JavaScript 不會報錯的問題
// 執行方式：tsc 03-non-exception-failures.ts && node 03-non-exception-failures.js

const user = {
  name: "Daniel",
  age: 26,
};

console.log(user.name);
console.log(user.age);

// 以下這行如果取消註解，tsc 會報錯：
// console.log(user.location);
// ❌ Property 'location' does not exist on type '{ name: string; age: number; }'

// --- 拼寫錯誤 ---
const announcement = "Hello World!";
console.log(announcement.toLocaleLowerCase()); // ✅ 正確寫法

// 以下這行如果取消註解，tsc 會報錯：
// announcement.toLocaleLowercase();
// ❌ Did you mean 'toLocaleLowerCase'?

// --- 未呼叫的函式 ---
function flipCoin() {
  return Math.random() < 0.5; // ✅ 正確：Math.random() 要加括號
}

console.log(`擲硬幣結果: ${flipCoin() ? "正面" : "反面"}`);
