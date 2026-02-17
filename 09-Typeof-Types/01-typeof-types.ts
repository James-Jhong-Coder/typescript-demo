// ============================================
// Typeof Type Operator — typeof 型別運算子 範例
// ============================================

// --------------------------------------------------
// 1. JavaScript typeof vs TypeScript typeof
// --------------------------------------------------

// JavaScript 的 typeof（執行時，回傳字串）
console.log(typeof "hello");    // "string"
console.log(typeof 42);         // "number"
console.log(typeof true);       // "boolean"
console.log(typeof undefined);  // "undefined"

// TypeScript 的 typeof（型別層級，編譯時使用）
let s = "hello";
let n: typeof s;
// n 的型別是 string（從 s 推導出來）

n = "world"; // ✅
// n = 123;  // ❌ Error: Type 'number' is not assignable to type 'string'

// --------------------------------------------------
// 2. 搭配物件 — 從值推導型別
// --------------------------------------------------

const config = {
  host: "localhost",
  port: 3000,
  debug: true,
};

// 從值推導出完整的型別，不用手動寫 interface
type Config = typeof config;
// 等同於:
// type Config = {
//   host: string;
//   port: number;
//   debug: boolean;
// }

// 可以用這個型別來宣告新的變數
const anotherConfig: Config = {
  host: "192.168.1.1",
  port: 8080,
  debug: false,
};

console.log(anotherConfig);

// --------------------------------------------------
// 3. 搭配函式 — 取得函式型別簽名
// --------------------------------------------------

function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

type GreetFn = typeof greet;
// type GreetFn = (name: string, age: number) => string

// 用這個型別來宣告另一個相同簽名的函式
const greetChinese: GreetFn = (name, age) => {
  return `你好，${name}！你 ${age} 歲了。`;
};

console.log(greet("Alice", 25));          // "Hello, Alice! You are 25 years old."
console.log(greetChinese("小明", 25));     // "你好，小明！你 25 歲了。"

// --------------------------------------------------
// 4. 搭配 ReturnType 和 Parameters
// --------------------------------------------------

// ReturnType — 取得函式回傳型別
type GreetReturn = ReturnType<typeof greet>;
// type GreetReturn = string

// Parameters — 取得函式參數型別（tuple）
type GreetParams = Parameters<typeof greet>;
// type GreetParams = [name: string, age: number]

// 實際應用：建立一個 wrapper 函式
function logAndCall(...args: Parameters<typeof greet>): ReturnType<typeof greet> {
  console.log("呼叫 greet，參數:", args);
  return greet(...args);
}

console.log(logAndCall("Bob", 30)); // "Hello, Bob! You are 30 years old."

// --------------------------------------------------
// 5. 搭配 keyof — 從值取 key type
// --------------------------------------------------

const routes = {
  home: "/",
  about: "/about",
  contact: "/contact",
};

type RouteName = keyof typeof routes;
// type RouteName = "home" | "about" | "contact"

function navigate(route: RouteName) {
  console.log(`導航到 ${routes[route]}`);
}

navigate("home");     // 導航到 /
navigate("about");    // 導航到 /about
navigate("contact");  // 導航到 /contact
// navigate("login"); // ❌ Error: "login" 不在 "home" | "about" | "contact" 中

// --------------------------------------------------
// 6. 搭配 enum
// --------------------------------------------------

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

// keyof typeof 取得 enum 的 key 名稱
type LogLevelKey = keyof typeof LogLevel;
// type LogLevelKey = "DEBUG" | "INFO" | "WARN" | "ERROR"

function setLogLevel(level: LogLevelKey) {
  console.log(`設定 log level: ${level} = ${LogLevel[level as keyof typeof LogLevel]}`);
}

setLogLevel("DEBUG"); // ✅
setLogLevel("ERROR"); // ✅
// setLogLevel("TRACE"); // ❌ Error

// --------------------------------------------------
// 7. 搭配 as const — 取得精確的字面值型別
// --------------------------------------------------

// 沒有 as const：型別被拓寬
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
};

type Colors = typeof colors;
// type Colors = { red: string; green: string; blue: string }
// 值的型別只是 string，不夠精確

// 有 as const：保留字面值型別
const colorsConst = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
} as const;

type ColorsConst = typeof colorsConst;
// type ColorsConst = {
//   readonly red: "#ff0000";
//   readonly green: "#00ff00";
//   readonly blue: "#0000ff";
// }

// 實用：取得所有顏色值的 union type
type ColorValue = (typeof colorsConst)[keyof typeof colorsConst];
// type ColorValue = "#ff0000" | "#00ff00" | "#0000ff"

function setColor(color: ColorValue) {
  console.log(`設定顏色: ${color}`);
}

setColor("#ff0000"); // ✅
setColor("#00ff00"); // ✅
// setColor("#999999"); // ❌ Error: 不在允許的顏色值中

// --------------------------------------------------
// 8. 實用範例：API Response 型別推導
// --------------------------------------------------

// 假設你有一組 API handler，想推導出回傳型別
const apiHandlers = {
  getUser: () => ({ id: 1, name: "Alice" }),
  getPosts: () => ([{ id: 1, title: "Hello" }, { id: 2, title: "World" }]),
  getSettings: () => ({ theme: "dark", lang: "zh-TW" }),
};

// 從 handler 推導出各 API 的回傳型別
type ApiHandlers = typeof apiHandlers;
type UserResponse = ReturnType<ApiHandlers["getUser"]>;
// type UserResponse = { id: number; name: string }

type PostsResponse = ReturnType<ApiHandlers["getPosts"]>;
// type PostsResponse = { id: number; title: string }[]

type SettingsResponse = ReturnType<ApiHandlers["getSettings"]>;
// type SettingsResponse = { theme: string; lang: string }

// 泛型版本：根據 API 名稱取得對應的回傳型別
type ApiResponse<K extends keyof ApiHandlers> = ReturnType<ApiHandlers[K]>;

// 使用
type R1 = ApiResponse<"getUser">;     // { id: number; name: string }
type R2 = ApiResponse<"getPosts">;    // { id: number; title: string }[]
type R3 = ApiResponse<"getSettings">; // { theme: string; lang: string }

console.log(apiHandlers.getUser());     // { id: 1, name: "Alice" }
console.log(apiHandlers.getPosts());    // [{ id: 1, title: "Hello" }, ...]
console.log(apiHandlers.getSettings()); // { theme: "dark", lang: "zh-TW" }

// --------------------------------------------------
// 9. 限制：typeof 只能用在變數名稱上
// --------------------------------------------------

function add(a: number, b: number) {
  return a + b;
}

// ✅ 可以用在變數上
type AddFn = typeof add;

// ❌ 不能用在表達式上（以下會報錯）
// type Result = typeof add(1, 2);
// 應該用 ReturnType<typeof add> 來取得回傳型別

type AddResult = ReturnType<typeof add>;
// type AddResult = number

console.log("所有範例執行完畢！");
