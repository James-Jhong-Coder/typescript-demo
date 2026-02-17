// import from "config"
// TypeScript 看 config.d.ts 拿型別
// Runtime 看 config.js 拿值
import { API_URL, APP_NAME, DEBUG } from "./config.js";
console.log(`App: ${APP_NAME}`);
console.log(`API: ${API_URL}`);
if (DEBUG) {
    console.log("Debug mode is ON");
}
