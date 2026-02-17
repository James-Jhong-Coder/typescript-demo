// 範例：可辨識聯合（Discriminated Unions）& 窮盡檢查
// 執行方式：tsc --strict 05-discriminated-unions.ts && node 05-discriminated-unions.js

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

// 用 kind 作為可辨識屬性
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
      // 窮盡檢查：如果忘記處理某個 case，這裡會報錯
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

function describeShape(shape: Shape) {
  console.log(`${shape.kind} 的面積 = ${getArea(shape).toFixed(2)}`);
}

describeShape({ kind: "circle", radius: 5 });
describeShape({ kind: "square", sideLength: 4 });
describeShape({ kind: "triangle", base: 6, height: 3 });

// 試試看：如果你在 Shape 加一個新的型別（例如 Rectangle），
// 但忘記在 switch 裡處理它，TypeScript 會在 default 報錯！
