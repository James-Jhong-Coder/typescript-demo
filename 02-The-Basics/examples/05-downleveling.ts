// 範例：降級（Downleveling）
// 試試看用不同的 target 編譯，觀察輸出的差異
//
// 預設（ES3）：tsc 05-downleveling.ts && cat 05-downleveling.js
//   → 模板字串會被轉換成 .concat()
//
// ES2015：tsc --target es2015 05-downleveling.ts && cat 05-downleveling.js
//   → 模板字串會被保留
//
// 執行：node 05-downleveling.js

const person: string = "Alice";
const age: number = 30;

console.log(`${person} is ${age} years old.`);
console.log(`Next year, ${person} will be ${age + 1}.`);
