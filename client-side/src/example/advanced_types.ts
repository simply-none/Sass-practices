import { join } from "path";

/**
 * Intersection Types:
 *      key-symbol: &
 *      combines multiple types into one
 *      means: an object have this type, it will have all members of all combine types
 *      use site: mixins, and no-fit classic object-orient mold
 */

 function extend<First, Second>(first: First, second: Second): First & Second {
     const result: Partial<First & Second> = {};
     for(const prop in first) {
         if (first[prop]) {
             (result as First)[prop] = first[prop];
         }
     }
     for(const prop in second) {
         // TS2339: Property 'hasOwnProperty' does not exist on type 'Second'.
         if (second[prop]) {
             (result as Second)[prop] = second[prop];
         }
     }
     return result as First & Second;
 }

class Person_at1 {
    constructor(public name: string) { }
}

interface Loggable {
    log(name: string): void;
}

class ConsoleLogger implements Loggable {
    log(name: string) {
        console.log(`hello, I'm ${name}.`);
    }
}

const jim = extend(new Person_at1("Jim"), ConsoleLogger.prototype);
console.log(ConsoleLogger.prototype); // {log: ƒ, constructor: ƒ}
jim.log(jim.name);

/**
 * Union Types:
 *      key-symbol: `|`
 *      describes a value in one of several types
 *      only access all types common members in union
 */

/**
 * Takes a string and adds "padding" to the left.
 * if 'padding' is a string, then 'padding' is appended to the left side.
 * if 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: any) {
    if (typeof padding === "number") {
        return Array(padding +1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4);  // return "     hello world"

// althrough arguments neighter number nor string, but ts allow that:
// let indentedString = padLeft("hello world", true);

// use union type instead any:
function padLeft1(value: string, padding: string | number) {
    // ...
}

// TS2345: Argument of type 'true' is not assignable to parameter of type 'string | number'.
// let indentedString1 = padLeft1("hello world", true);

// access common members only:
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

function getSmallPet(): Fish | Bird {
    return {layEggs(){}, fly(){}} as Bird;
}

let pet = getSmallPet();
pet.layEggs();  // okay
// pet.swim(); 
// TS2339: Property 'swim' does not exist on type 'Bird | Fish'.
// Property 'swim' does not exist on type 'Bird'.

/**
 * Type Guards and Differentiating Types:
 * 
 */

 let pet1 = getSmallPet();

 // each of these property accesses will cause an error
/* if (pet.swim) {
     pet.swim();
 }
 // TS2339: Property 'fly' does not exist on type 'Bird | Fish'.
//   Property 'fly' does not exist on type 'Fish'.
 else if (pet.fly) {
     pet.fly();
 } */

// let the code working, use a type assertion:
let pet2 = getSmallPet();

if ((pet2 as Fish).swim) {
    (pet2 as Fish).swim();
} else if ((pet2 as Bird).fly) {
    (pet2 as Bird).fly();
}

/**
 * User-Defined Type Guards:
 *      using type assertion in type guard(a expression)
 *          to guarantee the type in some scope when perform runtime check
 * 
 * Using  type predicates:
 *      keyword: `is`
 *      return type is a type predicate
 * 
 * Using the `in` operator:
 *      `in` as narrow expression for types
 */

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

// both calls to 'swim' and 'fly' are now okay
if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}

// `in` 
function move(pet: Fish | Bird) {
    if ("swim" in pet) {
        return pet.swim();
    }
    return pet.fly();
}

