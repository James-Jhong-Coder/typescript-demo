// 範例：Rest 參數 & 參數解構
// 執行方式：tsc --strict 05-rest-and-destructuring.ts && node 05-rest-and-destructuring.js

// === Rest Parameters ===
function sum(first: number, ...rest: number[]): number {
  return rest.reduce((total, n) => total + n, first);
}

console.log(`sum(1, 2, 3, 4, 5) = ${sum(1, 2, 3, 4, 5)}`);
console.log(`sum(10) = ${sum(10)}`);

// === Rest Arguments ===
const nums = [1, 2, 3] as const;
// Math.max 需要展開傳入
console.log(`max(1, 2, 3) = ${Math.max(...nums)}`);

// === 參數解構（Parameter Destructuring） ===
type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

function printItem({ name, price, quantity }: CartItem) {
  const total = price * quantity;
  console.log(`${name} x${quantity} = $${total}`);
}

function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
}

const cart: CartItem[] = [
  { name: "TypeScript 入門書", price: 500, quantity: 1 },
  { name: "機械鍵盤", price: 3000, quantity: 1 },
  { name: "貼紙包", price: 50, quantity: 3 },
];

console.log("\n--- 購物車 ---");
cart.forEach(printItem);
console.log(`總計: $${getCartTotal(cart)}`);
