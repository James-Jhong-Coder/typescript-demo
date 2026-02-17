# Generics — 泛型

> 對應官方文件：[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

泛型（Generics）讓我們能夠建立**可重用的元件**，使其能支援多種型別，同時保留型別安全性。

---

## 1. 泛型的基本概念（Hello World of Generics）

如果不使用泛型，我們通常會用 `any` 來讓函式接受任意型別，但這會**失去型別資訊**：

```typescript
// ❌ 用 any — 回傳值的型別資訊遺失了
function identity(arg: any): any {
  return arg;
}

// ✅ 用泛型 — 保留型別資訊
function identityGeneric<Type>(arg: Type): Type {
  return arg;
}
```

呼叫泛型函式有兩種方式：

```typescript
// 方式一：明確指定型別參數
let output1 = identityGeneric<string>("hello");
//  output1 的型別是 string

// 方式二：型別推論（更常用）
let output2 = identityGeneric("hello");
//  TypeScript 自動推斷 Type = string
```

---

## 2. 使用泛型型別變數（Working with Generic Type Variables）

使用泛型時，必須把型別參數當成**任意型別**來處理，不能假設它有特定屬性：

```typescript
// ❌ Type 不一定有 .length 屬性
function loggingIdentity<Type>(arg: Type): Type {
  // console.log(arg.length); // Error: Property 'length' does not exist on type 'Type'
  return arg;
}

// ✅ 改成陣列，陣列一定有 .length
function loggingIdentityArray<Type>(arg: Type[]): Type[] {
  console.log(arg.length); // OK
  return arg;
}

// ✅ 也可以寫成 Array<Type>
function loggingIdentityArray2<Type>(arg: Array<Type>): Array<Type> {
  console.log(arg.length);
  return arg;
}
```

---

## 3. 泛型型別（Generic Types）

可以定義泛型函式的型別簽名，也可以用介面來描述：

```typescript
// 泛型函式型別
let myIdentity: <Type>(arg: Type) => Type = identityGeneric;

// 也可以用不同的名稱
let myIdentity2: <Input>(arg: Input) => Input = identityGeneric;

// 用物件字面呼叫簽名的形式
let myIdentity3: { <Type>(arg: Type): Type } = identityGeneric;
```

### 泛型介面（Generic Interface）

```typescript
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

// 使用時必須指定型別參數
let stringIdentity: GenericIdentityFn<string> = identityGeneric;
stringIdentity("hello"); // ✅
// stringIdentity(123);  // ❌ Error: number 不能指派給 string
```

---

## 4. 泛型類別（Generic Classes）

```typescript
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

// 使用 number 型別
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = (x, y) => x + y;
console.log(myGenericNumber.add(5, 3)); // 8

// 使用 string 型別
let myGenericString = new GenericNumber<string>();
myGenericString.zeroValue = "";
myGenericString.add = (x, y) => x + y;
console.log(myGenericString.add("Hello", " World")); // "Hello World"
```

> **注意**：泛型類別只對**實例端（instance side）**生效，`static` 成員不能使用類別的型別參數。

---

## 5. 泛型約束（Generic Constraints）

用 `extends` 關鍵字來限制泛型必須符合特定結構：

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentityConstrained<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // ✅ 保證有 .length 屬性
  return arg;
}

loggingIdentityConstrained("hello");           // ✅ string 有 .length
loggingIdentityConstrained([1, 2, 3]);         // ✅ array 有 .length
loggingIdentityConstrained({ length: 10 });    // ✅ 物件有 .length
// loggingIdentityConstrained(123);            // ❌ number 沒有 .length
```

---

## 6. 在泛型約束中使用型別參數（Using Type Parameters in Generic Constraints）

一個型別參數可以被另一個型別參數約束，確保不會存取不存在的屬性：

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let person = { name: "Alice", age: 25 };

getProperty(person, "name");  // ✅ 回傳 "Alice"
getProperty(person, "age");   // ✅ 回傳 25
// getProperty(person, "job"); // ❌ Error: "job" 不是 { name, age } 的 key
```

---

## 7. 在泛型中使用類別型別（Using Class Types in Generics）

用泛型搭配建構函式（工廠模式）：

```typescript
// 基本工廠函式
function create<Type>(c: { new (): Type }): Type {
  return new c();
}
```

### 進階範例 — 利用約束建立類別之間的關係

```typescript
class BeeKeeper {
  hasMask: boolean = true;
}

class ZooKeeper {
  nametag: string = "Mikle";
}

class Animal {
  numLegs: number = 4;
}

class Bee extends Animal {
  numLegs = 6;
  keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
  keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
  return new c();
}

console.log(createInstance(Lion).keeper.nametag); // "Mikle"
console.log(createInstance(Bee).keeper.hasMask);  // true
```

---

## 8. 泛型參數的預設型別（Generic Parameter Defaults）

TypeScript 也支援為泛型參數指定預設值：

```typescript
interface Container<Type = string> {
  value: Type;
}

let stringContainer: Container = { value: "hello" };       // Type 預設為 string
let numberContainer: Container<number> = { value: 123 };   // 明確指定為 number
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 泛型函式 | `function fn<T>(arg: T): T` | 讓函式支援多種型別 |
| 型別推論 | `fn("hello")` | TS 自動推斷型別參數 |
| 泛型介面 | `interface Fn<T> { ... }` | 定義可重用的泛型介面 |
| 泛型類別 | `class Cls<T> { ... }` | 只對實例成員生效 |
| 泛型約束 | `<T extends Constraint>` | 限制 T 必須符合特定結構 |
| `keyof` 約束 | `<K extends keyof T>` | 確保 key 是物件的有效屬性 |
| 類別型別 | `new () => T` | 表示建構函式型別 |
| 預設型別 | `<T = string>` | 為泛型參數指定預設值 |