/**
 * `typeof` type guards:
 *      using only number, string, boolean, symbol
 *  
 */

 // using type predicates as follows:
 function isNumber(x: any): x is Number {
     return typeof x === "number";
 }

 function isString(x: any): x is String {
     return typeof x === "string";
 }

 function padLeft2(value: string, padding: string | number) {
     if (isNumber(padding)) {
         return Array(padding + 1).join(" ") + value;
     }
     if (isString(padding)) {
         return padding + value;
     }
     throw new Error(`expected string or number, got '${padding}'.`);
 }

 // using these checks inline: 
 function padLeft3(value: string, padding: string | number) {
     if (typeof padding === "number") {
         return Array(padding + 1).join(" ") + value;
     }
     if (typeof padding === "string") {
         return padding + value;
     }
     throw new Error(`expected string or number, got '${padding}'.`);
 }

 /**
  * `instanceof` type guards:
  *     familar with `typeof`, a way of narrow type using constructor function
  *     right of instanceof need a constructor, narrow is: 
  *         if type not is any, type is func prototype 
  *         union of types returned by type's construct signatures
  */

  interface Padder {
      getPaddingString(): string;
  }

  class SpaceRepeatingPadder implements Padder {
      constructor(private numSpaces: number) { }
      getPaddingString() {
          return Array(this.numSpaces + 1).join(" ");
      }
  }

  class StringPadder implements Padder {
      constructor(private value: string) { }
      getPaddingString() {
          return this.value;
      }
  }

function getRandomPadder() {
    return Math.random() < 0.5 ? 
        new SpaceRepeatingPadder(4):
        new StringPadder(" ");
}

// type is 'SpaceRepeatingPadder | StringPadder'
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // type narrowed to 'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder; // type narrow to 'StringPadder'
}

/**
 * Nullable types:
 * 
 *      type checker consider `null` and `undefined` assignable to anything
 * 
 *      `--strictNullChecks` flag: 
 *          declare a variable, it isn't automatically include null or undefined
 *          an optional parameter/properties automatically adds `| undefined`
 * 
 *      ts treat null and undefined different like js, ts3.7 can use optional chaining work with nullable types
 */

let s = "foo";
// s = null;   // TS2322: Type 'null' is not assignable to type 'string'.
let sn: string | null = "bar";
sn = null;  // ok
// sn = undefined; // TS2322: Type 'undefined' is not assignable to type 'string | null'.

function f_at (x: number, y?:number) {
    return x + (y || 0);
}
f_at(1, 2);
f_at(1);
f_at(1, undefined);
// f_at(1, null);// TS2345: Argument of type 'null' is not assignable to parameter of type 'number | undefined'.

class C_at {
    a: number;
    b?: number;
}
let cat = new C_at();
cat.a = 12;
// cat.a = undefined; //  TS2322: Type 'undefined' is not assignable to type 'number'.
cat.b = 13;
cat.b = undefined;
// cat.b = null; // TS2322: Type 'null' is not assignable to type 'number | undefined'.

// nullable types are implemented with union, so need to use type guard to get rid of `null`(compiler can't eliminate nullable type)
function f_at1(sn: string | null): string {
    if (sn === null) {
        return "default";
    } else {
        return sn;
    }
}
// use terser operators:
function f_at2(sn: string | null): string {
    return sn || "default";
}

// using type assert to manually remove nullable type, syntax is postfix `!`
function broken(name: string | null): string {
    // compiler can't eliminate null inside nest func(expect IIFE)
    // because it can't track calls to nest func, so its not know name type
    function postfixb(epithet: string) {
        // return name.charAt(0) + ". the " + epithet;
        //  TS2531: Object is possibly 'null'.
        return ""
    }
    name =  name || "bob";
    return postfixb("great");
}

function fixed(name: string | null): string {
    function postfixc(epithet: string) {
        return name!.charAt(0) + ". the " + epithet;// ok
    }
    name = name || "bob";
    return postfixc("great");
}

/**
 * Type Aliases:
 *      create a new name for a type(any type)
 * 
 * type aliases can also be generic
 */

type Name_at = string;
type NameResolver = () => string;
type NameOrResolver = Name_at | NameResolver;
function getName_at(n: NameOrResolver): Name_at {
    if (typeof n === "string") return n;
    else return n();
}

