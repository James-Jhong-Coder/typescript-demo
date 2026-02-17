// =============================================
// 全域宣告檔案（沒有 import/export → 自動成為全域）
// =============================================

// --- 全域變數 ---
declare const __DEV__: boolean;
declare const __VERSION__: string;
declare const API_URL: string;

// --- 全域函式 ---
declare function greet(name: string): void;
declare function sendAnalytics(event: string, data?: Record<string, unknown>): void;

// --- 全域類別 ---
declare class ExternalLogger {
  constructor(prefix: string);
  log(message: string): void;
  error(message: string): void;
}

// --- 全域命名空間（巢狀物件） ---
declare namespace MyLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;

  interface Options {
    verbose?: boolean;
    timeout?: number;
  }
}

// --- 全域型別 ---
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

// --- 萬用字元模組宣告 ---
declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const src: string;
  export default src;
}

// --- 環境變數型別 ---
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT?: string;
    DATABASE_URL?: string;
  }
}
