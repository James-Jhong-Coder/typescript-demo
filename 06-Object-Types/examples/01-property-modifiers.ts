// 範例：可選屬性、readonly、索引簽名
// 執行方式：tsc --strict 01-property-modifiers.ts && node 01-property-modifiers.js

// === 可選屬性 + 預設值 ===
interface PaintOptions {
  shape: string;
  xPos?: number;
  yPos?: number;
}

function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log(`Drawing ${shape} at (${xPos}, ${yPos})`);
}

paintShape({ shape: "circle" });
paintShape({ shape: "square", xPos: 50 });
paintShape({ shape: "triangle", xPos: 10, yPos: 20 });

// === readonly ===
interface User {
  readonly id: number;
  name: string;
  readonly createdAt: Date;
}

const user: User = { id: 1, name: "Alice", createdAt: new Date() };
user.name = "Bob";       // ✅ name 不是 readonly
// user.id = 2;          // ❌ Cannot assign to 'id' because it is a read-only property
console.log(`\nUser: ${user.name}, id: ${user.id}`);

// === 索引簽名 ===
interface ScoreBoard {
  [playerName: string]: number;
}

const scores: ScoreBoard = {};
scores["Alice"] = 95;
scores["Bob"] = 88;
scores["Charlie"] = 72;

console.log("\n--- 分數表 ---");
for (const [name, score] of Object.entries(scores)) {
  console.log(`${name}: ${score}`);
}
