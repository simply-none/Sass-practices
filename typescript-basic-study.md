# typescript study

```bash
create-data: 2019-11-28 16:14:02
author     : yuyuanqiu
version    : v0.0.1-alpha
```

## handbook

### basic types

- `boolean`
- `number`
    - numbers are floating-point values
    - support hex, decimal, binary and octal
- `string`
    - use double, single quotes
    - use backtick/backquote for template strings, and embed expressions using `${ expr }`
- `array`
    - using `[]`
    - using generic array type like `Array<elemType>`
- `tuple`
    - an array with a fixed number and known type of elements
    - elements need not be same
    - access an outside of indices fails with an error
- `enum`
    - a helpful addition to the standard(set a more friendly names) set of datatypes
    - enums begin number is 0 by default, can change by manually set any value of numbers, like 1
    - handy feature is get name of value using numeric value
- `any`
    - descript we don't know type of variables, come from dynamic content or want to opt-out/in of type checking and pass through compile-time checks
    - handy using when you know some part of the type, but not all of it
- `void`
    - see this as the return type of functions that don't return a value
    - using it to declaring variables isn't useful, because only assign `null` (only if --strictNullChecks is not specified) or `undefined` to them
- `null` and `undefined`
    - by default null and undefined are subtypes of all other types
    - using --strictNullChecks flag (we encourage use it) that null and undefined are only assignable to any and their respective types (undefined is also assignable to void).
    - if want to pass in either a string or null or undefined, can use the union type `string | null | undefined`
- `any`
    - represent the type of value that never occur
    - return type for a function that throw an exception or never return
    - variables also acquire the type never when narrowed by any type guards that can never be true
    - it it a subtype of, and assignable to every type, but no type is subtype of or assignable to it (except itself), even isn't assignable to never
- `object`
    - represent a non-primitive type, with object type, apis like Object.create can be better represented
- type assertions
    - a way to tell the compiler that trust me and i know what i'm doing
    - useing is `angle-bracket` or `as` syntax, when using typescript with JSX, only using `as` syntax
- a not about `let`
    - JavaScript many problems are alleviated by using let

```typescript
let isDone: boolean = false;

let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

let color: string = "blue";
color = 'red';

let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ fullName }.

I'll be ${ age + 1 } years old next month.`;

// equivalent like so:
let sentence: string = "Hello, my name is " + fullName + ".\n\n" + 
    "I'll be " + (age + 1) + " years old next month.";

let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];

// declare a tuple type
let x: [string, number];
// initialize it
x = ["hello", 10];  // ok
// initialize it incorrectly
x = [10, "hello"];  // error

console.log(x[0].substring(1)); // ok
console.log(x[1].substring(1)); // error, "number" does not have "substring"

x[3] = "world"; // error, property "3" does not exist on type "[string, number]".

console.log(x[5].toString());   // error, property "5" does not exist on type "[string, number]".

enum Color {Red, Green, Blue}
let c: Color = Color.Green;

enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;

enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;

enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName); // display 'green' as its value is 2 above

let notSure: any = 4;
notSure = "Maybe a string instead";
notSure = false;    // okay, definitely a boolean

let notSure: any = 4;
notSure.ifItExists();   // okay, ifItExists might exist at runtime
notSure.toFixed();  // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed();   // error: property "toFixed" doesn't exist on type "Object".

let list: any[] = [1, true, "free"];

list[1] = 100;

function warnUser(): void {
    console.log("this is my warning message");
}

let unusable: void = undefined;
unusable = null;    // ok if `--strictNullChecks` is not given.

// not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;

// function returning never must have unreachable end point
function error(message: string): never {
    throw new Error(message);
}

// inferred return type is never
function fail() {
    return error("Something failed");
}

// function returning never must have unreachable end point
function infiniteLoop(): never {
    while（true) {
    }
}

declare function create(o: object | null): void;

create({ prop: 0}); // ok
create(null);   // ok

create("string");   // error
create(false);  // error
create(42); // error
create(undefined);  // error

let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;

let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

### variable declarations

- `var` declarations
    - scoping rules
        - var declarations are accessible anywhere, call this var-scoping or function-scoping, parameters are also function scoped
        - cause types of mistakes like can declare the same variable multiple times
    - variable capturing quirks
        - setTimeout will run after for loop, resolve that using IIFE
```typescript
var a = 10;

function f() {
    var message = "hello, world!";

    return message;
}

function f() {
    var a = 10;
    return function g() {
        var b = a + 1;
        return b;
    }
}

var g = f();
g();    // returns "11"


function f() {
    var a = 1;

    a = 2;
    var b = g();
    a = 3;

    return b;

    function g() {
        return a;
    }
}

f();    // returns "2"


function f(shouldInitialize: boolean) {
    if (shouldInitialize) {
        var x = 10;
    }

    return x;
}

f(true);    // return '10'
f(false);   // return 'undefined'


function sumMatrix(matrix: number[][]) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
    }

    return sum;
}

// variable capturing quirks
for (var i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i); }, 100 * i);
}   // output: 10 10 ... 10

for (var i = 0; i < 10; i++) {
    // capture the current state of "i"
    // by invoking a function with its current value
    (function(i) {
        setTimeout(function() {console.log(i); }, 100 * i);
    })(i);  // IIFE expression
}   // output: 0 1 2 ... 9

```

