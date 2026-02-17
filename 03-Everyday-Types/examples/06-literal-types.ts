// 範例：字面值型別（Literal Types）& as const
// 執行方式：tsc --strict 06-literal-types.ts && node 06-literal-types.js

// --- 字串字面值型別 ---
function printText(s: string, alignment: "left" | "right" | "center") {
  console.log(`[${alignment}] ${s}`);
}

printText("Hello", "left");
printText("World", "center");
// printText("!", "top"); // ❌ Argument of type '"top"' is not assignable

// --- 數字字面值型別 ---
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}

console.log(`compare("a", "b") = ${compare("a", "b")}`);  // -1
console.log(`compare("b", "a") = ${compare("b", "a")}`);  //  1
console.log(`compare("a", "a") = ${compare("a", "a")}`);  //  0

// --- boolean 字面值 ---
type YesOrNo = true | false; // 其實就等於 boolean

// --- as const ---
// 沒有 as const，method 會被推斷為 string
const req1 = { url: "https://example.com", method: "GET" };
console.log(`req1.method 是一般的 string`);

// 有 as const，method 會被推斷為 "GET"（字面值型別）
const req2 = { url: "https://example.com", method: "GET" } as const;
console.log(`req2.method 是字面值 "GET"`);

// 實際用途：搭配需要字面值型別的函式
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(url: string, method: HttpMethod) {
  console.log(`${method} ${url}`);
}

// makeRequest(req1.url, req1.method); // ❌ string 不能賦值給 HttpMethod
makeRequest(req2.url, req2.method);    // ✅ "GET" 可以賦值給 HttpMethod
