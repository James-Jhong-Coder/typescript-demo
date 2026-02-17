// 範例：可選參數 & 預設值
// 執行方式：tsc --strict 03-optional-and-default.ts && node 03-optional-and-default.js

// === 可選參數 ===
function greet(name: string, greeting?: string) {
  if (greeting) {
    console.log(`${greeting}, ${name}!`);
  } else {
    console.log(`Hello, ${name}!`);
  }
}

greet("Alice");              // Hello, Alice!
greet("Bob", "Good morning"); // Good morning, Bob!

// === 預設值 ===
function createUser(name: string, role: string = "user") {
  console.log(`建立使用者: ${name}, 角色: ${role}`);
}

createUser("Alice");          // 角色: user（使用預設值）
createUser("Bob", "admin");   // 角色: admin

// === 搭配解構使用 ===
type Config = {
  host: string;
  port?: number;
  secure?: boolean;
};

function connect({ host, port = 3000, secure = false }: Config) {
  const protocol = secure ? "https" : "http";
  console.log(`連線到 ${protocol}://${host}:${port}`);
}

connect({ host: "localhost" });                       // http://localhost:3000
connect({ host: "example.com", port: 443, secure: true }); // https://example.com:443
