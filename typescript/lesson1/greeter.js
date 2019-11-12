/* 安装：npm install -g typescript
        npm install -g tsc
    转换：tsc name.ts => name.js
    运行：node name.js

    在一个项目中引入node_modules模块：npm i @types/node

    多个步骤合成一步：配置json文件：npm init -y

    使用npm run start编译出错：ReferenceError: document is not defined
    解决方案：js代码是在浏览器执行的，而不是在节点中（节点没有定义全局文档对象document）
    https://stackoverflow.com/questions/18167438/error-referenceerror-document-is-not-defined

*/
var Student = (function () {
    function Student(firstName, middleInital, lastName) {
        this.firstName = firstName;
        this.middleInital = middleInital;
        this.lastName = lastName;
        this.fullName = firstName + middleInital + lastName;
    }
    return Student;
})();
function greeter(person) {
    return "hello, " + person.firstName + " " + person.lastName;
}
var user = new Student("ioiy", "aig", "xyy");
console.log(user);
// document.body.innerHTML = greeter(user); 
