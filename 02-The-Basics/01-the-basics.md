# The Basics — TypeScript 基礎

> 對應官方文件：[The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)

---

## 1. 靜態型別檢查（Static Type-Checking）

大多數程式設計師不希望在執行程式碼時遇到任何錯誤——那些都被視為 bug！而當我們撰寫新的程式碼時，我們會盡力避免引入新的 bug。

如果我們只是加了一點程式碼、存檔、重新執行程式，然後馬上看到錯誤，我們可能可以快速找出問題——但那不是常態。我們可能沒有充分測試功能，所以我們可能永遠不會遇到某些潛在的錯誤！

**靜態型別檢查器（如 TypeScript）**可以在程式碼運行之前幫助我們找出 bug。

```typescript
const message = "hello!";

// 這行在 JavaScript 中不會報錯，但在 TypeScript 中會報錯
message();
// ❌ Error: This expression is not callable.
// Type 'String' has no call signatures.
```

使用 TypeScript，上面這段程式碼在執行前就會告訴你它有錯誤。

---

## 2. 非例外失敗（Non-Exception Failures）

有些情況在 JavaScript 中不會丟出錯誤，但從邏輯上來說是有問題的。TypeScript 會標記這些問題。

```typescript
const user = {
  name: "Daniel",
  age: 26,
};

user.location;
// ❌ TypeScript Error: Property 'location' does not exist on type '{ name: string; age: number; }'.
```

在 JavaScript 中，存取不存在的屬性會回傳 `undefined`，不會報錯。但 TypeScript 認為這很可能是個 bug，並會發出錯誤。

其他 TypeScript 能捕捉的非例外錯誤包括：

```typescript
// 拼寫錯誤
const announcement = "Hello World!";
announcement.toLocaleLowercase();
// ❌ Did you mean 'toLocaleLowerCase'?

// 未呼叫的函式
function flipCoin() {
  return Math.random < 0.5;
  // ❌ Operator '<' cannot be applied to types '() => number' and 'number'.
  // 應該是 Math.random()
}

// 基本邏輯錯誤
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
  // ...
} else if (value === "b") {
  // ❌ This comparison appears to be unintentional
  // because the types '"a"' and '"b"' have no overlap.
}
```

---

## 3. 型別作為工具（Types for Tooling）

TypeScript 不只是在你犯錯時抓到 bug。它還可以在你**撰寫程式碼的時候**就防止你犯錯。

型別檢查器擁有的資訊可以用來提供：

- **自動補全（auto-completion）**：在你輸入時建議正確的屬性和方法
- **快速修復（quick fixes）**：建議修正方案
- **重構（refactoring）**：安全地重新命名變數或函式
- **導覽（navigation）**：跳轉到定義

這就是為什麼 TypeScript 在編輯器中非常強大——它讓開發體驗更加順暢。

---

## 4. tsc — TypeScript 編譯器

安裝 TypeScript：

```bash
npm install -g typescript
```

使用 `tsc` 指令來編譯 TypeScript 檔案：

```bash
tsc hello.ts
```

這會將 `hello.ts` 編譯成 `hello.js`。如果有型別錯誤，tsc 會在終端機中顯示錯誤訊息。

```typescript
// hello.ts
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

---

## 5. 發出錯誤（Emitting with Errors）

即使有型別錯誤，tsc 預設仍然會產生輸出檔案。這是 TypeScript 的設計哲學：**即使有型別錯誤，你的程式碼可能仍然可以正常運作。**

如果你想要更嚴格——在有錯誤時不要產生輸出檔案，可以使用 `--noEmitOnError` 選項：

```bash
tsc --noEmitOnError hello.ts
```

---

## 6. 明確的型別（Explicit Types）

你可以為變數、參數和函式回傳值加上**型別註記（type annotations）**：

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
```

這裡 `person: string` 和 `date: Date` 就是型別註記，告訴 TypeScript `greet` 函式的參數型別。

如果呼叫方式不正確，TypeScript 會報錯：

