// 範例：tsc 編譯器 & 明確的型別（Explicit Types）
// 執行方式：tsc 01-greet.ts && node 01-greet.js

function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
