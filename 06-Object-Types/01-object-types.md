# Object Types — 物件型別

> 對應官方文件：[Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

---

在 TypeScript 中，物件型別是我們最常使用的型別。定義物件型別有三種方式：

```typescript
// 1. 匿名物件型別
function greet(person: { name: string; age: number }) { ... }

// 2. 用 interface
interface Person {
  name: string;
  age: number;
}

// 3. 用 type alias
type Person = {
  name: string;
  age: number;
};
```

---

## 1. 屬性修飾符（Property Modifiers）

物件型別中的每個屬性可以指定：**型別**、**是否可選**、**是否唯讀**。

### 可選屬性（Optional Properties）

在屬性名稱後加上 `?`：

```typescript
interface PaintOptions {
  shape: string;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // xPos 和 yPos 的型別是 number | undefined
  let xPos = opts.xPos ?? 0; // 用 ?? 設定預設值
  let yPos = opts.yPos ?? 0;
  console.log(`Drawing at (${xPos}, ${yPos})`);
}

paintShape({ shape: "circle" });               // (0, 0)
paintShape({ shape: "circle", xPos: 100 });    // (100, 0)
```

也可以用解構搭配預設值：

```typescript
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log(`Drawing ${shape} at (${xPos}, ${yPos})`);
}
```

### 唯讀屬性（`readonly` Properties）

標記為 `readonly` 的屬性不能被重新賦值：

```typescript
interface SomeType {
  readonly prop: string;
}

function doSomething(obj: SomeType) {
  console.log(obj.prop); // ✅ 可以讀取
  // obj.prop = "hello"; // ❌ Cannot assign to 'prop' because it is a read-only property
}
```

> **注意**：`readonly` 只是在 TypeScript **型別檢查層**的限制，不會影響執行時行為。而且 `readonly` 不代表內部屬性也是唯讀的：

```typescript
interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  home.resident.age++;       // ✅ 可以修改 resident 的屬性
  // home.resident = { ... } // ❌ 不能替換整個 resident
}
```

### 索引簽名（Index Signatures）

當你不知道屬性的名稱，但知道值的型別時，可以用索引簽名：

```typescript
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["a", "b", "c"];
const item = myArray[0]; // string

// 字串索引
interface NumberDictionary {
  [key: string]: number;
  length: number;    // ✅ number 與索引簽名相容
  // name: string;   // ❌ string 與索引簽名不相容
}
```

你也可以讓索引簽名是 `readonly`，防止被修改：

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

const arr: ReadonlyStringArray = ["a", "b"];
// arr[0] = "c"; // ❌ Index signature in type 'ReadonlyStringArray' only permits reading
```

---

## 2. 擴展型別（Extending Types）

用 `extends` 讓一個 interface 繼承另一個 interface 的所有屬性：

```typescript
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

// AddressWithUnit 繼承 BasicAddress 的所有屬性，並加上 unit
interface AddressWithUnit extends BasicAddress {
  unit: string;
}
```

可以同時繼承多個 interface：

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "red",
  radius: 42,
};
```

---

## 3. 交集型別（Intersection Types）

TypeScript 提供 `&`（交集）來組合多個型別：

```typescript
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;

function draw(circle: ColorfulCircle) {
  console.log(`Color: ${circle.color}`);
  console.log(`Radius: ${circle.radius}`);
}

draw({ color: "blue", radius: 42 });
```

### `extends` vs `&` 的差異

兩者看起來很像，但處理衝突的方式不同：

```typescript
// extends：衝突會直接報錯
interface A {
  x: number;
}
// interface B extends A { x: string } // ❌ 不相容

// &：衝突會產生 never（不會報錯，但實際上無法使用）
type C = { x: number } & { x: string };
// c.x 的型別是 never（number & string = never）
```

---

## 4. 泛型物件型別（Generic Object Types）

### 問題：用 `any` 失去型別安全

```typescript
interface Box {
  contents: any;
}

// 可以放任何東西，但取出來也是 any，沒有型別檢查
```

### 解法：用泛型

```typescript
interface Box<Type> {
  contents: Type;
}

const stringBox: Box<string> = { contents: "hello" };
const numberBox: Box<number> = { contents: 42 };

// TypeScript 知道 stringBox.contents 是 string
console.log(stringBox.contents.toUpperCase());
```

泛型也可以用在 type alias 上：

```typescript
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
// = Type | Type[] | null
```

### `Array` 型別

其實 `number[]` 就是 `Array<number>` 的簡寫。`Array` 本身就是泛型型別：

```typescript
// 這兩個完全一樣
let arr1: number[] = [1, 2, 3];
let arr2: Array<number> = [1, 2, 3];
```

### `ReadonlyArray`

`ReadonlyArray<Type>` 是不能被修改的陣列：

```typescript
function doStuff(values: ReadonlyArray<string>) {
  const copy = values.slice();    // ✅ 可以讀取
  console.log(values[0]);         // ✅ 可以讀取
  // values.push("hello");        // ❌ Property 'push' does not exist
}
```

簡寫語法：`readonly string[]`

```typescript
function doStuff(values: readonly string[]) {
  // 和 ReadonlyArray<string> 一樣
}
```

> **注意**：普通陣列不能賦值給 `ReadonlyArray`（反之可以），這是單向的：

```typescript
let x: readonly string[] = ["a"];
let y: string[] = [];
x = y; // ✅
// y = x; // ❌
```

---

## 5. 元組型別（Tuple Types）

元組是一種特殊的陣列型別，**長度固定**且每個位置的型別已知：

```typescript
type StringNumberPair = [string, number];

function doSomething(pair: StringNumberPair) {
  const [str, num] = pair;
  console.log(`${str}: ${num}`);
}

doSomething(["hello", 42]);
```

元組可以有**可選元素**（用 `?`，必須在最後面）：

```typescript
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;
  console.log(`x=${x}, y=${y}, z=${z ?? "N/A"}`);
  console.log(`length: ${coord.length}`); // 2 或 3
}

setCoordinate([1, 2]);
setCoordinate([1, 2, 3]);
```

元組也可以有 **rest 元素**：

```typescript
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];

const a: StringNumberBooleans = ["hello", 1, true, false, true];
const b: StringBooleansNumber = ["world", true, false, 2];
```

### `readonly` 元組

```typescript
function readButtonInput(...args: readonly [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  console.log(`${name} v${version}, inputs: ${input}`);
}

readButtonInput("submit", 1, true, false);
```

`as const` 推斷出來的也是 `readonly` 元組：

```typescript
const point = [3, 4] as const;
// 型別是 readonly [3, 4]

function distanceFromOrigin(point: readonly [number, number]): number {
  return Math.sqrt(point[0] ** 2 + point[1] ** 2);
}

console.log(distanceFromOrigin(point));
```

---

## 重點整理

| 概念 | 說明 |
| --- | --- |
| **可選屬性** | `prop?: type`，值是 `type \| undefined` |
| **readonly** | `readonly prop: type`，不能重新賦值 |
| **索引簽名** | `[key: string]: type`，動態屬性名稱 |
| **extends** | 介面繼承，衝突會報錯 |
| **&（交集）** | 型別組合，衝突產生 `never` |
| **泛型物件** | `Box<Type>`，讓型別可重複使用 |
| **Array\<T\>** | 等同 `T[]` |
| **ReadonlyArray** | 等同 `readonly T[]`，不能修改 |
| **元組** | `[string, number]`，固定長度與型別的陣列 |
| **readonly 元組** | `readonly [string, number]`，`as const` 推斷出的也是 |
