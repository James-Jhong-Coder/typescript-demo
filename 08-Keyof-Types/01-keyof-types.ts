// ============================================
// Keyof Type Operator — keyof 型別運算子 範例
// ============================================

// --------------------------------------------------
// 1. 基本用法
// --------------------------------------------------

type Point = { x: number; y: number };

type P = keyof Point;
// 等同於 type P = "x" | "y"

let key1: P = "x"; // ✅
let key2: P = "y"; // ✅
// let key3: P = "z"; // ❌ Error: Type '"z"' is not assignable to type '"x" | "y"'

console.log(key1); // "x"
console.log(key2); // "y"

// --------------------------------------------------
// 2. 搭配 Index Signatures
// --------------------------------------------------

// number 索引簽名 → keyof 為 number
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

// string 索引簽名 → keyof 為 string | number
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
// 因為 JS 中 obj[0] === obj["0"]，所以 number 也算合法的 key

// 驗證型別
const aKey: A = 0;       // ✅ number
const mKey1: M = "test"; // ✅ string
const mKey2: M = 42;     // ✅ number（也可以）

console.log(aKey, mKey1, mKey2);

// --------------------------------------------------
// 3. 搭配 Generics — 型別安全的屬性存取
// --------------------------------------------------

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, city: "Taipei" };

console.log(getProperty(person, "name"));  // "Alice"  — 型別: string
console.log(getProperty(person, "age"));   // 30       — 型別: number
console.log(getProperty(person, "city"));  // "Taipei" — 型別: string
// getProperty(person, "email");           // ❌ Error: "email" 不在 keyof person 中

// --------------------------------------------------
// 4. 搭配 typeof 對實際值取 key
// --------------------------------------------------

const config = {
  host: "localhost",
  port: 3000,
  debug: true,
};

type ConfigKeys = keyof typeof config;
// type ConfigKeys = "host" | "port" | "debug"

function getConfig(key: ConfigKeys) {
  return config[key];
}

console.log(getConfig("host"));  // "localhost"
console.log(getConfig("port"));  // 3000
console.log(getConfig("debug")); // true
// getConfig("url");              // ❌ Error

// --------------------------------------------------
// 5. 型別安全的 pick 函式
// --------------------------------------------------

function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const user = { name: "Alice", age: 30, email: "alice@example.com" };
const nameAndAge = pick(user, ["name", "age"]);
console.log(nameAndAge); // { name: "Alice", age: 30 }
// pick(user, ["name", "job"]); // ❌ Error: "job" 不在 keyof user 中

// --------------------------------------------------
// 6. 型別安全的 Object.keys 包裝
// --------------------------------------------------

function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const point: Point = { x: 10, y: 20 };
const pointKeys = typedKeys(point);
// pointKeys 的型別: ("x" | "y")[]

console.log(pointKeys); // ["x", "y"]

// 可以安全地用來遍歷物件
pointKeys.forEach((key) => {
  console.log(`${key}: ${point[key]}`);
  // key 的型別是 "x" | "y"，所以 point[key] 是安全的
});

// --------------------------------------------------
// 7. keyof 與聯合型別 / 交叉型別
// --------------------------------------------------

type ShapeA = { x: number; y: number };
type ShapeB = { y: number; z: number };

// 聯合型別的 keyof — 取交集（共有的 key）
type KeyOfUnion = keyof (ShapeA | ShapeB);
// type KeyOfUnion = "y"

const unionKey: KeyOfUnion = "y"; // ✅
// const unionKey2: KeyOfUnion = "x"; // ❌ x 不是共有的

// 交叉型別的 keyof — 取聯集（所有的 key）
type KeyOfIntersection = keyof (ShapeA & ShapeB);
// type KeyOfIntersection = "x" | "y" | "z"

const interKey1: KeyOfIntersection = "x"; // ✅
const interKey2: KeyOfIntersection = "y"; // ✅
const interKey3: KeyOfIntersection = "z"; // ✅

console.log(unionKey);                          // "y"
console.log(interKey1, interKey2, interKey3);   // "x" "y" "z"

// --------------------------------------------------
// 8. 實用範例：型別安全的事件系統
// --------------------------------------------------

interface Events {
  click: { x: number; y: number };
  focus: { target: string };
  blur: { target: string };
}

// K extends keyof Events 確保只能監聽已定義的事件
function on<K extends keyof Events>(event: K, callback: (data: Events[K]) => void) {
  // 模擬事件處理
  console.log(`已註冊事件: ${event}`);
}

on("click", (data) => {
  // data 的型別自動推斷為 { x: number; y: number }
  console.log(`點擊位置: ${data.x}, ${data.y}`);
});

on("focus", (data) => {
  // data 的型別自動推斷為 { target: string }
  console.log(`聚焦: ${data.target}`);
});

// on("hover", () => {}); // ❌ Error: "hover" 不在 keyof Events 中

// --------------------------------------------------
// 9. 進階：用 keyof 建立型別安全的 setter
// --------------------------------------------------

function setValue<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

const settings = {
  theme: "dark",
  fontSize: 16,
  autoSave: true,
};

setValue(settings, "theme", "light");     // ✅ value 必須是 string
setValue(settings, "fontSize", 20);       // ✅ value 必須是 number
setValue(settings, "autoSave", false);    // ✅ value 必須是 boolean
// setValue(settings, "theme", 123);      // ❌ Error: number 不能指派給 string
// setValue(settings, "fontSize", "big"); // ❌ Error: string 不能指派給 number

console.log(settings); // { theme: "light", fontSize: 20, autoSave: false }
