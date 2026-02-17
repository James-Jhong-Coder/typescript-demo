# Classes — 類別

> 對應官方文件：[Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

---

TypeScript 在 JavaScript 的 class 基礎上增加了**型別註記**和**額外語法**，讓類別更安全、更具表達力。

---

## 1. Class Members — 類別成員

### 1.1 屬性（Fields）

```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const pt = new Point(1, 2);
console.log(pt.x, pt.y); // 1, 2
```

### 1.2 屬性預設值

```typescript
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
console.log(pt.x, pt.y); // 0, 0
```

### 1.3 `readonly` 修飾符

`readonly` 屬性只能在 constructor 中賦值，之後不能再修改：

```typescript
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName; // ✅ constructor 中可以賦值
    }
  }

  changeName() {
    // this.name = "not allowed"; // ❌ Error
  }
}
```

---

## 2. Constructors — 建構函式

```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

### 2.1 Constructor Overloads

```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number);
  constructor(s: string);
  constructor(xs: number | string, y?: number) {
    if (typeof xs === "string") {
      const parts = xs.split(",");
      this.x = Number(parts[0]);
      this.y = Number(parts[1]);
    } else {
      this.x = xs;
      this.y = y!;
    }
  }
}

const p1 = new Point(1, 2);
const p2 = new Point("3,4");
```

---

## 3. Methods — 方法

```typescript
class Point {
  x = 10;
  y = 10;

  scale(n: number): void {
    this.x *= n;
    this.y *= n;
  }
}
```

---

## 4. Getters / Setters — 存取器

```typescript
class C {
  _length = 0;

  get length(): number {
    return this._length;
  }

  set length(value: number) {
    if (value < 0) {
      throw new Error("Length must be non-negative");
    }
    this._length = value;
  }
}

const c = new C();
c.length = 10;    // 呼叫 setter
console.log(c.length); // 呼叫 getter → 10
```

TypeScript 的特殊規則：
- 如果只有 `get` 沒有 `set`，屬性會自動變成 `readonly`
- `set` 的參數型別如果沒寫，會從 `get` 的回傳型別推斷

---

## 5. Index Signatures — 索引簽名

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string): boolean {
    return this[s] as boolean;
  }
}
```

---

## 6. `implements` — 實作介面

用 `implements` 檢查一個 class 是否滿足某個 interface：

```typescript
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

// ❌ Error: Class 'Ball' incorrectly implements interface 'Pingable'.
// class Ball implements Pingable {
//   pong() {
//     console.log("pong!");
//   }
// }
```

### 6.1 實作多個介面

```typescript
interface A {
  x: number;
}

interface B {
  y: number;
}

class C implements A, B {
  x = 0;
  y = 0;
}
```

### 6.2 注意：`implements` 不會改變型別

```typescript
interface Checkable {
  check(name: string): boolean;
}

class NameChecker implements Checkable {
  check(s: string) {
    // 注意：s 的型別不會自動從 interface 推斷
    // 需要自己標註
    return s.toLowerCase() === "ok";
  }
}
```

---

## 7. `extends` — 繼承

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  woof(times: number) {
    for (let i = 0; i < times; i++) {
      console.log("Woof!");
    }
  }
}

const d = new Dog();
d.move();    // 繼承自 Animal
d.woof(3);   // Dog 自己的方法
```

### 7.1 覆寫方法（Overriding Methods）

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}

class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

const d = new Derived();
d.greet();        // "Hello, world!"
d.greet("reader"); // "Hello, READER"
```

### 7.2 `override` 關鍵字（TypeScript 4.3+）

用 `override` 明確表示要覆寫父類的方法，避免打錯名字：

```typescript
class Base {
  greet() {
    console.log("Hello!");
  }
}

class Derived extends Base {
  override greet() {
    console.log("Hi!");
  }

  // ❌ Error: 'oops' does not override any member of 'Base'
  // override oops() {}
}
```

### 7.3 初始化順序

```
1. 父類的屬性初始化
2. 父類的 constructor 執行
3. 子類的屬性初始化
4. 子類的 constructor 執行
```

---

## 8. Member Visibility — 成員可見性

### 8.1 `public`（預設）

```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
// public 是預設值，可以省略不寫
```

### 8.2 `protected`

`protected` 成員只能在**類別本身**和**子類**中存取：

```typescript
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "world";
  }
}

class SpecialGreeter extends Greeter {
  public howdy() {
    // ✅ 子類中可以存取 protected 成員
    console.log("Howdy, " + this.getName());
  }
}

const g = new SpecialGreeter();
g.greet();   // ✅
g.howdy();   // ✅
// g.getName(); // ❌ Error: protected 成員不能從外部存取
```

### 8.3 `private`

`private` 成員只能在**類別本身**中存取，子類也不行：

```typescript
class Base {
  private x = 0;

  getX() {
    return this.x; // ✅ 類別內部可以存取
  }
}

class Derived extends Base {
  showX() {
    // console.log(this.x); // ❌ Error: 子類也不能存取
  }
}

const b = new Base();
// console.log(b.x); // ❌ Error: 外部不能存取
console.log(b.getX()); // ✅ 透過 public 方法存取
```

### 8.4 TypeScript `private` vs JavaScript `#`

