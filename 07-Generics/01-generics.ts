// ============================================
// Generics — 泛型 範例
// ============================================

// --------------------------------------------------
// 1. 泛型的基本概念
// --------------------------------------------------

// 用 any — 失去型別資訊
function identityAny(arg: any): any {
  return arg;
}

// 用泛型 — 保留型別資訊
function identity<Type>(arg: Type): Type {
  return arg;
}

// 明確指定型別
let result1 = identity<string>("hello");

// 型別推論
let result2 = identity(42);
// result2 的型別自動推斷為 number

console.log(result1); // "hello"
console.log(result2); // 42

// --------------------------------------------------
// 2. 使用泛型型別變數
// --------------------------------------------------

// 陣列型別 — 保證有 .length
function loggingIdentity<Type>(arg: Type[]): Type[] {
  console.log(`陣列長度: ${arg.length}`);
  return arg;
}

loggingIdentity([1, 2, 3]);         // 陣列長度: 3
loggingIdentity(["a", "b"]);        // 陣列長度: 2

// --------------------------------------------------
// 3. 泛型型別與泛型介面
// --------------------------------------------------

// 泛型函式型別
let myIdentity: <T>(arg: T) => T = identity;
console.log(myIdentity("test")); // "test"

// 泛型介面
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

let stringIdentity: GenericIdentityFn<string> = identity;
console.log(stringIdentity("hello generic interface")); // "hello generic interface"

// --------------------------------------------------
// 4. 泛型類別
// --------------------------------------------------

class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

// 用 number
const myNum = new GenericNumber<number>();
myNum.zeroValue = 0;
myNum.add = (x, y) => x + y;
console.log(myNum.add(10, 20)); // 30

// 用 string
const myStr = new GenericNumber<string>();
myStr.zeroValue = "";
myStr.add = (x, y) => x + y;
console.log(myStr.add("Hello", " World")); // "Hello World"

// --------------------------------------------------
// 5. 泛型約束（Generic Constraints）
// --------------------------------------------------

interface Lengthwise {
  length: number;
}

function logWithLength<Type extends Lengthwise>(arg: Type): Type {
  console.log(`長度: ${arg.length}`);
  return arg;
}

logWithLength("hello");           // 長度: 5
logWithLength([1, 2, 3]);         // 長度: 3
logWithLength({ length: 99 });    // 長度: 99
// logWithLength(123);            // ❌ Error: number 沒有 .length

// --------------------------------------------------
// 6. 在泛型約束中使用型別參數（keyof）
// --------------------------------------------------

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

const person = { name: "Alice", age: 25, city: "Taipei" };

console.log(getProperty(person, "name"));  // "Alice"
console.log(getProperty(person, "age"));   // 25
console.log(getProperty(person, "city"));  // "Taipei"
// getProperty(person, "job");             // ❌ Error: "job" 不在 keyof person 中

// --------------------------------------------------
// 7. 在泛型中使用類別型別（工廠模式）
// --------------------------------------------------

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

// --------------------------------------------------
// 8. 泛型參數預設值
// --------------------------------------------------

interface Container<Type = string> {
  value: Type;
}

const strContainer: Container = { value: "default is string" };
const numContainer: Container<number> = { value: 42 };

console.log(strContainer.value); // "default is string"
console.log(numContainer.value); // 42

// --------------------------------------------------
// 9. 實用範例：泛型工具函式
// --------------------------------------------------

// 把陣列的第一個元素取出
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

console.log(getFirst([10, 20, 30]));       // 10
console.log(getFirst(["a", "b", "c"]));    // "a"
console.log(getFirst([]));                 // undefined

// 泛型的 Map 轉換函式
function mapArray<Input, Output>(
  arr: Input[],
  fn: (item: Input) => Output
): Output[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3, 4];
const doubled = mapArray(numbers, (n) => n * 2);
console.log(doubled); // [2, 4, 6, 8]

const strings = mapArray(numbers, (n) => `#${n}`);
console.log(strings); // ["#1", "#2", "#3", "#4"]

// 泛型的 Pair 型別
interface Pair<A, B> {
  first: A;
  second: B;
}

function makePair<A, B>(a: A, b: B): Pair<A, B> {
  return { first: a, second: b };
}

const pair1 = makePair("name", 42);
console.log(pair1); // { first: "name", second: 42 }

const pair2 = makePair(true, [1, 2, 3]);
console.log(pair2); // { first: true, second: [1, 2, 3] }
