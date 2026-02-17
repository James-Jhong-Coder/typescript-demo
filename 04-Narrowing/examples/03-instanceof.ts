// 範例：instanceof 縮小 & 賦值縮小
// 執行方式：tsc --strict 03-instanceof.ts && node 03-instanceof.js

// === instanceof narrowing ===
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(`Date: ${x.toUTCString()}`);
  } else {
    console.log(`String: ${x.toUpperCase()}`);
  }
}

logValue(new Date());
logValue("hello world");

// === 賦值縮小（Assignment Narrowing） ===
let x: string | number;

x = "hello";
console.log(`x 是 string: ${x.toUpperCase()}`); // TypeScript 知道是 string

x = 42;
console.log(`x 是 number: ${x.toFixed(2)}`); // TypeScript 知道是 number

// x = true; // ❌ Type 'boolean' is not assignable to type 'string | number'