- `let` declarations
    - block scoping
        - let is call lexical scoping or block scoping, isn't visible outside of their nearest containing block or for-loop. 
        - variables declared in a catch clause also have similar scoping rules.
        - they can't be read or written to before actually declared (**temporal dead zone**), typescript report it error
        - can capture a block-scoped variable before it's declared. 
        - call function before declaration is illegal, runtime will throw an error in es6, but typescript is permissive.
    - re-declarations and shadowing
        - all declarations of x actually refer to the same x, but let not is
        - variables don't necessarily need to both be block-scoped, but need to be declared within a distinctly different block in same block-scoped.
    - block-scoped variable capturing
        - each time a scope is run, it creates an environment of variables, that environment and its captured variables can exist even after everything within its scope has finished executing.

```typescript
let hello = "hello!";

function f(input: boolean) {
    let a = 100;

    if (input) {
        // still okay to reference 'a'
        let b = a + 1;
        return b;
    }

    // error: 'b' doesn't exist here
    return b;
}


try {
    throw "oh no!";
}
catch (e) {
    console.log("oh well.");
}

// error: 'e' doesn't exist here
console.log(e);


a++;// illegal to use 'a' before it's declared;
let a;


function foo() {
    // okay to capture 'a'
    return a;
}

// illegal call 'foo' before 'a' is declared
// runtimes should throw an error here
foo();

let a;



function f(x) {
    var x;
    var x;
    
    if (true) {
        var x;
    }
}


let x = 20;
let x = 10; // error: can't re-declare 'x' in the same scope


function f(x) {
    let x = 100;    // error: interferes with parameter declaration
}

function g() {
    let x = 100;
    var x = 100;    // error: can't have both declarations of  'x'
}


function f(condition, x) {
    if (condition) {
        let x = 100;
        return x;
    }

    return x;
}

f(false, 0);    // returns '0'
f(true, 0); // returns '100'


function sumMatrix(matrix: number[][]) {
    let sum = 0;
    for (let i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        for(let i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}


function theCityThatAlwaysSleeps() {
    let getCity;

    if (true) {
        let city = "seattle";
        getCity = function() {
            return city;
        }
    }

    return getCity();
}


for (let i = 0; i < 10; i++) {
    setTimeout(function() { console.log(i);}, 100 * i);
}   // output: 0 1 ... 9
```

- `const` declarations
    - scoping rules as same as let, but can't reassign
    - but internal state of a const variable is still modifiable, typescript allow you to specify members of object are `readonly`

```typescript
const numLivesForCat = 9;
const kitty = {
    name: "Aurora",
    numLives: numLivesForCat,
}

// error
kitty = {
    name: "danielle",
    numLives: numLivesForCat
};

// all 'okay'
kitty.name = 'rory';
kitty.name = 'kitty';
kitty.name = 'cat';
kitty.numLives--;
```

- destructuring
    - array destructuring
    - tuple destructuring
    - object destructuring
        - we had to surround this statement with parentheses, js normally parses a `{` as the start of block
        - can also give different names to properties


```typescript
let input = [1, 2];
let [first, second] = input;
console.log(first); // output: 1
console.log(second);    // output: 2
// equivalent using indexing: 
first = input[0];
second = input[1];

// swap variables
[first, second] = [second, first];

function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
f([1, 2]);

let [first, ...rest] = [1, 2, 3, 4];
console.log(first); // output: 1
console.log(rest);  // output: [2, 3, 4]

let [first] = [1, 2, 3, 4];
console.log(first); // output: 1

let [, second, , fourth] = [1, 2, 3, 4];
console.log(second);    // output: 2
console.log(fourth);    // output: 4
```

```typescript
let tuple: [number, string, boolean] = [7, "hello", true];

let [a, b, c] = tuple;  // a: number, b: string, c: boolean

let [a, b, c, d] = tuple;   // Error, no element at index 3

let [a, ...bc] = tuple; // bc: [string, boolean]

let [a, b, c, ...d] = tuple;    // d: [], the empty tuple

let [a] = tuple;    // a: number
let [, b] = tuple;  // b: string
```

```typescript
let o = {
    a: "foo",
    b: 12,
    c: "bar"
};
let {a, b} = o;

({a, b} = { a: "baz", b: 101 });

let { a, ...passthrough } = o;
let total = passthrough.b + passthrough.c.length;

let { a: newName1, b: newName2 } = o;
// like
let newName1 = o.a;
let newName2 = o.b;

let {a, b}: {a:string, b:number} = o;

// `b?` indicates that b is optional
function keepWholeObject(wholeObject: {a: string, b?: number}) {
    let {a, b = 1001} = wholeObject;
}
```
