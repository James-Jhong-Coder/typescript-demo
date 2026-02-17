// 範例：等值縮小 & in 運算子縮小
// 執行方式：tsc --strict 02-equality-and-in.ts && node 02-equality-and-in.js

// === 等值縮小（Equality Narrowing） ===
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // 唯一可能相等的型別是 string
    console.log(`兩者都是 string: x=${x.toUpperCase()}, y=${y.toUpperCase()}`);
  }
}

example("hello", "hello");
example(42, true); // 不會進入 if

// --- 用 != null 同時排除 null 和 undefined ---
function printValue(value: string | null | undefined) {
  if (value != null) {
    console.log(`值: ${value.toUpperCase()}`);
  } else {
    console.log("值是 null 或 undefined");
  }
}

printValue("TypeScript");
printValue(null);
printValue(undefined);

// === in 運算子縮小 ===
type Fish = { name: string; swim: () => void };
type Bird = { name: string; fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    console.log(`${animal.name} is swimming!`);
    animal.swim();
  } else {
    console.log(`${animal.name} is flying!`);
    animal.fly();
  }
}

move({ name: "Nemo", swim: () => console.log("  🐟 splash~") });
move({ name: "Tweety", fly: () => console.log("  🐦 flap~") });
