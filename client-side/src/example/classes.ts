import { Settings } from "http2";
import G = require("glob");

// # introduction: 
// using function with prototype-based inheritance or using class with object-oriented in es6+
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "hello, " + this.greeting;
    }
}

// call into the earlier defined constructor,creating a new object with `Greeter` shape, and running constructor to initialize it
let greeter = new Greeter("world");

// # inheritance:

// base class(superclass)
class Animal1 {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m`);
    }
}

// drived class(subclass)
class Dog1 extends Animal1 {
    bark() {
        console.log("woof! woof!");
    }
}

const dog = new Dog1();
dog.bark();
dog.move();
dog.bark();

class Animal2 {
    name: string;
    constructor(theName: string) {
        this.name = theName;
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

// important rule:
// 1. derived class contain constructor function must call `super()` to execute base class constructor
// 2. call `super()` before access property on `this` in constructor body
class Snake2 extends Animal2 {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse2 extends Animal2 {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 45) {
        console.log("Gallloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake2("sammy the python");
// even though tom is declared as an Animal, its value is a Horse
let tom: Animal2 = new Horse2("tommy the palomino");

sam.move();
tom.move(34);

/** 
 * # public, private, and protected modifiers
 * each member is `public` by default
 * privated members cannot be accessed form class outside
 * type is compatible that two members all  `private`(`protected`) and originated in the same declaration
 * protected members with an exception that also be accessed within deriving classes
 * protected constructor means class cannot be instantiated outside of its containing class, but can be extened.
 */

class Animal3 {
    public name: string;
    public constructor(theName: string) {
        this.name = theName;
    }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m`);
    }
}

class Animal4 {
    private name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}

// new Animal4("Cat").name;
// Property 'name' is private and only accessible within class 'Animal4'.

class Animal5 {
    private name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}

class Rhino5 extends Animal5 {
    constructor() {
        // 访问派生类的构造函数中的 "this" 前，必须调用 "super"
        // this.override_name = theName;
        super("Rhino");
    }
}

class Employee5 {
    private name: string;
    constructor(theName: string) {
        this.name = theName;
    }
}

let animal = new Animal5("Goat");
let rhino = new Rhino5();
let employee = new Employee5("Bob");

animal = rhino;
// animal = employee;
// Type 'Employee5' is not assignable to type 'Animal5'. Types have separate declarations of a private property 'name'.

class Person {
    protected name: string;
    constructor(name: string) {
        this.name = name;
    }
}

class EmployeeP extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `hello, my name is ${this.name} and i work in ${this.department}.`;
    }
}

let howard = new EmployeeP("howard", "sales");
console.log(howard.getElevatorPitch());
// console.log(howard.name);
// Property 'name' is protected and only accessible within class 'Person' and its subclasses.

class Person1 {
    protected name: string;
    protected constructor(theName: string) {
        this.name = theName;
    }
}

// EmployeeP1 can extend Person1
class EmployeeP1 extends Person1 {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `hello, my name is ${this.name} and i work in ${this.department}.`;
    }
}

let howard1 = new EmployeeP1("Howard", "Sales");
// let john = new Person1("John");
// Constructor of class 'Person1' is protected and only accessible within the class declaration

/**
 * readonly modifier: `readonly` keyword
 * readonly properties must be initialize at their declaration or constructor
 * readonly parameter properties create and initialize a member in one place
 */

class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor(theName: string) {
        this.name = theName;
    }
} 

let jerry = new Octopus("man with the 8 strong legs");
// jerry.name = "man with the 3-piece suit";
// Cannot assign to 'name' because it is a read-only property.

class Octopus1 {
    readonly numberOfLegs: number = 8; 
    constructor(readonly name: string) {

    }
}

/**
 * Accessors:
 * using `get` or `set` access to object member
 * note:
 * accessors require set compiler to output es5+
 * only `get` is automatically inferred to be  `readonly`
 * its helpful to `.d.ts` file, user can see property that cann't change it
 */

