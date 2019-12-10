/**
 * ts type compatibility introduction:
 *  based on structural subtyping
 *
 *      structural typing: based solely on their members,
 *                         contrast with nominal typing
 *      nominal typing: based on same names
 */

interface Named {
    name: string;
}

class Person {
    name: string;
}

let named: Named;
// OK, because of structural typing
named = new Person();

/**
 * starting out:
 *      ts structural type system's basic rule:
 *          x = y -> y need all x's members
 */
interface Named1 {
    name: string;
}

let named1: Named1;
// named_1's inferred type is { name: string; location: string; }
let named_1 = { name: "Alice", location: "Seattle"};
named1 = named_1;
// named_1 = named1;
// TS2741: Property 'location' is missing in type 'Named1' but required in type '{ name: string; location: string; }'.

// same rule used in function call arguments:
function greet(n: Named1) {
    console.log("hello, " + n.name);
}
greet(named_1);// ok

/**
 * Comparing two functions:
 *      x = y -> x is including with y, x have all y's parameter
 *  allow 'discarding parameter
 */
let x2 = (a: number) => 0;
let y2 = (b: number, s: string) => 0;

y2 = x2;
// x2 = y2; 
// TS2322: Type '(b: number, s: string) => number' is not assignable to type '(a: number) => number'.

// allow discarding parameter like Array#forEach:
let items = [1, 2, 3];

// don't force these extra parameters
items.forEach((item, index, array) => console.log(item));

// should be ok
items.forEach(item => console.log(item));

// return type is: x = y -> x return type is subtype of y
let x3 = () => ({name: "Alice"});
let y3 = () => ({name: "Alice", location: "Seattle"});

x3 = y3;    // ok
// TS2322: Type '() => { name: string; }' is not assignable to type '() => { name: string; location: string; }'.
//   Property 'location' is missing in type '{ name: string; }' but required in type '{ name: string; location: string; }'.
// y3 = x3;

/**
 * Function parameter bivariance:
 *      comparing function parameter type assign success:
 *          source-param <=> target-param   (unsound)
 *          invoke func with less-specialize type, and caller give a more-specialize type (allow and common)
 *
 *          ts raise errors via compiler flag strictFunctionTypes
 */
enum EventType { Mouse, Keyboard}

interface  Event {
    timestamp: number;
}
interface MouseEvent extends Event{
    x1: number;
    y1: number;
}
interface KeyEvent extends Event{
    keyCode: number;
}

function listenEvent(eventType: EventType, handler: (n: Event) => void) {
    /* .. */
}

// unsound, but useful and common

/*
TS2345: Argument of type '(e: MouseEvent) => void' is not assignable to parameter of type
'(n: Event) => void'.
  Types of parameters 'e' and 'n' are incompatible.
    Type 'Event' is missing the following properties from type 'MouseEvent': altKey, button, but
tons, clientX, and 22 more.
 */
// listenEvent(EventType.Mouse, (e: MouseEvent) => console.log(e.x1 + "," + e.y1));

// undesirable alternatives in presence of soundness
listenEvent(EventType.Mouse, (e:Event) => console.log((e as MouseEvent).x1 + "," + (e as MouseEvent).y1));
listenEvent(EventType.Mouse, ((e: MouseEvent) => console.log(e.x1 + "," + e.y1)) as (e: Event) => void);

// still disallowed (clear error). type safety enforced for wholly incompatible types

// TS2345: Argument of type '(e: number) => void' is not assignable to parameter of type '(n:Event1) => void'.
//   Types of parameters 'e' and 'n' are incompatible.
//     Type 'Event1' is not assignable to type 'number'.
// listenEvent(EventType.Mouse, (e: number) => console.log(e));

/**
 * Optional Parameters and Rest Parameters:
 *  comparing func compatibility: optional and required parameter are interchangeable
 *
 *  rest param treat as infinite param (unsound in type system)
 *      but runtime is not enforced     (equal like pass `undefined`)
 */

// motivating example: predictable to programmer, unknown to type system of arguments number
function invokeLater(args: any[], callback: (...args: any[]) => void) {
    /* .. Invoke callback with 'args' ... */
}

// unsound - invokeLater 'might' provide any number of arguments
invokeLater([1, 2], (x, y) => console.log(x + ", " + y));

// confusing (x and y are actually required) and undiscoverable
invokeLater([1, 2], (x?, y?) => console.log(x + ", " + y));

/**
 * Enums:
 *      enums are compatible with numbers, or vice versa（反过来也是）
 *      but different enum values is incompatible
 */
enum Status {
    Ready,
    Waiting,
}
enum Color {
    Red,
    Blue,
    Green
}

let status1 = Status.Ready;
status1 = 2;
// TS2322: Type 'Color.Green' is not assignable to type 'Status'.
// status1 = Color.Green;

/**
 * Classes:
 *      work like interfaces and obj literal but with one exception:
 *          this has static and instance type
 *
 *          comparing class type, only instance type effect
 *              private and protected members effect
 *              static members and constructors no-effect compatibility
 *
 */

class Animal2 {
    feet: number;
    constructor(name: string, numFeet: number) { }
}

class Size1 {
    feet: number;
    constructor(numFeet: number) {}
}

let a3!: Animal2;
let s2!: Size1;
// TS2454: Variable 's2' is used before being assigned.
a3 = s2;    // ok
s2 = a3;    // ok


/**
 * Generics:
 *
 */
interface Empty<T> { }
let empty1!: Empty<number>;
let empty2!: Empty<string>;
// TS2454: Variable 'empty2' is used before being assigned.
// resolve it : use ! in empty2
empty1 = empty2;
// ok, because e2 matches structure e1
// and their structure arguments type isn't different

interface NotEmpty<T> {
    data: T;
}
let notEmpty1!: NotEmpty<number>;
let notEmpty2!: NotEmpty<string>;

// notEmpty1 = notEmpty2;
// TS2322: Type 'NotEmpty<string>' is not assignable to type 'NotEmpty<number>'.
//   Type 'string' is not assignable to type 'number'.

// for not specified arguments type, compatibility checker let it to `any`
let identity11 = function<T> (x: T): T {
    return x;
};
let reverse11 = function<U> (y: U): U {
    return y;
};

identity11 = reverse11; // ok , because (x: any) => any match (y: any) => any

/**
 * Advanced Topics:
 *      subtype vs assignment
 *          assignment extends subtype compatibility rules
 *              allow form `any` , and enum with numeric value
 *          type is dictated by assignment
 */