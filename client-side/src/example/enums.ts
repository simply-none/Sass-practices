/**
 * Enums:
 * 
 * define constant set: using `enum` keyword
 * 
 * numeric, string-based enums
 * 
 */

/**
 * Numeric enums:
 * 
 * auto-incrementing behavior: useful to distinct other values in the same enum
 * 
 */

enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}

console.log(Direction.Down);    // 2

// leave off initializer:
enum Direction1 {
    Up,
    Down,
    Left,
    Right,
}

// usage: access member by enum property, declare type by enum name
enum Responce {
    No = 0,
    Yes = 1,
}

function responce(recipient: string, message: Responce): void {
    // ...
    console.log(recipient, message);
}

responce("Princess Caroline", Responce.Yes);

// numeric enums can be mixed in computed and constant members: without initializer enums need to be first or come after initializer numeric constants or come after other constant enum members
function getSomeValue():any {
    return window;
}

enum E {
    B,
    A = getSomeValue(), // computed value
    // B,  // TS1061: Enum member must have initializer.
    // C = " ", // Computed values are not permitted in an enum with string valued members.
    D = B,
    F,  // 1, come after other constant enum members
}

console.log(E.A, E.F);   // 0 1

/**
 * String enums:
 * 
 * each member has to constant-initialized with string-literal or another string enum member
 * 
 * it is serialize well(give meaningful and readable value and independent of enum member when code runs)
 */

enum Direction2 {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
    Middle = Up,
}

/**
 * Heterogeneous enums:
 * 
 * mixed with string and numeric members, it's not clear
 */

enum BooleanLikeHeterogeneousEnum {
    No = 0, 
    Yes = "YES",
}

/**
 * Computed and constant members:
 * 
 * enum member is associated with constant or computed value
 * 
 */

// first: first member without initializer, it value is `0`:
enum E1 { X }   // E.X is constant

// second: member without initializer but preceding member is numeric constant, current value will be preceding value plus one

// all enum members in 'E1' and 'E2' are constant.
enum E2 { X, Y, Z }
enum E3 { A = 1, B, C}

/* three: member is initializer with a constant enum expression(ts-exp subset), it can be fully evaluated at compile time, the enum-exp case like:
    a. literal enum exp(basically string or numeric literal)
    b. reference to previously definde constant enum member(can originate from different enum)
    c. parenthesized constant enum exp
    d. constant enum exp with unary operators(like `+`, `-`, `~`)
    e. operands(like +, -, *, /, %, <<, >>, >>>, &, |, ^) in constant enum exp, its a compile time error if that case to be evaluated to NaN or Infinity
f. other cases enum member need considered to computed
*/

enum FileAccess {
    // constant members
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    // computed member
    G = "123".length,
}

/**
 * Union enums and enum member types:
 * 
 * literal enum members(special constant enum members): 
 *  when all members have literal enum values, its a special semantics :
 *      a. enum members become types 
 *      b. enum type become union of each enum member
 */

 // a.
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

/* let c1: Circle = {
    // TS2322: Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
    kind: ShapeKind.Square,
    radius: 100,
} */

// b.
enum E3 {
    Foo,
    Bar,
}

function f4(x: E3) {
    /* if (x !== E3.Foo || x !== E3.Bar) {
        // TS2367: This condition will always return 'true' since the types 'E3.Foo' and 'E3.A' have no overlap.
    } */
}

/**
 * Enums at runtime:
 * 
 * enum are real object exist runtime
 */

enum E4 {
    X, Y, Z,
}
// it is pass around to functions:
function f5(obj: {X: number}) {
    return obj.X;
}

// works, since 'E' has a property named 'X' number
f5(E4);

/**
 * Enums at compile time:
 * 
 * use `keyof typeof` to get represent all enum keys Type as string
 * 
 */

enum LogLevel {
    ERROR, WARN, INFO, DEBUG,
}

// This is equivalent to :
// type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
    const num = LogLevel[key];
    if (num <= LogLevel.WARN) {
        console.log('log level key is: ', key);
        console.log('log level value is: ', num);
        console.log('log level message is: ', message);
    }
}

printImportant('ERROR', "This is a message");

// reverse mapping: from enum value to enum name(instead string enum member)
enum Enum {
    A,
}

let a1 = Enum.A;
let nameofA = Enum[a1]; 
console.log(nameofA); // "A"

// ts compile this like:
/* var Enum1;
(function(Enum1) {
    // store both forward(name -> value) and reverse(value -> name) mappings
    Enum1[Enum1["A"] = 0] = "A";
})(Enum1 || (Enum1 = {} ));
var a2 = Enum1.A;
var nameofA1 = Enum1[a2];
console.log(nameofA1);  // "A" */

/**
 * `const` enums:
 * 
 * avoid cost of extra generated code and indirect access enum value
 * 
 * remove it during compilation
 * 
 * its inlined at use sites
 * 
 * usage: only use constant enum exp, don't use computed member
 */

const enum Enum3 {
    A = 1,
    B = A * 2,
}

const enum Directions {
    Up,
    Down,
    Left,
    Right,
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

// generated code:
// var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];

/**
 * Ambient enums:
 * 
 * describe the shape of already existing enum types
 * 
 * a non-initializer ambient(and non-const) enum member is always considered computed, but regular enum member is considered constant if preceding enum member is constant
 */

declare enum Enum4 {
    A = 1,
    // B, // Enum member must have initializer
    C = 2, 
    // D = getSomeValue(), // In ambient enum declarations member initializer must be constant expression.
}

// console.log(Enum4.A);// Uncaught ReferenceError: Enum4 is not defined