### Sass
#### install
- use `koala`, `scout-app` or `GitHub repository with dart-sass`(need add it to your path)
- nodejs with `npm install -g sass`

#### Sass basis
```scss
// basic output
sass input.sass output.css
// watch the file anytime
sass --watch input.sass output.css
// watch all files in different path
sass --watch app/sass:public/stylesheets

// define variables
// writed with Sass or SCSS
$font-stack: monospace, sans-serif
// nesting selector with SCSS
nav {
    ul {
        font-family: $font-stack;
        margin: 0;
        padding: 0;
        list-style: none;
    }
}
// Sass partial file named leading underscore like _partial.sass
// Sass partial also include css file
// Sass partial are used with the "@use" rule
// modules only compatibility dart-sass
// refer to Sass partial file
// _base.scss
$font-stack: monospace, sans-serif;
$primary-color: #333；

body {
    font: 100% $font-stack;
    color: $primary-color;
}

// style.scss, notice the leading reference
@use 'base'

.inverse {
    background-color: base.$primary-color;
    color: white;
}

// create mixin with "@mixin" directive, use it with "@include" directive
// mixin function named transform, and also named others
@mixin transform($property) {
    -webkit-transform: $property;
    -ms-transform: $property;
    transform: $property;
}
.box { @include transform(rotate(30deg)); }
// generated into css file

.box {
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
}

// extend/inheritance use "@extend"
// pass placeholder class keep css neat and clean
%message-shared {
    border: 1px solid #ccc;
    padding: 10px;
    color: #333;
}

.message {
    @extend %message-shared;
}
.success {
    @extend %message-shared;
    border-color: green;
}
.error {
    @extend %message-shared;
    border-color: red;
}
.warning {
    @extend %message-shared;
    border-color: yellow;
}

// a handful math operator like +,-,*,/,% to calculate
.container {
    width: 100%;
}
artical[role="main"] {
    float: left;
    width: 600px / 960px * 100%; // pixel to percentage
}
aside[role="complementary"] {
    float: left;
    width: 300px / 960px * 100%;
}
```
