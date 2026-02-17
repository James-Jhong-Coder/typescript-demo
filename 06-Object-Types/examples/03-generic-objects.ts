// 範例：泛型物件型別 & ReadonlyArray
// 執行方式：tsc --strict 03-generic-objects.ts && node 03-generic-objects.js

// === 泛型物件 ===
interface Box<T> {
  contents: T;
}

const stringBox: Box<string> = { contents: "TypeScript" };
const numberBox: Box<number> = { contents: 42 };
const boolBox: Box<boolean> = { contents: true };

console.log(`stringBox: ${stringBox.contents.toUpperCase()}`);
console.log(`numberBox: ${numberBox.contents.toFixed(2)}`);
console.log(`boolBox: ${boolBox.contents}`);

// === 泛型搭配函式 ===
function unbox<T>(box: Box<T>): T {
  return box.contents;
}

const value = unbox(stringBox); // TypeScript 推斷 value 是 string
console.log(`\nunboxed: ${value}`);

// === 組合泛型 ===
type OrNull<T> = T | null;
type OneOrMany<T> = T | T[];

function processItems<T>(items: OneOrMany<OrNull<T>>) {
  const arr = Array.isArray(items) ? items : [items];
  for (const item of arr) {
    if (item !== null) {
      console.log(`item: ${item}`);
    } else {
      console.log("item: null (skipped)");
    }
  }
}

console.log("\n--- processItems ---");
processItems("hello");
processItems(["a", null, "c"]);

// === ReadonlyArray ===
function printNames(names: readonly string[]) {
  // names.push("new"); // ❌ Property 'push' does not exist on type 'readonly string[]'
  for (const name of names) {
    console.log(`  ${name}`);
  }
}

console.log("\n--- readonly array ---");
printNames(["Alice", "Bob", "Charlie"]);
