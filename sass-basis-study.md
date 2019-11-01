# Sass

## basic tutorial

### install

- use `koala`, `scout-app` or `GitHub repository with dart-sass`(need add it to your path)
- nodejs with `npm install -g sass`

```scss
// in terminal
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
$primary-color: #333;

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

## syntax

### overview

two different syntaxes, each one can load the other，and sass have not braces and semicolons, is indented.

```scss
@mixin button-base() {
    @include typography(button);
    @include ripple-surface;
    @include ripple-radius-bounded;

    display: inline-flex;
    position: relative;
    height: $button-height;
    border: none;
    vertical-align: middle;

    &:hover { cursor: pointer; }

    &:disabled {
        color: $mdc-button-disabled-ink-color;
        cursor: default;
        pointer-events: none;
    }
}
```

### parsing a stylesheet

- dart sass only support utf-8
- sass decoding rules
    - utf-8/16 with U+FFFF, used corresponding decoding
    - used ASCII start with `@charset`, need used 2 step css algorithm
    - otherwise used utf-8
- parse error will be presented to user with information

### structure of a stylesheet

#### statements

- universal statements
    - variable declarations like $var: value
    - flow control at-rules like `@if` and `@each`
    - `@error`, `@warn`, `@debug` rules

- css statements except within a `@function`
    - style rules like h1 { /* ... */ }
    - css at-rules like `@media` and `@font-face`
    - mixin uses using `@include`
    - `@at-root` rule

- top-level statements(using top-level or nested)
    - module loads using `@use`
    - imports using `@import`
    - mixin definitions using `@mixin`
    - function definitions using `@function`

- other statements
    - property declarations like `width: 100px` only used within style rules and some css at-rules
    - `@extend` rule only be used within style rules

#### expressions

- totally, sass expressions are more powerful than plain css values

- literals
    - numbers, may or may not have units like 12 or 100px
    - strings, may or may not have quotes like 'Helvetica Neue' or bold
    - colors, referred to by hex representation or by name like #cccccc or blue
    - boolean literals like true or false
    - singleton null
    - lists of values separated by spaces or commas and enclosed brackets may or may not like `1.5em 1em 0 2em` or `Helvetica, arial, sans-serif` or `[col1-start]`
    - maps associate values with keys like `("background": red, "foreground": pink)`

- operations
    - `==` and `!=`
    - `+`, `-`, `*`, `/`, `%` special behavior of units, and `+`, `-`, `/` used to concatenate strings
    - `<`, `<=`, `>`, `>=`
    - `and`, `or`, `not`, every value is true except for false and null, `and` used to explicitly control the precedence order of operations

- other expressions
    - variables like `$var`
    - function call like `nth($list, 1)`
    - special functions like `calc(1px + 100%)` or `url(https://w3c.org)`
    - parent selector is `&`
    - value `!important` is parsed as an unquoted string

### comments

#### in scss

- single-line comments(silent comments) start with `//`, don't produce anything in css
- multi-line comments(loud comments) start with `/*` and end with `*/`, written somewhere if statement is allowed, can compiled to a css comment
    - contains interpolation will evaluated before css compiled
    - in compressed mode, that will strip, though begins with `/*!` will don't strip

    ```scss
    // this comment won't be included in css
    
    /* but this comment will except in compressed mode */

    /* it can also contain interpolation:
     * 1 + 1 = #{1 + 1} */
    
    /*! this comment will be included even in compressed mode */

    p /* multi-line comments can be written anywhere
       * whitespace is allowed */ .sans {
        font: Helvetica, // so can single-line comments
              sans-serif;
    }
    ```

#### sass is different with scss

- indentation-based, so `//` next line is indented, next line is comment as well
- closing `*/` is optional, but within exprssions is necessary

    ```Sass
    // this comment won't be included in css
       this is also commented out

    /*but this comment will except in compressed mode

    /* it can also contain interpolation:
     * 1 + 1 = #{1 + 1}

    /*! this comment will be included even in compressed mode

    p .sans
        font: Helvetica, /* inline comment must enclosed */ sans-serif
    ```

#### documentation comments

- using sassdoc tools to beautiful documentation, sassdoc parses text in comments as markdown
- is silent comments, written by three slashes `///` start

    ```scss
    /// computes an exponent
    ///
    /// @param {number} $base
    ///     the number to multiply by itself
    /// @param {integer (unitless)} $exponent
    ///     the number of `$base` to multiply together
    /// @return {number} `base` to the power of `$exponent`
    @function pow($base, $exponent) {
        $result: 1;
        @for $_ from 1 through $exponent {
            $result: $result * $base;
        }
        @return $result;
    }
    ```
    