// first interface work like
// require obj must passed in has a label property of type string, but the obj can has more properties
// interfaces like above
function printLabel(labeledObj: { label: string} ) {
    console.log(labeledObj.label);
}

let myObj = { size: 10, label: "size 10 object" };
printLabel(myObj);
// "size 10 object"

interface LabelValue {
    label: string;
}

function printLabel1(labeledObj: LabelValue) {
    console.log(labeledObj.label);
}

let myObj1 = { size: 10, label: "size 10 object" };
printLabel1(myObj1);
// "size 10 object"

// optional properties
// not all properties of an interface may be required
interface SquareConfig {
    // each optional property denoted by a `?`
    color?: string;
    width?: number;
}

// 下面的函数类型声明对象中属性间可用","或";"隔开
function createSquare(config: SquareConfig): {color: string, area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
console.log(mySquare);
// {color: "black", area: 100}

// readonly properties
// putting `readonly` before the name of the property

interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = {x: 10, y: 20};
// p1.x = 5; // Cannot assign to 'x' because it is a read-only property.

// ReadonlyArray<T> type make sure you don't change arrays after creation
// even ReadonlyArray to a normal array is illegal
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; //  Index signature in type 'readonly number[]' only permits reading.
// ro.push(5); // Property 'push' does not exist on type 'readonly number[]'.
// ro.length = 100;// Cannot assign to 'length' because it is a read-only property.
// a = ro;// The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.

// so override it with a type assertion:
a = ro as number[];

// variables use const whereas properties use readonly

// excess property checks

// let mySquare1 = createSquare({colour: "red", width: 100});
// Argument of type '{ colour: string; width: number; }' is not assignable to parameter of type 'SquareConfig'.Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?

// easiest method is to just use a type assertion to avoid:
let mySquare2 = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
// a better approach like:
interface SquareConfig1 {
    color?: string;
    width?: number;
    // 
    [propName: string]: any;
}

let squareOptions = {colour: "red", width: 100};
let mySquare3 = createSquare(squareOptions);
console.log(mySquare3);
// {color: "white", area: 10000}

// but squareOptions and SquareConfig must have a common property
let squareOptions1 = { colour: "red"};
// let mySquare4 = createSquare(squareOptions1);
// Type '{ colour: string; }' has no properties in common with type 'SquareConfig'.

// function types
// using interface to describe a function type need give signature call like function declaration with parameter list and return type, each parameter in the parameter list requires both name and type

interface SearchFunc {
    // (parameters..): return-type
    (source: string, subString: string): boolean;
}

let mySerach: SearchFunc;
mySerach = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
// because function types to correctly type check, so names of parameters don't need to match:
let mySerach1: SearchFunc;
mySerach1 = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
// typescript's contextual typing can infer the argument types and return types
let mySerach2: SearchFunc;
mySerach2 = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
// when return type doesn't match the return-type in interface, type checker will make a error
// mySerach2 = function(src, sub) {
//     let result = src.search(sub);
//     // Type '(src: string, sub: string) => string' is not assignable to type 'SearchFunc'.
//     //   Type 'string' is not assignable to type 'boolean'.
//     return "string";
// }

// indexable types
// using `a[10]` or `ageMap["daniel"]`
// indexable type have an index signature that index-type and return-type of object

interface StringArray {
    //[indexed with number]: return string
    [index: number]: string;
}

let myArrray: StringArray;
myArrray = ["bob", "fred"];

let myStr: string = myArrray[0];

// numeric-indexer must be subtype of string-indexer in index-type
// js will actually number convert to string before indexing into an object, means 100 is same with "100"
class Animal {
    // name: string;
}
class Dog extends Animal {
    // breed: string;
}

interface NotOkay {
    //  Numeric index type 'Animal' is not assignable to string index type 'Dog'.
    // [x: number]: Animal;
    [x: string]: Dog;
}

// all properties match their return type(number)
interface NumberDictionary {
    [index: string]: number;
    length: number;// ok
    // Property 'name' of type 'string' is not assignable to string index type 'number'.
    // name: string;
}
// when index signature is union of property types, properties can different types
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number; // ok
    name: string;   // ok
}
// make index signature readonly to prevent assignment to their indices, so that can't set array
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["alice", "bob"];
// Index signature in type 'ReadonlyStringArray' only permits reading.
// myArray[2] = "mallory";


// class type: implementing an interface
// interface describe the public side of the class
// interface ClockInterface {
//     currentTime: Date;
//     setTime(d: Date): void;
// }

// class Clock implements ClockInterface {
//     currentTime: Date = new Date();
//     setTime(d: Date) {
//         this.currentTime = d;
//     }
//     constructor(h: number, m: number){}
// }

// difference between the static and instance sides of classes
// create a class to implements an construct signature interface will get an error, because class implements an interface, only instance of class is checked, but constructor in static side
// interface ClockConstructor {
//     new (hour: number, minute: number);
// }

// class Clock implements ClockConstructor {
//     currentTime: Date = new Date();
//     constructor(h: number, m: number) {}
// }

// resolve methods: 
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h:number, m: number) {}
    tick() {
        console.log("tick tick");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
digital.tick();
analog.tick();
// another way:
const Clock1:ClockConstructor = class Clock1 implements ClockInterface {
    constructor(h: number, m: number) {}
    tick() {
        console.log("meet meet");
    }
}
new Clock1(2, 3).tick();

// extending interfaces 
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;

// multiple interfaces extends
interface Shape1 {
    color: string;
}
interface PenStroke {
    penWidth: number;
}
interface Square1 extends Shape1, PenStroke {
    sideLength: number;
}

let square1 = {} as Square1;
square1.color = "blue";
square1.sideLength = 10;
square1.penWidth = 5.0;
// console.log(square1); // {color: "blue", sideLength: 10, penWidth: 5}

// hybrid types: 
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = (function (start: number) {}) as Counter;
    counter.interval = 123;
    counter.reset = function () { console.log("reset") }
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;

