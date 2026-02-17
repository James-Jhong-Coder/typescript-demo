# More on Functions — 深入函式

> 對應官方文件：[More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

---

## 1. 函式型別表達式（Function Type Expressions）

描述函式最簡單的方式是使用**函式型別表達式**，語法類似箭頭函式：

```typescript
// 定義一個函式型別：接受 string 參數，回傳 void
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
  fn("Hello World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

> **注意**：`(a: string) => void` 表示「接受一個 string 參數、不回傳值的函式」。參數名稱 `a` 是必須的，如果寫 `(string) => void` 代表接受一個名為 `string`、型別為 `any` 的參數。

---

## 2. 呼叫簽名（Call Signatures）

在 JavaScript 中，函式除了可以被呼叫，還可以有屬性。如果你想描述一個帶有屬性的可呼叫物件，可以用**呼叫簽名**：

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean; // 呼叫簽名
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}

const myFunc: DescribableFunction = Object.assign(
  (someArg: number) => someArg > 3,
  { description: "is greater than 3" }
);

doSomething(myFunc);
```

> 注意語法差異：呼叫簽名用 `:` 而不是 `=>`（`(someArg: number): boolean`）。

---

## 3. 建構簽名（Construct Signatures）

函式也可以用 `new` 來呼叫（建構函式）。在呼叫簽名前面加上 `new` 就是建構簽名：

```typescript
type SomeConstructor = {
  new (s: string): object;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

有些物件（如 `Date`）可以同時被呼叫或用 `new` 呼叫，你可以把兩種簽名寫在一起：

```typescript
interface CallOrConstruct {
  (n?: number): string;
  new (s: string): Date;
}
```

---

## 4. 泛型函式（Generic Functions）

當函式的**輸入型別與輸出型別有關聯**，或者兩個輸入的型別有關聯時，就需要用到**泛型（Generics）**。

```typescript
// 沒有泛型：回傳 any
function firstElement_bad(arr: any[]) {
  return arr[0];
}

// 有泛型：回傳型別與輸入型別一致
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}

const s = firstElement(["a", "b", "c"]); // s 的型別是 string | undefined
const n = firstElement([1, 2, 3]);       // n 的型別是 number | undefined
const u = firstElement([]);              // u 的型別是 undefined
```

### 型別推斷（Inference）

TypeScript 通常可以自動推斷泛型的型別參數：

```typescript
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);
}

// TypeScript 推斷：Input = string, Output = number
const parsed = map(["1", "2", "3"], (n) => parseInt(n));
```

### 約束（Constraints）

用 `extends` 來限制泛型可以接受的型別：

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type): Type {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}

const longerArray = longest([1, 2], [1, 2, 3]);       // number[]
const longerString = longest("alice", "bob");          // string
// const notOK = longest(10, 100);  // ❌ number 沒有 length 屬性
```

### 撰寫好的泛型函式的準則

**準則一：將型別參數下推（Push Type Parameters Down）**

```typescript
// ✅ 好：回傳型別是 Type
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

// ❌ 差：回傳型別是 Type extends any[]，太模糊
function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}
```

**準則二：用越少的型別參數越好**

```typescript
// ✅ 好
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

// ❌ 差：Func 沒有必要作為型別參數
function filter2<Type, Func extends (arg: Type) => boolean>(arr: Type[], func: Func): Type[] {
  return arr.filter(func);
}
```

**準則三：型別參數應出現兩次**

如果一個型別參數只出現在一個地方，想想你是否真的需要它：

```typescript
// ❌ 差：Str 只出現一次，沒有在「建立關聯」
function greet1<Str extends string>(s: Str) {
  console.log("Hello, " + s);
}

// ✅ 好：直接用 string
function greet2(s: string) {
  console.log("Hello, " + s);
}
```

---

## 5. 可選參數（Optional Parameters）

用 `?` 標記可選參數：

```typescript
function f(x?: number) {
  // x 的型別是 number | undefined
  console.log(x);
}

f();    // undefined
f(10);  // 10
```

也可以提供預設值：

```typescript
function f(x = 10) {
  // x 的型別是 number（有預設值就不會是 undefined）
  console.log(x);
}

f();    // 10
f(20);  // 20
```

### Callbacks 中的可選參數

為 callback 定義型別時，**不要加可選參數**（除非你打算在不傳該參數的情況下呼叫 callback）：

```typescript
// ✅ 好
function myForEach(arr: any[], callback: (arg: any, index: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

// 呼叫時可以忽略不需要的參數
myForEach([1, 2, 3], (a) => console.log(a));
```

---

## 6. 函式重載（Function Overloads）

有些函式可以用不同數量或型別的參數來呼叫。在 TypeScript 中，你可以用**重載簽名（overload signatures）**來描述：