// example without getters and setter
class Employee6 {
    fullName: string = "";
}

let employee6 = new Employee6();
employee6.fullName = "Bob Smith";
if (employee6.fullName) {
    console.log(employee6.fullName);
}

// example with getter and setter
const fullNameMaxLength = 10;

class Employee7 {
    private _fullName: string = "";
    
    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (newName && newName.length > fullNameMaxLength) {
            throw new Error("fullName has a max length of " + fullNameMaxLength);
        }

        this._fullName = newName;
    }
}

let employee7 = new Employee7();
employee7.fullName = "Bob Smith";
if (employee7.fullName) {
    console.log(employee7.fullName);
}

/**
 * static properties:
 * its visible on the class itself so access it using `Class.`
 * 
 */

class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor(public scale: number) {
        
    }
}

let grid1 = new Grid(1.0);
let grid2 = new Grid(5.0);

console.log(grid1.calculateDistanceFromOrigin({x: 3, y: 4}));
console.log(grid2.calculateDistanceFromOrigin({x: 3, y: 4}));

/**
 * Abstract Classes: `abstract` keyword(or methods)
 * may not be instantiated directly
 * may contain implementation details for its members
 * 
 */

abstract class Animal {
    // implemented by derived classes and must contain abstract keyword with optional access modifiers
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}

abstract class Department1 {
    constructor(public name: string) {}

    printName(): void {
        console.log("Department name" + this.name);
    }

    abstract printMeeting(): void;// must be implemented in derived classes
}

class AccountingDepartment extends Department1 {
    constructor() {
        // constructors in derived classes must call super()
        super("Accounting and Auditing"); 
    }

    printMeeting(): void {
        console.log("the accounting department meets each monday at 10am.");
    }

    generateReports(): void {
        console.log("generating accounting reports...");
    }
}

let department1: Department1;
// Cannot create an instance of an abstract class.
// department1 = new Department1();
department1 = new AccountingDepartment();
department1.printName();
department1.printMeeting();
// Property 'generateReports' does not exist on type 'Department1'.
// department1.generateReports();

/**
 * Advanced Techniques:
 * 
 * constructor functions:
 * declare a class actully creating multiple declarations at the same time
 * first: `let greeter: Greeter1` using Greeter1 as the type of instances of the class Creeter
 * second: using `new`
 * constructor function contains all of the static members of the class
 */

class Greeter1 {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "hello, " + this.greeting;
    }
}

let greeter1: Greeter1;
greeter1 = new Greeter1("world");
console.log(greeter1.greet());

/* //using js like:
let Greeter2 = (function() {
    function Greeter2(message) {
        this.greeting = message;
    }
    Greeter2.prototype.greet = function () {
        return "hello, " + this.greeting;
    }
    return Greeter2;
})();

let greeter2;
greeter2 = new Greeter2("world");
console.log(greeter2.greet()); */

class Greeter3 {
    static standardGreeting = "hello, there";
    greeting: string = "";
    greet() {
        if(this.greeting) {
            return "hello, " + this.greeting;
        }
        else {
            return Greeter3.standardGreeting;
        }
    }
}

let greeter3: Greeter3;
greeter3 = new Greeter3();
console.log(greeter3.greet());

// the variable will hold class itself or say it will hold its constructor function
// `typeof Greeter3` is get a type of Greeter3 class itself or give the type of symbol called Greeter3(type of the constructor function)
let greeterMaker: typeof Greeter3 = Greeter3;
greeterMaker.standardGreeting = "hey there!";

let greeter4: Greeter3 = new greeterMaker();
console.log(greeter4.greet());

/**
 * using a class as an interface:
 * class declaration creates two thing: a type representing instances of class and a constructor function
 * class also create types, so can using them in be able to using interfaces place
 */

class Point {
    x: number = 0;
    y: number = 0;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
console.log(point3d);// {x: 1, y: 2, z: 3}