# Typeof Type Operator — typeof 型別運算子

> 對應官方文件：[Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)

---

TypeScript 的 `typeof` 可以在**型別層級**使用，從一個「值」推導出它的「型別」。
這和 JavaScript 執行時的 `typeof`（回傳 `"string"`、`"number"` 等字串）是不同的。

---

## 1. 基本用法

JavaScript 本身就有 `typeof` 運算子，可以在表達式中使用：

```typescript
// JavaScript 的 typeof（執行時）
console.log(typeof "hello"); // "string"
console.log(typeof 42);      // "number"
```

TypeScript 擴充了 `typeof`，讓它可以在**型別位置**使用，取得變數的型別：

```typescript
let s = "hello";

// 在型別位置使用 typeof
let n: typeof s;
// n 的型別是 string
```

> **注意**：這對基本型別（string、number 等）用處不大，真正強大的地方是搭配複雜的型別。

---

## 2. 搭配物件使用

`typeof` 可以從一個物件值推導出完整的型別結構，省去手動定義 interface 的麻煩：

```typescript
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
};

// 不需要手動寫 interface，直接從值推導
type Config = typeof config;
// 等同於：
// type Config = {
//   host: string;
//   port: number;
//   debug: boolean;
// }
```

---

## 3. 搭配函式使用

可以取得一個函式的完整型別簽名：

```typescript
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

type GreetFn = typeof greet;
// type GreetFn = (name: string, age: number) => string
```

這在搭配其他工具型別時特別有用：

```typescript
// 搭配 ReturnType — 取得函式的回傳型別
type GreetReturn = ReturnType<typeof greet>;
// type GreetReturn = string

// 搭配 Parameters — 取得函式的參數型別
type GreetParams = Parameters<typeof greet>;
// type GreetParams = [name: string, age: number]
```

> **注意**：`ReturnType<T>` 接受的是型別，不是值。
> 所以不能寫 `ReturnType<greet>`，必須寫 `ReturnType<typeof greet>`。

---

## 4. 搭配 keyof 使用

這是前一章提到的組合技：

```typescript
const routes = {
  home: "/",
  about: "/about",
  contact: "/contact",
};

// typeof routes → { home: string; about: string; contact: string }
// keyof typeof routes → "home" | "about" | "contact"
type RouteName = keyof typeof routes;

function navigate(route: RouteName) {
  console.log(`Navigating to ${routes[route]}`);
}

navigate("home");    // ✅
navigate("about");   // ✅
// navigate("login"); // ❌ Error
```

---

## 5. 搭配 enum 使用

`typeof` 對 enum 有特殊的行為：

```typescript
enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

// typeof LogLevel 不是 enum 本身，而是 enum 的「建構物件」型別
type LogLevelType = typeof LogLevel;
// 等同於：
// type LogLevelType = {
//   DEBUG: LogLevel;
//   INFO: LogLevel;
//   WARN: LogLevel;
//   ERROR: LogLevel;
// }

// 搭配 keyof — 取得 enum 的 key 名稱
type LogLevelKey = keyof typeof LogLevel;
// type LogLevelKey = "DEBUG" | "INFO" | "WARN" | "ERROR"
```

---

## 6. 搭配 as const 使用

`typeof` 搭配 `as const` 可以取得更精確的**字面值型別**：

```typescript
// 沒有 as const
const colors = { red: "#ff0000", green: "#00ff00", blue: "#0000ff" };
type Colors = typeof colors;
// type Colors = { red: string; green: string; blue: string }

// 有 as const — 型別更精確
const colorsConst = { red: "#ff0000", green: "#00ff00", blue: "#0000ff" } as const;
type ColorsConst = typeof colorsConst;
// type ColorsConst = {
//   readonly red: "#ff0000";
//   readonly green: "#00ff00";
//   readonly blue: "#0000ff";
// }
```

---

## 7. 限制

TypeScript 刻意限制 `typeof` 只能用在**變數名稱**或**屬性**上，不能用在任意表達式上：

```typescript
function add(a: number, b: number) {
  return a + b;
}

// ✅ 可以用在變數上
type AddFn = typeof add;

// ❌ 不能用在函式呼叫的結果上
// type Result = typeof add(1, 2);
// Error: 應該用 ReturnType<typeof add> 取得回傳型別
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 基本 typeof | `typeof variable` | 從值推導出型別 |
| 物件 typeof | `typeof obj` | 取得物件的完整型別結構 |
| 函式 typeof | `typeof fn` | 取得函式簽名型別 |
| 搭配 ReturnType | `ReturnType<typeof fn>` | 取得函式回傳型別 |
| 搭配 Parameters | `Parameters<typeof fn>` | 取得函式參數型別（tuple） |
| 搭配 keyof | `keyof typeof obj` | 從值取得所有 key 的 union |
| 搭配 as const | `typeof constObj` | 取得字面值層級的精確型別 |
| 限制 | 只能用在變數/屬性 | 不能用在表達式或函式呼叫上 |
