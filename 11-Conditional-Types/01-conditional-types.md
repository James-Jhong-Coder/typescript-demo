# Conditional Types — 條件型別

> 對應官方文件：[Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

---

條件型別（Conditional Types）的語法類似 JavaScript 的三元運算子，讓我們根據型別之間的關係來選擇不同的型別。

基本語法：

```
SomeType extends OtherType ? TrueType : FalseType
```

當 `extends` 左邊的型別可以賦值給右邊的型別時，會得到 `TrueType`（真分支）；否則得到 `FalseType`（假分支）。

---

## 1. 基本用法

```typescript
interface Animal {
  live(): void;
}

interface Dog extends Animal {
  woof(): void;
}

// Dog extends Animal 為 true → 結果是 number
type Example1 = Dog extends Animal ? number : string;
// type Example1 = number

// RegExp 不 extends Animal → 結果是 string
type Example2 = RegExp extends Animal ? number : string;
// type Example2 = string
```

---

## 2. 搭配 Generics 使用

條件型別搭配泛型才能真正發揮威力：

```typescript
interface IdLabel {
  id: number;
}

interface NameLabel {
  name: string;
}

// 根據傳入型別決定回傳型別
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;

function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

const a = createLabel("typescript");
// const a: NameLabel

const b = createLabel(2.8);
// const b: IdLabel

const c = createLabel(Math.random() ? "hello" : 42);
// const c: NameLabel | IdLabel
```

---

## 3. 條件型別的約束（Conditional Type Constraints）

在條件型別的真分支中，TypeScript 會幫我們進一步縮窄型別：

```typescript
// 取得訊息型別，如果 T 有 message 屬性就取出它的型別
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string

type DogMessageContents = MessageOf<Dog>;
// type DogMessageContents = never
```

另一個範例 — 攤平陣列型別：

```typescript
type Flatten<T> = T extends any[] ? T[number] : T;

type Str = Flatten<string[]>;
// type Str = string

type Num = Flatten<number>;
// type Num = number
```

---

## 4. 在條件型別中推斷（Inferring with `infer`）

`infer` 關鍵字可以在條件型別的 `extends` 子句中宣告一個新的型別變數，讓 TypeScript 自動幫我們推斷：

```typescript
// 用 infer 取得陣列元素型別
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

type Str = Flatten<string[]>;
// type Str = string

type Num = Flatten<number>;
// type Num = number
```

### 4.1 推斷函式回傳型別

```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
// type Num = number

type Str = GetReturnType<(x: string) => string>;
// type Str = string

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
// type Bools = boolean[]
```

### 4.2 推斷函式參數型別

```typescript
type GetParameters<Type> = Type extends (...args: infer P) => any ? P : never;

type Params1 = GetParameters<(a: string, b: number) => void>;
// type Params1 = [a: string, b: number]

type Params2 = GetParameters<() => void>;
// type Params2 = []
```

### 4.3 推斷 Promise 的值型別

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>;
// type A = string

type B = UnwrapPromise<Promise<number[]>>;
// type B = number[]

type C = UnwrapPromise<number>;
// type C = number
```

### 4.4 多重推斷

當有多個候選型別可以推斷到同一個型別變數時：

```typescript
// infer 在共變位置（co-variant）→ 產生 union
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
// type T1 = string

type T2 = Foo<{ a: string; b: number }>;
// type T2 = string | number
```

---

## 5. 分配式條件型別（Distributive Conditional Types）

當條件型別作用在泛型上且傳入的是 union type 時，它會**自動分配**到 union 的每個成員：

```typescript
type ToArray<Type> = Type extends any ? Type[] : never;

// string | number 會被分別套用
type StrOrNumArray = ToArray<string | number>;
// type StrOrNumArray = string[] | number[]
```

分配的過程等同於：

```
ToArray<string | number>
→ ToArray<string> | ToArray<number>
→ string[] | number[]
```

### 5.1 避免分配行為

如果不想要分配行為，可以用方括號將 `extends` 兩側包起來：

```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

type StrOrNumArray = ToArrayNonDist<string | number>;
// type StrOrNumArray = (string | number)[]
// 注意：這次是一個包含 string | number 的陣列，而不是 string[] | number[]
```

---

## 6. 實用範例

### 6.1 排除特定型別（模擬 Exclude）

```typescript
type MyExclude<T, U> = T extends U ? never : T;

type T0 = MyExclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c"

type T1 = MyExclude<string | number | boolean, string>;
// type T1 = number | boolean
```

分配過程：

```
MyExclude<"a" | "b" | "c", "a">
→ ("a" extends "a" ? never : "a") | ("b" extends "a" ? never : "b") | ("c" extends "a" ? never : "c")
→ never | "b" | "c"
→ "b" | "c"
```

### 6.2 提取特定型別（模擬 Extract）

```typescript
type MyExtract<T, U> = T extends U ? T : never;

type T0 = MyExtract<"a" | "b" | "c", "a" | "f">;
// type T0 = "a"

type T1 = MyExtract<string | number | (() => void), Function>;
// type T1 = () => void
```

### 6.3 NonNullable 實作

```typescript
type MyNonNullable<T> = T extends null | undefined ? never : T;

type T0 = MyNonNullable<string | number | undefined>;
// type T0 = string | number

type T1 = MyNonNullable<string[] | null | undefined>;
// type T1 = string[]
```

### 6.4 遞迴條件型別 — 深層解包 Promise

```typescript
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;

type A = DeepAwaited<Promise<string>>;
// type A = string

type B = DeepAwaited<Promise<Promise<number>>>;
// type B = number

type C = DeepAwaited<Promise<Promise<Promise<boolean>>>>;
// type C = boolean
```

### 6.5 根據屬性型別篩選 key

```typescript
type FilterKeysByType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
}

type StringKeys = FilterKeysByType<User, string>;
// type StringKeys = "name" | "email"

type NumberKeys = FilterKeysByType<User, number>;
// type NumberKeys = "id" | "age"
```

### 6.6 條件型別搭配 Mapped Types

```typescript
type Optional<T, K extends keyof T> = Omit<T, K> & {
  [P in K]?: T[P];
};

interface Config {
  host: string;
  port: number;
  debug: boolean;
}

type FlexibleConfig = Optional<Config, "debug" | "port">;
// type FlexibleConfig = { host: string; debug?: boolean; port?: number }

const config: FlexibleConfig = {
  host: "localhost",
  // port 和 debug 變成可選的了
};
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 基本語法 | `T extends U ? X : Y` | 類似三元運算子的型別判斷 |
| 搭配泛型 | `type F<T> = T extends ...` | 根據傳入型別動態決定回傳型別 |
| 型別約束 | 真分支中型別被縮窄 | 可安全存取通過檢查的屬性 |
| `infer` | `T extends Array<infer U>` | 在條件中推斷並擷取子型別 |
| 分配式 | Union 自動展開分配 | `T<A \| B>` → `T<A> \| T<B>` |
| 避免分配 | `[T] extends [U]` | 用方括號包裹阻止分配行為 |
| 遞迴 | 真分支引用自身 | 可處理巢狀結構如深層 Promise |
| 常見應用 | `Exclude`, `Extract`, `NonNullable`, `ReturnType` | 內建工具型別大量使用條件型別 |
