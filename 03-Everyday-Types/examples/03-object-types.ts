// 範例：物件型別 & 可選屬性
// 執行方式：tsc --strict 03-object-types.ts && node 03-object-types.js

// --- 物件型別 ---
function printCoord(pt: { x: number; y: number }) {
  console.log(`x = ${pt.x}, y = ${pt.y}`);
}

printCoord({ x: 3, y: 7 });
printCoord({ x: -1, y: 100 });

// --- 可選屬性（Optional Properties） ---
function printUser(user: { name: string; email?: string }) {
  console.log(`名字: ${user.name}`);

  // 要先檢查 undefined 才能安全使用
  if (user.email !== undefined) {
    console.log(`Email: ${user.email}`);
  } else {
    console.log("Email: 未提供");
  }

  // 或用可選串連 ?.
  console.log(`Email 長度: ${user.email?.length ?? "N/A"}`);
  console.log("---");
}

printUser({ name: "Alice", email: "alice@example.com" });
printUser({ name: "Bob" }); // 沒有提供 email，也 OK
