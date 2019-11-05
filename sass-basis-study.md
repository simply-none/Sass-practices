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

### special functions

#### url()

- `url()` can take either a quoted or unquoted url, when is a **unquoted url is invalid sass-exp**, so need special logic to parse it
- url's arguments is valid unquoted url, parse it as-is, although may used interpolation
- it's invalid unquoted url, it's parsed as a normal plain css function call

    ```scss
    $roboto-font-path: "../fonts/roboto";

    @font-face {
        // this is parsed as a normal function call that takes a quoted string
        src: url("#{$roboto-font-path}/Roboto-thin.woff2") format("woff2");

        font-family: "Roboto";
        font-weight: 100;
    }

    @font-face {
        // this is parsed as a normal function call that takes an arithmetic expression
        src: url($roboto-font-path + "/Roboto-light.woff2") format("woff2");

        font-family: "Roboto";
        font-weight: 300;
    }

    @font-face {
        // this is parsed as an interpolated special function
        src: url(#{$roboto-font-path}/Roboto-regular.woff2) format("woff2");

        font-family: "Roboto";
        font-weight: 400;
    }
    ```

#### calc(), element(), progid:...(), and expression()

- css spec(special parsing): calc() mathematical expressions conflict with sass's arithmetic and element()'s id could be parsed as colors
- expression() beginning with progid: is ie-legacy, recent browsers no longer supports, and sass continue to parse them for backwards compatibility
- **function calls allows any text, including nested parentheses, but interpolation inject dynamic values with exception, nothing is interpreted**

    ```scss
    .logo {
        $width: 800px;
        width: $width;  // width: 800px;
        position: absolute;
        left: calc(50% - #{$width / 2}); // left: calc(50% - 400px);
        top: 0;
    }
    ```

#### min() and max()

- libsass and rubsass parsed them as sass function, so create a plain css need using unquoted function call like`min(#{$padding}, env(safe-area-inset-left))`
- call contains sassscript feature like variables or funtion calls, it's parsed as a call to sass's core min() or max()
- call is valid plain css, like nested calls to calc(), env(), var(), min(), max() and interpolation, it's compiled to a css call

    ```scss
    $padding: 12px;

    .post {
        // since these max() calls don't use any sass features other than interpolation, they're compiled to csss max() calls
        padding-left: max(#{$padding}, env(safe-area-inset-left));
        padding-right: max(#{$padding}, env(saft-area-inset-right));
    }

    .sidebar {
        // since these refer to a sass variable without interpolation, they call sass's bulit-in max() function
        padding-left: max($padding, 20px);
        padding-right: max($padding, 20px);
    }
    ```

## style rules

### overview

#### nesting

