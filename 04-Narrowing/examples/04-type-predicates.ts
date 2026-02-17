// 範例：型別謂詞（Type Predicates）
// 執行方式：tsc --strict 04-type-predicates.ts && node 04-type-predicates.js

type Fish = { name: string; swim: () => void };
type Bird = { name: string; fly: () => void };

// 自訂型別守衛函式，回傳型別是 "pet is Fish"
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    console.log(`${pet.name} is a fish!`);
    pet.swim();
  } else {
    console.log(`${pet.name} is a bird!`);
    pet.fly();
  }
}

const nemo: Fish = { name: "Nemo", swim: () => console.log("  swimming...") };
const tweety: Bird = { name: "Tweety", fly: () => console.log("  flying...") };

move(nemo);
move(tweety);

// --- 用型別謂詞過濾陣列 ---
const zoo: (Fish | Bird)[] = [
  { name: "Dory", swim: () => {} },
  { name: "Eagle", fly: () => {} },
  { name: "Salmon", swim: () => {} },
  { name: "Parrot", fly: () => {} },
];

const fishes: Fish[] = zoo.filter(isFish);
const birds: Bird[] = zoo.filter((pet): pet is Bird => !isFish(pet));

console.log(`\nFishes: ${fishes.map((f) => f.name).join(", ")}`);
console.log(`Birds: ${birds.map((b) => b.name).join(", ")}`);
