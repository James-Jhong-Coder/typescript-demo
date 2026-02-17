// 範例：泛型函式（Generic Functions）
// 執行方式：tsc --strict 02-generics.ts && node 02-generics.js

// === 基本泛型 ===
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // string | undefined
const n = firstElement([1, 2, 3]);       // number | undefined

console.log(`第一個字串: ${s}`);
console.log(`第一個數字: ${n}`);

// === 多個型別參數 + 推斷 ===
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

const parsed = map(["1", "2", "3"], (n) => parseInt(n));
console.log(`字串轉數字: ${parsed}`); // [1, 2, 3]

const lengths = map(["hello", "hi", "hey"], (s) => s.length);
console.log(`字串長度: ${lengths}`); // [5, 2, 3]

// === 約束（Constraints） ===
function longest<Type extends { length: number }>(a: Type, b: Type): Type {
  return a.length >= b.length ? a : b;
}

console.log(`\n較長的陣列: ${longest([1, 2], [1, 2, 3])}`);
console.log(`較長的字串: ${longest("alice", "bob")}`);
// longest(10, 100); // ❌ number 沒有 length 屬性

// === 泛型實用範例：鍵值存取 ===
function getProperty<Obj, Key extends keyof Obj>(obj: Obj, key: Key) {
  return obj[key];
}

const person = { name: "Alice", age: 30, city: "Taipei" };
console.log(`\nname: ${getProperty(person, "name")}`);
console.log(`age: ${getProperty(person, "age")}`);
// getProperty(person, "email"); // ❌ "email" 不在 person 的 key 裡
