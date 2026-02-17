// 範例：void / unknown / never
// 執行方式：tsc --strict 06-special-types.ts && node 06-special-types.js

// === void ===
function logMessage(msg: string): void {
  console.log(`[LOG] ${msg}`);
  // 不回傳值
}

logMessage("這是 void 函式");

// void 回傳型別的 callback 可以回傳值（但會被忽略）
const numbers = [1, 2, 3];
const result: void[] = numbers.map((n) => {
  console.log(n); // forEach/map 的 callback 回傳值被忽略
});

// === unknown（安全版的 any） ===
function processInput(input: unknown) {
  // input.toUpperCase(); // ❌ 不能直接操作 unknown

  // 必須先做型別檢查（narrowing）
  if (typeof input === "string") {
    console.log(`字串: ${input.toUpperCase()}`);
  } else if (typeof input === "number") {
    console.log(`數字: ${input.toFixed(2)}`);
  } else if (Array.isArray(input)) {
    console.log(`陣列，長度: ${input.length}`);
  } else {
    console.log(`其他型別: ${typeof input}`);
  }
}

console.log("\n--- unknown ---");
processInput("hello");
processInput(3.14);
processInput([1, 2, 3]);
processInput(true);

// === never（永遠不回傳） ===
function throwError(message: string): never {
  throw new Error(message);
}

// 實用場景：窮盡檢查
type Shape = "circle" | "square" | "triangle";

function getShapeSides(shape: Shape): number {
  switch (shape) {
    case "circle":
      return 0;
    case "square":
      return 4;
    case "triangle":
      return 3;
    default:
      // 如果 Shape 新增了型別但忘了處理，這裡會報錯
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}

console.log("\n--- never（窮盡檢查） ---");
console.log(`circle: ${getShapeSides("circle")} sides`);
console.log(`square: ${getShapeSides("square")} sides`);
console.log(`triangle: ${getShapeSides("triangle")} sides`);
