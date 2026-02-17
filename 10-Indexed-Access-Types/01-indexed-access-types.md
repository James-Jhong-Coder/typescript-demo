# Indexed Access Types — 索引存取型別

> 對應官方文件：[Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

---

我們可以使用 **Indexed Access Type**（索引存取型別）來查詢另一個型別上特定屬性的型別。

---

## 1. 基本用法

使用 `Type["property"]` 的語法，可以取得某個型別中特定屬性的型別：

```typescript
type Person = { age: number; name: string; alive: boolean };

// 取得 age 屬性的型別
type Age = Person["age"];
// type Age = number
```

索引型別本身也是一個型別，所以可以搭配 union、`keyof` 或其他型別使用：

```typescript
type Person = { age: number; name: string; alive: boolean };

// 用 union 一次取得多個屬性的型別
type I1 = Person["age" | "name"];
// type I1 = string | number

type I2 = Person[keyof Person];
// type I2 = string | number | boolean
```

---

## 2. 搭配型別別名使用

可以用另一個型別作為索引：

```typescript
type Person = { age: number; name: string; alive: boolean };

type AliveOrName = "alive" | "name";

type I3 = Person[AliveOrName];
// type I3 = string | boolean
```

---

## 3. 不存在的屬性會報錯

如果嘗試索引一個不存在的屬性，TypeScript 會報錯：

```typescript
type Person = { age: number; name: string; alive: boolean };

// ❌ Error: Property 'alpiVe' does not exist on type 'Person'.
// type I1 = Person["alpiVe"];
```

---

## 4. 搭配 typeof 從實際值取得型別

```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

// typeof MyArray → { name: string; age: number }[]
// typeof MyArray[number] → 取得陣列元素的型別
type Person = (typeof MyArray)[number];
// type Person = { name: string; age: number }

type Age = (typeof MyArray)[number]["age"];
// type Age = number

// 或者分開寫
type Person2 = (typeof MyArray)[number];
type Age2 = Person2["age"];
// type Age2 = number
```

---

## 5. 用 number 索引陣列元素型別

這是非常實用的技巧 — 用 `number` 作為索引可以取得陣列中**元素的型別**：

```typescript
const roles = ["admin", "editor", "viewer"] as const;

// typeof roles → readonly ["admin", "editor", "viewer"]
// typeof roles[number] → "admin" | "editor" | "viewer"
type Role = (typeof roles)[number];
// type Role = "admin" | "editor" | "viewer"

function assignRole(role: Role) {
  console.log(`Assigning role: ${role}`);
}

assignRole("admin");   // ✅
assignRole("editor");  // ✅
// assignRole("super"); // ❌ Error
```

---

## 6. 索引只能使用型別，不能使用值

索引存取只能使用**型別**，不能使用變數（值）：

```typescript
const key = "age";

type Person = { age: number; name: string; alive: boolean };

// ❌ Error: 'key' refers to a value, but is being used as a type here.
// type Age = Person[key];

// ✅ 正確做法：使用型別別名
type Key = "age";
type Age = Person[Key];
// type Age = number

// ✅ 或者使用 typeof
type Age2 = Person[typeof key];
// type Age2 = number
```

---

## 7. 搭配 Generics 使用

Indexed Access Types 搭配泛型是非常常見的模式：

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30, email: "alice@example.com" };

const name = getProperty(person, "name");  // 型別: string
const age = getProperty(person, "age");    // 型別: number
```

---

## 8. 巢狀索引存取

可以連續索引來取得巢狀屬性的型別：

```typescript
type API = {
  user: {
    profile: {
      name: string;
      avatar: string;
    };
    settings: {
      theme: "light" | "dark";
      lang: string;
    };
  };
};

type Profile = API["user"]["profile"];
// type Profile = { name: string; avatar: string }

type Theme = API["user"]["settings"]["theme"];
// type Theme = "light" | "dark"
```

---

## 9. 實用範例

### 9.1 從 tuple 取得特定位置的型別

```typescript
type Tuple = [string, number, boolean];

type First = Tuple[0];   // string
type Second = Tuple[1];  // number
type Third = Tuple[2];   // boolean

// 取得 tuple 中所有元素的聯合型別
type All = Tuple[number];
// type All = string | number | boolean
```

### 9.2 從 API 回應型別中提取資料

```typescript
type ApiResponse = {
  status: number;
  data: {
    users: { id: number; name: string; role: "admin" | "user" }[];
    total: number;
  };
  error: string | null;
};

// 取得 data 的型別
type Data = ApiResponse["data"];
// type Data = { users: { id: number; name: string; role: "admin" | "user" }[]; total: number }

// 取得單一 user 的型別
type User = ApiResponse["data"]["users"][number];
// type User = { id: number; name: string; role: "admin" | "user" }

// 取得 role 的型別
type UserRole = ApiResponse["data"]["users"][number]["role"];
// type UserRole = "admin" | "user"
```

### 9.3 搭配 Mapped Types

```typescript
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type StringFields = PickByType<User, string>;
// type StringFields = { name: string; email: string }
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 基本索引 | `Type["prop"]` | 取得特定屬性的型別 |
| 聯合索引 | `Type["a" \| "b"]` | 一次取得多個屬性型別的 union |
| keyof 索引 | `Type[keyof Type]` | 取得所有屬性型別的 union |
| 陣列元素 | `Type[number]` | 取得陣列元素的型別 |
| Tuple 索引 | `Tuple[0]` | 取得特定位置的型別 |
| 巢狀索引 | `Type["a"]["b"]` | 取得巢狀屬性的型別 |
| 搭配 typeof | `(typeof arr)[number]` | 從值推導陣列元素型別 |
| 搭配 as const | `(typeof constArr)[number]` | 取得字面值聯合型別 |
| 限制 | 只能用型別，不能用值 | 需要用 `typeof` 轉換 |
