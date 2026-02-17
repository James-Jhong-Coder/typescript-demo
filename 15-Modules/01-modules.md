# Modules — 模組

> 對應官方文件：[Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)

---

TypeScript 完整支援 JavaScript 的 ES Modules（`import` / `export`）語法，並在此基礎上擴展了**型別的匯入匯出**功能。

---

## 1. 什麼是模組？

在 TypeScript 中，任何包含頂層 `import` 或 `export` 的檔案都被視為**模組（module）**。反之，沒有任何 `import` / `export` 的檔案會被視為**腳本（script）**，其內容在全域作用域中可見。

```typescript
// ✅ 這是模組（有 export）
export const hello = "world";

// ✅ 這也是模組（有 import）
import { something } from "./other";

// ❌ 這是腳本（沒有 import/export），變數會在全域
const x = 10;
```

如果想讓一個沒有 import/export 的檔案變成模組，加一行空的 export：

```typescript
export {};
// 現在這個檔案是模組了
```

---

## 2. ES Modules 語法

### 2.1 Named Export — 具名匯出

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export const PI = 3.14159;
```

### 2.2 Named Import — 具名匯入

```typescript
// app.ts
import { add, subtract, PI } from "./math";

console.log(add(1, 2));  // 3
console.log(PI);          // 3.14159
```

### 2.3 重新命名（as）

```typescript
// 匯出時重新命名
export { add as addition } from "./math";

// 匯入時重新命名
import { add as addition } from "./math";
console.log(addition(1, 2)); // 3
```

### 2.4 Default Export — 預設匯出

每個模組只能有一個 default export：

```typescript
// greeting.ts
export default function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

```typescript
// app.ts
import greet from "./greeting";
// default import 不需要大括號，名字可以自己取
greet("TypeScript");
```

### 2.5 整個模組匯入（Namespace Import）

```typescript
import * as math from "./math";

console.log(math.add(1, 2));
console.log(math.PI);
```

### 2.6 只執行副作用（Side-effect Import）

```typescript
import "./setup";
// 不取任何匯出值，只執行 setup.ts 的程式碼
```

---

## 3. TypeScript 特有的模組語法

### 3.1 `export type` / `import type` — 只匯出/匯入型別

型別在編譯後會被完全移除，不會出現在 JavaScript 中：

```typescript
// types.ts
export type User = {
  id: number;
  name: string;
};

export interface Product {
  id: number;
  price: number;
}
```

```typescript
// app.ts
import type { User, Product } from "./types";

// ✅ 用在型別位置
const user: User = { id: 1, name: "Alice" };

// ❌ 不能用在值的位置（因為編譯後不存在）
// console.log(User);
```

### 3.2 Inline Type Import

也可以在一般 import 中，用 `type` 標記個別的匯入項目：

```typescript
// mixed.ts
export class UserService {
  getUser() { return { id: 1, name: "Alice" }; }
}

export type UserType = {
  id: number;
  name: string;
};
```

```typescript
// app.ts
import { UserService, type UserType } from "./mixed";
//                      ^^^^
//                      只有 UserType 是 type-only

const service = new UserService();  // ✅ 值可以使用
const user: UserType = service.getUser(); // ✅ 型別可以使用
```

### 3.3 `export =` / `import = require()` — CommonJS 互操作

TypeScript 提供了與 CommonJS 模組互動的語法：

```typescript
// CommonJS 風格匯出
// legacy-module.ts
class Calculator {
  add(a: number, b: number) { return a + b; }
}
export = Calculator;
```

```typescript
// CommonJS 風格匯入
import Calculator = require("./legacy-module");

const calc = new Calculator();
console.log(calc.add(1, 2));
```

> 現代專案建議統一使用 ES Modules 語法。

---

## 4. Module Resolution — 模組解析

TypeScript 需要知道 `import` 的路徑對應到哪個檔案。這由 `tsconfig.json` 的 `moduleResolution` 設定控制。

### 4.1 常見的解析策略

| 策略 | 適用場景 |
|------|---------|
| `node16` / `nodenext` | Node.js（ESM + CJS） |
| `bundler` | Webpack、Vite、esbuild 等打包工具 |
| `classic` | 舊版 TypeScript（不建議使用） |

