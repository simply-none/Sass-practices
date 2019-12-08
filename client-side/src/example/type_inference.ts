/**
 * type inference basics:
 * 
 * take place in: 
 *  a. initializing variables and members
 *  b. set parameter default values
 *  c. determining function return types
 */

// used to no explicit type annotation:
// 'x1' is infer to be `number`
let x1 = 3;

/**
 * Best common type:
 * 
 * algorithm consider each candidate type, and picks the super type that is compatible with all other candidates
 * 
 * not found the best common type, resulting inference is union array type `( Rhino | Elephant | Snake )[]`
 * if there haven't super type, should explicitly provide type
 * 
 */

class Animals {}
class Rhino extends Animals {}
class Elephant extends Animals {}
class Snake extends Animals {}

let zoo: Animals[] = [new Rhino(), new Elephant(), new Snake()];

/**
 * Contextual Typing:
 * 
 * occured location: expression type is implicit
 * 
 * applied cases:
 *  a. arguments to function calls
 *  b. right sides of assignments
 *  c. type assertions
 *  d. members of object and array literals
 *  e. return statements
 */


// ts type checker used `window.onmousedown` type to infer right-hand func-exp type: 

// Parameter 'mouseEvent' implicitly has an 'any' type. `mouseEvent` => `mouseEvent: MouseEvent`
window.onmousedown = function(mouseEvent: MouseEvent) {
    console.log(mouseEvent.button); // ok
    // TS2339: Property 'kangroo' does not exist on type 'MouseEvent'.
    // console.log(mouseEvent.kangroo);  
}

// infer type in other context: 
/* window.onscroll = function(uiEvent) {
    console.log(uiEvent.button); 
    // TS7006: Parameter 'uiEvent' implicitly has an 'any' type
} */
/*
TS2322: Type '(uiEvent: UIEvent) => void' is not assignable to type '((this: GlobalEventHandlers, ev: Event) => any) & ((this: Window, ev: Event) => any)'.
Type '(uiEvent: UIEvent) => void' is not assignable to type 
'(this: GlobalEventHandlers, ev: Event) => any'.
    Types of parameters 'uiEvent' and 'ev' are incompatible. 

TS2339: Property 'button' does not exist on type 'UIEvent'.
*/

/**
 * 错误和文档显示的不一致
 */

/* window.onscroll = function(uiEvent: UIEvent) {
    console.log(uiEvent.button);
} */

// function isn't contextually typed position, function argument will implicitly typed `any` and no error(unless using `--noImplicitAny`)

/* const handler = function(uiEvent) {
    // TS7006: Parameter 'uiEvent' implicitly has an 'any' type.
    console.log(uiEvent.button);    // ok? 有错误
} */

// explicitly give type to argument to override any contextual type:

window.onscroll = function(uiEvent: any) {
    console.log(uiEvent.button);   // ok, value is undefined
}

// contextual type as candidate type in best common type:
// candidate type: [Animals], Rhino, Elephant, Snake
// best common type: Animals
function createZoo(): Animals[] {
    return [new Rhino(), new Elephant(), new Snake()];
}