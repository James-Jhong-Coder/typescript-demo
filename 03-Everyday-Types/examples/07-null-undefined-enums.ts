// 範例：null / undefined 處理 & Enums
// 執行方式：tsc --strict 07-null-undefined-enums.ts && node 07-null-undefined-enums.js

// === null & undefined ===

// --- 用 narrowing 安全處理 ---
function doSomething(x: string | null) {
  if (x === null) {
    console.log("值是 null，跳過");
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}

doSomething("TypeScript");
doSomething(null);

// --- 非空斷言 ! （確定不是 null 時才用） ---
function getLength(x?: string | null) {
  // 用 ! 告訴 TypeScript「我確定 x 不是 null/undefined」
  // ⚠️ 如果實際是 null 會在執行時報錯，要小心使用
  // console.log(x!.length);

  // 更安全的做法
  console.log(x?.length ?? "沒有值");
}

getLength("hello");
getLength(null);
getLength();

// === Enums ===
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

function move(dir: Direction) {
  switch (dir) {
    case Direction.Up:
      console.log("向上移動 ⬆");
      break;
    case Direction.Down:
      console.log("向下移動 ⬇");
      break;
    case Direction.Left:
      console.log("向左移動 ⬅");
      break;
    case Direction.Right:
      console.log("向右移動 ➡");
      break;
  }
}

move(Direction.Up);
move(Direction.Right);

// --- 字串 Enum ---
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}

function paintColor(color: Color) {
  console.log(`上色: ${color}`);
}

paintColor(Color.Red);
paintColor(Color.Blue);
