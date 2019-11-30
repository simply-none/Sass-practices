setInterval(function() {
    var date = new Date();
    if(date.getMinutes() < 20) {
        document.title = date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate() + " " + (date.getHours() - 1) + ": " + (60 + date.getMinutes() - 20) + ": " + date.getSeconds();
    } else {
    document.title = date.getFullYear() + "-" +(date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ": " + (date.getMinutes() - 20) + ": " + date.getSeconds();
    }
}, 1000)

const getArray = (value: any, times: number = 5): any[] => {
    return new Array(times).fill(value);
}

document.body.innerHTML = "<h1>hello</h1>";

console.log(getArray("abc", 1000));