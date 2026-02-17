// 這裡直接使用，TypeScript 不會報錯
// 因為 global.d.ts 已經 declare 了
console.log("App: ".concat(APP_NAME));
console.log("API: ".concat(API_URL));
if (DEBUG) {
    console.log("Debug mode is ON");
}
