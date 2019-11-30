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