```typescript
greet("Maddison", Date());
// ❌ Error: Argument of type 'string' is not assignable to parameter of type 'Date'.
// Date() 回傳 string，要用 new Date()
```

> **注意**：我們不一定總是需要寫明確的型別註記。在很多情況下，TypeScript 可以自動**推斷（infer）**型別。

```typescript
// TypeScript 會自動推斷 msg 的型別是 string
let msg = "hello there!";
```

---

## 7. 被擦除的型別（Erased Types）

當 TypeScript 編譯成 JavaScript 時，型別註記會被完全**移除**：

**TypeScript（編譯前）：**

```typescript
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

**JavaScript（編譯後）：**

```javascript
function greet(person, date) {
  console.log("Hello ".concat(person, ", today is ").concat(date.toDateString(), "!"));
}

greet("Maddison", new Date());
```

注意兩件事：

1. `person` 和 `date` 參數不再有型別註記
2. 模板字串（template string）被轉換成了普通的字串串接

型別註記不是 JavaScript（或更精確地說，ECMAScript）的一部分，所以沒有任何瀏覽器或執行環境可以直接運行 TypeScript。這就是為什麼 TypeScript 需要一個編譯器——它需要先移除或轉換 TypeScript 專屬的程式碼，這樣你才能運行它。

---

## 8. 降級（Downleveling）

你可能注意到上面的範例中，模板字串：

```typescript
`Hello ${person}, today is ${date.toDateString()}!`;
```

被轉換成了：

```javascript
"Hello ".concat(person, ", today is ").concat(date.toDateString(), "!");
```

這是因為 TypeScript 預設會將程式碼轉譯為 **ES3**（一個非常舊的 ECMAScript 版本）。你可以使用 `--target` 選項來選擇目標版本：

```bash
tsc --target es2015 hello.ts
```

這樣模板字串就會被保留，因為 ES2015（ES6）原生支援模板字串。

> 大多數情況下，目標設為 `es2015` 或更新版本就足夠了。

---

## 9. 嚴格模式（Strictness）

TypeScript 有多個型別檢查的嚴格模式標記，可以開啟或關閉。在 `tsconfig.json` 中，`"strict": true` 會一次開啟所有嚴格檢查。

兩個最重要的嚴格選項：

### `noImplicitAny`

在某些情況下，TypeScript 不會嘗試推斷型別，而是會退回到最寬鬆的型別：`any`。`any` 基本上關閉了型別檢查。

開啟 `noImplicitAny` 後，任何被隱式推斷為 `any` 的變數都會發出錯誤：

```typescript
// 開啟 noImplicitAny
function fn(s) {
  //         ^ ❌ Parameter 's' implicitly has an 'any' type.
  console.log(s.subtr(3));
}
```

### `strictNullChecks`

預設情況下，`null` 和 `undefined` 可以被賦值給任何其他型別。開啟 `strictNullChecks` 後，你必須明確處理 `null` 和 `undefined`：

```typescript
// 開啟 strictNullChecks
function doSomething(x: string | null) {
  if (x === null) {
    // 做一些事
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

---

## 重點整理

| 概念 | 說明 |
| --- | --- |
| **靜態型別檢查** | 在程式碼執行前就發現型別錯誤 |
| **非例外失敗** | 捕捉 JavaScript 不會報錯但有問題的程式碼 |
| **型別作為工具** | 提供自動補全、導覽、重構等功能 |
| **tsc** | TypeScript 編譯器，將 `.ts` 編譯為 `.js` |
| **noEmitOnError** | 有錯誤時不產生輸出檔案 |
| **型別註記** | 明確標示變數和參數的型別 |
| **型別推斷** | TypeScript 自動判斷型別，不一定要寫註記 |
| **型別擦除** | 編譯後型別註記會被移除 |
| **降級** | 將新語法轉換為舊版 JavaScript |
| **strict** | 開啟所有嚴格型別檢查 |
| **noImplicitAny** | 禁止隱式的 `any` 型別 |
| **strictNullChecks** | 強制明確處理 `null` 和 `undefined` |
