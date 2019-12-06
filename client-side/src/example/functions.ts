import M = require("minimatch");

/**
 * function types：
 * 
 * typing the function：named function, anonymous function
 * ts can figure return-type by return satements(so its optional)
 * parameters and return type make up the function type
 * 
 */

// add type of parameters and return type
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number {
    return x + y;
}

// full type of the function look like: 
// write same two parts that type of arguments and return type, both parts are required(readability)
let myAdd1: (x: number, y: number) => number = function(x: number, y: number): number {
    return x + y;
}

// using arrow(=>) between parameters and return type
let myAdd2: (baseValue: number, increment: number) => number = function(x: number, y: number): number {
    return x + y;
}

// inferring the types(contextual typing): even if only have types on one side of equation

// myAdd3 has the full function type:
let myAdd3 = function(x: number, y: number): number {
    return x + y;
}

// the parameters 'x' and 'y' have the type number:
let myAdd4: (baseValue: number, increment: number) => number = function(x, y) {
    return x + y;
}

/**
 * Optional and Default Parameters:
 * 
 * given arguments numbers has to match expects parameters numbers
 * 
 */

function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

// let result1 = buildName("Bob");
// Expected 2 arguments, but got 1.
// let result2 = buildName("Bob", "Adams", "Sr.");
// Expected 2 arguments, but got 3.
let result3 = buildName("Bob", "Adams");

// optional parameters: adding a `?` to end of parameters
function buildName1(firstName: string, lastName?: string) {
    if(lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result4 = buildName1("Bob");    // work correctly now
// let result5 = buildName1("Bob", "Adams", "Sr.");
// Expected 1-2 arguments, but got 3.
let result6 = buildName1("Bob", "Adams");

// any optional parameters must follow required parameters
// default-initialized parameters: set a value if user doesn't provide or passes `undefined`:

function buildName2(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result7 = buildName2("Bob");
let result8 = buildName2("Bob", undefined);
// let result9 = buildName2("Bob", "Adams", "Sr.");
// Expected 1-2 arguments, but got 3.
let result10 = buildName2("Bob", "Adams");

// default-initialized parameters come after all required parameters are treated as optional
function buildName3(firstName: string, lastName?: string) {}

function buildName4(firstName: string, lastName = "Smith") {}

// default-initialized parameters don't need to occur after required parameters, if it comes before required parameters that need to pass `undefined`:
function buildName5(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}

// let result11 = buildName5("Bob");
// Expected 2 arguments, but got 1.
// let result12 = buildName5("Bob", "Adams", "Sr.");
// Expected 2 arguments, but got 3.
let result13 = buildName5("Bob", "Adams");
let result14 = buildName5(undefined, "Adams");

/**
 * Rest Parameters:
 * 
 * pass multiple parameters or may not know pass parameters accounts(even pass none), using `arguments` with js, using ellipsis(...) with ts
 * ellipsis is also used in the type of the function with rest parameters
 */

function buildName6(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName6;

/**
 * this:
 * 
 * top-level non-method syntax call like use window for this
 * 
 * arrow functions capture the this where the function is created rather than where it is invoked
 */

let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        let that = this;
        return function() {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);
            // 'this' implicitly has type 'any' because it does not have a type annotation. (that => this)
            // this ==> window(strict mode: ===> undefined)
            return {suit: that.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);   // card: 10 of clubs

let deck1 = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // the line below is now an arrow function, allow us to capture 'this' right here
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker1 = deck1.createCardPicker();
let pickedCard1 = cardPicker1();
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

// ts will warn you when make mistake if you pass the `--noImplictThis` flag to complier, it will point out `this` in `this.suits[pickedSuit]` is of type `any`

// unfortunately, the type of `this.suits[pickedSuit]` is still `any`, becaust it come from func-exp inside obj-literal, so to fix it can provide an explicit `this` parameter(fake parameter)

function f(this: void) {
    // make sure `this` is unusable in this standalone function
}

interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck2: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // the function now explicitly specifies that its callee must be of type Deck
    // so --noImplictThis willn't cause any errors
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
} 

let cardPicker2 = deck2.createCardPicker();
let pickedCard2 = cardPicker2();

alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);

/**
 * this parameters in callbacks(library):
 * prevent error with callbacks:
 * first: library author needs to annotate the callback type with `this`
 * 
 */

interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}

// second annotate your calling code with `this`:
class Handler {
    info: string = "";
    onClickBad(this: Handler, e: Event) {
        // oops, used `this` here. using this callback would crash at runtime
        // this.info = e.message;
    }
}

let h = new Handler();
// uiElement.addClickListener(h.onClickBad);// error

class Handler1 {
    info: string = "";
    onClickGood(this: void, e: Event) {
        // can't use `this` here because it's of type void
        console.log("clicked!");
    }
}

let h1 = new Handler1();
// uiElement.addClickListener(h.onClickBad);// error

/**
 * 
 * don't understanding behind
 * 
 */

// downside is that one arrow function is created per object of type Handler, and methods only created once and attached to Handler's prototype, and shared between all objects of type Handler
class Handler2 {
    info: string = "";
    onClickGood = (e: Event) => {
        // this.info = e.message;
    }
}

/**
 * Overloads:
 * 
 * 
 */

let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickedCard3(x: any): any{
    // check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if(typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // otherwise just let them pick the card
    else if(typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return {suit: suits[pickedSuit], card: x % 13};
    }
} 

let myDesk = [{suit: "diamonds", card: 2}, {suit: "spades", card: 10}, {suit: "hearts", card: 4}];
let pickedCard4 = myDesk[pickedCard3(myDesk)];
alert("card: " + pickedCard4.card + " of " + pickedCard4.suit);

let pickedCard5 = pickedCard3(15);
alert("card: " + pickedCard5.card + " of " + pickedCard5.suit);

// `function pickCard6(x): any` is not part of the overload list, so it only has two overloads:
let suits6 = ["hearts", "spades", "clubs", "diamonds"];

function pickedCard6(x: {suit: string; card: number}[]): number;
function pickedCard6(x: number): {suit: string; card: number};
function pickedCard6(x:any): any {
    // check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return {suit: suits6[pickedSuit], card: x % 13};
    }
}

let myDesk2 = [{suit: "diamonds", card: 2}, {suit: "spades", card: 10}, {suit: "hearts", card: 4}];
let pickedCard7 = myDesk2[pickedCard6(myDesk2)];
alert("card: " + pickedCard7.card + " of " + pickedCard7.suit);

let pickedCard8 = pickedCard6(15);
alert("card: " + pickedCard8.card + " of " + pickedCard8.suit);