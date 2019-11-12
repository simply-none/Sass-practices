// boolean
var isDone = false;
console.log(isDone);
// number: 都是浮点数
var decLiteral = 6;
var hexLiteral = 0xf00d;
var binaryLiteral = 10;
var octalLiteral = 484;
console.log(decLiteral, hexLiteral, binaryLiteral, octalLiteral);
// string: "",''；``嵌入表达式`${ expr }`
var name = "aig";
/* 编译运行出错：error TS2451: Cannot redeclare block-scoped variable 'name'.
    原因：默认状态下，typescript将dom typings作为全局运行环境，故当声明name时与dom中全局window对象下的name属性重名了
    解决方法：
        1.在tsconfig.json中更改运行环境{"compilerOptions":{"lib":["es2015"]}}
        2.封装脚本到模块内（有自己的作用域），故不会产生冲突，在末尾使用export {}
*/
name = "gia";
console.log(name);
// console.log("window: " + window.name)
var name2 = "AIG";
var age2 = 37;
var sentence = "hello, my name is " + name + "\n\ni'll be " + (age2 + 1) + " years old next month.";
console.log(sentence);
// array: 2种形式： 普通形式，使用数组泛型
var list = [1, 2, 3];
var list2 = [1, 2, 3];
console.log(list, list2);
// tuple：表示一个已知元素数量和类型的数组，各元素类型不必相同
// declare a tuple type
var x;
// initialize it
x = ["hello", 10];
// initialize it incorrectly
// x = [10, "hello"];
console.log(x);
console.log(x[0].substr(1));
// console.log(x[1].substr(1));    // Property 'substr' does not exist on type 'number'.
// 访问越界元素，会使用联合类型替代(string | numbe),即上述类型中的一种
// x[3] = "world";// error, property '3' does not exit on type '[string, number]'
// console.log(x[5].toString); // error, property '5' does not exist on type '[string, number]';
// x[6] = true; // Type 'boolean' is not assignable to type 'string | number'.
// enumerate: 默认从0开始，也可手动编号
var Color;
(function (Color) {
    Color[Color["red"] = 0] = "red";
    Color[Color["green"] = 1] = "green";
    Color[Color["blue"] = 2] = "blue";
})(Color || (Color = {}));
;
var c = Color.green;
console.log(c);
var Color2;
(function (Color2) {
    Color2[Color2["red"] = 1] = "red";
    Color2[Color2["green"] = 2] = "green";
    Color2[Color2["blue"] = 3] = "blue";
})(Color2 || (Color2 = {}));
;
var c1 = Color2.green;
console.log(c1);
var Color3;
(function (Color3) {
    Color3[Color3["red"] = 1] = "red";
    Color3[Color3["green"] = 2] = "green";
    Color3[Color3["blue"] = 4] = "blue";
})(Color3 || (Color3 = {}));
;
var c3 = Color3.green;
console.log(c3);
var Color4;
(function (Color4) {
    Color4[Color4["ren"] = 1] = "ren";
    Color4[Color4["green"] = 2] = "green";
    Color4[Color4["blue"] = 3] = "blue";
})(Color4 || (Color4 = {}));
;
// 根据数值查找映射的枚举名字
var colorName = Color4[2];
console.log(colorName);
// any: 为在编程阶段不清楚类型的变量指定一个类型
var notSure = 4;
// notSure.ifItExists();// TypeError: notSure.ifItExists is not a function
notSure.toFixed();
var prettySure = 4;
// prettySure.toFixed();//  Property 'toFixed' does not exist on type 'Object'.
var list3 = [1, true, "free"];
list3[1] = 100;
console.log(list3);
// void: 表示没有任何类型，函数无返回值类型为void
// void类型只能赋值undefined和null
var unusable = undefined;
function warnUser() {
    console.log("this is my warn message");
}
// Null 和undefined：用处不大， 为所有类型的子类型
// 当指定了--strictNullChecks标记（尽可能使用）时，只能赋给自身
// 如果想传入几种类型，可使用联合类型
// never：表示永不存在值的类型，如会抛出异常或根本就不会有返回值的函数表达式的返回值类型，变量也有可能是never
// never类型为所有类型子类型
// 返回never的函数必须存在无法达到的终点
function error(message) {
    throw new Error(message);
}
// 推断的返回值类型为never
function fail() {
    return error("something failed");
}
// 返回never的函数必须存在无法达到的终点
function infiniteLoop() {
    while (true) {
    }
}
// create({ prop: 0}); // 
// create(null);
// create(42); // error
// create("string");
// create(false);
// create(undefined);
// 类型断言：相当于类型转换，不进行数据检查和解构，只在编译阶段起作用
var someValue = "this is a string";
var strLength = someValue.length;
var someValue1 = "this is a string";
var strLength1 = (someValue1), as = string, length;
