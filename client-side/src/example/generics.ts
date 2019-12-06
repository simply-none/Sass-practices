/**
 * Hello World of Generics:
 * 
 * using `<>` rather than `()`
 */

// without generics:
function identity(arg: number): number {
    return arg;
}

// using `any` that losing information of type
function identity1(arg: any): any {
    return arg;
}

// with generics `type variable` named T:
// don't lose any information 
function identity2<T>(arg: T): T {
    return arg;
}

// call it in two ways: 
// first: pass all of arguments including type arguments:
let output = identity2<string>("myString"); // type of output will be 'string'

// second(common most): want compiler to set value of T for automatically based on passed in arguments:
let output1 = identity2("myString"); // type of output will be 'string'

/**
 * Working with Generic Type Variables:
 * 
 * `generic represent any and all types`
 */

function loggingIdentity<T>(arg: T): T {
    // console.log(arg.length);
    // Property 'length' does not exist on type 'T'.
    return arg;
}

// generic function take a type parameter T, and argument arg is an array of T, return array of T
function loggingIdentity1<T>(arg: T[]): T[] {
    console.log(arg.length); // array has a .length, so no more error.
    return arg;
}
// same example: 
function loggingIdentity2<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);
    return arg;
}

/**
 * Generic Types:
 * 
 * can create generic class and interfaces, but don't create generic enums and namespaces
 */

// type of generic function:
function identity3<T>(arg: T): T {
    return arg;
}

let myIdentity3: <T>(arg: T) => T = identity3;

// generic type parameter also have different name, so long as number of type variables is line up
function identity4<T>(arg: T): T {
    return arg;
} 

let myIdentity4: <U>(arg: U) => U = identity4;

// write generic type as a call signature of an object literal type:
function identity5<T>(arg: T): T {
    return arg;
}

let myIdentity5: {<T>(arg: T): T} = identity5;

//write generic interface using above example:
interface GenericIdentityFn {
    <T>(arg: T): T;
} 

function identity6<T>(arg: T): T {
    return arg;
}

let myIdentity6: GenericIdentityFn = identity6;

// write generic interface and let see the certain type:(e.g. Dictionary<string> rather than Dictionary):
interface GenericIdentityFn1<T> {
    (arg: T): T;
}

function identity7<T>(arg: T): T {
    return arg;
}

let myIdentity7: GenericIdentityFn1<number> = identity7;

/**
 * Generic Classes:
 * 
 * 
 */

class GenericNumber<T> {
    // TS2564: Property 'zeroValue' has no initializer and is not definitely assigned in the constructor.
    // resolve it: using `!` like name!: string;
    // or tsconfig.json: "strictPropertyInitialization": false(old ts version)
    zeroValue!: T;
    add!: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {return x + y;};

let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) {return x + y;};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));

// generic classes are only generic over their instance side rather than static side, so static members cann't use the class's type parameter

/**
 * Generic Constraints:
 * 
 * 
 */

interface Lengthwise {
    length: number;
}

function loggingIdentity3<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // now we konw it has a .length property, so no more error
    return arg;
}

// because generic function is constrained, it will no longer work over any and all types: 
// loggingIdentity3(3);  // error, number doesn't have a .length property

// we need to pass in values whose type has all the required properties:
loggingIdentity3({length: 10, value: 3});

/**
 * Using Type Parameter in Generic Constraints:
 * 
 * 
 */

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = {a: 1, b: 2, c: 3, d: 4};

getProperty(x, "a");    // okay
// getProperty(x, "m");    // TS2345: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.

/**
 * Using Class Types in Generics:
 * 
 * 
 */

function create<T>(c: {new(): T;}): T {
    return new c();
}


/**
 * 
 * understanding cann't
 */
class BeeKeeper {
    hasMask!: boolean;
}

class ZooKeeper {
    nametag!: string;
}

class Animal1 {
    numLegs!: number;
}

class Bee extends Animal1 {
    keeper!: BeeKeeper;
}

class Lion extends Animal1 {
    keeper!: ZooKeeper;
}

function createInstance<A extends Animal1>(c: new() => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;    // typechecks
createInstance(Bee).keeper.hasMask; // typechecks
