# Everyday Types — 日常型別

> 對應官方文件：[Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

---

## 1. 原始型別（The Primitives）

JavaScript 中最常見的三種原始型別，在 TypeScript 中也有對應的型別：

| JavaScript | TypeScript 型別 |
| --- | --- |
| `"Hello"` | `string` |
| `42` | `number` |
| `true` / `false` | `boolean` |

```typescript
let name: string = "Alice";
let age: number = 30;
let isStudent: boolean = true;
```

> **注意**：`String`、`Number`、`Boolean`（大寫開頭）是合法的，但它們指的是特殊的內建型別，幾乎不會出現在你的程式碼中。**永遠使用小寫的 `string`、`number`、`boolean`。**

---

## 2. 陣列（Arrays）

宣告陣列型別有兩種寫法：

```typescript
// 寫法一：type[]
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// 寫法二：Array<type>（泛型寫法）
let scores: Array<number> = [90, 85, 100];
```

兩種寫法的效果完全一樣，`number[]` 比較常見。

---

## 3. `any`

當你不想讓某個值造成型別檢查錯誤時，可以使用 `any`：

```typescript
let obj: any = { x: 0 };

// 以下這些都不會報錯
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

`any` 會**完全關閉型別檢查**。當你不想花時間寫型別只為了讓 TypeScript 確信某行程式碼沒有問題時，`any` 很有用。

### `noImplicitAny`

當你沒有指定型別，而且 TypeScript 也無法從上下文推斷時，編譯器預設會將型別設為 `any`。開啟 `noImplicitAny` 可以讓這種情況變成錯誤。

---

## 4. 變數的型別註記（Type Annotations on Variables）

使用 `const`、`var` 或 `let` 宣告變數時，你可以選擇性地加上型別註記：

```typescript
let myName: string = "Alice";
```

但在大多數情況下不需要這樣做。TypeScript 會根據初始值自動**推斷型別**：

```typescript
// 不需要型別註記 — myName 會自動推斷為 string
let myName = "Alice";
```

---

## 5. 函式（Functions）

### 參數型別註記（Parameter Type Annotations）

宣告函式時，你可以在每個參數後面加上型別註記：

```typescript
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}

greet("Alice");   // ✅
// greet(42);     // ❌ Argument of type 'number' is not assignable to parameter of type 'string'
```

### 回傳型別註記（Return Type Annotations）

你也可以標註函式的回傳型別：

```typescript
function getFavoriteNumber(): number {
  return 26;
}
```

通常不需要手動標註回傳型別，TypeScript 會根據 `return` 語句自動推斷。但有些人為了文件化或防止意外修改而選擇標註。

### 匿名函式（Anonymous Functions）

匿名函式出現在「TypeScript 能夠判斷它會如何被呼叫」的位置時，參數會自動被推斷型別。這稱為**上下文推斷（contextual typing）**：

```typescript
const names = ["Alice", "Bob", "Eve"];

// TypeScript 自動推斷 s 的型別為 string
names.forEach(function (s) {
  console.log(s.toUpperCase());
});

// 箭頭函式也一樣
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

---

## 6. 物件型別（Object Types）

定義物件型別，只需列出它的屬性和型別：

```typescript
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 3, y: 7 });
```

屬性之間可以用 `,` 或 `;` 分隔，最後一個分隔符號是可選的。

### 可選屬性（Optional Properties）

在屬性名稱後面加上 `?` 表示該屬性是可選的：

```typescript
function printName(obj: { first: string; last?: string }) {
  console.log(obj.first);
  if (obj.last !== undefined) {
    console.log(obj.last);
  }
}

printName({ first: "Alice" });            // ✅
printName({ first: "Alice", last: "B" }); // ✅
```

在 JavaScript 中，存取不存在的屬性會得到 `undefined`。所以當你讀取可選屬性時，在使用它之前要先檢查是否為 `undefined`。

