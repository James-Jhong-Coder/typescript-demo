# Narrowing — 型別縮小

> 對應官方文件：[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

---

## 什麼是 Narrowing？

當一個變數的型別是聯合型別（如 `string | number`）時，TypeScript 會根據你的程式碼邏輯，自動**縮小**變數的可能型別。這個過程就叫做 **Narrowing（型別縮小）**。

```typescript
function padLeft(padding: number | string, input: string): string {
  // 這裡 padding 是 number | string
  if (typeof padding === "number") {
    // 這裡 TypeScript 知道 padding 是 number
    return " ".repeat(padding) + input;
  }
  // 這裡 TypeScript 知道 padding 是 string
  return padding + input;
}
```

TypeScript 分析這些條件判斷（如 `if`、`switch`），來理解某個位置的變數是什麼型別。這個分析的過程叫做**控制流分析（control flow analysis）**。

---

## 1. `typeof` 型別守衛（typeof Type Guards）

JavaScript 的 `typeof` 運算子可以回傳一個字串，表示值的基本型別：

| 表達式 | 回傳值 |
| --- | --- |
| `typeof "hello"` | `"string"` |
| `typeof 42` | `"number"` |
| `typeof true` | `"boolean"` |
| `typeof undefined` | `"undefined"` |
| `typeof null` | `"object"` ⚠️ |
| `typeof {}` | `"object"` |
| `typeof []` | `"object"` |
| `typeof function(){}` | `"function"` |

TypeScript 可以利用 `typeof` 檢查來做 narrowing：

```typescript
function printAll(strs: string | string[] | null) {
  if (typeof strs === "object") {
    // ⚠️ 注意！null 的 typeof 也是 "object"
    // 所以這裡 strs 的型別是 string[] | null
    // strs.forEach(...) // ❌ 可能是 null！
  } else if (typeof strs === "string") {
    // strs 是 string
  } else {
    // strs 是 null（因為其他情況都排除了）
  }
}
```

> **注意**：`typeof null === "object"` 是 JavaScript 的歷史遺留 bug。TypeScript 知道這一點，所以 `typeof` 檢查 `"object"` 時不會排除 `null`。

---

## 2. 真值縮小（Truthiness Narrowing）

在 JavaScript 中，以下值在條件判斷中會被視為 **falsy（假值）**：

- `0`
- `NaN`
- `""` （空字串）
- `0n` （bigint 的零）
- `null`
- `undefined`

其他所有值都是 **truthy（真值）**。

TypeScript 可以利用真值檢查來做 narrowing：

```typescript
function printAll(strs: string | string[] | null) {
  if (strs && typeof strs === "object") {
    // strs 是 string[]（排除了 null 和 string）
    for (const s of strs) {
      console.log(s);
    }
  } else if (typeof strs === "string") {
    // strs 是 string
    console.log(strs);
  }
}
```

用 `!` 來從否定分支做 narrowing：

```typescript
function multiplyAll(values: number[] | undefined, factor: number) {
  if (!values) {
    // values 是 undefined
    return values;
  }
  // values 是 number[]
  return values.map((x) => x * factor);
}
```

> **注意**：真值檢查對空字串 `""` 也會判定為 falsy，所以要小心別意外過濾掉合法的空字串。

---

## 3. 等值縮小（Equality Narrowing）

TypeScript 可以利用 `===`、`!==`、`==`、`!=` 來做 narrowing：

```typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // x 和 y 都是 string（因為這是唯一可能相等的型別）
    console.log(x.toUpperCase());
    console.log(y.toUpperCase());
  } else {
    console.log(x); // string | number
    console.log(y); // string | boolean
  }
}
```

用 `== null` 可以同時檢查 `null` 和 `undefined`：

```typescript
function printValue(value: string | null | undefined) {
  if (value != null) {
    // 排除了 null 和 undefined
    console.log(value.toUpperCase());
  }
}
```

---

## 4. `in` 運算子縮小（The `in` Operator Narrowing）

JavaScript 的 `in` 運算子可以檢查物件是否有某個屬性。TypeScript 用它來做 narrowing：

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    // animal 是 Fish
    animal.swim();
  } else {
    // animal 是 Bird
    animal.fly();
  }
}
```

如果兩個型別都有某個可選屬性：

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };
type Human = { swim?: () => void; fly?: () => void };

function move(animal: Fish | Bird | Human) {
  if ("swim" in animal) {
    // animal 是 Fish | Human
  } else {
    // animal 是 Bird | Human
  }
}
```

