// 範例：tsc 編譯器 & 明確的型別（Explicit Types）
// 執行方式：tsc 01-greet.ts && node 01-greet.js
function greet(person, date) {
    console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}
greet("Maddison", new Date());
