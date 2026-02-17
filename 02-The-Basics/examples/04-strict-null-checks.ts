// 範例：strictNullChecks
// 開啟嚴格模式後，必須明確處理 null 和 undefined
// 執行方式：tsc --strict 04-strict-null-checks.ts && node 04-strict-null-checks.js

function doSomething(x: string | null) {
  if (x === null) {
    console.log("收到 null，不做任何事");
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}

doSomething("TypeScript");  // Hello, TYPESCRIPT
doSomething(null);          // 收到 null，不做任何事

// --- 另一個範例：可選參數 ---
function printLength(str?: string) {
  if (str !== undefined) {
    console.log(`字串長度: ${str.length}`);
  } else {
    console.log("沒有提供字串");
  }
}

printLength("hello");   // 字串長度: 5
printLength();          // 沒有提供字串
