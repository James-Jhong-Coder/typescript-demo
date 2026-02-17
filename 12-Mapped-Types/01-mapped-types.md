# Mapped Types — 映射型別

> 對應官方文件：[Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

---

Mapped Types 讓我們基於一個既有型別，**逐一遍歷其屬性並產生新的型別**。語法建立在 Index Signatures 的基礎上，使用 `in` 來迭代所有的 key。

---

## 1. 基本語法

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

interface FeatureFlags {
  darkMode: () => void;
  newUserProfile: () => void;
}

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//   darkMode: boolean;
//   newUserProfile: boolean;
// }
```

`[Property in keyof Type]` 會遍歷 `Type` 的每個 key，並將值的型別統一改為 `boolean`。

---

## 2. Mapping Modifiers — 映射修飾符

映射時可以加上兩個修飾符：`readonly` 和 `?`（可選）。

- 用 `-` 前綴可以**移除**修飾符
- 用 `+` 前綴可以**新增**修飾符（不寫前綴時預設就是 `+`）

### 2.1 移除 readonly

```typescript
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
// type UnlockedAccount = {
//   id: string;
//   name: string;
// }
```

### 2.2 移除可選（`?`）

```typescript
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
// type User = {
//   id: string;
//   name: string;
//   age: number;
// }
```

### 2.3 加上 readonly 和可選

```typescript
type ReadonlyPartial<Type> = {
  +readonly [Property in keyof Type]+?: Type[Property];
};

interface Todo {
  title: string;
  description: string;
}

type ReadonlyPartialTodo = ReadonlyPartial<Todo>;
// type ReadonlyPartialTodo = {
//   readonly title?: string;
//   readonly description?: string;
// }
```

---

## 3. Key Remapping via `as` — 用 `as` 重新映射 key

TypeScript 4.1 起，可以在映射型別中使用 `as` 子句來**重新命名 key**：

```typescript
type MappedTypeWithNewProperties<Type> = {
  [Property in keyof Type as NewKeyType]: Type[Property];
};
```

### 3.1 搭配 Template Literal Types

```typescript
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
// type LazyPerson = {
//   getName: () => string;
//   getAge: () => number;
//   getLocation: () => string;
// }
```

### 3.2 用 `never` 過濾 key

在 `as` 中回傳 `never` 可以過濾掉某些 key：

```typescript
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
// type KindlessCircle = {
//   radius: number;
// }
```

### 3.3 映射任意 union，不只是 `keyof`

`in` 後面可以放任何 union，不一定要是 `keyof`：

```typescript
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
// type Config = {
//   square: (event: SquareEvent) => void;
//   circle: (event: CircleEvent) => void;
// }
```

---

## 4. 搭配條件型別使用

Mapped Types 可以和 Conditional Types 結合，根據屬性的型別決定不同的處理方式：

```typescript
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
// type ObjectsNeedingGDPRDeletion = {
//   id: false;
//   name: true;
// }
```

---

## 5. 常見內建工具型別的原理

許多內建工具型別底層都是 Mapped Types：

```typescript
// Partial<T> — 所有屬性變可選
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Required<T> — 所有屬性變必填
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

// Readonly<T> — 所有屬性變唯讀
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Pick<T, K> — 從 T 中挑選特定 key
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Record<K, V> — 建立 key-value 映射
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 基本映射 | `[K in keyof T]: ...` | 遍歷所有 key 產生新型別 |
| 加 readonly | `+readonly [K in keyof T]` | 所有屬性變唯讀 |
| 移除 readonly | `-readonly [K in keyof T]` | 移除唯讀限制 |
| 加可選 | `[K in keyof T]+?` | 所有屬性變可選 |
| 移除可選 | `[K in keyof T]-?` | 所有屬性變必填 |
| Key 重映射 | `[K in keyof T as NewKey]` | 重新命名 key |
| 過濾 key | `as Exclude<K, "x">` | 用 `never` 排除特定 key |
| 搭配模板字面值 | `` as `get${Capitalize<K>}` `` | 動態產生新 key 名稱 |
| 搭配條件型別 | `T[K] extends U ? X : Y` | 根據值型別決定處理方式 |
| 內建工具型別 | `Partial`, `Required`, `Readonly`, `Pick`, `Record` | 都是 Mapped Types 的應用 |
