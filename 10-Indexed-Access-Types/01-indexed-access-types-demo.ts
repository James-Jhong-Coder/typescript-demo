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


type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
// type T1 = string

type T2 = Foo<{ a: string; b: number }>;
