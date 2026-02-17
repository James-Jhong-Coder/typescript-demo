// 範例：型別別名（Type Alias）vs 介面（Interface）
// 執行方式：tsc --strict 05-type-alias-and-interface.ts && node 05-type-alias-and-interface.js

// === Type Alias ===
type Point = {
  x: number;
  y: number;
};

// type 也可以用在非物件型別
type ID = number | string;

function printCoord(pt: Point) {
  console.log(`[Type] x = ${pt.x}, y = ${pt.y}`);
}

printCoord({ x: 10, y: 20 });

// === Interface ===
interface Animal {
  name: string;
}

// interface 用 extends 擴展
interface Dog extends Animal {
  breed: string;
}

// type 用 & 擴展（交集）
type Cat = Animal & {
  color: string;
};

const myDog: Dog = { name: "Buddy", breed: "Golden Retriever" };
const myCat: Cat = { name: "Whiskers", color: "orange" };

console.log(`[Interface] 狗: ${myDog.name}, 品種: ${myDog.breed}`);
console.log(`[Type]      貓: ${myCat.name}, 顏色: ${myCat.color}`);

// === 實際使用情境 ===
interface ApiResponse {
  status: number;
  data: string;
}

function handleResponse(res: ApiResponse) {
  if (res.status === 200) {
    console.log(`成功: ${res.data}`);
  } else {
    console.log(`錯誤: status ${res.status}`);
  }
}

handleResponse({ status: 200, data: "Hello from API" });
handleResponse({ status: 404, data: "Not Found" });
