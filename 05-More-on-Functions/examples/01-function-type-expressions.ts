// 範例：函式型別表達式 & 呼叫簽名
// 執行方式：tsc --strict 01-function-type-expressions.ts && node 01-function-type-expressions.js

// === 函式型別表達式 ===
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;

function calculate(a: number, b: number, operation: MathOperation) {
  return operation(a, b);
}

console.log(`10 + 3 = ${calculate(10, 3, add)}`);
console.log(`10 - 3 = ${calculate(10, 3, subtract)}`);
console.log(`10 * 3 = ${calculate(10, 3, multiply)}`);

// === 呼叫簽名（帶屬性的函式） ===
type DescribableFunction = {
  description: string;
  (arg: number): string;
};

const doubleIt: DescribableFunction = Object.assign(
  (arg: number) => `Result: ${arg * 2}`,
  { description: "Doubles a number" }
);

console.log(`\n${doubleIt.description}`);
console.log(doubleIt(21));