```typescript
function printName(obj: { first: string; last?: string }) {
  // ❌ 可能會出錯！如果沒提供 obj.last 的話
  // console.log(obj.last.toUpperCase());

  // ✅ 安全的做法
  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase());
  }

  // ✅ 或使用可選串連（optional chaining）
  console.log(obj.last?.toUpperCase());
}
```

---

## 7. 聯合型別（Union Types）

TypeScript 允許你用現有的型別組合出新的型別。

### 定義聯合型別

聯合型別由兩個或多個型別組成，表示值可以是其中**任何一個**型別：

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}

printId(101);      // ✅
printId("202");    // ✅
// printId(true);  // ❌ Argument of type 'boolean' is not assignable
```

### 使用聯合型別

TypeScript 只允許你執行對聯合中**每個成員都有效**的操作：

```typescript
function printId(id: number | string) {
  // ❌ Property 'toUpperCase' does not exist on type 'number'
  // console.log(id.toUpperCase());
}
```

解決方法是用**型別縮小（narrowing）**：

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // 這個分支裡，id 是 string
    console.log(id.toUpperCase());
  } else {
    // 這個分支裡，id 是 number
    console.log(id);
  }
}
```

另一個例子，使用 `Array.isArray()`：

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log("Hello, " + x.join(" and "));
  } else {
    console.log("Welcome lone traveler " + x);
  }
}
```

---

## 8. 型別別名（Type Aliases）

如果你想重複使用同一個型別，可以用 `type` 給它一個名稱：

```typescript
type Point = {
  x: number;
  y: number;
};

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

型別別名可以用在任何型別上，不只是物件：

```typescript
type ID = number | string;

function printId(id: ID) {
  console.log("Your ID is: " + id);
}
```

---

## 9. 介面（Interfaces）

介面是另一種定義物件型別的方式：

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

### Type Alias vs Interface 的差異

兩者非常相似，幾乎所有 `interface` 的功能在 `type` 中都有。關鍵差異是：

| 特性 | Interface | Type Alias |
| --- | --- | --- |
| 擴展方式 | `extends` 關鍵字 | `&`（交集） |
| 新增屬性 | 可以重複宣告來擴展（declaration merging） | 建立後無法修改 |
| 適用範圍 | 只能描述物件形狀 | 可以為任何型別命名 |

```typescript
// Interface 擴展
interface Animal {
  name: string;
}
interface Bear extends Animal {
  honey: boolean;
}

// Type 擴展（透過交集）
type Animal2 = {
  name: string;
};
type Bear2 = Animal2 & {
  honey: boolean;
};
```

```typescript
// Interface 可以重複宣告（declaration merging）
interface Window {
  title: string;
}
interface Window {
  ts: number;
}
// Window 現在有 title 和 ts 兩個屬性

// Type 不能重複宣告
// type Window = { title: string; }
// type Window = { ts: number; }  // ❌ Error: Duplicate identifier
```

> **經驗法則**：如果不確定用哪個，先用 `interface`。當你需要 `interface` 做不到的功能時，再用 `type`。

---

## 10. 型別斷言（Type Assertions）

有時候你比 TypeScript 更了解某個值的型別。這時可以使用**型別斷言**：

```typescript
// TypeScript 只知道這回傳某種 HTMLElement
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

也可以用角括號語法（但在 `.tsx` 檔案中不能用）：

```typescript
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

型別斷言只能斷言為「更具體」或「更不具體」的型別，不能做不可能的斷言：

```typescript
// ❌ 不能直接把 string 斷言為 number
// const x = "hello" as number;

// 如果真的需要，可以先斷言為 any 或 unknown
const a = "hello" as unknown as number;
```

---

## 11. 字面值型別（Literal Types）

除了一般的 `string` 和 `number`，你可以指定**特定的**字串或數字作為型別：

