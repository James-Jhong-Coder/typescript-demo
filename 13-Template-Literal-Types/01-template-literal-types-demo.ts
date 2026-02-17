// =============================================
// Template Literal Types Demo
// =============================================

// --- 1. 基本用法 ---

type World = "world";
type Greeting = `hello ${World}`;
// type Greeting = "hello world"

const greet: Greeting = "hello world"; // ✅

// --- 2. 搭配 Union — 自動展開 ---

type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

const localeId: AllLocaleIDs = "welcome_email_id"; // ✅

// --- 2.1 多個 Union 交叉組合 ---

type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

type Alignment = `${VerticalAlignment}-${HorizontalAlignment}`;
// 3 × 3 = 9 種組合

const align1: Alignment = "top-left";      // ✅
const align2: Alignment = "bottom-right";  // ✅
// const bad: Alignment = "top-top";       // ❌

// --- 3. 搭配物件 key 產生事件名稱 ---

type PropEventSource<Type> = {
  on<Key extends string & keyof Type>(
    eventName: `${Key}Changed`,
    callback: (newValue: Type[Key]) => void
  ): void;
};

declare function makeWatchedObject<Type>(
  obj: Type
): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

// eventName 自動限制為 "firstNameChanged" | "lastNameChanged" | "ageChanged"
// callback 的 newValue 型別也會自動對應
person.on("firstNameChanged", (newValue) => {
  // newValue: string
  console.log(`new first name is ${newValue.toUpperCase()}`);
});

person.on("ageChanged", (newValue) => {
  // newValue: number
  console.log(`new age is ${newValue}`);
});

// person.on("firstName", () => {}); // ❌ 不是有效的 event name

// --- 4. 搭配 infer 推斷 — 解構字串 ---

// 判斷是否以特定前綴開頭
type StartsWith<T extends string, Prefix extends string> =
  T extends `${Prefix}${infer _}` ? true : false;

type Test1 = StartsWith<"hello world", "hello">; // true
type Test2 = StartsWith<"hello world", "world">; // false

// 取得第一個字元
type FirstChar<T extends string> =
  T extends `${infer First}${infer _}` ? First : never;

type FC = FirstChar<"hello">;
// type FC = "h"

// 取得副檔名
type GetExtension<T extends string> =
  T extends `${infer _}.${infer Ext}` ? Ext : never;

type Ext = GetExtension<"image.png">;
// type Ext = "png"

// --- 4.1 遞迴替換字串 ---

type ReplaceAll<
  S extends string,
  From extends string,
  To extends string
> = From extends ""
  ? S
  : S extends `${infer Before}${From}${infer After}`
    ? ReplaceAll<`${Before}${To}${After}`, From, To>
    : S;

type Replaced = ReplaceAll<"hello-world-foo", "-", "_">;
// type Replaced = "hello_world_foo"

// --- 5. 內建字串操作型別 ---

type T1 = Uppercase<"hello">;       // "HELLO"
type T2 = Lowercase<"HELLO">;       // "hello"
type T3 = Capitalize<"hello">;      // "Hello"
type T4 = Uncapitalize<"Hello">;    // "hello"

// 搭配 Mapped Types — 自動產生 getter
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// 搭配 Mapped Types — 自動產生 setter
type Setters<Type> = {
  [Property in keyof Type as `set${Capitalize<string & Property>}`]: (
    value: Type[Property]
  ) => void;
};

type UserSetters = Setters<User>;
// { setName: (value: string) => void; setAge: (value: number) => void }

// --- 6. 實用範例 ---

// 6.1 CSS 值型別
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;

const width: CSSValue = "100px";    // ✅
const height: CSSValue = "50%";     // ✅
const margin: CSSValue = "1.5rem";  // ✅
// const bad: CSSValue = "100";     // ❌

// 6.2 路由參數提取
type ExtractParams<Path extends string> =
  Path extends `${infer _}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<`/${Rest}`>
    : Path extends `${infer _}:${infer Param}`
      ? Param
      : never;

type RouteParams = ExtractParams<"/users/:userId/posts/:postId">;
// type RouteParams = "userId" | "postId"

// 6.3 kebab-case → camelCase
type KebabToCamel<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${KebabToCamel<Capitalize<Tail>>}`
    : S;

type CamelBg = KebabToCamel<"background-color">;
// type CamelBg = "backgroundColor"

type CamelBorder = KebabToCamel<"border-top-width">;
// type CamelBorder = "borderTopWidth"

// 6.4 HTTP Method + Path 組合
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiPath = "/users" | "/posts" | "/comments";

type ApiEndpoint = `${HttpMethod} ${ApiPath}`;
// "GET /users" | "GET /posts" | "GET /comments"
// | "POST /users" | "POST /posts" | "POST /comments"
// | "PUT /users"  | ... | "DELETE /comments"
// 共 4 × 3 = 12 種組合

function callApi(endpoint: ApiEndpoint) {
  console.log(`Calling: ${endpoint}`);
}

callApi("GET /users");     // ✅
callApi("POST /posts");    // ✅
// callApi("PATCH /users"); // ❌ PATCH 不在 HttpMethod 中
