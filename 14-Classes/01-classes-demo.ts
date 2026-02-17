// =============================================
// Classes Demo
// =============================================

// --- 1. 基本屬性與 Constructor ---

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

// --- 1.1 readonly ---

class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName; // ✅ constructor 中可以
    }
  }
}

const g = new Greeter("TypeScript");
console.log(g.name); // "TypeScript"
// g.name = "other"; // ❌ Error: readonly

// --- 2. Methods ---

class Calculator {
  private value = 0;

  add(n: number): this {
    this.value += n;
    return this; // 回傳 this 實現鏈式呼叫
  }

  subtract(n: number): this {
    this.value -= n;
    return this;
  }

  getResult(): number {
    return this.value;
  }
}

const result = new Calculator().add(10).subtract(3).add(5).getResult();
console.log(result); // 12

// --- 3. Getters / Setters ---

class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  get fahrenheit(): number {
    return this._celsius * 1.8 + 32;
  }

  set fahrenheit(f: number) {
    this._celsius = (f - 32) / 1.8;
  }

  get celsius(): number {
    return this._celsius;
  }
}

const temp = new Temperature(100);
console.log(temp.fahrenheit); // 212
temp.fahrenheit = 32;
console.log(temp.celsius); // 0

// --- 4. implements — 實作介面 ---

interface Printable {
  print(): void;
}

interface Loggable {
  log(message: string): void;
}

class Report implements Printable, Loggable {
  constructor(private title: string) {}

  print() {
    console.log(`Printing: ${this.title}`);
  }

  log(message: string) {
    console.log(`[${this.title}] ${message}`);
  }
}

const report = new Report("Monthly");
report.print();           // "Printing: Monthly"
report.log("Generated");  // "[Monthly] Generated"

// --- 5. extends — 繼承 ---

class Animal {
  constructor(public name: string) {}

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }

  // 覆寫父類方法
  override move(distance: number = 5) {
    console.log("Running...");
    super.move(distance); // 呼叫父類方法
  }
}

const dog = new Dog("Rex");
dog.bark();  // "Woof! Woof!"
dog.move();  // "Running..." → "Rex moved 5m."

// --- 6. Member Visibility ---

class Person {
  public name: string;        // 任何地方都能存取（預設）
  protected age: number;      // 類別本身 + 子類
  private secret: string;     // 只有類別本身

  constructor(name: string, age: number, secret: string) {
    this.name = name;
    this.age = age;
    this.secret = secret;
  }

  getSecret() {
    return this.secret; // ✅ 類別內部可以存取 private
  }
}

class Employee extends Person {
  showAge() {
    console.log(this.age);    // ✅ 子類可以存取 protected
    // console.log(this.secret); // ❌ 子類不能存取 private
  }
}

const emp = new Employee("Alice", 30, "shhh");
console.log(emp.name);        // ✅ public
// console.log(emp.age);      // ❌ protected
// console.log(emp.secret);   // ❌ private
console.log(emp.getSecret()); // ✅ 透過 public 方法

// --- 7. Static Members ---

class Counter {
  static count = 0;

  static increment() {
    Counter.count++;
  }

  static getCount() {
    return Counter.count;
  }
}

Counter.increment();
Counter.increment();
Counter.increment();
console.log(Counter.getCount()); // 3

// --- 8. Parameter Properties — 簡寫 ---

// 一般寫法要寫很多重複的程式碼
// class User {
//   name: string;
//   email: string;
//   readonly id: number;
//   constructor(name: string, email: string, id: number) {
//     this.name = name;
//     this.email = email;
//     this.id = id;
//   }
// }

// Parameter Properties 簡寫：一行搞定宣告 + 賦值
class User {
  constructor(
    public name: string,
    public email: string,
    public readonly id: number
  ) {}
}

const user = new User("Alice", "alice@example.com", 1);
console.log(user.name, user.email, user.id);

// --- 9. Generic Classes ---

class Box<T> {
  constructor(public contents: T) {}

  replaceContents(newContents: T): Box<T> {
    return new Box(newContents);
  }
}

const stringBox = new Box("hello");
// const stringBox: Box<string>
console.log(stringBox.contents); // "hello"

const numberBox = new Box(42);
// const numberBox: Box<number>
console.log(numberBox.contents); // 42

// --- 10. Abstract Classes ---

abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;

  // 非抽象方法可以直接實作
  describe(): string {
    return `Area: ${this.getArea().toFixed(2)}, Perimeter: ${this.getPerimeter().toFixed(2)}`;
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

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number
  ) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const circle = new Circle(5);
console.log(circle.describe());
// "Area: 78.54, Perimeter: 31.42"

const rect = new Rectangle(4, 6);
console.log(rect.describe());
// "Area: 24.00, Perimeter: 20.00"

// 接受任何 Shape 的子類
function printShapes(shapes: Shape[]) {
  shapes.forEach((s) => console.log(s.describe()));
}

printShapes([circle, rect]);

// --- 11. this 型別與鏈式呼叫 ---

class QueryBuilder {
  private conditions: string[] = [];
  private _limit?: number;

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  limit(n: number): this {
    this._limit = n;
    return this;
  }

  build(): string {
    let query = `WHERE ${this.conditions.join(" AND ")}`;
    if (this._limit) {
      query += ` LIMIT ${this._limit}`;
    }
    return query;
  }
}

const query = new QueryBuilder()
  .where("age > 18")
  .where("active = true")
  .limit(10)
  .build();

console.log(query);
// "WHERE age > 18 AND active = true LIMIT 10"

// --- 12. this-based Type Guards ---

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

const fso: FileSystemObject = new FileRep("readme.md", "# Hello");

if (fso.isFile()) {
  console.log(fso.content); // ✅ 型別縮窄為 FileRep
} else if (fso.isDirectory()) {
  console.log(fso.children); // ✅ 型別縮窄為 Directory
}