```typescript
class Dog {
  private name: string;  // TypeScript 的 private（編譯後消失，runtime 仍可存取）
  #bark: number;          // JavaScript 的 #（真正的 runtime private）

  constructor(name: string) {
    this.name = name;
    this.#bark = 0;
  }
}
```

| | `private` | `#` |
|---|---|---|
| 檢查時機 | 編譯期 | 編譯期 + 執行期 |
| Runtime 存取 | 可以（透過 `[]`） | 完全不行 |
| 子類存取 | 不行 | 不行 |

---

## 9. Static Members — 靜態成員

靜態成員屬於**類別本身**，不屬於實例：

```typescript
class MyClass {
  static x = 0;

  static printX() {
    console.log(MyClass.x);
  }
}

console.log(MyClass.x);  // 0
MyClass.printX();         // 0

// 不能透過 instance 存取
// const obj = new MyClass();
// obj.x  // ❌
```

### 9.1 靜態成員也有可見性

```typescript
class MyClass {
  private static x = 0;

  static getX() {
    return MyClass.x; // ✅ 類別內部可以存取
  }
}

// MyClass.x;  // ❌ Error: private
MyClass.getX(); // ✅
```

### 9.2 Static Blocks

```typescript
class Foo {
  static #count = 0;

  static {
    // 靜態初始化區塊，可以存取 private static 成員
    Foo.#count = getInitialCount();
  }
}

function getInitialCount() {
  return 42;
}
```

---

## 10. Generic Classes — 泛型類別

```typescript
class Box<Type> {
  contents: Type;

  constructor(value: Type) {
    this.contents = value;
  }
}

const b = new Box("hello!");
// const b: Box<string>
console.log(b.contents); // "hello!"
```

注意：靜態成員**不能**使用泛型參數：

```typescript
class Box<Type> {
  // static defaultValue: Type; // ❌ Error
}
```

---

## 11. Parameter Properties — 參數屬性

在 constructor 參數前加上可見性修飾符或 `readonly`，可以**同時宣告並初始化**屬性：

```typescript
// 一般寫法
class Params {
  x: number;
  y: number;
  readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// 簡寫（Parameter Properties）
class Params {
  constructor(
    public x: number,
    public y: number,
    public readonly z: number
  ) {}
  // 不需要額外宣告屬性和賦值
}
```

---

## 12. Abstract Classes — 抽象類別

抽象類別**不能直接被實例化**，只能被繼承。抽象方法必須在子類中實作：

```typescript
abstract class Shape {
  abstract getArea(): number;

  printArea() {
    console.log(`Area: ${this.getArea()}`);
  }
}

// const s = new Shape(); // ❌ Error: 不能實例化抽象類別

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(5);
c.printArea(); // "Area: 78.539..."
```

### 12.1 Abstract Construct Signatures

如果要寫一個接受「抽象類別的子類」的函式：

```typescript
abstract class Shape {
  abstract getArea(): number;
}

// ❌ 不能直接用 Shape 作為 constructor 型別
// function createShape(ctor: typeof Shape) {
//   return new ctor(); // Error: 不能實例化抽象類別
// }

// ✅ 用 construct signature 限制
function createShape(ctor: new () => Shape) {
  return new ctor();
}

class Circle extends Shape {
  getArea() {
    return 0;
  }
}

createShape(Circle); // ✅
// createShape(Shape); // ❌ 不能傳入抽象類別
```

---

## 13. `this` 型別

在類別中，`this` 會動態指向目前的類別型別：

```typescript
class Box {
  contents: string = "";

  // 回傳 this 可以實現鏈式呼叫
  set(value: string): this {
    this.contents = value;
    return this;
  }
}

class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello");
// b 的型別是 ClearableBox，不是 Box
```

### 13.1 `this`-based Type Guards

```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }

  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
}

class FileRep extends FileSystemObject {
  constructor(public path: string, public content: string) {
    super();
  }
}

class Directory extends FileSystemObject {
  children: FileSystemObject[] = [];
}

const fso: FileSystemObject = new FileRep("foo.txt", "hello");

if (fso.isFile()) {
  console.log(fso.content); // ✅ 型別被縮窄為 FileRep
} else if (fso.isDirectory()) {
  console.log(fso.children); // ✅ 型別被縮窄為 Directory
}
```

---

## 重點整理

| 概念 | 語法 | 說明 |
|------|------|------|
| 屬性 | `x: number` | 類別成員屬性 |
| readonly | `readonly x: number` | 唯讀屬性，只能在 constructor 中賦值 |
| `public` | `public x` | 預設值，任何地方都能存取 |
| `protected` | `protected x` | 類別本身 + 子類可存取 |
| `private` | `private x` | 只有類別本身可存取 |
| `#` | `#x` | JavaScript 原生 private，runtime 也無法存取 |
| `static` | `static x` | 屬於類別本身，不屬於實例 |
| `extends` | `class B extends A` | 繼承 |
| `implements` | `class C implements I` | 實作介面 |
| `override` | `override method()` | 明確表示覆寫父類方法 |
| Parameter Properties | `constructor(public x: number)` | 簡寫：同時宣告 + 初始化屬性 |
| `abstract` | `abstract class / method` | 抽象類別，不能直接實例化 |
| Generic Class | `class Box<T>` | 泛型類別 |
| `this` 型別 | `method(): this` | 回傳動態的 this 型別 |
