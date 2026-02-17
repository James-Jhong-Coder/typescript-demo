// 範例：元組型別（Tuple Types）
// 執行方式：tsc --strict 04-tuples.ts && node 04-tuples.js

// === 基本元組 ===
type StringNumberPair = [string, number];

function printPair(pair: StringNumberPair) {
  const [label, value] = pair;
  console.log(`${label}: ${value}`);
}

printPair(["年齡", 30]);
printPair(["分數", 95]);

// === 可選元素 ===
type Coordinate = [number, number, number?]; // 2D 或 3D

function printCoord(coord: Coordinate) {
  const [x, y, z] = coord;
  if (z !== undefined) {
    console.log(`3D: (${x}, ${y}, ${z})`);
  } else {
    console.log(`2D: (${x}, ${y})`);
  }
}

console.log("\n--- 座標 ---");
printCoord([10, 20]);
printCoord([10, 20, 30]);

// === Rest 元素的元組 ===
type NameAndScores = [string, ...number[]];

function printStudentScores([name, ...scores]: NameAndScores) {
  const avg = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  console.log(`${name}: 分數=${scores.join(", ")}, 平均=${avg.toFixed(1)}`);
}

console.log("\n--- 學生成績 ---");
printStudentScores(["Alice", 90, 85, 92]);
printStudentScores(["Bob", 78, 88]);

// === readonly 元組 & as const ===
const point = [3, 4] as const; // readonly [3, 4]

function distanceFromOrigin(p: readonly [number, number]): number {
  return Math.sqrt(p[0] ** 2 + p[1] ** 2);
}

console.log(`\n原點到 (3, 4) 的距離: ${distanceFromOrigin(point).toFixed(2)}`);

// === 實用範例：函式回傳元組（類似 React useState） ===
function useState<T>(initial: T): [T, (newValue: T) => void] {
  let value = initial;
  function setValue(newValue: T) {
    value = newValue;
    console.log(`值更新為: ${value}`);
  }
  return [value, setValue];
}

const [count, setCount] = useState(0);
console.log(`\n初始值: ${count}`);
setCount(1);
setCount(2);
