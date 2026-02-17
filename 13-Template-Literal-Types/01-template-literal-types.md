# Template Literal Types — 模板字面值型別

> 對應官方文件：[Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

---

Template Literal Types 建立在 string literal types 之上，語法跟 JavaScript 的模板字串一樣，但用在**型別**的位置。它可以透過插值來組合、展開出新的 string literal types。

---

## 1. 基本用法

```typescript
type World = "world";

type Greeting = `hello ${World}`;
// type Greeting = "hello world"
```

在插值位置放入型別，TypeScript 會自動計算出結果的字串型別。

---

## 2. 搭配 Union Types — 自動展開

當插值位置是 union type 時，會產生**所有可能組合**的 union：

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs =
//   | "welcome_email_id"
//   | "email_heading_id"
//   | "footer_title_id"
//   | "footer_sendoff_id"
```

### 2.1 多個插值位置 — 交叉組合

如果有多個 union 插值，會產生所有的**交叉排列組合**：

```typescript
type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`;
// type Alignment =
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"
// 共 3 × 3 = 9 種組合
```

---

## 3. 搭配型別中的 String Unions

實際應用中，Template Literal Types 常搭配物件的 key 來產生新的型別：

```typescript
type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// eventName 只能是 "firstNameChanged" | "lastNameChanged" | "ageChanged"
person.on("firstNameChanged", (newValue) => {
  // newValue 自動推斷為 string
  console.log(`new name is ${newValue.toUpperCase()}`);
});

person.on("ageChanged", (newValue) => {
  // newValue 自動推斷為 number
  console.log(`new age is ${newValue}`);
});

// ❌ Error: "firstName" 不是有效的 event name
// person.on("firstName", () => {});
```

---

## 4. 搭配 `infer` 推斷 — 解構字串

Template Literal Types 可以搭配 `infer` 來**拆解字串**：

```typescript
// 判斷字串是否以特定前綴開頭
type StartsWith<T extends string, Prefix extends string> =
  T extends `${Prefix}${infer _}` ? true : false;

type A = StartsWith<"hello world", "hello">;
// type A = true

type B = StartsWith<"hello world", "world">;
// type B = false
```

### 4.1 提取字串的一部分

```typescript
// 取得第一個字元
type FirstChar<T extends string> =
  T extends `${infer First}${infer _}` ? First : never;

type A = FirstChar<"hello">;
// type A = "h"

// 取得最後一部分（以 "." 分隔）
type GetExtension<T extends string> =
  T extends `${infer _}.${infer Ext}` ? Ext : never;

type B = GetExtension<"image.png">;
// type B = "png"
```

### 4.2 遞迴替換字串

```typescript
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer Before}${From}${infer After}`
    ? ReplaceAll<`${Before}${To}${After}`, From, To>
    : S;

type Result = ReplaceAll<"hello-world-foo", "-", "_">;
// type Result = "hello_world_foo"
```

---

## 5. Intrinsic String Manipulation Types — 內建字串操作型別

TypeScript 內建了四個字串操作工具型別，直接在編譯器中實作：

### 5.1 `Uppercase<StringType>`

```typescript
type Shouting = Uppercase<"hello">;
// type Shouting = "HELLO"

type LoudGreeting = Uppercase<"Hello, World">;
// type LoudGreeting = "HELLO, WORLD"
```

### 5.2 `Lowercase<StringType>`

```typescript
type Quiet = Lowercase<"HELLO">;
// type Quiet = "hello"

type SoftGreeting = Lowercase<"Hello, World">;
// type SoftGreeting = "hello, world"
```

### 5.3 `Capitalize<StringType>`

```typescript
type Cap = Capitalize<"hello">;
// type Cap = "Hello"
```

### 5.4 `Uncapitalize<StringType>`

```typescript
type Uncap = Uncapitalize<"Hello">;
// type Uncap = "hello"
```

### 5.5 搭配 Mapped Types 使用

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// type PersonGetters = {
//   getName: () => string;
//   getAge: () => number;
// }
```

---

## 6. 實用範例

### 6.1 CSS 屬性型別

```typescript
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;

const width: CSSValue = "100px";    // ✅
const height: CSSValue = "50%";     // ✅
const margin: CSSValue = "1.5rem";  // ✅
// const bad: CSSValue = "100";     // ❌ 缺少單位
```

### 6.2 路由路徑提取參數

```typescript
type ExtractParams<Path extends string> =
  Path extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : Path extends `${infer _}:${infer Param}`
      ? Param
      : never;

type Params = ExtractParams<"/users/:userId/posts/:postId">;
// type Params = "userId" | "postId"
```

### 6.3 事件名稱轉換（kebab-case → camelCase）

```typescript
type KebabToCamel<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${KebabToCamel<Capitalize<Tail>>}`
    : S;

type A = KebabToCamel<"background-color">;
// type A = "backgroundColor"

type B = KebabToCamel<"border-top-width">;
// type B = "borderTopWidth"
```

### 6.4 Dot Notation 取得巢狀型別

```typescript
type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}${DotPrefix<DotNestedKeys<T[K]>>}`;
    }[keyof T & string]
  : "";

interface Form {
  user: {
    name: string;
    address: {
      city: string;
      zip: string;
    };
  };
  age: number;
}

type FormKeys = DotNestedKeys<Form>;
// "user" | "user.name" | "user.address" | "user.address.city" | "user.address.zip" | "age"
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 基本語法 | `` `hello ${Type}` `` | 在型別層級使用模板字串 |
| Union 展開 | `` `${A \| B}` `` | 自動產生所有組合的 union |
| 交叉組合 | `` `${A}-${B}` `` | 多個 union 交叉排列 |
| 搭配 infer | `` `${infer X}${infer Y}` `` | 拆解字串、提取子字串 |
| 遞迴處理 | 條件型別 + 模板字面值 | 處理任意長度的字串 |
| `Uppercase` | `Uppercase<"hello">` | → `"HELLO"` |
| `Lowercase` | `Lowercase<"HELLO">` | → `"hello"` |
| `Capitalize` | `Capitalize<"hello">` | → `"Hello"` |
| `Uncapitalize` | `Uncapitalize<"Hello">` | → `"hello"` |
| 搭配 Mapped Types | `` as `get${Capitalize<K>}` `` | 動態產生新的 key 名稱 |