```typescript
// 重載簽名
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// 實作簽名（不會直接被呼叫者看到）
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}

const d1 = makeDate(12345678);    // ✅ 用 timestamp
const d2 = makeDate(5, 5, 2023);  // ✅ 用 month, day, year
// const d3 = makeDate(1, 3);     // ❌ 沒有匹配的重載（不能只傳兩個參數）
```

### 重載簽名與實作簽名

- **實作簽名**必須與所有重載簽名相容
- 呼叫者看不到實作簽名，所以實作簽名**不算**一個可呼叫的版本

### 盡量用聯合型別取代重載

```typescript
// ❌ 用重載：比較冗長
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any): number {
  return x.length;
}

// ✅ 用聯合型別：更簡潔
function len2(x: string | any[]): number {
  return x.length;
}
```

> **建議**：能用聯合型別解決的，就不要用重載。

---

## 7. 在函式中宣告 `this`

TypeScript 會透過控制流分析推斷函式中的 `this`。但有時你需要明確指定 `this` 的型別。在參數列表中，`this` 是一個特殊的參數：

```typescript
interface User {
  name: string;
  admin: boolean;
}

interface DB {
  users: User[];
  filterUsers(filter: (this: User) => boolean): User[];
}
```

> **注意**：用 `this` 參數時不能用箭頭函式，因為箭頭函式不會有自己的 `this`。

---

## 8. 其他需要知道的型別

### `void`

表示函式不回傳值。只要函式沒有 `return` 語句，回傳型別就是 `void`：

```typescript
function noop(): void {
  // 不回傳任何值
}
```

> **注意**：`void` 和 `undefined` 不同。

### `object`

指的是任何不是原始型別的值（不是 `string`、`number`、`boolean`、`symbol`、`null`、`undefined`）。

> **注意**：`object` 不是 `Object`。**永遠使用 `object`！**

### `unknown`

代表任何值，類似 `any`，但更安全——你不能對 `unknown` 的值做任何操作：

```typescript
function f1(a: any) {
  a.b(); // OK（但不安全）
}

function f2(a: unknown) {
  // a.b(); // ❌ 'a' is of type 'unknown'

  // 必須先做型別檢查
  if (typeof a === "string") {
    console.log(a.toUpperCase());
  }
}
```

### `never`

表示永遠不會回傳的函式（例如丟出例外或無窮迴圈）：

```typescript
function fail(msg: string): never {
  throw new Error(msg);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### `Function`

全域的 `Function` 型別。可以被呼叫，但回傳 `any`。**盡量使用 `() => void` 取代。**

---

## 9. 其餘參數（Rest Parameters & Arguments）

### Rest Parameters（接收方）

```typescript
function multiply(n: number, ...m: number[]) {
  return m.map((x) => n * x);
}

const result = multiply(10, 1, 2, 3, 4); // [10, 20, 30, 40]
```

### Rest Arguments（呼叫方）

```typescript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
arr1.push(...arr2);

// 搭配 as const 確保型別正確
const args = [8, 5] as const;
const angle = Math.atan2(...args);
```

---

## 10. 參數解構（Parameter Destructuring）

```typescript
type ABC = { a: number; b: number; c: number };

function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}

sum({ a: 10, b: 3, c: 9 });
```

---

## 11. 函式的可賦值性 — `void` 回傳型別

當函式型別的回傳值是 `void` 時，**實作可以回傳任何值**，但回傳值會被忽略：

```typescript
type voidFunc = () => void;

const f1: voidFunc = () => {
  return true; // ✅ 不會報錯
};

const f2: voidFunc = () => true; // ✅ 也不會報錯

// 但回傳值的型別是 void，不是 boolean
const v1 = f1(); // void
```

這就是為什麼像 `Array.prototype.forEach` 的 callback 可以回傳值卻不會報錯。

但如果函式本身**直接標註** `void`，就真的不能回傳值：

```typescript
function f3(): void {
  // return true; // ❌ Type 'boolean' is not assignable to type 'void'
}
```

---

## 重點整理

| 概念 | 說明 |
| --- | --- |
| **函式型別表達式** | `(a: string) => void` |
| **呼叫簽名** | `{ (arg: number): boolean }` — 帶屬性的可呼叫物件 |
| **建構簽名** | `{ new (s: string): Object }` |
| **泛型** | `function f<T>(arr: T[]): T` — 輸入輸出型別關聯 |
| **約束** | `<T extends { length: number }>` — 限制泛型範圍 |
| **可選參數** | `f(x?: number)` 或 `f(x = 10)` |
| **函式重載** | 多個簽名 + 一個實作，優先考慮聯合型別 |
| **void** | 不回傳值 |
| **unknown** | 安全版的 `any`，必須先 narrowing |
| **never** | 永遠不回傳（throw 或無窮迴圈） |
| **Rest 參數** | `...m: number[]` |
| **參數解構** | `{ a, b, c }: ABC` |