// as a generic:
type Container<T> = {value: T};
// refer to itself:
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
// together with intersection types(make it mind-bending):
type LinkeedList<T> = T & { next: LinkeedList<T> };

interface Person_at2 {
    name: string;
}

/* var p_at1: LinkeedList<Person_at2> = {
    name: " ",
    next: {
        name: " ",
        next: {
            name: " ",
            next: {}
        }
    }
}
var s_at1 = p_at1.name; 
var s_at1 = p_at1.next.name;
var s_at1 = p_at1.next.next.name;
var s_at1 = p_at1.next.next.next.name;
 */
// it's not appear on right side of the declaration:
// type Yikes = Array<Yikes>;// TS2314: Generic type 'Array<T>' requires 1 type argument(s).

/**
 * interfaces vs aliases:
 *      interfaces create a new name, aliases not
 *          example: error message won't use alias name
 * 
 * because ideal property is open to extension, so use interface to instead, but can't express with interface , you will use it 
 *      older version, aliases don't extend or implement(and be extended or implemented), but ts-2.7, aliases can be extended by creating a new intersection type(type a = A & {B})
 * 
 */

type Alias = {num: number};
interface Interface_at {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface_at): Interface_at;

/**
 * String Literal Types:
 *      specify exact value for string
 *  it combine with union types, type guards, type aliases: get enum-like behavior
 */

 type Easing = "ease-in" | "ease-out" | "ease-in-out";
 class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if (easing === "ease-in") {}
        else if (easing === "ease-out") {}
        else if (easing === "ease-in-out") {}
        else {throw new Error(`${easing} is not allow here.`)}
    }
 }

 let button_at = new UIElement();
 button_at.animate(0, 0, "ease-in");
//  button_at.animate(0, 0, "uneasy");// TS2345: Argument of type '"uneasy"' is not assignable to parameter of type 'Easing'

// string literal types used in distinguish overloads:
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "imput"): HTMLInputElement;
// ...more overloads...
function createElement(tagName: string): Element {
    return new Element();// its rest in doc
}

/**
 * Numeric Literal Types:
 *      useful with narrow issues and catch bugs
 */

 function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {return 1};
 function foo_at(x: number) {
     /* if (x !== 1 || x !== 2) {
         //  TS2367: This condition will always return 'true' since the types '1' and '2' have no overlap.
     } */
 }

 /**
  * Enum Member Types:
  *     all member must literal-init for this case
  */

/**
 *  Discriminated Unions:
 *      combine singleton types, union types ,type guard, type aliases (called tagged unions or algebraic data types also )
 *      useful for funcitonal program
 * 
 *      three ingredients:
 *          have a common type, singleton type property(discriminant)
 *          a union type's aliase( union )
 *          common property's type guard
 * 
 * 
 */  

 interface Square_at {
     kind: "square";
     size: number;
 }
 interface Rectangle_at {
     kind: "rectangle";
     width: number;
     height: number;
 }
 interface Circle_at {
     kind: "circle";
     radius: number;
 }

 // put to union: `kind` property is called `discriminant` or `tag`
 type Shape_ts = Square_at | Rectangle_at | Circle_at;

 // using it:
 function area(s: Shape_ts) {
     switch (s.kind) {
         case "square": return s.size * s.size;
         case "rectangle": return s.height * s.width;
         case "circle": return s.radius ** 2 * Math.PI;
     }
 }

 /**
  * exhaustiveness checking:
  *         let compiler tell us don't cover all variants of the discriminated union ways:
  *             a: turn on `--strictNullChecks`(not well in old code) and specify a return type
  *             b: using `never` type to check for exhaustiveness
  */

  // update: 
  interface Triangle_at {
      kind: "triangle";
      other: number;
  }
  type Shape_at1 = Square_at | Rectangle_at | Circle_at | Triangle_at;
  function area1(s: Shape_at1) {
      switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return s.radius ** 2 * Math.PI;
      }
      // should error here - we didn't handle case 'triangle'
  }