- automatically combine the outer rule's selector with the inner rules

    ```scss
    nav {
        ul {
            margin: 0;
            padding: 0;
            list-style: none;
        }

        li { display: inline-block;}

        a {
            display: block;
            padding: 6px 12px;
            text-decoration: none;
        }
    }

- heads-up should keep nested don't deep
- selector lists: complex selector is nested separately and then combined back into a selector list

    ```scss
    .alert, .warning {
        ul, p {
            margin-right: 0;
            margin-left: 0;
            padding-bottom: 0
        }
    }
    ```

- selector combinators: put the combinator at the end of the outer selector, and the beginning of the inner selector, or even all on its own in between the two(两级之间)

    ```scss
    ul > {
        li {
            list-style-type: none;
        }
    }

    h2 {
        + p { 
            border-top: 1px solid gray;
       }
    }

    // p ~ span { opacity: 0.8;}
    p {
        ~ {
            span {
                opacity: 0.8;
            }
        }
    }
    ```

#### interpolation

- use interpolation to inject values into selectors(useful for mixins)
- sass only parses selector after interpolation is resolved
- combine interpolation with parent selector(&), the @at-root, and selector function when dynamically generating selector.

    ```scss
    @mixin define-emoji($name, $glyph) {
        // span.emoji-women-holding-hands {}
        span.emoji-#{$name} {
            font-family: IconFont;
            font-variant: normal;
            font-weight: normal;
            content: $glyph;
        }
    }

    @include define-emoji("women-holding-hands", "👭");
    ```

### property declarations

#### interpolation

- a declaration's value can be any sassscript expression and will be evaluated and included in the result
- property's name can include interpolation partly or entire property name

    ```scss
    .circle {
        $size: 100px;
        width: $size;
        height: $size;
        border-radius: $size / 2;
    }

    @mixin prefix($property, $value, $prefixes) {
        @each $prefix in $prefixes {
            -#{$prefix}-#{$property}: $value;
        }
        #{$property}: $value;
    }

    .gray {
        @include prefix(filter, graysacle(50%), moz webkit);
    }
    ```

#### nesting

- allowing property declarations to be nested
- write both the shorthand value and the more explicit nested versions

    ```scss
    .enlarge {
        font-size: 14px;
        transition: {
            property: font-size;
            duration: 4s;
            delay: 2s;
        }

        &:hover { font-size: 36px; }
    }

    .info-page {
        margin: auto {
            bottom: 10px;
            top: 2px;
        }
    }
    ```

#### hidden declarations

- declarations's value is null or an empty unquoted string, won't compile that declaration to css

    ```scss
    $rounded-corners: false;

    .button {
        border: 1px solid blank;
        // won't compile to css
        border-radius: if($rounded-corners, 5px, null);
    }
    ```

#### custom properties(自定义属性)

- using older versions of lib/ruby-sass recommended use interpolation to inject sassscript values for forwards-compatibility
- that look like sassscript are parsed to css as-is, interpolation is exception, it's inject dynamic values into custom properties
- interpolation removes quotes from string make it difficult to use quoted string, so can use the `meta.inspect()` function to preserve quotes 

    ```scss
    $primary: #81899b;
    $accent: #302e24;
    $warn: #dfa612;

    :root {
        --primary: #{$pramiry};
        --accent: #{$accent};
        --warn: #{$warn};

        // even though this looks like a sass variable, it's valid css so it's not evaluated(原样输出)
        --consumed-by-js: $primary;
    }

    @use "sass:meta";

    $font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    $font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas;

    :root {
        --font-family-sans-serif: #{meta.inspect($font-family-sans-serif)};
        --font-family-monospace: #{meta.inspect($font-family-monospace)};
    }
    ```

### parent selector(&)

#### overview

- adding a pseudo-class or adding a selector before the parent
- parent selector could be replaced by a type selector like h1, so it's only allowed at the beginning of compound selectors when type selector be allowed, like span& is not allowed

    ```scss
    .alert {
        // the parent selector can be used to add pseudo-classes to the outer selecotr
        &:hover {
            font-weight: bold;
        }

        // it can also be used to style the outer selector in a certain context
        // such as a body set to use a right to left language
        [dir=rtl] & {
            margin-left: 0;
            margin-right: 10px;
        }

        // you can even use it as an argument to pseudo-class selectors
        :not(&) {
            opacity: 0.8;
        }
    }
    ```

#### adding suffixes

- useing the parent selector to add extra suffixes to outer selector(useful in **BEM**
- as long as outer selector ends with an alphtnumeric name like class, id, ele-selector useing parent selector additional text

    ```scss
    .accordion {
        max-width: 600px;
        margin: 4rem auto;
        width: 90%;
        font-family: "Raleway", sans-serif;
        background: #f4f4f4;

        &__copy {
            display: none;
            padding: 1rem 1.5rem 2rem 1.5rem;
            color: gray;
            line-height: 1.6;
            font-size: 14px;
            font-weight: 500;

            &--open {
                display: block;
            }
        }
    }

    ```

#### in sassscript

- parent selector can also be used within sassscript and return the current parent selector(lists)
- & is used outside any style rules and return null

    ```scss
    .main aside:hover,
    .sidebar p {
        // parent-selector: .main aside:hover, .sidebar p;
        parent-selector: &;
        // => ((unquote(".main") unquote("aside:hover")), (unquote(".sidebar") unquote("p")))
    }

    @mixin app-background($color) {
        #{if(&, "&.app-background", ".app-background")} {
            background-color: $color;
            color: rgba(#fff, 0.75);
        }
    }

    // .app-background {}
    @include app-background(#036);

    // .sidebar.app-background {}
    .sidebar {
        @include app-background(#c6538c);
    }
    ```

#### advanced nesting

- use & as a normal sassscript expression, means can pass it to function or include in interpolation, using it in combination with selector functions and the @at-root rule allows you to nest selector
- write a selector match outer selector and element selector, could write a mixin using `selector.unify` function to combine & with user's selector

    ```scss
    @use "sass:selector";

    @mixin unify-parent($child) {
        @at-root #{selector.unify(&, $child)} {
            @content;
        }
    }

    .wrapper .field {
        // .wrapper input.field {}
        @include unify-parent("input") {
            /*...*/
        }

        // .wrapper select.field {}
        @include unify-parent("select") {
            /*...*/
        }
    }
    ```

### placeholder selectors(%)

- it starts with a `%` and if it isn't extended and mandate, it's not included in the css output

    ```scss
    // first
    // .alert:hover {}
    .alert:hover, %strong-alert {
        font-weight: bold;
    }

    %strong-alert:hover {
        color: red;
    }

    // second
    /* .action-buttons, .reset-buttons {}
       .action-buttons:hover, .reset-buttons:hover {}
    */
    %toolbelt {
        box-sizing: border-box;
        border-top: 1px rgba(#000, .12) solid;
        padding: 16px 0;
        width: 100%;

        &:hover { border: 2px rgba(#000, .5) solid; }
    }

    .action-buttons {
        @extend %toolbelt;
        color: #4285f4;
    }

    .reset-buttons {
        @extend %toolbelt;
        color: #cddc39;
    }
    ```

## variables($)

### overview

- begin with `$`, it can be declared anywhere
- css varibales can have different values for different elements, but sass variables only have one value at a time
- sass variables are imperative means use a variable and then change its value, the earlier use will stay the same, but css varibales are declarative means change the value, will affect both earlier and later
- sass variables treat hyphens and underscores as identical like `$font-size === $font_size`

    ```scss
    $variable: value 1;
    .rule-1 {
        // value: value 1;
        value: $variable;
    }

    $variable: value 2;
    .rule-2 {
        // value: value 2;
        value: $variable;
    }
    ```

### default values

- sass provides the `!default` flag(allow users to configure css), this assigns a value to a variables only if that variable isn't defined or its value is null, otherwise existing value will be used
- only dart sass support @use, other must use @import rule
- to load a module with configuration write @use <url> with(<variable>: <value>), the configured values will override the default value(only !default configured in top level)

    ```scss
    // _library.scss
    $black: #000 !default;
    $border-radius: 0.25rem !default;
    $box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

    code {
        border-radius: $border-radius;
        box-shadow: $box-shadow;
    }

    // style.scss

    @use 'library' with (
        $black: #222;
        $border-radius: 0.1rem;
    )
    ```

### scope

- those declare in blocks are usually local, and only be accessed within the block they were declare
- local variables can even be declared with the same name as a global variable, there are two different variables
- set a global variables value from within a local scope using the `!global` flag, it only be used to already been declared at the top level of a file. but older sass version can used doesn't exist variables yet
- variables declare in flow control rules have special scoping, they don't shadow the same level variable, it can assign to existing variables in the outer scope, but the variables should declared before you assign to it, even if you need to declare it as null

    ```scss
    // first
    $global-variable: global value;

    .content {
        $local-variable: local value;
        global: $global-variable;
        local: $local-variable;
    }

    .sidebar {
        global: $global-variable;

        // this would fail, because $local-variable isn't in scope:
        // local: $local-variable;
    }

    // second
    $variable: global value;

    .content {
        $variable: local value;
        value: $variable;
    }

    .sidebar {
        value: $variable;
    }

    //three
    $variable: first global value;

    .content {
        $variable: second global value !global;
        value: $variable;
    }

    .sidebar {
        value: $variable;
    }

    // four
    $dark-theme: true !default;
    $primary-color: #f8bbd0 !default;
    $accent-color: #6a1b9a !default;

    @if $dark-theme {
        $primary-color: darken($primary-color, 60%);
        $accent-color: lighten($accent-color, 60%);
    }

    .button {
        // background-color: #750c30;
        background-color: $primary-color;
        border: 1px solid $accent-color;
        border-radius: 3px;
    }
    ```

### advanced variable function

- sass core library provides functions for working with variables, `meta.variable-exists()` function return whether a variable with the given name exists in the current scope, and the `meta.global-variable-exists()` function does the same for global scope
- using interpolation to define a variable name based on another variable, you should define a map from names to values that you can then access using variables

    ```scss
    @use "sass:map";

    $theme-colors: {
        "success": #28a745;
        "info": #17a2b8;
        "warning": #ffc107;
    };

    .alert {
        // instead of $theme-color-#{warning}
        //background-color: #ffc107;
        background-color: map.get($theme-colors, "warning");
    }
    ```

## interpolation

### overview

- it can be used almost anywhere in `#{}` in any of the following places:
    - selectors in style rules
    - property names in declarations
    - custom property values
    - css at-rules
    - @extends
    - plain css @import
    - quoted for unquoted strings
    - special functions
    - plain css function names
    - loud comments
    
    ```scss
    @mixin corner-icon($name, $top-or-bottom, $left-or-right) {
        .icon-#{$name} {
            background-image: url("/icons/#{$name}.svg");
            position: absolute;
            #{$top-or-bottom}: 0;
            #{$left-or-right}: 0;
        }
    }

    @include corner-icon("mail", top, left);
    ```

#### in sassscript

- lib-ruby sass use an older syntax for parsing interpolation in sassscript, but it can behave strangely around operators
- interpolation can be used in scssscript to inject scssscript into unquoted strings(useful with dynamically generating names or using slash-sparated values), and always returns an unquoted string
- in fact, it's rarely necessary using in sass-exp, you can instead of writing color: #{$accent} using color: $accent
- using interpolation with numbers is bad, sass have powerful unit arithmetic, so insted of #{$width}px using $width * 1px or better, but if $width already has units, 1px should remove unit otherwise its will error

    ```scss
    @mixin inline-animation($duration) {
        $name: inline-#{unique-id()};

        @keyframes #{$name} {
            @content;
        }

        animation-name: $name;
        animation-duration: $duration;
        animation-iteration-count: infinite;
    }

    .pulse {
        @include inline-animation(2s) {
            from {background-color: yellow; }
            to { background-color: red; }
        }
    }
    ```
    ```css
    .pulse {
        animation-name: inline-un9b7mrf8;
        animation-duration: 2s;
        animation-iteration-count: infinite;
    }

    @keyframes inline-un9b7mrf8 {
        from {
            background-color: yellow;
        }
        to {
            background-color: red;
        }
    }
    ```

#### quoted strings

- the exception that the quotation marks around quoted strings are remove, it's possible to write quoted strings that contains sassscript not allowed syntax
- clearly using `string.unquote()` function instead of `#{$string}`, example `string.unquote($string)`

    ```scss
    .example {
        // unquoted: string;
        unquoted: #{"string"};
    }
    ```

## at-rules

### overview

- much of sass's extra functionality comes in the form of new at-rules it add on top of css
    - `@use`: loads mixins, functions, and variables from  sass-stylesheets
    - `@forward`: loads a sass-stylesheet and makes its mixins, func, var
    - `@import`: extends css at-rule to load styles, mixins, func, var from other-stylesheets
    - `@mixin` and `@include`: re-use chunks of styles
    - `@function`: defines custom function
    - `@extend`: inherit styles
    - `@at-root`: puts styles within it at the root of the css document
    - `@error`: causes compilation to fail with an err-msg
    - `@warn`: prints a msg without stopping compilation
    - `@debug`: prints a msg for debugging purposes
    - flow control rules like `@if`, `@each`, `@for`, `@while`
    - special behavior is can contain interpolation and can be nested in style rules, and `@media` or `@supports` also allow used without interpolation
  
### @use

