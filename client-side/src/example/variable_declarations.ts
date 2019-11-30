// 必须传入对象，表示a必须有，且b可选
type C = { a: string, b?: number }
function f1({ a, b } : C): void {
    console.log(f1);
}

f1({ a: "a-value"});

// 传入对象时a，b均可选，且可不传参
function f2({ a="", b=0} = {}): void {
    console.log(f2);
}

f2();

// 可不传入对象，当传入对象时a必须有，b可选
function f3({ a, b = 0 } = { a: "" }): void {
    console.log(f3);
}

f3({ a: "yes" });   // ok, default b = 0
f3();   // ok, default { a: "" }, then default b = 0;
// f3({}); // error, 'a' is required if you supply an argument

// spread operator is opposite of destructuring
// spread create a **shallow** copy of first and second
let first = [1, 2, [11, 22]];
let second = [3, 4];
let bothPlus = [0, ...first, ...second, 5];

console.log(bothPlus);  // [0, 1, 2, [11, 22], 3, 4, 5]

// object spread: it proceed from left-to-right
// means properties come later overwrite come earlier

let defaults = { food: "spicy", price: "$$", ambiance: "noisy"};
let search = { ...defaults, food: "rich" };

console.log(search);    
//{food: "rich", price: "$$", ambiance: "noisy"}

let search2 = { food: "rich", ...defaults };

console.log(search2);   
// {food: "spicy", price: "$$", ambiance: "noisy"}

// object spread limits:
// it only include an objects'own enumerable properties, means will lose methods of object instance
// typescript compiler doesn't allow spread of type parameters from generic functions
class D {
    p = 12;
    m() {
        return this.p;
    }
}
let d = new D();
let clone = { ...d };

console.log(clone.p);   // ok
// console.log(clone.m()); // clone.m is not a function