### 4.2 路徑解析規則

```typescript
// 相對路徑 — 相對於目前檔案
import { add } from "./math";        // ./math.ts
import { add } from "../utils/math"; // ../utils/math.ts

// 非相對路徑 — 從 node_modules 查找
import express from "express";
import { useState } from "react";
```

### 4.3 Path Aliases — 路徑別名

在 `tsconfig.json` 中設定 `paths` 可以建立路徑別名：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// 使用別名
import { add } from "@utils/math";
// 等同於 import { add } from "src/utils/math";
```

---

## 5. Declaration Files — 型別宣告檔案

`.d.ts` 檔案只包含型別資訊，不包含實作：

```typescript
// math.d.ts
export declare function add(a: number, b: number): number;
export declare const PI: number;
```

### 5.1 為第三方套件提供型別

```typescript
// 很多套件的型別定義來自 DefinitelyTyped
// npm install --save-dev @types/lodash
// npm install --save-dev @types/express

import _ from "lodash";        // 型別來自 @types/lodash
import express from "express"; // 型別來自 @types/express
```

### 5.2 為沒有型別的模組宣告型別

```typescript
// global.d.ts
declare module "some-untyped-module" {
  export function doSomething(): void;
  export const value: number;
}
```

### 5.3 萬用字元模組宣告

```typescript
// 讓 TypeScript 認識非 JS/TS 的 import
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.png" {
  const src: string;
  export default src;
}
```

---

## 6. Namespaces（命名空間）

Namespaces 是 TypeScript 較早期的模組化方式，現在建議使用 ES Modules 取代：

```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string): boolean {
      return /^[A-Za-z]+$/.test(s);
    }
  }
}

const validator = new Validation.LettersOnlyValidator();
console.log(validator.isAcceptable("Hello")); // true
```

> 現代 TypeScript 專案幾乎不使用 `namespace`，優先使用 ES Modules。

---

## 7. 實用模式

### 7.1 Re-export — 統一匯出入口

```typescript
// models/user.ts
export interface User { id: number; name: string; }

// models/product.ts
export interface Product { id: number; price: number; }

// models/index.ts — barrel file
export { User } from "./user";
export { Product } from "./product";
export type { User as UserType } from "./user"; // 也可以只 re-export 型別
```

```typescript
// app.ts — 從統一入口匯入
import { User, Product } from "./models";
```

### 7.2 Dynamic Import — 動態匯入

```typescript
async function loadModule() {
  // 動態 import 回傳 Promise
  const { add } = await import("./math");
  console.log(add(1, 2));
}

// 常見用於 code splitting
async function loadPage(page: string) {
  switch (page) {
    case "home":
      return await import("./pages/home");
    case "about":
      return await import("./pages/about");
    default:
      return await import("./pages/404");
  }
}
```

### 7.3 `typeof import` — 取得模組的型別

```typescript
type MathModule = typeof import("./math");
// 取得整個模組匯出的型別，等同於：
// { add: (a: number, b: number) => number; PI: number; ... }
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 具名匯出 | `export { x }` | 匯出特定成員 |
| 具名匯入 | `import { x } from "./m"` | 匯入特定成員 |
| 預設匯出 | `export default x` | 每個模組一個 |
| 預設匯入 | `import x from "./m"` | 不需要大括號 |
| 整個模組 | `import * as m from "./m"` | 匯入為命名空間物件 |
| 重新命名 | `import { x as y }` | 匯入/匯出時改名 |
| 只匯入型別 | `import type { X }` | 編譯後完全移除 |
| Inline type | `import { A, type B }` | 個別標記型別匯入 |
| Re-export | `export { x } from "./m"` | 統一匯出入口 |
| 動態匯入 | `await import("./m")` | 回傳 Promise，用於 code splitting |
| 宣告檔案 | `.d.ts` | 只有型別，沒有實作 |
| 萬用字元宣告 | `declare module "*.css"` | 讓 TS 認識非 JS 的 import |
| 路徑別名 | `paths` in tsconfig | `@/` 等快捷路徑 |
