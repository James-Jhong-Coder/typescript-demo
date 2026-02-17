// =============================================
// Default Export — 預設匯出
// =============================================

// 每個模組只能有一個 default export
export default function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 也可以同時有 named export
export const farewell = (name: string): string => {
  return `Goodbye, ${name}!`;
};