//   console.log(area1({kind: "square", other: 10}));
  // TS2345: Argument of type '{ kind: "square"; other: number; }' is not assignable to parameter of type 'Shape_at1'.
  // Object literal may only specify known properties, and 'other' does not exist in type 'Square_at'.

// because `switch` not exhaustive write, ts return `undefined` sometimes

 /*  function area2(s: Shape_at1): number { // TS2366: Function lacks ending return statement and return type does not include 'undefined'.
      switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return s.radius ** 2 * Math.PI;
      }
  }
   */

   // doc is `x: never`
   function assertNever(x: any): never {
       throw new Error(`unexpected object ${x}`);
   }
   function area3(s: Shape_at1) {
    switch (s.kind) {
        case "square": return s.size * s.size;
        case "rectangle": return s.height * s.width;
        case "circle": return s.radius ** 2 * Math.PI;
        default: return assertNever(s);
      }
   }
//    console.log(area3({kind: "triangle", other: 2}));

/**
 * Polymorphic `this` types:
 *      represent a subtype of contain class or interface(called F-bounded polymorphism)
 */

 class BasicCalculator {
     public constructor(protected value: number = 0) { }
     public currentValue(): number {
         return this.value;
     }
     public add(operand: number): this {
         this.value += operand;
         return this;
     }
     public multiply(operand: number): this {
         this.value *= operand;
         return this;
     }
     // ... other operations go here
 }

 let v_at = new BasicCalculator(2).multiply(5).add(1).currentValue();
 console.log(v_at); // 11

 // since class use this type, allow extend it, new class can use old methods:
 class ScientificCalculator extends BasicCalculator {
     public constructor(value = 0) {
         super(value);
     }
     public sin() {
         this.value = Math.sin(this.value);
         return this;
     }
     // ... ohter operations go here ...
 }

 let v_at1 = new ScientificCalculator(2).multiply(5).sin().add(1).currentValue();
 console.log(v_at1); // 0.4559788891106302

/**
 * Index types:
 *      function: using it, compiler can use dynamic property names to check code
 * 
 *      `keyof T`: index type query operator
 *              is union of know, public property names of T
 *      `T[K]`: indexed access operator
 *              type syntax reflects exp syntax,
 *               means `person["name"]` has the type `Person["name"]`   
 *      
 *      keyof and T[K] interact with index signatures
 *          index signature param type must be "string" or "number"
 *          
 *          string index: 
 *              keyof T => string | number, 
 *              T[string] => type of index signature
 *          number index:
 *              keyof T => number
 */


 /**
  * if like: 
  * let modelYear = pluck(taxi, ["model", "year"]);
  * so type of K is `string | number`
  * so type of K[] is `(string | number)[]`
  * type of T[K][] is type  like `[T[K1], T[K2]...]`
  */
 // using index type query and indexed access operators:
 function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
     return propertyNames.map(n => o[n]);
 }

 interface Car_at {
     manufacturer: string;
     model: string;
     year: number;
 }
 let taxi: Car_at = {
     manufacturer: "Toyota",
     model: "Camry",
     year: 2014,
 };

 // manufacturer and model are both of type string,
 // so we can pluck themm both into a typed string array:
 let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

 // if we try to pluck model and year, we get an
 // array of a union type: (string | number)[]:
 let modelYear = pluck(taxi, ["model", "year"]);

 // the union of ("manufacturer" | "model" | "year")
 // when update car properties, keyof Car will auto-update
 // using keyof in contexts, dont know property name ahead of time, so
 // compiler will check passed property whether right
 let carProps: keyof Car_at;

//  TS2322: Type 'string' is not assignable to type '"manufacturer" | "model" | "year"'.
//  pluck(taxi, ["year", "unknown"]); 

// o: T and propertyName: K  =>  o[propertyName]: T[K]
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
    return o[propertyName]; // o[propertyName] is of type T[K]
}

