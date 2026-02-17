# Declare — 環境宣告

> 對應官方文件：
> - [Type Declarations](https://www.typescriptlang.org/docs/handbook/2/type-declarations.html)
> - [Declaration Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html)

---

`declare` 的核心概念：**告訴 TypeScript「這個東西存在」，但不提供實作**。

它用來描述「不是由 TypeScript 產生的程式碼」的型別資訊，例如：瀏覽器 API、CDN 載入的函式庫、Node.js 全域變數等。

---

## 1. 為什麼需要 `declare`？

TypeScript 只能檢查 `.ts` 檔案中的程式碼，但很多東西存在於 TypeScript 之外：

```
┌─────────────────────────────────┐
│  TypeScript 看得到的            │
│  → .ts 檔案中的程式碼            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  TypeScript 看不到的            │
│  → 瀏覽器 API（document, window）│
│  → CDN 載入的 JS 函式庫          │
│  → Node.js 全域變數              │
│  → 第三方沒有型別的套件           │
│  → 環境注入的變數（如 process.env）│
└─────────────────────────────────┘

declare 的作用：幫 TypeScript「看到」這些外部的東西
```

---

## 2. `declare` 的各種用法

### 2.1 `declare const` / `declare let` / `declare var` — 宣告全域變數

```typescript
// 假設 HTML 中透過 <script> 載入了一個全域變數 API_URL
// <script>var API_URL = "https://api.example.com";</script>

// 告訴 TypeScript 這個變數存在
declare const API_URL: string;

// 現在可以安全使用
console.log(API_URL); // ✅ TypeScript 不會報錯
```

`declare var` vs `declare const` vs `declare let`：

| 宣告 | 意義 |
|------|------|
| `declare var` | 全域變數，可讀可寫 |
| `declare let` | 全域變數，可讀可寫（block-scoped） |
| `declare const` | 全域常數，唯讀 |

### 2.2 `declare function` — 宣告全域函式

```typescript
// 假設全域有一個 greet 函式（由外部 JS 提供）
declare function greet(name: string): void;

greet("TypeScript"); // ✅

// 也支援 overloads
declare function createElement(tag: "div"): HTMLDivElement;
declare function createElement(tag: "span"): HTMLSpanElement;
declare function createElement(tag: string): HTMLElement;
```

### 2.3 `declare class` — 宣告全域類別

```typescript
// 假設全域有一個 Animal 類別
declare class Animal {
  name: string;
  constructor(name: string);
  move(distance: number): void;
}

const cat = new Animal("Cat");
cat.move(10); // ✅
```

### 2.4 `declare enum` — 宣告全域列舉

```typescript
declare enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const dir: Direction = Direction.Up; // ✅
```

### 2.5 `declare namespace` — 宣告命名空間

當外部函式庫使用巢狀物件結構時：

```typescript
// 假設全域有一個 MyLib 物件
// MyLib.makeGreeting("hello")
// MyLib.numberOfGreetings

declare namespace MyLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}

MyLib.makeGreeting("hello"); // ✅
console.log(MyLib.numberOfGreetings); // ✅
```

巢狀的命名空間：

```typescript
declare namespace GreetingLib {
  interface LogOptions {
    verbose?: boolean;
  }

  interface AlertOptions {
    modal: boolean;
    title?: string;
  }
}

declare namespace GreetingLib.Options {
  interface Log extends GreetingLib.LogOptions {
    timestamp?: boolean;
  }
}
```

---

## 3. `declare module` — 模組宣告

### 3.1 為沒有型別的第三方套件宣告型別

```typescript
// 某個套件沒有提供型別定義
// npm install some-untyped-lib

declare module "some-untyped-lib" {
  export function doSomething(input: string): number;
  export function doAnotherThing(): void;
  export const version: string;
}
```

```typescript
// 使用時就有型別了
import { doSomething, version } from "some-untyped-lib";
doSomething("hello"); // ✅ 回傳 number
```

### 3.2 快速跳過型別檢查（不建議長期使用）

```typescript
// 宣告為 any，快速跳過
declare module "some-lib";
// 等同於所有匯出都是 any
```

### 3.3 萬用字元模組宣告

```typescript
// 讓 TypeScript 認識非 JS/TS 的 import
declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}
```

### 3.4 擴充既有模組（Module Augmentation）

```typescript
// 為 express 的 Request 物件加入自訂屬性
import "express";

declare module "express" {
  interface Request {
    userId?: string;
    role?: "admin" | "user";
  }
}
```

---

## 4. `declare global` — 全域擴充

在**模組檔案**中（有 import/export 的檔案），使用 `declare global` 來新增全域型別：

```typescript
export {}; // 讓這個檔案成為模組

declare global {
  // 擴充全域的 Window 介面
  interface Window {
    myCustomProperty: string;
    analytics: {
      track(event: string): void;
    };
  }

  // 新增全域變數
  var DEBUG: boolean;

  // 新增全域函式
  function sleep(ms: number): Promise<void>;
}
```

```typescript
// 使用
window.myCustomProperty = "hello"; // ✅
window.analytics.track("page_view"); // ✅
console.log(DEBUG); // ✅
```

### 4.1 擴充全域的原生型別

```typescript
export {};

declare global {
  interface Array<T> {
    // 為 Array 新增一個方法
    first(): T | undefined;
    last(): T | undefined;
  }

  interface String {
    // 為 String 新增方法
    toTitleCase(): string;
  }
}
```

---

## 5. `.d.ts` 檔案 — 宣告檔案

`.d.ts` 檔案是**純型別宣告檔案**，不包含任何實作，編譯後也不會產生 `.js`。

### 5.1 自動產生

```bash
# tsconfig.json 中開啟 declaration
# "declaration": true

# TypeScript 會為每個 .ts 檔案自動產生對應的 .d.ts
# math.ts → math.d.ts
```

### 5.2 手動撰寫

```typescript
// custom.d.ts
// 不需要 declare 關鍵字（.d.ts 檔案中的頂層宣告預設就是 ambient）

export function add(a: number, b: number): number;
export const PI: number;

export interface Config {
  host: string;
  port: number;
}
```

### 5.3 全域 `.d.ts`

```typescript
// global.d.ts（沒有 import/export → 自動成為全域宣告）

// 全域變數
declare const __DEV__: boolean;
declare const __VERSION__: string;

// 全域型別
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

// 萬用字元模組
declare module "*.png" {
  const src: string;
  export default src;
}
```

---

## 6. `declare` vs 不加 `declare` 的差別

```typescript
// ❌ 這會產生實際的 JavaScript 程式碼
const API_URL = "https://api.example.com";

// ✅ 這只是告訴 TypeScript「API_URL 存在且是 string」
// 編譯後完全消失，不產生任何 JS
declare const API_URL: string;
```

| | 不加 `declare` | 加 `declare` |
|---|---|---|
| 產生 JS | 是 | 否 |
| 需要實作 | 是 | 否 |
| 用途 | 一般程式碼 | 描述外部存在的東西 |
| 常見位置 | `.ts` 檔案 | `.d.ts` 檔案 或 `.ts` 中描述外部 |

---

## 7. 常見使用情境

### 7.1 環境變數

```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    DATABASE_URL: string;
    API_KEY: string;
    PORT?: string;
  }
}

// 使用時有自動完成和型別檢查
process.env.NODE_ENV; // "development" | "production" | "test"
process.env.API_KEY;  // string
```

### 7.2 CDN 載入的函式庫

```html
<!-- index.html -->
<script src="https://cdn.example.com/lodash.min.js"></script>
```

```typescript
// lodash.d.ts
declare const _: {
  chunk<T>(array: T[], size: number): T[][];
  compact<T>(array: T[]): T[];
  uniq<T>(array: T[]): T[];
};
```

### 7.3 Vite / Webpack 環境變數

```typescript
// env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 重點整理

| 語法 | 用途 | 範例 |
|------|------|------|
| `declare const/let/var` | 宣告全域變數 | `declare const API_URL: string` |
| `declare function` | 宣告全域函式 | `declare function greet(s: string): void` |
| `declare class` | 宣告全域類別 | `declare class Animal { ... }` |
| `declare enum` | 宣告全域列舉 | `declare enum Direction { ... }` |
| `declare namespace` | 宣告命名空間物件 | `declare namespace MyLib { ... }` |
| `declare module "x"` | 為模組宣告/擴充型別 | `declare module "express" { ... }` |
| `declare module "*.css"` | 萬用字元模組 | 讓 TS 認識非 JS import |
| `declare global` | 在模組中擴充全域 | 擴充 `Window`、`Array` 等 |
| `.d.ts` | 純型別宣告檔案 | 不產生 JS，只提供型別 |
