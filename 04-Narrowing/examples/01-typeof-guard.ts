// 範例：typeof 型別守衛 & 真值縮小
// 執行方式：tsc --strict 01-typeof-guard.ts && node 01-typeof-guard.js

// --- typeof narrowing ---
function padLeft(padding: number | string, input: string): string {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}

console.log(padLeft(4, "Hello"));    // "    Hello"
console.log(padLeft(">> ", "Hello")); // ">> Hello"

// --- Truthiness narrowing ---
function printAll(strs: string | string[] | null) {
  // 用 strs && 排除 null
  if (strs && typeof strs === "object") {
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    console.log(strs);
  } else {
    console.log("沒有值");
  }
}

console.log("--- 陣列 ---");
printAll(["Alice", "Bob", "Charlie"]);

console.log("--- 字串 ---");
printAll("Hello");

console.log("--- null ---");
printAll(null);