// according to request property to return type:
let name_at: string = getProperty(taxi, "manufacturer");
let year_at: number = getProperty(taxi, "year");
// TS2345: Argument of type '"unknown"' is not assignable to parameter of type '"manufacturer" | "model" | "year"'.
// let unknow_at = getProperty(taxi, "unknown");

/**
 * index types and index signatures:
 * 
 * 
 */

 interface Dictionary_at<T> {
     [key: string]: T;
 }
 let keys: keyof Dictionary_at<number>;  // string | number
 let values: Dictionary_at<number>["foo"];  // number

 interface Dictionary_at1<T> {
     [key: number]: T;
 }
 let keys1: keyof Dictionary_at1<number>;   // number
//  let values1: Dictionary_at1<number>["foo"];// TS2339: Property 'foo' does not exist on type 'Dictionary_at1<number>'.
let values2: Dictionary_at1<number>[42];    // number

/**
 * Mapped types:
 *    new type transforms each property in old type  
 * 
 */

 // make all properties of a type readonly or optional:
 type Readonly<T> = {
     readonly [P in keyof T]: T[P];
 }
 type Partial<T> = {
     [P in keyof T]?: T[P];
 }
 // use it: this syntax describe a type(notice)
 type PersonPartial = Partial<Car_at>;
 type ReadonlyPersion = Readonly<Car_at>;

 // add members using intersection types:
 type PartialWithNewMember<T> = {
     [P in keyof T]?: T[P];
 } & { newMember: boolean};
 // don't use the following:
 type PartialWithNewMemberError<T> = {
     [P in keyof T]?: T[P];
     // TS2693: 'boolean' only refers to a type, but is being used as a value here.
    //  newMember: boolean;
 }

 /**
  * [K in Keys]: boolean; like for...in with index signature:
  *     three parts:
  *         type variable `K`, bound to each property
  *         string literal union `Keys`, contains property names in iterate
  *         result type of property `boolean`
  */
 // simplest mapped type:
 type Keys = 'option1' | 'option2';
 type Flags = { [K in Keys]: boolean };

 // equal to:
 type FlagsCopy = {
     option1: boolean;
     option2: boolean;
 }

 // with keyof and indexed access types:
 type NullablePerson = { [P in keyof FlagsCopy]: FlagsCopy[P] | null}
 type PartialPerson = { [P in keyof FlagsCopy]?: FlagsCopy[P] }

 // useful with generic(good template, is homomorphic):
 // mapping only apply to properties of T: 
 // compiler will copy all property modifiers
 type NullableF<T> = { [P in keyof T]: T[P] | null }
 type PartialF<T> = { [P in keyof T]?: T[P] }

 // T[P] warpprd in Proxy<T> class:
 type T = {
    a: string;
    b: number;
    c: boolean;
}

 type Proxy<T> = {
     get(): T;
     set(value: T): void;
 }

 type Proxify<T> = {
     [P in keyof T]: Proxy<T[P]>;
 }

 function proxify<T>(o: T): Proxify<T> {
     // doc not it:
     return {} as Proxify<T>;
 }


 let t_at: T = {
    a: " ",
    b: 1,
    c: false,
 };
 let proxyProps = proxify(t_at);

 /**
  * (Readonly<T> , Partial<T>, Pick)( `homomorphic` ), Record included in ts-standard library
  */

  type Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  }

  type Record<K extends keyof any, T> = {
      [P in K]: T;
  }

  // no-homomorphic types: creating new properties, can't coopy property modifiers
  type ThreeStringProps = Record<'prop1' | 'prop2' | 'prop3', string>;

  /**
   * inference from mapped types:
   *    unwrapping inference only work on homomorphic mapped types
   *        if not-homomo, need explicit type
   */
  function unproxify<T>(t: Proxify<T>): T {
      let result = {} as T;
      for (const k in t) {
          result[k] = t[k].get();
      }
      return result;
  }

  let originalProps = unproxify(proxyProps);