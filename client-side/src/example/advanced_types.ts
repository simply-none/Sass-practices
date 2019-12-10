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
 * 
 */

