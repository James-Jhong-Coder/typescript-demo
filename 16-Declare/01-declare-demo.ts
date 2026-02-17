// =============================================
// Declare Demo — 環境宣告示範
// =============================================

// --- 1. 使用 global.d.ts 中宣告的全域變數 ---

// 這些變數實際上不存在於這個檔案中
// 但因為 global.d.ts 中有 declare，TypeScript 不會報錯
console.log(__DEV__);      // ✅ boolean
console.log(__VERSION__);  // ✅ string
console.log(API_URL);      // ✅ string

// --- 2. 使用 declare 的全域函式 ---

greet("TypeScript"); // ✅ 有型別提示
sendAnalytics("page_view", { page: "/home" }); // ✅

// --- 3. 使用 declare 的全域類別 ---

const logger = new ExternalLogger("App");
logger.log("Started");  // ✅
logger.error("Oops");   // ✅

// --- 4. 使用 declare namespace ---

MyLib.makeGreeting("hello"); // ✅
console.log(MyLib.numberOfGreetings); // ✅

const opts: MyLib.Options = {
  verbose: true,
  timeout: 3000,
};

// --- 5. 使用全域型別 ---

const name1: Nullable<string> = "Alice";
const name2: Nullable<string> = null;    // ✅ 可以是 null

const age1: Optional<number> = 30;
const age2: Optional<number> = undefined; // ✅ 可以是 undefined

// --- 6. declare 在 .ts 檔案中的用法 ---

// 6.1 宣告一個外部存在的變數（不產生 JS）
declare const jQuery: (selector: string) => any;

jQuery("#app"); // ✅ TypeScript 知道 jQuery 存在

// 6.2 宣告 function overloads
declare function createElement(tag: "div"): HTMLDivElement;
declare function createElement(tag: "span"): HTMLSpanElement;
declare function createElement(tag: string): HTMLElement;

const div = createElement("div");   // HTMLDivElement
const span = createElement("span"); // HTMLSpanElement
const p = createElement("p");       // HTMLElement

// --- 7. declare vs 不加 declare 的差別 ---

// 這會產生 JS：const url = "https://..."
const url = "https://api.example.com";

// 這不會產生 JS：只是告訴 TS「BASE_URL 在 runtime 存在」
declare const BASE_URL: string;

// 兩者在 TypeScript 中都能使用
console.log(url);      // ✅
console.log(BASE_URL); // ✅

// --- 8. declare global 用法 ---
// （需要在模組檔案中才能使用）

export {}; // 讓這個檔案成為模組

declare global {
  // 擴充 Window
  interface Window {
    myApp: {
      version: string;
      debug: boolean;
    };
  }

  // 擴充 Array
  interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
  }
}

// 使用擴充後的型別
// window.myApp.version;  // ✅ string
// window.myApp.debug;    // ✅ boolean

// [1, 2, 3].first();     // ✅ number | undefined
// [1, 2, 3].last();      // ✅ number | undefined

// --- 9. declare module — 為第三方套件補型別 ---

// 假設有一個沒有型別的套件 "cool-lib"
declare module "cool-lib" {
  export function coolFunction(input: string): number;
  export class CoolClass {
    constructor(name: string);
    getName(): string;
  }
  export const COOL_VERSION: string;
}

// 使用時：
// import { coolFunction, CoolClass } from "cool-lib";
// coolFunction("test");  // ✅ 回傳 number

// --- 10. 實際應用：Vite 環境變數 ---

// 通常放在 env.d.ts 中
// /// <reference types="vite/client" />
//
// interface ImportMetaEnv {
//   readonly VITE_APP_TITLE: string;
//   readonly VITE_API_URL: string;
// }
//
// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }
//
// 使用：import.meta.env.VITE_APP_TITLE  // ✅ string
