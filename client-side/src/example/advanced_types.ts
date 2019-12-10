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
let indentedString = padLeft("hello world", true);

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
    return {} as Fish | Bird;
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
 */

type Name_at = string;
type NameResolver = () => string;
type NameOrResolver = Name_at | NameResolver;
function getName_at(n: NameOrResolver): Name_at {
    if (typeof n === "string") return n;
    else return n();
}
