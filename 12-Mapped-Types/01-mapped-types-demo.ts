// =============================================
// Mapped Types Demo
// =============================================

// --- 1. 基本映射：把所有屬性型別改為 boolean ---

type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

interface FeatureFlags {
  darkMode: () => void;
  newUserProfile: () => void;
}

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = { darkMode: boolean; newUserProfile: boolean }

const options: FeatureOptions = {
  darkMode: true,
  newUserProfile: false,
};

// --- 2. Mapping Modifiers ---

// 2.1 移除 readonly
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
// id 和 name 不再是 readonly

const account: UnlockedAccount = { id: "1", name: "Alice" };
account.name = "Bob"; // ✅ 可以修改了

// 2.2 移除可選
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
// name 和 age 變成必填

const user: User = {
  id: "1",
  name: "Alice", // 必填
  age: 30,       // 必填
};

// --- 3. Key Remapping via `as` ---

// 3.1 用 Template Literal 產生 getter 名稱
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
// { getName: () => string; getAge: () => number; getLocation: () => string }

const lazyPerson: LazyPerson = {
  getName: () => "Alice",
  getAge: () => 30,
  getLocation: () => "Taipei",
};

console.log(lazyPerson.getName()); // "Alice"

// 3.2 用 never 過濾掉特定 key
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
// { radius: number }

// 3.3 映射任意 union
type EventConfig<Events extends { kind: string }> = {
  [E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
// { square: (event: SquareEvent) => void; circle: (event: CircleEvent) => void }

const config: Config = {
  square: (event) => console.log(event.x, event.y),
  circle: (event) => console.log(event.radius),
};

// --- 4. 搭配條件型別 ---

type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
// { id: false; name: true }

// --- 5. 手刻內建工具型別 ---

// Partial
type MyPartial<T> = { [K in keyof T]?: T[K] };

// Required
type MyRequired<T> = { [K in keyof T]-?: T[K] };

// Readonly
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// Pick
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// Record
type MyRecord<K extends keyof any, V> = { [P in K]: V };

// 驗證：這些跟內建的行為一致
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type PartialTodo = MyPartial<Todo>;
// { title?: string; description?: string; completed?: boolean }

type PickedTodo = MyPick<Todo, "title" | "completed">;
// { title: string; completed: boolean }

type PageInfo = MyRecord<"home" | "about" | "contact", { title: string }>;
// { home: { title: string }; about: { title: string }; contact: { title: string } }

const pages: PageInfo = {
  home: { title: "首頁" },
  about: { title: "關於" },
  contact: { title: "聯絡我們" },
};
