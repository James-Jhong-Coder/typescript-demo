# Keyof Type Operator — keyof 型別運算子

> 對應官方文件：[Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

---

`keyof` 運算子會取得一個物件型別的**所有 key**，產生一個由字串或數字字面值組成的 **union type**。

---

## 1. 基本用法

`keyof` 接受一個物件型別，回傳它所有 key 的聯合型別：

```typescript
type Point = { x: number; y: number };

type P = keyof Point;
// 等同於 type P = "x" | "y"

let key1: P = "x"; // ✅
let key2: P = "y"; // ✅
// let key3: P = "z"; // ❌ Error: Type '"z"' is not assignable to type '"x" | "y"'
```

---

## 2. 搭配 Index Signatures

如果型別使用了 index signature，`keyof` 會回傳**索引的型別**：

```typescript
// number 索引簽名
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number

// string 索引簽名
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
```

> **為什麼 `Mapish` 的 keyof 是 `string | number`？**
> 因為在 JavaScript 中，物件的 key 永遠會被轉為字串，所以 `obj[0]` 等同於 `obj["0"]`。
> TypeScript 因此允許 `number` 也作為 `string` 索引的有效 key。

---

## 3. 搭配 Generics 使用

`keyof` 最常見的用法是搭配泛型，確保只能存取物件上**存在的 key**：

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, city: "Taipei" };

getProperty(person, "name");  // ✅ 回傳型別: string
getProperty(person, "age");   // ✅ 回傳型別: number
// getProperty(person, "email"); // ❌ Error: "email" 不在 "name" | "age" | "city" 中
```

這裡的 `T[K]` 是 **Indexed Access Type**，會根據 key 自動推斷出對應的 value 型別。

---

## 4. 搭配 typeof 對實際值取 key

`keyof` 只能作用在**型別**上，如果要對一個實際的變數取 key type，需要搭配 `typeof`：

```typescript
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
};

// typeof config → { host: string; port: number; debug: boolean }
// keyof typeof config → "host" | "port" | "debug"
type ConfigKeys = keyof typeof config;

function getConfig(key: ConfigKeys) {
  return config[key];
}

getConfig("host");  // ✅
getConfig("port");  // ✅
// getConfig("url"); // ❌ Error
```

---

## 5. 實用範例：型別安全的物件操作

### 5.1 型別安全的 pick 函式

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const user = { name: "Alice", age: 30, email: "alice@example.com" };
const nameAndAge = pick(user, ["name", "age"]);
// nameAndAge 的型別: Pick<typeof user, "name" | "age">
// → { name: string; age: number }
```

### 5.2 型別安全的 Object.keys 包裝

```typescript
// Object.keys 預設回傳 string[]，可以用 keyof 加強
function typedKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

const point = { x: 10, y: 20 };
const keys = typedKeys(point);
// keys 的型別: ("x" | "y")[]
```

### 5.3 搭配 Mapped Types 建立唯讀版本

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

interface Todo {
  title: string;
  completed: boolean;
}

const todo: Readonly<Todo> = {
  title: "Learn keyof",
  completed: false,
};

// todo.title = "Change"; // ❌ Error: Cannot assign to 'title' because it is a read-only property
```

---

## 6. keyof 與聯合型別、交叉型別

```typescript
// 聯合型別的 keyof — 取交集（共有的 key）
type A = { x: number; y: number };
type B = { y: number; z: number };

type KeyOfUnion = keyof (A | B);
// type KeyOfUnion = "y"  （只有 y 是共有的）

// 交叉型別的 keyof — 取聯集（所有的 key）
type KeyOfIntersection = keyof (A & B);
// type KeyOfIntersection = "x" | "y" | "z"
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 基本 keyof | `keyof T` | 取得型別 T 的所有 key 組成 union type |
| 搭配泛型 | `K extends keyof T` | 限制 K 只能是 T 的有效 key |
| Indexed Access | `T[K]` | 根據 key 取得對應的 value 型別 |
| 搭配 typeof | `keyof typeof obj` | 對實際值取得 key type |
| string index | `keyof { [k: string]: T }` | 結果為 `string \| number` |
| number index | `keyof { [n: number]: T }` | 結果為 `number` |
| 聯合型別 | `keyof (A \| B)` | 取共有的 key（交集） |
| 交叉型別 | `keyof (A & B)` | 取所有的 key（聯集） |
