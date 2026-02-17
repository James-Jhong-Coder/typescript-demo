// 範例：聯合型別（Union Types）& Narrowing
// 執行方式：tsc --strict 04-union-types.ts && node 04-union-types.js

// --- 基本聯合型別 ---
function printId(id: number | string) {
  // 用 typeof 做 narrowing
  if (typeof id === "string") {
    console.log(`字串 ID: ${id.toUpperCase()}`);
  } else {
    console.log(`數字 ID: ${id}`);
  }
}

printId(101);
printId("abc-202");

// --- 陣列或字串 ---
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    console.log("Hello, " + x.join(" and "));
  } else {
    console.log("Welcome lone traveler " + x);
  }
}

welcomePeople(["Alice", "Bob", "Charlie"]);
welcomePeople("Dave");

// --- 共同方法不需要 narrowing ---
function getFirstThree(x: number[] | string) {
  // .slice() 在 number[] 和 string 上都存在，所以不需要判斷
  return x.slice(0, 3);
}

console.log(getFirstThree("Hello World"));  // Hel
console.log(getFirstThree([1, 2, 3, 4, 5])); // [1, 2, 3]