---

## 5. `instanceof` 縮小（`instanceof` Narrowing）

`instanceof` 用來檢查一個值是否是某個類別的實例：

```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    // x 是 Date
    console.log(x.toUTCString());
  } else {
    // x 是 string
    console.log(x.toUpperCase());
  }
}
```

---

## 6. 賦值縮小（Assignments）

TypeScript 會根據賦值來更新變數的型別：

```typescript
// 宣告型別是 string | number
let x: string | number;

x = "hello";
// 現在 x 是 string
console.log(x.toUpperCase());

x = 42;
// 現在 x 是 number
console.log(x.toFixed(2));

// 但你不能賦一個不在聯合裡的型別
// x = true; // ❌ Type 'boolean' is not assignable to type 'string | number'
```

---

## 7. 控制流分析（Control Flow Analysis）

TypeScript 會分析整個程式碼的控制流，在每個位置推導出變數的型別：

```typescript
function example() {
  let x: string | number | boolean;

  x = Math.random() < 0.5;
  // x 是 boolean

  if (Math.random() < 0.5) {
    x = "hello";
    // x 是 string
  } else {
    x = 100;
    // x 是 number
  }

  // x 是 string | number（因為走完 if/else 後可能是其中一個）
  return x;
}
```

---

## 8. 型別謂詞（Type Predicates）

你可以定義一個**自訂的型別守衛函式**，回傳型別是 `parameterName is Type` 的形式：

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    // pet 是 Fish
    pet.swim();
  } else {
    // pet 是 Bird
    pet.fly();
  }
}
```

型別謂詞也可以用來過濾陣列：

```typescript
const zoo: (Fish | Bird)[] = [
  { swim: () => console.log("swimming") },
  { fly: () => console.log("flying") },
  { swim: () => console.log("swimming") },
];

const fishes: Fish[] = zoo.filter(isFish);
// TypeScript 知道 fishes 是 Fish[]
```

---

## 9. 可辨識聯合（Discriminated Unions）

這是 narrowing 最常用也最重要的模式之一。每個型別都有一個**共同屬性**（通常叫做 `kind` 或 `type`），值是不同的字面值：

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // shape 是 Circle
      return Math.PI * shape.radius ** 2;
    case "square":
      // shape 是 Square
      return shape.sideLength ** 2;
  }
}

console.log(getArea({ kind: "circle", radius: 5 }));
console.log(getArea({ kind: "square", sideLength: 4 }));
```

`kind` 屬性就是**可辨識屬性（discriminant property）**。TypeScript 用它來精確判斷是哪個型別。

---

## 10. `never` 型別與窮盡檢查（Exhaustiveness Checking）

當 narrowing 排除了所有可能的型別後，變數的型別會變成 `never`。`never` 代表「不可能存在的值」。

你可以利用 `never` 來做**窮盡檢查**——確保你處理了所有可能的情況：

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // 如果所有 case 都處理了，shape 的型別會是 never
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

如果你之後新增了一個型別到 `Shape` 聯合（例如 `Triangle`），但忘記在 `switch` 裡處理它，TypeScript 會在 `default` 分支報錯，因為 `Triangle` 不能賦值給 `never`。

---

## 重點整理

| Narrowing 方法 | 使用方式 | 適用場景 |
| --- | --- | --- |
| **typeof** | `typeof x === "string"` | 原始型別判斷 |
| **Truthiness** | `if (x)` / `if (!x)` | 排除 null / undefined |
| **Equality** | `x === y` / `x != null` | 精確值比較 |
| **in** | `"prop" in obj` | 物件屬性判斷 |
| **instanceof** | `x instanceof Date` | 類別實例判斷 |
| **賦值** | `x = "hello"` | 變數重新賦值後 |
| **型別謂詞** | `pet is Fish` | 自訂型別守衛函式 |
| **可辨識聯合** | `shape.kind === "circle"` | 最常用的模式！ |
| **never + 窮盡檢查** | `const _: never = x` | 確保所有 case 都有處理 |