```typescript
// x 只能是 "hello"
let x: "hello" = "hello";
x = "hello"; // ✅
// x = "world"; // ❌

// 搭配聯合型別，非常實用
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}

printText("Hello", "left");   // ✅
// printText("Hello", "top"); // ❌ Argument of type '"top"' is not assignable

// 數字字面值型別
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}

// 搭配非字面值型別
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}

configure({ width: 100 }); // ✅
configure("auto");         // ✅
// configure("automatic"); // ❌
```

### 字面值推斷（Literal Inference）

當你用物件初始化變數時，TypeScript 會假設屬性可能會被修改，所以不會推斷為字面值型別：

```typescript
const req = { url: "https://example.com", method: "GET" };
// req.method 的型別是 string，不是 "GET"

// 解決方法一：型別斷言
const req1 = { url: "https://example.com", method: "GET" as "GET" };

// 解決方法二：as const（將整個物件轉為字面值型別）
const req2 = { url: "https://example.com", method: "GET" } as const;
// req2.method 的型別是 "GET"
```

---

## 12. `null` 和 `undefined`

JavaScript 有兩個特殊值表示「缺少值」：`null` 和 `undefined`。

TypeScript 有對應的型別，行為取決於是否開啟 `strictNullChecks`：

### `strictNullChecks` 關閉

`null` 和 `undefined` 可以被賦值給任何型別。這很容易導致 bug，**建議總是開啟 `strictNullChecks`。**

### `strictNullChecks` 開啟

你需要在使用值之前先檢查它是否為 `null` 或 `undefined`：

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // 處理 null
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### 非空斷言運算子（Non-null Assertion Operator `!`）

在任何表達式後面加上 `!` 表示「我確定這個值不是 `null` 或 `undefined`」：

```typescript
function liveDangerously(x?: number | null) {
  // 不會報錯！
  console.log(x!.toFixed());
}
```

> **注意**：這不會改變執行時的行為。只有在你確定值不會是 `null` / `undefined` 時才使用 `!`。

---

## 13. 列舉（Enums）

Enums 是 TypeScript 加入 JavaScript 的一個功能，允許你定義一組命名常數：

```typescript
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function move(direction: Direction) {
  console.log(`Moving ${Direction[direction]}`);
}

move(Direction.Up);   // Moving Up
move(Direction.Left); // Moving Left
```

> Enums 是一個**型別層級的功能**，會在編譯後產生實際的 JavaScript 程式碼。詳細內容可以參考 Handbook 的 Enums 章節。

---

## 14. 較少見的原始型別

### `bigint`

ES2020 之後，用來表示非常大的整數：

```typescript
const oneHundred: bigint = BigInt(100);
const anotherHundred: bigint = 100n;
```

### `symbol`

用來建立全域唯一的參考：

```typescript
const firstName = Symbol("name");
const secondName = Symbol("name");

// firstName === secondName 永遠是 false，即使描述相同
```

---

## 重點整理

| 概念 | 說明 |
| --- | --- |
| **原始型別** | `string`、`number`、`boolean`（永遠用小寫） |
| **陣列** | `number[]` 或 `Array<number>` |
| **any** | 關閉型別檢查，盡量避免使用 |
| **型別註記** | `let x: string = "hello"` |
| **型別推斷** | 有初始值時通常不需要手動標註 |
| **函式型別** | 參數和回傳值都可以標註型別 |
| **物件型別** | `{ x: number; y: number }` |
| **可選屬性** | `last?: string`，使用前要檢查 `undefined` |
| **聯合型別** | `number \| string`，使用前要 narrowing |
| **型別別名** | `type Point = { x: number; y: number }` |
| **介面** | `interface Point { x: number; y: number }` |
| **型別斷言** | `value as Type`，你比 TS 更了解型別時使用 |
| **字面值型別** | `"left" \| "right" \| "center"` |
| **as const** | 將物件所有屬性轉為字面值型別 |
| **非空斷言** | `x!` 表示確定不是 null/undefined |
| **Enums** | 一組命名常數 |
