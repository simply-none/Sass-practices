# Sass

```
insert-date : 2019/11/07 16:13:44
author      : yuyuanqiu(漆无)
version     : 0.0.1-alpha
```

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
.box {
  @include transform(rotate(30deg));
}
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

  &:hover {
    cursor: pointer;
  }

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

  - variable declarations like \$var: value
  - flow control at-rules like `@if` and `@each`
  - `@error`, `@warn`, `@debug` rules

- css statements except within a `@function`

  - style rules like h1 { /_ ... _/ }
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
    font: Helvetica,
      // so can single-line comments
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
    src: url($roboto-font-path+"/Roboto-light.woff2") format("woff2");

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
    width: $width; // width: 800px;
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

    li {
      display: inline-block;
    }

    a {
      display: block;
      padding: 6px 12px;
      text-decoration: none;
    }
  }
  ```

- heads-up should keep nested don't deep
- selector lists: complex selector is nested separately and then combined back into a selector list

  ```scss
  .alert,
  .warning {
    ul,
    p {
      margin-right: 0;
      margin-left: 0;
      padding-bottom: 0;
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

    &:hover {
      font-size: 36px;
    }
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
    [dir="rtl"] & {
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
  .alert:hover,
  %strong-alert {
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
    border-top: 1px rgba(#000, 0.12) solid;
    padding: 16px 0;
    width: 100%;

    &:hover {
      border: 2px rgba(#000, 0.5) solid;
    }
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

## variables(\$)

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
      $border-radius: 0.1rem
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
    "success":#28a745 ;
    "info":#17a2b8 ;
    "warning":#ffc107 ;
  }

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
- in fact, it's rarely necessary using in sass-exp, you can instead of writing color: `#{$accent}` using `color: $accent`
- using interpolation with numbers is bad, sass have powerful unit arithmetic, so insted of `#{$width}px` using `$width * 1px` or better, but if `$width` already has units, 1px should remove unit otherwise its will error

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
      from {
        background-color: yellow;
      }
      to {
        background-color: red;
      }
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

  - `@use`: loads mixins, functions, and variables from sass-stylesheets
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

#### overview

- only dart-sass supports `@use`, others use `@import` rule
- stylesheets loaded by `@use` are called modules
- the simplest `@use` rule is `@use <url>`, once in the compiled css output no matter how many times loaded
- `@use` must before any rules other than `@forward`, but can declare variables before `@use` when configuring modules

  ```scss
  // foundation/_code.scss
  code {
    padding: 0.25rem;
    line-height: 0;
  }

  // foundation/_lists.scss
  ul,
  ol {
    text-align: left;

    // output: ul ul, ol ol {}
    & & {
      padding: {
        bottom: 0;
        left: 0;
      }
    }
  }

  // style.scss
  @use 'foundation/code'
  @use 'foundation/lists';
  ```

#### loading members

- can access variables, func, mixins from another module by writing <namespace>.<variable>, <namespace>.<funtion>(), or @include <namespace>.<mixin>()
- by default the namespace is the last component of url without extension, choosing re-name by write `@use "<url>" as <namespace>`
- even load module without namespace by `@use "<url>" as *` its may cause name conflicts
- load many files at once, use the `@forward` rule
- `@use` is safe to choose simple name like $radius, is different from @import rule which let user write long name like $mat-corner-radius
- private members starting with `-` or `_`, means stylesheets loads can't see it
- let entire package is private, just don't forward its module, and even hide member while forwarding the rest of its module

  ```scss
  // first
  // src/_corners.scss
  $radius: 3px;

  @mixin rounded {
    border-radius: $radius;
  }

  // style.scss
  @use "src/corners";

  .button {
    @include corners.rounded;
    padding: 5px + corners.$radius;
  }

  // second
  // src/_corners.scss
  $radius: 3px;

  @mixin rounded {
    border-radius: $radius;
  }

  // style.scss
  @use "src/corners" as c;

  .button {
    @include c.rounded;
    padding: 5px + c.$radius;
  }

  // three
  // src/_corners.scss
  $radius: 3px;

  @mixin rounded {
    border-radius: $radius;
  }

  // style.scss
  @use "src/corners" as *;

  .button {
    @include rounded;
    padding: 5px + $radius;
  }

  // four
  // src/corners.scss
  $-radius: 3px;

  @mixin rounded {
    border-radius: $-radius;
  }

  // style.scss
  @use "src/corners";

  .button {
    @include corners.rounded;

    // this is an error $-radius isn't visible outside of `_corners.scss`
    padding: 5px + corners.$-radius;
  }
  ```

#### configuring modules

- define variablees with the `!default` flag to make them configurable, and to load it write `@use <url> with (<variable>: <value>, <variable>: <value>...)` to override the variables.

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
      $black: #222,
      $border-radius: 0.1rem
  );
  ```

#### finding the modules

- ensure stylesheets work on every operating system, sass loads files by url, not by file path, so need to use forward slashes
- load paths will only be used if no relative file exists that matches the modules url, sass doesn't require use `./`
- partial sass files begin name with `_`, import it can leave off the \_
- load url for folder itself, the index file(like \_index.sass, \_index.scss) will be loaded automatically

  ```scss
  // foundation/_code.scss
  code {
    padding: 0.25em;
    line-height: 0;
  }

  // foundation/_lists.scss
  ul,
  ol {
    text-align: left;

    & & {
      padding: {
        bottom: 0;
        left: 0;
      }
    }
  }

  // foundation/_index.scss
  @use 'code';
  @use 'lists';

  // style.scss
  @use 'foundation';
  ```

#### loading css

- in addition to loading .sass and .scss, sass can load plain old .css file
- loading css module don't allow any special sass features, sass features isn't valid css will produce errors

  ```scss
  // code.css
  code {
    padding: 0.25em;
    line-height: 0;
  }

  // style.scss
  @use 'code';
  ```

### @forward

#### overview

- `@forward '<url>'` loads the module at the given url like @use
- both using @forward and @use in the same module, it's always to write @forward first, and if forwarded module is configure, it's will before in no-configure

  ```scss
  // src/_list.scss
  @mixin list-reset {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  // bootstrap.scss
  @forward "src/list";

  // styles.scss
  @use "bootstrap";

  li {
    @include bootstrap.list-reset;
  }
  ```

#### adding prefix

- @forward has the option of adding an extra prefix to all members it forward, written `@forward "<url>" as <prefix>-*`

  ```scss
  // src/_list.scss
  @mixin reset {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  //bootstrap.scss
  @forward "src/list" as list-*;

  // styles.scss
  @use "bootstrap";

  li {
    @include bootstrap.list-reset;
  }
  ```

#### controlling visibility

- you can control exactly which members get forwarded by writing `@forward "<url>" hide/show <members...>`, hide means members shouldn't be forwarded, show means only the named members should be forwarded

  ```scss
  // src/_list.scss
  $horizontal-list-gap: 2em;

  @mixin list-reset {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  @mixin list-horizontal {
    @include reset;

    li {
      display: inline-block;
      margin: {
        left: -2px;
        right: $horizontal-list-gap;
      }
    }
  }

  // bootstrap.scss
  @forward "src/list" hide list-reset, $horizontal-list-gap;
  ```

### @import

#### overview

- unlike plain css imports require make multiple http requests, sass imports are handled entirely during compilation
- allow multiple imports use commas separated, and don't required to have quotes
- discourages continued use of @import rule, prefer @use rule instead
- @import wrong, and use @use to resolve

  - @import makes all members to globally accessible
  - @extend rules are also global, so make it difficult to predict styles rule will be extended
  - each stylesheet is executed and its css emitted every time its @imported, increases compilation time and produces bloated output
  - no way to define private members or placeholder selector inaccessible to downstream stylesheets

  ```scss
  // foundation/_code.scss
  code {
    padding: 0.25em;
    line-height: 0;
  }

  // foundation/_lists.scss
  ul,
  ol {
    text-align: left;

    & & {
      padding: {
        bottom: 0;
        left: 0;
      }
    }
  }
  ```

#### finding the file like @use rule

##### custom importers

- node sass and dart sass on npm provide an importer option
- dart sass on pub provides an abstract importer class
- ruby sass provides an abstract importer::Base class

#### nesting

- @import can nested within style rules or plain css at-rules
- others like @use

#### import css

- lib sass importing .css file but it treated as scss filed rather than being parsed as css
- others like @use

### plain css @imports

- the following characteristics to plain css imports
  - url ends with .css
  - url begins http:// or https://
  - written as a url()
  - media queries
- sass import can't use interpolation, but plain css can

  ```scss
  @import "theme.css";
  @import "http://fonts.googleapis.com/css?family=Droid+Sans";
  @import url(theme);
  @import "landscape" screen and (orientation: landscape);

  @mixin google-font($family) {
    @import url("http://fonts.gooleapis.com/css?family=#{$family}");
  }

  @include google-font("Droid Sans");
  ```

### import and modules

- importing a module-system file: import a contains @use rules file, importing file has access to all members, but the file has loaded can't access. if the file contains @forward rules, importing file will have access to forwarded members
- a file with @use rules is imported, all the css loaded even if its already included by another import, this can result in bloated css output
- a file named <name>.import.scss, it will only be loaded for imports, not for @uses
- use @use load a contain @import module, the module will comtain all the public members defined

  ```scss
  // _reset.scss
  // module system users write `@include reset.list()`
  @mixin list() {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }

  // _reset.import.scss
  // legacy import users can keep writting `@include reset-list()`
  @forward "reset" as reset-*;
  ```

### @mixin and @include

#### overview

- defined using the @mixin at-rule, written @mixin <name> {} or @mixin <name>(<arguments...>) {}
- mixins are included into the current context using @include at-rule, written @include <name> or @include <name>(<arguments>)
- mixins names like all sass identiffiers treat hyphens and underscore as identical, like reset-list equal with reset_list

  ```scss
  @mixin reset-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  @mixin horizontal-list {
    @include reset-list;

    li {
      display: inline-block;
      margin: {
        left: -2px;
        right: 2em;
      }
    }
  }

  nav ul {
    @include horizontal-list;
  }
  ```

#### arguments

- argument lists can also have trailing commas to avoid syntax error when refactoring stylesheets

  ```scss
  @mixin rtl($property, $ltr-value, $rtl-value) {
    #{$property}: $ltr-value;

    [dir="rtl"] & {
      #{$property}: $rtl-value;
    }
  }

  .sidebar {
    @include rtl(float, left, right);
  }
  ```

- can make an argument optional by defining a default value which will be used if that arguments isn't passed, default values(any sassscript expression) use same syntax as variable declarations

  ```scss
  @mixin replace-text($image, $x: 50%, $y: 50%) {
    text-indent: -99999em;
    overflow: hidden;
    text-align: left;

    background: {
      image: $image;
      repeat: no-repeat;
      position: $x $y;
    }
  }

  .mail-icon {
    @include replace-text(url("/images/mail.svg"), 0);
  }
  ```

- keyword arguments use the same syntax as variable declarations and optional arguments

  ```scss
  @mixin square($size, $radius: 0) {
    width: $size;
    height: $size;

    @if $radius != 0 {
      border-radius: $radius;
    }
  }

  .avatar {
    @include square(100px, $radius: 4px);
  }
  ```

- taking arbitrary arguments with the last arguments in a @mixin declaration ends in `...`

  ```scss
  @mixin order($height, $selectors...) {
    @for $i from 0 to length($selectors) {
      #{nth($selectors, $i +1)} {
        position: absolute;
        height: $height;
        margin-top: $i * $height;
      }
    }
  }

  @include order(150px, "input.name", "input.address", "input.zip");
  ```

- taking arbitrary keyword arguments: `meta.keywords()` function takes an argument list and return a map not including \$

  ```scss
  @use "sass:meta";

  @mixin syntax-colors($args...) {
    @debug meta.keywords($args);
    // (string: #000, comment: #800, variable: #60b)

    @each $name, $color in meta.keywords($args) {
      pre span.stx-#{$name} {
        color: $color;
      }
    }
  }

  @include syntax-colors($string: #080, $comment: #800, $varibalu: #60b);
  ```

- passing arbitrary arguments:(任意参数传递)

  ```scss
  $form-selectors: "input.name", "input.address", "input.zip" !default;

  @include order(150px, $form-selectors...);

  @mixin btn($args...) {
    @warn "the btn() mixin is deprecated. include button() instead";
    @include button($args...);
  }
  ```

#### content blocks

- mixin can declare content block by including the `@content` at-rule
- mix can include multiple `@content` at-rules, that the content block included separately for each `@content`
- content block is lexical scope, only see local variables

  ```scss
  @mixin hover {
    &:not([disabled]):hover {
      @content;
    }
  }

  .button {
    border: 1px solid black;
    @include hover {
      border-width: 2px;
    }
  }
  ```

- passing arguments to content blocks written `@content(<arguments...>)`, accept arguments by written `@include <name> using (<arguments...>)`
- passing arguments to content blocks, content blocks must declare it accept arguments, consider passing it a map contain needed information

  ```scss
  @mixin media($types...) {
    @each $type in $types {
      @media #{$type} {
        @content ($type);
      }
    }
  }

  @include media(screen, print) using ($type) {
    h1 {
      // @media screen { h1 { font-size: 40px; }}
      font-size: 40px;
      // @media print {h1 {font-size: 40px; font-family: Calluna; } }
      @if $type == print {
        font-family: Calluna;
      }
    }
  }
  ```

#### indented mixin syntax

- indented syntax has special syntax in addition to standard @mixin/include, mixin defined using `=`, including using `+`

  ```sass
  =reset-list
      margin: 0
      padding: 0
      list-style: none

  =norizontal-list
      +reset-list

      li
          display: inline-block
          margin:
              left: -2px
              right: 2em

  nav ul
      +horizontal-list
  ```

### @function

#### overview

- all sass identifiers treat hyphens and underscores as identical, means scale-color and scale_color refer to same
- function using @function at-rule, written @function <name>(<arguments..>) {...}
- functions have side-effects, use mixins for side-effects, and use functions just to compute values

  ````scss
  @function pow($base, $exponent) {
    $result: 1;
    @for $_ from 1 through $exponent {
      $result: $result * $base;
      }
      @return $result;
     }

     .sidebar {
      float: left;
      margin-left: pow(4, 3) * 1px;
      }
      ```
  ````

#### arguments

- the function must be called with the same number of arguments in the form of sassscript expressions
- argument lists can have trailing commas, avoid syntax error when refactoring stylesheets
- optional arguments by defining a default value(any sassscript expression)

  ```scss
  @function invert($color, $amount: 100%) {
    $inverse: change-color($color, $hue: hue($color) + 180);
    @return mix($inverse, $color, $amount);
  }

  $primary-color: #036;
  .header {
    background-color: invert($primary-color, 80%);
  }
  ```

- arguments can be passed by name, keyword arguments use the same syntax as variable declarations and optional arguments
- careful when renaming a function's arguments, you should keep the old name around as a optional arguments for a while and printing a warning if passes it
  ```scss
  $primary-color: #036;
  .banner {
    background-color: $primary-color;
    color: scale-color($primary-color, $lightness: +40%);
  }
  ```
- the last arguments in a @function declaration ends with `...`, this arguments is known as an arguments list
- arguments lists can be used to take arbitrary keyword arguments use `meta.keywords()` function, and you should pass an argument lists to the `meta.keywords()` function

  ```scss
  @function sum($numbers...) {
    $sum: 0;
    @each $number in $numbers {
      $sum: $sum + $number;
    }
    @return $sum;
  }

  .micro {
    width: sum(50px, 30px, 100px);
  }
  ```

- passing arbitrary arguments: can be used to pass positional and keyword arguments to a function or both pass use `...`

```scss
$widths: 50px, 30px, 100px;
.micro {
  width: min($widths...);
}
```

- define an alias for function: using positional and keyword arguments to pass both at once to another function

```scss
@function fg($args...) {
  @warn "the fg() function is deprecated. call foreground() instead.";
  @return foreground($args...);
}
```

#### @return

- each @function must end with a @return
- returning early can be useful for handling edge-cases or cases other than warpping the entire function in an @else block

  ```scss
  @use "sass:string";

  @function str-insert($string, $insert, $index) {
    // avoid making new strings if we don't need to
    @if string.length($string) == 0 {
      @return $insert;
    }

    $before: string.slice($string, 0, $index);
    $after: string.slice($string, $index);
    @return $before + $insert + $after;
  }
  ```

#### other functions

- not either user-defined or built-in function is compiled to a plain css function(unless it uses sass-syntax)
- typo a function name will be compiled to css, so can using a css linter on stylesheet
- some css functions like calc() and element() have unusual syntax, sass parses them as unquoted strings

  ```scss
  @debug var(--main-bg-color); // var(--main-bg-color)

  $primary: #f2ece4;
  $accent: #e1d7d2;
  @debug radial-gradient(
    $primary,
    $accent
  ); // radial-gradient(#f2ece4, #e1d7d2)
  ```

### @extend

#### overview

- **BEM methodology** encourages modifier classes that go on the same elements as block or element classes that can let html clutter

  ```html
  <div class="error error--serious">
    oh no!you're been hacked!
  </div>
  ```

  ````css
  .error {
    border: 1px #f00;
    background-color: #fdd;
    }

    .error--serious {
      border-width: 3px;
      }
    ```
  ````

- @extend rule tell scss that one selector should inherit the styles of another

  ```scss
  .error {
    border: 1px #f00;
    background-color: #fdd;

    &--serious {
      @extend .error;
      border-width: 3px;
    }
  }
  ```

- if you @extend .error, it won't affect the inner selector in `.error { &__icon {...} }`, and means that parent selector in sassscript can't see the results of extend

  ```scss
  .error:hover {
    background-color: #fee;
  }

  .error--serious {
    @extend .error; // .error--serious:hover {}
    border-width: 3px;
  }
  ```

#### how it works

- `selector.unify()` function returns a selector matches the intersection of two selectors, while `selector.extend()` function works just like @extend but on a signal selector
- the styles have precedence in the cascade based on where the extended selector's style rules appear, but if you added the extended classes to you html that is the same precedence

```scss
.content nav.sidebar {
  @extend .info;
}

// this won't be extended, because `p` is incommpatible with `nav`
p.info {
  background-color: #dee9fc;
}

// there's no way to know whether `<div class="guide">` will be inside or
// outside `<div class="content">`, so sass generates both to be safe
.guide .info {
  border: 1px solid rgba(#000, 0.8);
  border-radius: 2px;
}

// sass knows that every element matching "main.content" also matched ".content"
// and avoid generating unnecessary interleaved selectors
main.content .info {
  font-size: 0.8em;
}
```

#### placeholder selector(%)

- placeholders aren't included in the css output, but selector extend them, private placeholders starting named with `-` or `_`, it only be extended within the stylesheet that defines it

  ```scss
  .alert:hover,
  %strong-alert {
    font-weight: bold;
  }

  %strong-alert:hover {
    color: red;
  }
  ```

#### extension scope

#### mandatory and optional extends

- an @extend doesn't match any selectors in the stylesheet, sass will produce an error, so if want the @extend to do nothing if the extended selector doesn't exist, just add `!optional` to the end

#### select extends or mixins

#### limitations

- disallowed selectors

  ```scss
  .alert {
    @extend .message.info;
    // error: write @extend .message, .info instead.

    @extend .main .info;
    // error: write @extend .info instead.
  ```

- HTML heuristic assumes that each selector's ancestors will be self-contained, without being interleaved with any other selector's ancestors

  ```scss
  header .warning li {
    font-weight: bold;
  }

  aside .notice dd {
    // sass doesn't generate css to match the <dd> in
    // <header>
    //  <aside>
    //    <div class="warning">
    //      <div class="notice">
    //        <dd>...</dd>
    //      </div>
    //    </div>
    //  </aside>
    // </header>
    //
    // because matching all elements like that would require us to generate nine
    // new selectors instead of just two.
    @extend li;
  }
  ```

- extend in @media

```scss
@media screen and (max-width: 600px) {
  .error--serious {
    @extend .error;
    // error: ".error" was extended in @media, but used outside it.
  }
}

.error {
  border: 1px #f00;
  background-color: #fdd;
}
```

### @error

- @error rule is written @error <expression>, it print the value of the string expression along with a stack trace

  ```scss
  @mixin reflexive-position($property, $value) {
    @if $property != left and $property != right {
      @error "property #{$property} must be either left or right.";
    }

    $left-value: if($property == right, initial, $value);
    $right-value: if($property == right, $value, initial);

    left: $left-value;
    right: $right-value;
    [dir="rtl"] & {
      left: $right-value;
      right: $left-value;
    }
  }

  .sidebar {
    @include reflexive-position(top, 12px);
    // error: property top must be either left or right.
  }
  ```

### @warn

- if passing legacy deprecated arguments or calling not quite optimal api that appear @warn, unlike @error rule, it doesn't stop sass entirely

```scss
$know-prefixes: webkit, moz, ms, o;

@mixin prefix($property, $value, $prefixes) {
  @each $prefix in $prefixes {
    @if not index($know-prefixes, $prefix) {
      @warn "unknow prefix #{$prefix}.";
    }

    -#{$prefix}-#{$property}: $value;
  }
  #{$property}: $value;
}
```

### @debug

- using @debug rule written @debug <expression>, print value of that expression along with the filename and line number
- you can pass any value to @debug not just a string, it print same representation of that value as the `meta.inspect()` function

  ```scss
  @mixin inset-divider-offset($offset, $padding) {
    $divider-offset: (2 * $padding) + $offset;
    @debug "divider offset: #{$divider-offset}";

    margin-left: $divider-offset;
    width: calc(100% - #{$divider-offset});
  }
  ```

### @at-root

- @at-root rule is usually written @at-root <selector> {...}, causes everything within it to be emitted at the root of the document, it's most often used match outer selector and element selector, use the `selector.unify()` function to combine &
- it will automatically add the outer selector to the inner selector if you used & as a sassscript expression
- @at-root rule can also be written `@at-root {...}` to put multiple style rules, is just a shorthand for `@at-root {<selector> {...} }`

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
      /* ... */
    }
    // .wrapper select.field {}
    @include unify-parent("select") {
      /* ... */
    }
  }
  ```

#### beyond style rules

- media query feature written `@at-root (without: <rules...>) {...}` tells sass which rules should be excluded, `@at-root (with: ...)` query excludes all rules except those that are listed
- two special values in queries

  - `rule` refers to style rules, for example `@at-root (with: rule)` excluded all at-rules but preserves style rules
  - `all` refers to all-rules and style rules should be excluded

  ```scss
  // @media print { .page {} }
  @media print {
    .page {
      width: 8in;

      // .page {}
      @at-root (without: media) {
        color: #111;
      }

      // .page {}
      @at-root (with: rule) {
        font-size: 1.2em;
      }
    }
  }
  ```

### flow control

#### overview

- they can also be used in mixins and functions
- @each evaluates a block for each element in a list or each pair in a map

#### @if and @else

- @if rule is written `@if <expression> {...}`

```scss
@mixin avatar($size, $circle: false) {
  width: $size;
  height: $size;

  @if $circle {
    border-radius: $size / 2;
  }
}

.square-av {
  @include avatar(100px, $circle: false);
}
.circle-av {
  @include avatar(100px, $circle: true);
}
```

- @else rule written `@else {...}`

```scss
$light-background: #f2ece4;
$light-text: #036;
$dark-background: #6b717f;
$dark-text: #d2e1dd;

@mixin theme-colors($light-theme: true) {
  @if $light-theme {
    background-color: $light-background;
    color: $light-text;
  } @else {
    background-color: $dark-background;
    color: $dark-text;
  }
}

.banner {
  @include theme-colors($light-theme: true);
  body.dark & {
    @include theme-colors($dark-theme: false);
  }
}
```

- @else if rule written `@else if <expression> {...}`, and can to chain as many @else if as you want after an @if

```scss
@mixin triangle($size, $color, $direction) {
  height: 0;
  width: 0;

  border-color: transparent;
  border-style: solid;
  border-width: $size / 2;

  @if $direction == up {
    border-bottom-color: $color;
  } @else if $direction == right {
    border-left-color: $color;
  } @else if $direction == down {
    border-top-color: $color;
  } @else if $direction == left {
    border-right-color: $color;
  } @else {
    @error "unknown direction #{$direction}.";
  }
}

.next {
  @include triangle(5px, black, right);
}
```

- the values only `false` and `null` are falsey, and every other value is considered truthy
- check string contains a value example space, write `string.index($string, " ")`, if string isn't found return null and number otherwise

#### @each

- `@each <variable> in <expression> {...}` return a list, when assign to the get variable name, each element of the list in turn

```scss
$sizes: 40px, 50px, 80px;

@each $size in $sizes {
  .icon-#{$size} {
    font-size: $size;
    height: $size;
    width: $size;
  }
}
```

- use @each to iterate over every key/value pair in a map written `@each <variable>, <variable> in <expression> {...}`, the key is assigned to the variable name, and the value is assign to the second

```scss
$icons: (
  "eye": "\f112",
  "start": "\f12e",
  "stop": "\f12f"
);

@each $name, $glyph in $icons {
  .icon-#{$name}: before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
  }
}
```

- use @each to automatically assign variables to each of the values from the inner lists by writting it `@each <variable...> in <expression> {...}`, if the list doesn't have enough values the variable's value is `null`

```scss
$icons: "eye" "\f112"12px, "start" "\f12e"16px, "stop" "\f12f"10px;

@each $name, $glyph, $size in $icons {
  .icon-#{$name}:before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
    font-size: $size;
  }
}
```

#### @for

- @for rule written `@for <variable> from <expression> to/through <expression> {...}`, if `to` is used, the final number is exclude, if `through` is used, it's included

```scss
$base-color: #036;

@for $i from 1 through 3 {
  ul:nth-child(3n + #{$i}) {
    background-color: lighten($base-color, $i * 5);
  }
}
```

#### @while

- the @while rule written `@while <expression> {...}`
- they're often faster to compile as well
- using @each or @for instead

```scss
/// divides `$value` by `$ratio` until it's below `$base`
@function scale-below($value, $base, $ratio: 1.618) {
  @while $value > $base {
    $value: $value / $ratio;
  }
  @return $value;
}

$normal-font-size: 16px;
sup {
  font-size: scale-below(20px, 16px);
}
```

### from css(css at-rules)

- only currently dart sass support it, others support interpolation in values
- forwards-compatible with future versions of css
- css at-rules is written `@<name> <value>`, `@<name> {...}` or `@<name> <value> {...}`, name and value can contain interpolation

```scss
@namespace svg url(http://www.w3.org/2000/svg);

@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
}

@counter-style thumbs {
  system: cyclic;
  symbols: "\1f44d";
}
```

- css at-rules is nested within a style rule, the at-rule is at the top level of the css output and the style rule is within it

```scss
.print-only {
  display: none;

  // @media print { .print-only {} }
  @media print {
    display: block;
  }
}
```

- only currently dart-ruby sass support @media

```scss
@media (width <= 700px) {
  body {
    background: green;
  }
}
```

- @media allowing interpolation and sassscript expressions

```scss
$layout-breakpoint-small: 960px;

@media (min-width: $layout-breakpoint-small) {
  .hide-extra-small {
    display: none;
  }
}
```

- sass will also merge nested media queries but don't yet natively support nested @media rules

```scss
@media (hover: hover) {
  .button:hover {
    border: 2px solid black;

    // @media (hover: hover) and (color) {}
    @media (color) {
      border-color: #036;
    }
  }
}
```

- @supports rule also allow sassscript expression to be used in the declaration queries

```scss
@mixin sticky-position {
  position: fixed;
  @supports (position: sticky) {
    position: sticky;
  }
}

// .banner {}
.banner {
  // @supports () { .banner {} }
  @include sticky-position;
}
```

- @keyframes rule(渐变规则？) except its child must be valid keyframe rules(<number>%, from, or to) rather than normal selectors

```scss
@keyframes slide-in {
  from {
    margin-left: 100%;
    width: 300%;
  }

  70% {
    margin-left: 90%;
    width: 150%;
  }

  to {
    margin-left: 0%;
    width: 100%:
  }
}
```

## values

### overview

- most of values types come straight from css
  - `numbers`: may or may not have units, like 12 or 100px
  - `string`: may or may not quoets like "Helvetica Neue" or bold
  - `colors`: by hex representation or by name or function like #c6538c or blue or rgb(107, 113, 127) or hsl(210, 100%, 20%)
  - lists of values may be separated by spaces or commas and which may be enclosed square brackets or not, like `1.5em, 1em, 0, 2em`, `Helvetica, Arial, sans-serif` or `[col1-start]`
- more specific to sass:
  - boolean values
  - null
  - maps about key-value like `("background": red, "foreground": pink)`
  - function references returned by get-function() and called with call()

### numbers

- number in sass have two component is itselt and its units, and it can have no units, or can have complex units(but css doedn't support complex units)

```scss
@debug 100; // 100
@debug 0.8; // 0.8
@debug 16px; // 16px
@debug 5px * 2px; // 10px*px (read "square pixels")
```

- sass support same format as css numbers including scientific natation, written `e` between the numbers
- sasss like js doesn't distinguish between whole number and decimal, so 5 / 2 return 2.5

```scss
@debug 5.2e3; // 5200
@debug 6e-2; // 0.06
```

- sass support manipulating units example multiplied or divided
- if you aren't ending up with the right unit means something is wrong

```scss
@debug 4px * 6px; // 24px*px
@debug 5px / 2s; // 2.5px/s
@debug 5px * 30deg / 2s /24em; // 3.125px*deg/s*em

$degrees-per-second: 20deg/1s;
@debug $degrees-per-second; // 20deg/s
@debug 1 / $degress-per-second; // 0.05s/deg
```

- sass will automatically convert between compatible unit, but try to combine incompatible units will throw an error like 1in + 1em

```scss
//css defines one inch as 96 pixels
@debug 1in + 6px; // 102px or 1.0625in

@debug 1in + 1s;
// error: incompatible units s and in
```

- the numerator contains units that are compatible with units in the denominatoe, they'll cancel out

```scss
$transition-speed: 1s/50px;

@mixin move($left-start, $left-stop) {
  position: absolute;
  left: $left-start;
  transition: left ($left-stop - $left-start) * $transition-speed;

  &:hover {
    left: $left-stop;
  }
}

.slider {
  @include move(10px, 120px);
}
```

- should especially avoid using interpolation like #{$number}px, this doesn't actually create a number, it create an unquoted string looks like a number, nut won't work with any number operations or functions, try to make your math unit-clean so that $number already has the unit px or write \$number \* 1px
- percentages in sass work just like every other unit, but they are not interchangeable with decimals, so can convert between decimals and percentages using `$percentage / 100%` return decimal and `decimal * 100%` return percentage or using `math.percentage()` function to percentage
- libsass and old rubysass default to 5 digits of numeric precision but can custom configuared and recommended configure 10 digits
- sass support 10 digits of precision after dicimal point, this means a few different things
  - only the first ten digits of a number after decimal point will be included in the generated css
  - operations like == and >= will consider two numbers equivalent if they're the same up to the tenth digit after the dicimal point
  - if a number is less than 0.0000000001 away from an integer, it's considered to be an integer fot the purposes of functions like `like.nth()` that require integer arguments

```scss
@debug 0.012345678912345; // 0.0123456789
@debug 0.01234567891 == 0.01234567899; // true
@debug 1.00000000009; // 1
@debug 0.99999999991; // 1
```

- that math function will work with the full number value internally to avoid accumulating extra rounding errors

### string

#### overview

- strings are sequences of characters(specially unicode code point)
- sass supports two kinds of strings whose internal structure is the same
- render different is quoted strings like `"Helvetica Neue"`, and unquoted string like `bold`
- string convert quoted string to unquoted string using `string.unquote()`, otherwise using `string.quote()`

  ```scss
  @use "sass:string";

  @debug string.unquote(".widght:hover");  // .widght:hover
  @debug string.quote(bold);  // "bold"
  ```
  
#### escapes

- any charactor other than a letter form A-F or 0-9 can be included as part of a string by writing \ in front of it
- any charactor included in a string by writing \ followed by its unicode code point number written in hexadecimal
  ```scss
  @debug "\""; // '"'
  @debug \.widght; // \.widght
  @debug "\a"; // "\a" (a string containing only a newline)
  @debug "line1\a line2"; "line1\a line2"
  @debug "Nat + Liz \1F46D";  // "Nat + Liz 👭"
  ```

#### quoted

- quoted strings can contain interpolation
- the exact format may very based on the implementation or configuaration---a string containing a double quote may be compiled to `"\""` or `'"'`, and a non-ascii character may or may not be escaped.
- newlines can be escaped as `\a`(including a trailing space)
- quoted string injected into another value via interpolation, its quotes are removed

```scss
@debug "Helvetica Neue";  // "Helvetica Neue"
@debug "c:\\program files"; // "c:\\program files"
@debug "\"Don't fear the reader\""; // "\"don't fear the reader\""
@debug "line1\a line2"; // "line1\a line2"

$roboto-variant: "Mono";
@debug "Roboto #{$roboto-variant}"; // "Roboto Mono"
```

#### unquoted

- unquoted strings are written as css identifiers, they can include interpolation anywhere
- not all identifiers are parsed as unquoted string
  - css colors name are parsed as colors
  - null as sass null value
  - true, false as booleans
  - not, and, or as boolean operators

```scss
@debug bold;  // bold
@debug -webkit-flex;  // -webkit-flex
@debug --123; // --123

$prefix: ms;
@debug -#{$prefix}-flex;  // -ms-flex
```

- unquoted string is parsed, the literal text of escapes are parsed as part of the string
- each point escaped or unescaped
  - it's a valid identifier character, it's included unescaped in the unquoted string, like \1f46d
  - it's a printable character ohter than a newline or tab, it's included after a \, like \21
  - otherwise the lowercase unicode escape is included with a trailing space, like \7fx

```scss
@use "sass:string";

@debug \1f46d;  // 👭
@debug \21; // \!
@debug \7fx;  // \7f x
@debug string.length(\7fx); // 5
```

#### string indexes

- index string function return numbers, refer to the characters in a string, index 1 is first character of string, and index -1 is last character in a string

```scss
@use "sass:string";

@debug string.index("Helvetica Neue", "Helvetica"); // 1
@debug string.index("Helvetica Neue", "Neue");  // 11
@debug string.slice("Roboto Mono", -4); // "Mono"
```

### colors

- old sass version don't support hex colors
- sass colors can be written as hex codes(#f2ece4 or #b37399aa), css color name, or functions like rgb(), hsl(), hsla()

```scss
@debug #f2ece4; // #f2ece4
@debug #b37399aa; // rgba(179, 115, 153, 67%)
@debug midnightblue;  // #191970
@debug rgb(204, 102, 153);  // #c69
@debug rgba(107, 113, 127, 0.8);  // rgba(107, 113, 127, 0.8)
@debug hsla(20, 20%, 85%, 0.7); // rgba(225, 215, 210, 0.7)
```

- sass supports many useful color functions to create new color by mixing colors or scaling hue, saturation, lightness

```scss
$venus: #998099;

@debug scale-color($venus, $lightness: +15%); // #a893a8
@debug mix($venux, midnightblue); // #594d85
```

### lists

#### overview

- elements in lists can be separated by commas or spaces, and allowed using brackets like `([line1 line2])`, is usefule when using grid-template-columns
- sass lists can contain one or even zero elements, like `(<expression>)`, `[<expression>]`, `()`, `[]`, all list functions will treat individual values  that aren't in lists as through they're lists containing that value
- empty lists without brackets aren't valid css

#### using lists

- access an element using the `list.nth($list, $n)` function to get the element at a given index in a list

```scss
@debug list.nth(10px 12px 16px, 2); // 12px
@debug list.nth([line1, line2, line3], -1); // line3
```

- do something for every element using `@each` rule

```scss
$sizes: 40px, 50px, 80px;

@each $size in $sizes {
  .icon-#{$size} {
    font-size: $size;
    height: $size;
    width: $size;
  }
}
```

- adding a element to a list using `list.append($list, $eval)` function, return a copy of the list, because sass lists are immutable, it doesn't modify original list

```scss
@debug append(10px 12px 16px, 25px);  // 10px 12px 16px 25px
@debug append([col1-line1], [col1-line2]);   // [col1-line1, col1-line2]
```

- find an element in a list using `list.index($list, $value)` function, if the value isn't in the list, return null, so you can using `list.index()` with `@if` to check whether a list doesn't contains a given value

```scss
@debug list.index(1px solid red, 1px);  // 1
@debug list.index(1px solid red, solid);  // 2
@debug list.index(1px solid red, dashed); // null

@use "sass:list";

$valid-sides: top, bottom, left, right;

@mixin attach($side) {
  @if not list.index($valid-sides, $side) {
    @error "#{$side} is not a valid side , expected one of #{$sides}.";
  }

  // ...
}
```

#### immutability

- lists in sass are immutable, so can update your state over time by assining new lists to the same variables

```scss
@use "sass:list";
@use "sass:map";

$prefixes-by-browser: ("firefox": moz, "safari": webkkit, "ie": ms);

@function prefixes-for-browsers($browsers) {
  $prefixes: ();
  @each $browser in $browsers {
    $prefixes: list.append($prefixes, map.get($prefixes-by-browser));
  }
  @return $prefixes;
}

@debug prefixes-for-browsers("firefox" "ie"); // moz ms
```

#### argument lists

- passing keyword arguments, they can be accessed as a map by passing the argument list to the `meta.keywords()` function

```scss
@use "sass:meta";

@mixin syntax-colors($args...) {
  @debug meta.keywords($args);
  // (string: #080, comment: #800, variable: $60b)

  @each $name, $color in meta.keywords($args) {
    pre span.stx-#{$name} {
      color: $color;
    }
  }
}

@include syntax-colors(
  $string: #080,
  $comment: #800,
  $variable: #60b
)
```

### maps

#### overview

- maps written `(<expression>: <expression>, <expression>: <expression>)`, the key allow any sass values and is uniqued, and maps must be written with parentheses around them
- a map with no pairs is written `()`, is also list, all maps count as lists, for example `(1: 2, 3: 4)` counts as `(1 2, 3 4)`
- `==` operator is used to determine whether two keys are the same
- a map keys should using quoted string other than unquoted, because some value like color name is not string type

#### using maps

- maps aren't valid css values, and its immutable
- look up a value by `map.get($map, $key)` function, if doesn't contain the key return null

```scss
$font-weights: ("regular": 400, "medium": 500, "bold": 700);

@debug map.get($font-weights, "medium");  // 500
@debug map.get($font-weights, "extra-bold");  // null
```

- do something for every pair by `@each` ruls

```scss
$icons: ("eye": "\f112", "start": "\f12e", "stop": "\f12f");

@each $name, $glyph in $icons {
  .icon-#{$name}:before {
    display: inline-block;
    font-family: "Icon Font";
    content: $glyph;
  }
}
```

- add new pairs or replace the value-key to a map using `map.merge($map1, $map2)` function

```scss
@use "sass:map";

$light-weights: ("lightest": 100, "light": 300);
$heavy-weights: ("medium": 500, "bold": 700);

@debug map.merge($light-weights, $heavy-weights);
/* (
  "lightest": 100,
  "light": 300,
  "medium": 500,
  "bold": 700
)
*/

@use "sass:map";

$font-weight: ("regular" 400, "medium":500, "bold": 700);

@debug map.merge($font-weights, ("extra-bold": 900));


@use "sass:map";

$font-weight: ("regular": 400, "medium": 500, "bold": 700);

@debug map.merge($font-weights, ("medium": 600));
// ("regular":400, "medium": 600, "bold": 700)
```

#### immutability

```scss
@use "sass:map";

$prefixes-by-browser: ("firefox": moz, "safari":webkit, "ie": ms);

@mixin add-browser-prefix($browser, $prefix) {
  $prefixes-by-browser: map.merge($prefixes-by-browser, ($browser: $prefix));
}

@include add-browser-prefix("opera", o);
@debug $prefixes-by-browser;
```

### true and false

- booleans are returned by equality and relational operators, and have many built-in functions like `math.comparable()` and `map.has-key()`

```scss
@use "sass:math";

@debug 1px == 2px;
@debug 1px == 1px;
@debug 10px < 3px;
@debug math.comparable(100px, 3in); // true
```
- using boolean operators like and, or, not

```scss
@debug true and true;
@debug true and false;

@debug true or false;
@debug false or false;

@debug not true;
@debug not false;
```

- using booleans with @if or `if()`, `if()` return one value if its argument is true and another if its argument is false

```scss
@debug if(true, 10px, 30px);  // 10px
@debug if(false, 10px, 30px); // 30px
```

#### null 

- null is the only value of its type
- it represents the absence of a value, and is often returned by functions to indicate the lack of a result

```scss
@use "sass:map";
@use "sass:string";

@debug string.index("Helvetica Neue", "Roboto");  // null
@debug map.get(("large": 20px), "small"); // null
@debug &; //null
```
- if a list contains a null, the null is omitted from the generated css

```scss
$fonts: ("serif": "Helvetica Neue", "Monospace": "Consolas");

h3 {
  font: 18px bold map-get($fonts, "sans");
  // font: 18px bold;
}
```
- if a property value is null, that property is omitted entirely

```scss
$fonts: ("serif": "Helvetica Neue", "monospace": "Consolas");

h3 {
  font: {
    size: 18px;
    weight: bold;
    family: map-get($fonts, "sans"); // omitted entirely
  }
}
```

- null is also falsey

```scss
@mixin app-background($color) {
  #{if(&, '&.app-background', '.app-background')} {
    background-color: $color;
    color: rgba(#fff, 0.75);
  }
}

@include app-background(#036);

.sidebar {
  @include app-background(#c6538c);
}
```

#### functions

- older version sass that the call() function took a string representing a function's name, but in a new , the functions are no longer global and so a given name may not always refer to the same function
- you can pass a function's name to the `meta.get-function()` to get it value, pass it to the `meta.call()` to call it

```scss
@use "sass:list";
@use "sass:meta";
@use "sass:string"

/// return a copy of $list with all elements for which $condition returns `true` removed
@function remove-where($list, $condition) {
  $new-list: ();
  $separacotr: list.separactor($list);
  @each $element in $list {
    @if not meta.call($condition, $element) {
      $new-list: list.append($new-list, $element, $separactor: $separactor);
    }
  }
  @return $new-list;
}

$fonts: Tahoma, Geneva, "Helvetica Neue", Helvetica, Arial, sans-serif;

content {
  @function contains-helvetica($string) {
    @return string.index($string, "Helvetica");
  }
  font-family: remove-where($fonts, meta.get-function("contains-helvetica"));
}
```

## operators

### overview

- types:
  - ==, !=
  - +, -, *, /, %(math)
  - <, <=, >, >=
  - and, or, not
  - +, -, /(string)

- early on in sass's history, supports for mathematical operations on colors using channel-by-channel rgb arithmetic, and now lib/ruby-sass support it, should using color functions instead
- order of operations(precedence from higher to lower)
  - parentheses
  - unary operators at `not`, `+`, `-`, and `/`
  - `*`, `/`, `%`
  - `+`, `-`
  - `>`, `>=`, `<`, `<=`
  - `==`, `!=`
  - `and`
  - `or`
  - `=`

```scss
@debug 1 + 2 * 3 == 1 + (2 * 3);  // true
@debug true or false and false == true or (false and false);  // true

@debug (1 + 2) * 3; // 6
@debug ((1 + 2) * 3 + 4) * 5; //  65
```
- single equals(`=`) only allow in function arguments, it's create an unquoted string, this exists for forwards-compatibility with old ie

```scss
.transparent-blue {
  filter: chroma(color=#0000ff);
}
```

### equality operators

- return true or false
- libsass and old rubysass consider numbers without units to be equal to the same numbers with any units
- different things for different types
  - numbers are equal if they have the same value and units, or value is equal but units are converted
  - string in unquoted and quoted with the same contents are equal
  - color have the same red/green/blue/alpha value is equal
  - lists contents is equal so its equal, but comma-separated not equal with space-separated, bracketed lists aren't equal to unbracketed lists
  - if maps have both equaled keys-values so its equal
  - true, false, null only equal to itself
  - functions are compared by reference

```scss
// all example is true
@debug 1px == 1px;
@debug 1px != 1em;
@debug 1 != 1px;
@debug 96px == 1in;

@debug "Helvetica" == Helvetica;
@debug "Helvetica" != "Arial";

@debug hsl(34, 35%, 92.1%) == #f2ece4; // true
@debug rgba(179, 115, 153, 0.5) != rgba(179, 115, 153, 0.8);

@debug (5px 7px 10px) == (5px 7px 10px);
@debug (5px 7px 10px) != (10px 14px 20px);
@debug (5px 7px 10px) != (5px, 7px, 10px);  //true
@debug (5px 7px 10px) != [5px, 7px, 10px];  //true

$theme: ("venus": #998099, "nebula": #d2e1dd);
@debug $theme == ("venus": #998099, "nebula": #d2e1dd);
@debug $theme != ("venus": #998099, "iron": #dadbdf);

@debug true == true;
@debug true != false;
@debug null != false;

@debug get-function("rgba") == get-function("rgba");
@debug get-function("rgba") != get-function("hsla");
```

### relational operators

- they automatically convert between compatible units
- unitless numbers can be compared with any number, they're automatically converted to that number's unit
- numbers with incompatible units can't be compared

```scss
@debug 100 > 50;
@debug 10px < 17px;
@debug 96px >= 1in;
@debug 1000ms <= 1s

@debug 100 > 50px;
@debug 10px < 17;
// front is all true

@debug 100px > 10s;
// error: incompatible units px and s
```

### numeric operators

- automatically convert between compatible units
- unitless number can be used with numbers of any unit
- numbers with incompatible units can't with `+`, `-`, `%`

```scss
@debug 10s + 15s;
@debug 1in - 10px; // 0.8958333333in
@debug 5px * 3px; // 15px*px
@debug (12px / 4px); // 3
@debug 1in % 9px; // 0.0625in

@debug 100px + 50;  // 150px
@debug 4s * 10; // 40s

@debug 100px + 10s;
// error: incompatible units px and s
```

- written `+` and `-` as unary operators which take only one value
- `-` can refer to both subtraction and unary negation, it can confusing which is which in a space-separated list, to be safe:
  - always write spaces on both sides of `-` when subtracting
  - write a space before `-` but not after for a negative number or a unary negation
  - wrap unary negation in parentheses if it's in a space-separated list
- precedence in `-`
  - `-` as part of an identifier, unit may not contain a hyphen followed by a digit
  - `-` between an expression and a literal number with no whitespace is parsed as subtraction
  - `-` at the begining of a liternal number is parsed as a negative number
  - `-` between two numbers regardless of whitespace is parsed as subtraction
  - `-` before a value other than a literal number is parsed as unary negation

```scss
@debug +(5s + 7s);
@debug -(50px + 30px);
@debug -(10px - 15px);

@debug a-1; // a-1
@debug 5px-3px; // 2px
@debug 5-3; // 2
@debug 1 -2 3;  // 1 -2 3

$number: 2;
@debug 1 -$numer 3;                                      // -1 3
@debug 1 (-$number) 3;  // 1 -2 3
```

- two numbers are separated by `/`, sass will print the result as divided
  - either expression is anything other than a literal number
  - the result is stored in a variable or returned by a function
  - the operation is surrounded by parentheses unless those parentheses are outside a list that contains the operation
  - the result is used as part of another operation(other than /)

- force / to be used as a separator, written it as #{<expression>} / #{<expression>}

```scss
@debug 15px / 30px;   // 15px/30px
@debug (10px + 5px) / 30px; // 0.5
@debug #{10px + 5px} / 30px;  // 15px/30px

$result: 15px / 30px;
@debug $result; // 0.5

@function fifteen-divided-by-thirty() {
  @return 15px / 30px;
}
@debug fifteen-divided-by-thirty(); // 0.5

@debug (15px/30px); // 0.5
@debug (bold 15px/30px sans-serif);// bold 15px/30px sans-serif
@debug 15px/30px + 1; // 1.5
```

### string operators

- `<expression> + <expression>`, if the either value is a quoted string, the result will be quoted, otherwise will be unquoted
- `<expression> / <expression>` return an unquoted string separated by /
- `<expression> - <expression>` return an unquoted string separated by -, this is a lefacy operatoe, should using interpolation

```scss
@debug "Helvetica" + " Neue"; // "Helvetica Neue"
@debug sans- + serif; // sans-serif
@debug #{10px + 5px}  / 30px; // 15px/30px
@debug sans - serif;  // sans-serif
```

- string operators can be used with any values than can be written to css, but numbers and colors can't be used as the left-hand value;
- should using interpolation to creat strings rather than relying on this operators

```scss
@debug "Elapsed time: " + 10s;  // "Elapsed time: 10s"
@debug true + " is a boolean value";  // "true is a boolean value"
```

- sass also supports / and - as a unary operators take only one value, return an unquoted string
  
```scss
@debug / 15px;  // /15px
@debug - moz; // -moz`
```

### boolean operators

- all boolean operators return true or false
- only `false` and `null` is falsey, others is truthy

## built-in modules

### overview

- only dartsass support built-in modules with @use, others must call functions using their global names instead
- all built-in module urls begin with `sass:` to indicate
- a few functions are only avaliable globally even in the new module system, like `if()`, `rgb()`, `hsl()`

```scss
@use "sass:color";

.button {
  $primary-color: #6b717f;
  color: $primary-color;
  border: 1px solid color.scale($primary-color, $lightness: 20%);
}
```

- built-in modules:
  - `sass:math`
  - `sass:string` to combine, serach, split apart string
  - `sass:color` generate new color, build color themes
  - `sass:list` to access, modify value in lists
  - `sass:map`
  - `sass:selector` to access selector engine
  - `sass:meta` exposes detail of sass inner workings

- global functions with `hsl(a)`, return a color, hue value is[0deg, 360deg], saturation value is [0%, 100%], alpha value is [0%, 100%] or [0, 1], all numbers may be unitless
  - for dartsass
  ```scss
  hsl(a)($hue $saturation $lightness)
  hsl(a)($hue $saturation $lightness / $alpha)
  hsl(a)($hue, $saturation, $lightness, $alpha: 1) 
  ```
  - for others, only current rubysass support percentage for alpha
  ```scss
  hsl($hue, $saturation, $lightness)
  hsla($hue, $saturation, $lightness, $alpha)
  ```

  - pass special functions like calc() or var() in place of any argument to hsl() or rgb(), even use var() to instead multiple arguments, return an unquoted string using the same signature it was called with.
  ```scss
  @debug hsl(210deg  100% 20% / var(--opacity));  // hsl(210deg 100% 20% / var(--opacity))
  @debug hsla(var(--peach), 20%); // hsla(var(--peach), 20%)

  @debug rgb(0 51 102 /var(--opacity)); // rgb(0 51 102 / var(--opacity))
  @debug rgba(var(--peach), 0.2); // rgba(var(--peach), 0.2)
  ```
  - consider using `hsl($hue, $saturation, $lightness, $alpha)` to instead `hsl($hue $saturation $lightness / $alpha)`, using `rgb($red, $green, $blue, $alpha)` to instead `rgb($red $green $blue / $alpha)`

  ```scss
  @debug hsl(210deg 100% 20%);//  #036
  @debug hsl(34, 35%, 92%); // #f2ece4
  @debug hsl(210deg 100% 20% / 50%);  // rgba(0, 51, 102, 0.5)
  @debug hsla(34, 35%, 92%, 0.2); // rgba(242, 236, 228, 0.2)

  @debug rgb(0 51 102); // #036
  @debug rgb(95%, 92.5%, 89.5%);  //#f2ece4
  @debug rgb(0 52 102 / 50%); // rgba(0, 51, 102, 0.5)
  @debug rgba(95%, 92.5%, 89.5%, 0.2);// rgba(242, 236, 228, 0.2)
  ```

- global function with rgb(a), color is [0, 255] or [0%, 100%], alpha is [0, 1] or [0%, 100%]
  ```scss
  rgb(a)($red $green $blue)
  rgb(a)($red $green $blue /$alpha)
  rgb(a)($red, $green, $blue, $alpha:1)
  rgb(a)($color, $alpha)

  rgb($red, $green, $blue)
  rgba($red, $green, $blue, $alpha)
  rgba($color, $alpha)
  ```
  - If $color and $alpha are passed, this returns $color with the given $alpha channel instead of its original alpha channel.
  ```scss
  @debug rgb(#f2ece4, 50%); // rgba(242, 236, 228, 0.5);
  @debug rgba(rgba(0, 51, 102, 0.5), 1); // #003366
  ```

- if($condition, $if-true, $if-false)

```scss
@debug if(true, 10px, 15px);// 10px
@debug if(false, 10px, 15px); // 15px
@debug if(variable-defined($var), $var, null);  // null
```

### sass:color

####  all optial arguments must be numbers

- it's an error to specify an rgb property at the same times as an hsl property
- color.adjust `+` or `-` property value, r/g/b is [-255, 255], hue unit is deg and value is [-360deg, 360deg] or not unit, saturation and lightness is [-100%, 100%] or not unit, alpha is [-1, 1]
- color.change() to ends property value, r/g/b is [0, 255], hue is [0deg, 360deg] or unitless, saturation and lightness is [0%, 100%] or unitless, alpha is [-1, 1](**有错？**)
- color.scale `origin * (100% + now)` property value, each keyword is [-100%, 100%]
- color.mix() mixture of colors, and weight is [0%, 100%], weight value is color1 rate
  
```scss
color.adjust($color,
  $red: null, $green: null, $blue: null,
  $hue: null, $saturation: null, $lightness: null,
  $alpha: null)
adjust-color(...) // => color

color.change($color,
  $red: null, $green: null, $blue: null,
  $hue: null, $saturation: null, $lightness: null,
  $alpha: null)
change-color(...) // => color

color.scale($color,
  $red: null, $green: null, $blue: null,
  $saturation: null, $lightness: null,
  $alpha: null)
scale-color(...)  // => color

color.mix($color1, $color2, $weight: 50%)
mix($color1, $color2, $weight: 50%) // => color

@debug color.adjust(#6b717f, $red: 15); // #7a717f
@debug color.adjust(#d2e1dd, $red: -10, $blue: 10); // #c8e1e7
@debug color.adjust(#998099, $lightness: -30%, $alpha: -0.4); // rgba(71, 57, 71, 0.6)

@debug color.change(#6b717f, $red: 100);  // 64717f
@debug color.change(#d2e1dd, $red: 100, $blue: 50); // #64e132
@debug color.change(#998099, $lightness: 30%, $alpha: 0.5); // rgba(85, 68, 85,0.5)

@debug color.scale(#6b717f, $red: 15%); // #81717f
@debug color.scale(#d2e1dd, $lightness: -10%, $saturation: 10%);  // #b3d4cd
@debug color.scale(#998099, $alpha: -40%);  // rgba(153, 128, 153, 0.6)

@debug color.mix(#036, #d2e1dd);  // #698aa2
@debug color.mix(#036, #d2e1dd, 75%); // #355f84
@debug color.mix(#036, #d2e1dd, 25%); // #9eb6bf
@debug color.mix(rgba(242, 236, 228, 0.5), #6b717f);  // rgba(141, 144, 152, 0.75)
```

#### it's not included directly in the new module system

- adjust-hue increases or decreases $color's $hue, hue is [-360deg, 360deg] and unitless
- complement return rgb complement of $color
- saturate make color more saturated, $amount is [0, 100%], increases saturation of color
- desaturate make color less saturated, $amount is [0%, 100%], decreases saturation of $color
- lighten makes $color lighter, $amount is [0%, 100%], increases lightness of $color
- darken makes $color darker, decreases hsl lightness of $color, $amount is [0%, 100%], its a bad way to make coloe darker
- opacity/fade-in makes color more opaque, $amount is [0, 1], increases alpha of $color
- transparentize/fade-out makes color more transparent, $amount is [0, 1], decreases alpha of color

```scss
adjust-hue($color, $degress)  // => color
color.adjust($color,  $hue: $amount)

// hue 222deg becomes 282deg
@debug adjust-hue(#6b717f, 60deg);  // #796b7f
// hue 164deg become 104deg
@debug adjust-hue(#d2e1dd, -60deg); // #d6e1d2
// hue 210deg becomes 255deg
@debug adjust-hue(#036, 45);  // #1a0066

color.complement($color)  // => color
complement($color)
color.adjust($color, $hue: 180deg)

// hue 222deg becomes 42deg
@debug color.complement(#6b717f); // #7f796b
// hue 164deg becomes 344deg
@debug color.complement(#d2e1dd); // #e1d2d6
// hue 210deg becomes 30deg
@debug color.complement(#036);  // #663300

saturate($color, $amount) // => color
color.adjust($color, $saturation: $amount)

// #0e4982 has saturation 80%, so when saturate() adds 30% it just becomes fully saturated
@debug saturate(#0e4982, 30%);  // #004990
// scale() instead makes it 30% more saturated than it was originally
@debug scale(#0e4982, $saturation: 30%);  // #0a4986
// saturation 50% becomes 70%
@debug saturate(#c69, 20%); // #e05299
// saturation 35% becomes 85%
@debug saturate(#f2ece4, 50%);  // #ebebeb
// saturation 80% becomes 100%
@debug saturate(#0e4982, 30%);  // #004990

desaturate($color, $amount) // => color
color.adjust($color, $saturation: -$amount)

// #d2e1dd has saturation 20%, so when desaturate() subtracts 30% it just returns grey
@debug desaturate(#d2e1dd, 30%);//   #dadada
// scale() instead makes it 30% less saturation than it was originally
@debug color.scale(#6b717f, $saturation: -30%); // #6e727c
// saturation 100% becomes 80%
@debug desaturate(#036, 20%); // #0a335c
// saturation 35% becomes 15%
@debug desaturate(#f2ece4, 20%);  // #eeebe8
// saturation 20% becomes 0%
@debug desaturate(#d2e1dd, 30%);  // #dadada

lighten($color, $amount)  // => color
color.adjust($color, $lightness: $amount)

// #e1d7d2 has lightness 85%, so when lighten() adds 30% it just returns white
@debug lighten(#e1d7d2, 30%); // white
// scale() instead makes it 30% lighter than it was originally
@debug color.scale(#e1d7d2, $lightness: 30%); // #eae3e0
// lightness 46% becomes 66%
@debug lighten(#6b717f, 20%); // #a1a5af
// lightness 20% becomes 80%
@debug lighten(#036, 60%);  // #99ccff
// lightness 85% becomes 100%
@debug lighten(#e1d7d2, 30%); // white

darken($color, $amount) // => color
color.adjust($color, $lightness: -$amount)

// #036 has lightness 20%, so when darken() subtracts 30% it just return black
@debug darken(#036, 30%); // black
// scale() instead makes it 30% darker than it was originally
@debug color.scale(#036, $lightness: -30%);
// lightness 92% becomes 72%
@debug darken(#b37399, 20%);  // #7c4465
// lightness 85% becomes 45%
@debug darken(#f2ece4, 40%);  // #b08b5a
// lightness 20% becomes 0%
@debug darken(#036, 30%); // black

opacity($color, $amount)  // => color
fade-in($color, $amount)
color.adjust($color, $alpha: $amount)

// rgba(#036, 0.7) has alpha 0.7, so when opacify() adds 0.3 it return a fully opaque color
@debug opacify(rgba(#036, 0.7), 0.3); // #036
// scale() instead makes it 30% more opaque than it was originally
@debug color.scale(rgba(#036, 0.7), $alpha: 30%); // rgba(0, 51, 102, 0.79)
@debug opacify(rgba(#6b717f, 0.5), 0.2);  // rgba(107, 113, 127, 0.7)
@debug fade-in(rgba(#e1d7d2, 0.5), 0.4);  // rgba(225, 215, 210, 0.9)
@debug opacify(rgba(#036, 0.7), 0.3); // #036

transparentize($color, $amount) // => color
fade-out($color, $amount)
color.adjust($color, $alpha: -$amount)

// rgba(#036, 0.3) has alpha 0.3, so when transparentize() subtracts 0.3 it return a fully transparent color
@debug transparentize(rgba(#036, 0.3), 0.3);  // rgba(0, 51, 102, 0)
// scale() instean makes it 30% more transparent than it was  originally
@debug color.scale(rgba(#036, 0.3), $alpha: -30%);  // rgba(0, 51, 102, 0.21)
@debug transparentize(rgba(#6b717f, 0.5), 0.2); // rgba(107, 113, 127,  0.3)
@debug fade-out(rgba(#e1d7d2, 0.5), 0.4); // rgba(225, 215, 210, 0.1)
@debug transparentize(rgba(#036, 0.3), 0.3);  // rgba(0, 51, 102, 0)
```

#### number

- red return [0, 255]
- blue return the blue of color as   [0, 255]
- green return the green of color as [0, 255]
- hue return the hue of color as [0deg, 255deg]
- saturation as [0%, 100%]
- lighteness return lightness of color as [0%, 100%]
- alpha return tha alpha of color as[0, 1], but ie use `alpha(opacity=20)` return an unquoted string


```scss
color.red($color)
red($color) // => number

@debug color.red(#e1d7d2);  // 225
@debug color.red(white);  // 255
@debug color.red(black);  // 0

color.green($color)
green($color) // => number

@debug color.green(#e1d7d2);  // 215
@debug color.green(white);  // 255
@debug color.green(black);  // 0

color.blue($color)
blue($color)  // => number

@debug color.blue(#e1d7d2); // 210
@debug color.blue(white); // 255
@debug color.blue(black); // 0

color.hue($color)
hue($color) // => number

@debug color.hue(#e1d7d2); // 20deg
@debug color.hue(#f2ece4);  // 34.2857142857deg
@debug color.hue(#dadbdf);  // 228deg

color.saturation($color)
saturation($color)  // => number

@debug color.saturation(#e1d7d2); // 20%
@debug color.saturation(#f2ece4); // 30%
@debug color.saturation(#dadbdf); // 7.2463768116%

color.lightness($color)
lightness($color) // => number

@debug color.lightness(#e1d7d2);  // 85.2941176471deg
@debug color.lightness(#f2ece4);  // 92.1568627451deg
@debug color.lightness(#dadbdf);  // 86.4705882353deg

color.alpha($color)
alpha($color)
opacity($color) // => number

@debug color.alpha(#e1d7d2);  // 1
@debug color.opacity(rgba(210, 225, 221, 0.4)); // 0.4
@debug alpha(opacity=20); // alpha(opacity=20)
```

#### others

- grayscale return a gray color with the same lightness as color
- ie-hex-str return unquoted string like #aabbccdd format expected by ie's -ms-filter property
- invert return inverse or negative of color, weight is [0%, 100%], heighter weight means result closer to negative, otherwise closer to $color


```scss
color.grayscale($color)
grayscale($color) // => color
color.change($color, $saturation: 0%)

@debug color.grayscale(#6b717f);  // #757575
@debug color.grayscale(#d2e1dd);  // #dadada
@debug color.grayscale(#036); // #333333

color.ie-hex-str($color)
ie-hex-str($color) // => unquoted string

@debug color.ie-hex-str(#b37399); // #ffb37399
@debug color.ie-hex-str(#808c99); // #ff808c99
@debug color.ie-hex-str(rgba(242, 236, 228, 0.6));  // #99f2ece4

color.invert($color, $weight: 100%)
invert($color, $weight: 100%) // => color

@debug color.invert(#b37399); // #4c8c66
@debug color.invert(black); // white
@debug color.invert(#550e0c, 20%);  // #663b3a
```

### sass:list

- in sass every map counts as a list, so all list function work for map 
- individual values also count as lists
- function
  - append return a copy of list, if value is list, will nested, and separactor is comma or space
  - join return a new list contain list1 and list2's elemets, if add individual value using append, beacuse join have not expecting result, join to combine two list, if brackented is true, return list has square brackets, if is false return no brackets
  - index return the index of value its first appearance
  - is-bracketed return whether list has square brackets
  - length return the length of list or map
  - separator return the name of the separator used by list, either space or comma
  - nth return element of list at index, if not index throws an error
  - set-nth return a copy of list with element at index replaced with value, throw an error if no exist index
  - zip combine every list into a sigle list of sub-list, return list is comma-separactor and sub-list space-separactor

```scss
list.append($list, $val, $separator: auto)
append($list, $val, $separactor: auto)  // => list

@debug list.append(10px 20px , 30px); // 10px 20px 30px
@debug list.append((blue, red), green); // blue, red, greed
@debug list.append(10px 20px, 30px 40px); // 10px 20px (30px 40px)
@debug list.append(10px, 20px, $separactor: comma); // 10px, 20px
@debug list.append((blue, red), green, $separactor: space); // blue red green

list.index($list, $val)
index($list, $val)  // => number | null

@debug list.index(1px solid red, 1px);  // 1
@debug list.index(1px solid red, solid);  // 2
@debug list.index(1px solid red, dashed); // null

list.join($list1, $list2, $separator: auto, $bracketed: auto)
join($list1, $list2, $separator: auto, $bracketed: auto)  // => list

@debug list.join(10px 20px, 30px 40px); // 10px 20px 30px 40px
@debug list.join((blue,red), (#abc, #def)); // blue, red, #abc, #def
@debug list.join(10px, 20px); // 10px 20px
@debug list.join(10px, 20px, $separator: comma);  // 10px, 20px
@debug list.join((blue, red), (#abc, #def), $separator: space); // blue red #abc #def
@debug list.join([10px], 20px); // [10px, 20px]
@debug list.join(10px, 20px, $bracketed: true); // [10px 20px]

list.is-bracketed($list)
is-bracketed($list) // => boolean

@debug list.is-bracketed(1px 2px 3px); // false
@debug list.is-bracketed([1px, 2px, 3px]);  // true

list.length($list)
length($list) // => number

@debug list.length(10px); // 1
@debug list.length(10px 20px 30px); // 3
@debug list.length((width: 10px, height: 20px));  // 2

list.separator($list)
list-separator($list) // => unquoted string

@debug list.separator(1px 2px 3px); // space
@debug list.separator(1px, 2px, 3px); // comma
@debug list.separator("helvetica"); // space
@debug list.separator(());  // space

list.nth($list, $index)
nth($list, $index)

@debug list.nth(10px 12px 16px, 2); // 12px
@debug list.nth([line1, line2, line3], -1); // line3

list.set-nth($list, $index, $val)
set-nth($list, $index, $val)  // => list

@debug list.set-nth(10px 20px 30px, 1, 2em);  // 2em 20px 30px
@debug list.set-nth(10px 20px 30px , -1, 8em);  // 10px,    20px , 8em
@debug list.set-nth((Helvetica, Arial, sans-serif), 3, Roboto); // Helvetica, Arial, Roboto

list.zip($lists...)
zip($lists...)  // => list

@debug list.zip(10px 50px 100px, short mid long); // 10px short, 50px mid, 100px long
@debug list.zip(10px 50px 100px, short mid);  // 10px short, 50px mid
```

### sass:map

- get return value or null
- has-key return boolean whether map contains key
- keys return a comma-separated list of all keys
- values return a comma-separated list of all values
- merge return new map with all key-value from map1 and map2, and is origin order
- remove return a copy of map, if a key doesn't in map, it's ignored


```scss
map.get($map, $key)
map-get($map, $key)

map.has-key($map, $key)
map-has-key($map, $key)

map.keys($map)
map-keys($map)

map.values($map)
map-values($map)

map.merge($map1, $map2)
map-merge($map1, $map2)

map.remove($map, $keys...)
map-remove($map, $keys...)

$font-weights: ("regular": 400, "medium": 500, "bold": 700);

@debug map.get($font-weights, "medium");  // 500
@debug map.get($font-weights, "extra-bold"); // null

@debug map.has-key($font-weights, "regular"); // true
@debug map.has-key($font-weights, "bolder");  // false

@debug map.keys($font-weights); // "regular", "medium", "bold"

@debug map.values($font-weights); // 400, 500, 700

$light-weights: ("lightest": 100, "light": 300);
$heavy-weights: ("medium": 500, "bold": 700);

@debug map.merge($light-weights, $heavy-weights);
/* (
  "lightest": 100,
  "light": 300,
  "medium": 500,
  "bold": 700
)
*/

// map.merge() can be used to add a single key/value pair to a map
@debug map.merge($light-weights, ("lighter": 200));
// ("lightest": 100, "light": 300, "lighter": 200)

// it can also be used to overwrite a value in a map
@debug map.merge($light-weights, ("light": 200));
// ("lightest": 100, "light": 300, "lighter": 200)

// it can also be used to overwrite a value in a map
@debug map.merge($light-weights, ("light": 200));
// ("lightest": 100, "light": 200)

@debug map.remove($font-weights, "regular");  // ("medium": 500, "bold": 700)
@debug map.remove($font-weights, "regular", "bold");  // ("medium": 500)
@debug map.remove($font-weights, "bolder"); // ("regular": 400, "medium": 500, "bold": 700)
```

### sass:math

#### return numbers

- abs return absolute value of number
- ceil is rounds number up to next whole number
- round is rounds number to nearest whole number
- floor rounds number down to next whole number
- max return the hightest of number, a list of numbers can be using ...
- min return the lowest of number, a list of number using ...
- percentage convert a unitless number to a percentage, is identical to `$number * 100%`
- random return [0, 1] or [1, $limit]

```scss
math.abs($number)
abs($number) 

@debug math.abs(10px); // 10px
@debug math.abs(-10px); // 10px

math.ceil($number)
ceil($number) 

@debug math.ceil(4); // 4
@debug math.ceil(4.2); // 5
@debug math.ceil(4.9);  // 5

math.round($number)
round($number)

@debug math.round(4); // 4
@debug math.round(4.2); // 4
@debug math.round(4.9); // 5

math.floor($number)
floor($number)

@debug math.floor(4);   // 4
@debug math.floor(4.2); // 4
@debug math.floor(4.9); // 4

math.max($number...)
max($number...)

@debug math.max(1px, 4px);  // 4px

$widths: 50px, 30px, 100px;
@debug math.max($widths...);  // 100px

math.min($number...)
min($number...)

@debug math.min(1px, 4px);  // 1px

$widths: 50px, 30px, 100px;
@debug math.min($widths...);  // 30px

math.percentage($number)
percentage($number)

@debug math.percentage(0.2);  // 20%
@debug math.percentage(100px / 50px); // 200%

math.random($limit: null)
random($limit: null)

// $limit is null, return (0, 1)
@debug math.random(); // 0.2321254534
@debug math.random(); // 0.8764192013

// $limit than or equal to 1, return [1, $limit]
@debug math.random(10); // 4
@debug math.random(10000);  // 5935
```

#### return booleans and quoted-string

- compatible return whether compatible units, if compatible, so can `+`, `-`, compared, otherwise produce errors, the global `comparable` add to the sass:math module, the name changed to `compatible`
- is-unitless return boolean whether has no unit
- unit return a string units, its output format is not consistent in sass version 

```scss
math.compatible($number1, $number2)
comparable($number1, $number2)

@debug math.compatible(2px, 1px); // true
@debug math.compatible(100px, 3em); // false
@debug math.compatible(10cm, 3mm);  // true

math.is-unitless($number)
unitless($number)

@debug math.is-unitless(100); // true
@debug math.is-unitless(100px); // false

math.unit($number)
unit($number) // => quoted string

@debug math.unit(100);  // ""
@debug math.unit(100px); // "px"
@debug math.unit(5px * 5px); // "px*px"
@debug math.unit(5px / 1s); // "px/s"
```

### sass:meta

#### mixins

- meta.load-css($url, $width: null): loads the module at $url and includes its css, if passed $with, it must be a map(key without $), and $url can be relative
- $url should be a string but not be a css url()
- like the @use rule:
  - only evaluate the given module once
  - cannot provide configuration to already loaded module
- unlike the  rule:
  - in loaded module, any members don't avaliable in the current module
  - can used to anywhere in stylesheet even can nested
  - url can come from variable and include interpolation

```scss
// dark-theme/_code.scss
$border-contrast: false !default;

code {
  background-color: #6b717f;
  color: #d2e1dd;
  @if $border-contrast {
    border-color: #dadbdf;
  }
}

// style.scss
@use "sass:meta";

body.dark {
  @include meta.load-css("dark-theme/code", $with: ("border-contrast": true));
}
```



### sass:selector

#### selector values

- inspect and manipulate selector function, return a selector, they arguments just be normal string(quoted or not) or combination like ".main aside:hover, .sidebar p"

```scss
@debug ((unquote(".main") unquote("aside:hover")),
        (unquote(".sidebar") unquote("p")));
// .main aside:hover, .sidebar p
```
- parse return format selector
- simple-selector return simple selector by comma-separated-unquoted list, $selector must a single contain compound selector string, without contain include space combinators or commas, 
- is-superselector return boolean whether $super match(contain) all $sub elements, arguments contain placeholder selector but not parent selector(&)
- append return selector that $selector without descendant combinator, whitespace and parent selector, may contain placeholder selectors
- unify return both match $selector1 and selector2 selector or null or overlap, don't guaranteed match all elements when complex-selector
- nest return selector that $selector may contain placeholder selector and parent selector
- extend return a copy of $selector, extend $selector with @extend rule, using $extendee, $extender to replace all instance $extendee in $selector, if $selector doesn't contain $extendee, return it as-is, arguments may contain placeholder selectors, but no parent selector
- replace return copy of $selector with $replacement to instead $original using @extend rule, if $selector doesn't contain $original return it as-is, all arguments may contain placeholder selector but not parent selector

```scss
selector.parse($selector)
selector-parse($selector) // => selector

@debug selector.parse(".main aside:hover, .sidebar p");
// ((unquote(".main") unquote("aside:hover")),
//  (unquote(".sidebar") unquote("p")))

selector.simple-selectors($selector)
simple-selectors($selector)  // => list

//                                                        函数名存在问题
@debug selector.compound-selectors("a.disabled");  // a, .disabled
@debug selector.compound-selectors("main.blog:after");  // main, .blog, :after

selector.is-superselector($super, $sub)
is-superselector($super, $sub)  // => boolean

@debug selector.is-superselector("a", "a.disabled");  // true
@debug selector.is-superselector("a.disabled", "a");  // false
@debug selector.is-superselector("a", "sidebar a"); // true
@debug selector.is-superselector("sidebar a", "a"); // false
@debug selector.is-superselector("a", "a"); // true

selector.append($selectors...)
selector-append($selectors...)  // => selector

@debug selector.append("a", ".disabled"); // a.disabled
@debug selector.append(".accordion", "__copy"); // .accordion__copy
@debug selector.append(".accordion", "__copy, __image");  
// .accordion__copy, .accordion__image

selector.unify($selector1, $selector2)
selector-unify($selector1, $selector2)  // => selector | null

@debug selector.unify("a", ".disabled");  // a.disabled
@debug selector.unify("a.disabled", "a.outgoing");  // a.disabled.outgoing
@debug selector.unify("a", "h1"); // null
@debug selector.unify(".warning a", "main a");  // .warning main a, main .warning a

selector.nest($selectors...)
selector-nest($selectors...)  // => selector

@debug selector.nest("ul", "li"); // ul li
@debug selector.nest(".alert, .warning", "p");  // .alert p, .warning p
@debug selector.nest(".alert", "&:hover");  // .alert:hover
@debug selector.nest(".accordion", "&__copy");  // .accordion__copy

selector.extend($selector, $extendee, $extender)
selector-extend($selector, $extendee, $extender)//  => selector

#{$extender} {
  @extend #{$extendee};
}

@debug selector.extend("a.disabled", "a", ".linK"); // a.disabled, .link.disabled
@debug selector.extend("a.disabled", "h1", "h2"); // a.disabled@
@debug selector.extend(".guide .info", ".info", ".content nav.sidebar");
// .guide .info, .guide .content nav.sidebar, .content .guide nav.sidebar

selector.replace($selector, $original, $replacement)
selector-replace($selector, $original, $replacement)  // => selector

@debug selector.replace("a.disabled", "a", ".link");  // .link.disabled
@debug selector.replace("a.disabled", "h1", "h2");  // a.disabled
@debug selector.replace(".guide .info", ".info", ".content nav.sidebar");
// .guide .content nav.sidebar, .content .guide nav.sidebar
```

### sass:string

- quote return a quoted string
- unquote return an unquoted string and it produce **invalid css** string
- index return the first appear index or null
- length return characters number 
- insert return a copy of $string with $insert inserted at $index, if $index higher than length so added to end, if $index is negative than length, added to start
- slice return a substring [$start-at, $end-at]
- to-upper-case return a copy of $string with ascii to upper case
- to-lower-case return a copy of $string with ascii to lower case
- unique-id return a randomly-generated unique unquoted string and its a valid css identifer


```scss
string.quote($string)
quote($string)  // => string

@debug string.quote(Helvetica); // "Helvetica"
@debug string.quote("Helvetica"); // "Helvetica"

string.unquote()
unquote() // string

@debug string.unquote("Helvetica"); // Helvetica
@debug string.unquote(".widget:hover"); // .widge:hover

string.index($string, $substring)
str-index($string, $substring)  // => number

@debug string.index("Helvetica Neue", "Helvetica"); // 1
@debug string.index("Helvetica Neue", "Neue");  // 11

string.length($string)
str-length($string) // => number

@debug string.length("Helvetica Neue"); // 14
@debug string.length(bold); // 4
@debug string.length(""); // 0

string.insert($string, $insert, $index)
str-insert($string, $insert, $index)  // => string

@debug string.insert("roboto bold", " mono", 7); // "roboto mobo bold"
@debug string.insert("roboto bold", " mono", -5); // "roboto mobo bold"

@debug string.insert("roboto", "bold", 100);  // "roboto bold"
@debug string.insert("bold", "roboto", -100); // "roboto bold"

string.slice($string, $start-at, $end-at: -1)
str-slice($string, $start-at, $end-at: -1)  // => string

@debug string.slice("Helvetica Neue", 11);  // "Neue"
@debug string.slice("Helvetica Neue", 1, 3);  // "Hel"
@debug string.slice("Helvetica Neue", 1, -6); // "Helvetica"

string.to-upper-case($string)
to-upper-case($string)  // => string

@debug string.to-upper-case("bold");  // "BOLD" 
@debug string.to-upper-case(sans-serif);  // SANS-SERIF

string.to-lower-case($string)
to-lower-case($string)  // => string

@debug string.to-lower-case("BOld");  // "bold"
@debug string.to-lower-case(SANS-SERIF);  // sans-serif

string.unique-id()
unique-id() // => string

@debug string.unique-id();  // uabtrnzug
@debug string.unique-id(); // u6w1b1def
```

## breaking changes

### overview

- new sass version are as backwards-compatible(previous version) as possibile

### extending compound selectors(only dartsass)

- libsass currently allow compound selectors(like .message.info) to be extended, but doesn't match @extend work
- write `.heads-up {@extend .info}` just like `class="heads-up info"` in html, but `.heads-up {@extend .message.info}` not like `class="heads-up message info"`,  it only it to have .info.message selector together, but for compatibility should extend each simple selector separactor
  
```scss
// these should both be extend, but they won't be
.message {
  border: 1px solid black
}
.info {
  font-size: 1.5rem;
}

.heads-up {
  @extend .message.info;
}
```
```scss
.message {
  border: 1px solid black;
}
.info {
  font-size: 1.5rem;
}

.heads-up {
  // @extend .message;
  // @extend .info;
  @extend .message, .info;
}
```

- because sass doesn't know the details of html css'style, so @extend might generator extra won't apply to html's selector, but its true to away from compound selectors, so recommend replaceing it using a placeholder selector

```scss
// instead of just `.message.info`
%message-info, .message.info {
  border: 1px solid black;
  font-size: 1.5rem;
}

.heads-up {
  // instead of `.message.info`
  @extend %message-info;
}
```

### css variable syntax

- older lib-ruby-sass parsed custom property declaractions like other property declaration,allowing any sassscript expression as value, but wasn't compatible with css, so parse failed to css

```scss
// output css as-is
:root {
  --flex-theme: {
    border: 1px solid var(--theme-dark-blue);
    font-family: var(--theme-font-family);
    padding: var(--theme-wide-padding);
    background-color: var(--theme-light-blue);
  };
}
```

- so provide maximum compatibility with plain css, require sass-exp written interpolation in custom property

```scss
$accent-color: #fbbc04;

:root {
  // wrong, will not work in recent sass versions
  // --accent-color-wrong: $accent-color;
  --accent-color-wrong: $accent-color;

  // right, will work in all sass versions
  // --accent-color-right: #fbbc04;
  --accent-color-right: #{$accent-color};
}
```

- interpolation will remove quotation mark from quoted string , so shoult using `meta.inspect()` to preserve their quotes

```scss
@use "sass:meta";

$font-family-monospace: Menlo, Consolas, "Courier New", monospace;

:root {
  --font-family-monospace: #{meta.inspect($font-family-monospace)};
}
```

## command-line interface

- dart sass has the same command-line interface no matter how you install it
- ruby sass is deprecated, so should move to different implementation

### dart-sass command-line interface

#### usage

- one-to-one mode:
  - if no output location is passed, the compiled css is printed to the terminal
  - input file extends is .scss, .sass, .css, if doesn't have one of these three extensions, parsed as scss by default, this can controlled with the `--indented` flag
  - special string can be passed, sass will default to parsing it as scss unless `--indented` flag is passed
- many-to-many mode:
  - when compiling whole directories, sass will ignore partial files names begin with `_`， its will without creating a bunch of uncessary output files

```bash
$ sass <input.scss> [output.css]

$ sass [<input.scss>:<output.css>] [<input/>:<output/>]...

# compiles style.scss to style.css
$ sass style.scss:style.css

# compiles light.scss and dark.scss to light.css and dark.css
$ sass light.scss:light.css dark.scss:dark.css

# compiles all sass files in themes/ to css file in public/css/
$ sass themes:public/css
```

#### options

- `--stdin` flag: when it's passed no input file may be passed, without using in many-to-many mode

```bash
$ echo "h1 {font-size: 40px}" |  sass --stdin h1.css
$ echo "h1 {font-size: 40px}" |  sass --stdin
h1 {
  font-size: 40px;
}
```

- `--indented` flag: force using indented syntex to parsed the input file, is useful when input file is coming from standard input, so its syntax can't be determined. the inverse `--no-indented` flag can be force parsed as scss

```bash
$ echo -e "h1\n font-size: 40px" | sass --indented -
h1 {
  font-size: 40px;
}
```

- `--load-path` flag(abbreviated -I): adds an additional load path and can be passed multiple load paths, earlier load path is precedence

```bash
$ sass --load-path=node_modules/boostrap/dist/css style.scss style.css
```

- `--style`(abbreviated -s) control output style of css, dart support two value is expanded(default) and compressed

```bash
$ sass --style=expanded style.scss
h1 {
  font-size: 40px;
}

$ sass --style=compressed style.scss
h1{font-size:40px}
```

- `--no-charset` flag tell sass to emit a @charset in expanded output mode or a utf-8 byte-order-mark in compressed output mode, default `--charset` passed, will insert them if stylesheet contains any no-ascii charactors

```bash
$ echo 'h1::before {content: "👭"}' | sass --no-charset
h1::before {
  content: "👭";
}

$ echo 'h1::before {content: "👭"}' | sass --charset
@charset "UTF-8";
h1::before {
  content: "👭";
} 
```

- `--error-css` flag(default) is whether emit a css file when occur an errors during compilation, and the  error description in a comment in body::before, and `--no-error-css` to disable it, now `--update` and `watch` flag will delete css files when have an error occur

```bash
$ sass --error-css style.scss style.css
/* Error: Incompatible units em and px.
 *   ,
 * 1 | $width: 15px + 2em;
 *   |         ^^^^^^^^^^
 *   |
 *   test.scss 1:9  root stylesheet */

body::before {
  font-family: "Source Code Pro", "SF Mono", Monaco, Inconsolata, "Fira Mono",
      "Droid Sans Mono", monospace, monospace;
  white-space: pre;
  display: block;
  padding: 1em;
  margin-bottom: 1em;
  border-bottom: 2px solid black;
  content: "Error: Incompatible units em and px.\a   \2577 \a 1 \2502  $width: 15px + 2em;\a   \2502          ^^^^^^^^^^\a   \2575 \a   test.scss 1:9  root stylesheet";         
}
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em;
  │         ^^^^^^^^^^
  ╵
  test.scss 1:9  root stylesheet
```

- `--update` flag let sass only compile modified stylesheets to generate corresponding css, and also print status message

```bash
$ sass --update themes:public/css
compiled themes/light.scss to public/css/light.css.
```

#### source maps

- tell browsers or other tools that css correspond come from, they make it possible to see and edit sass in browser, dart sass generate source maps by default for  every css
- `--no-source-map` won't generate  any source maps
- `--source-map-urls` will the sass generator link to css, dart support two url for `relative` links(be default) and `absolute` using `file:urls`
- `--embed-sources` to embed entire contents of sass file to generator css in source map
- `--embed-source-map` to embed content of source map file to generator css

```bash
$ sass --no-source-map style.scss style.css

# generates a url like "../sass/style.scss".
$ sass --source-map-urls=relative sass/style.scss css/style.css

# generates a url like "file:///home/style-wiz/sassy-app/sass/style.scss".
$ sass --source-map-urls=absolute sass/style.scss css/style.css

$ sass --embed-sources sass/style.scss css/style.css

$ sass --embed-sources-map sass/style.scss css/style.css
```

#### other options

- `--watch` like `--update` but continue compiling entire stylesheet when change
  - `--poll` passed along with `--watch`, tell sass often to manually check change, it's useful when edit on remote drive
- `--stop-on-error` to stop compiling immediately when an error is detected, it's useful in many-to-many mode
- `--interactive` (abbreviated -i) to run in interactive mode, its support variables and @use rules
- `--color`(default by support them terminal) to emit terminal colors, and `--no-color` is inverse
- `--no-unicode` emit ascii charactor to terminal as error messages, by default `--unicode` emit non-ascii characters, don't affect css output
- `--quiet` (abbreviated -q) not to emit any warning when compiling
- `--trace` to print  full dart or js stack trace when an error is encountered
- `--help` (abbreviated -h) prints a summary of documentation
- `--version` print the current version of sass

```bash
$ sass --watch themes:public/css
compiled themes/light.scss to public/css/light.css

# then when you edit themes/dark.scss...
compiled themes/dark.scss to public/css/dark.css

$ sass --watch --poll themes:public/css
compiled themes/light.scss to public/css/light.css

# then when you edit themes/dark.scss...
compiled themes/dark.scss to public/css/dark.css

$ sass --stop-on-error themes:public/css
Error: Expected expression.
   ╷
42 │ h1 {font-face: }
   │                ^
   ╵
  themes/light.scss 42:16  root stylesheet

$ sass --interactive
>> 1px + 1in
97px
>> @use "sass:map"
>> $map: ("width": 100px, "height":70px)
("width": 100px, "height": 70px)
>> map.get($map, "width")
100px

$ sass --color style.scss style.css
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em
  │         ^^^^^^^^^^
  ╵
  style.scss 1:9  root stylesheet

$ sass --no-color style.scss style.css
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em
  │         ^^^^^^^^^^
  ╵
  style.scss 1:9  root stylesheet

$ sass --no-unicode style.scss style.css
Error: Incompatible units em and px.
  ,
1 | $width: 15px + 2em;
  |         ^^^^^^^^^^
  ' 
  test.scss 1:9  root stylesheet'

$ sass --unicode style.scss style.css
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em;
  │         ^^^^^^^^^^
  ╵
  test.scss 1:9  root stylesheet

$ sass --quiet style.scss style.css

$ sass --trace style.scss style.css
Error: Expected expression.
   ╷
42 │ h1 {font-face: }
   │                ^
   ╵
  themes/light.scss 42:16  root stylesheet

package:sass/src/visitor/evaluate.dart 1846:7                        _EvaluateVisitor._addExceptionSpan
package:sass/src/visitor/evaluate.dart 1128:12                       _EvaluateVisitor.visitBinaryOperationExpression
package:sass/src/ast/sass/expression/binary_operation.dart 39:15     BinaryOperationExpression.accept
package:sass/src/visitor/evaluate.dart 1097:25                       _EvaluateVisitor.visitVariableDeclaration
package:sass/src/ast/sass/statement/variable_declaration.dart 50:15  VariableDeclaration.accept
package:sass/src/visitor/evaluate.dart 335:13                        _EvaluateVisitor.visitStylesheet
package:sass/src/visitor/evaluate.dart 323:5                         _EvaluateVisitor.run
package:sass/src/visitor/evaluate.dart 81:10                         evaluate
package:sass/src/executable/compile_stylesheet.dart 59:9             compileStylesheet
package:sass/src/executable.dart 62:15                               main

$ sass --help
Compile Sass to CSS.

Usage: sass <input.scss> [output.css]
       sass <input.scss>:<output.css> <input/>:<output/>

...

$ sass --version
1.23.3
```

## javascript api

dart sass is `sass` package, and libsass is `node-sass` package, the sass module provides two function with similar apis

### usage

- `renderSync()` 
  - using synchronously compiles a sass file to css
  - if it succeeds return result, otherwise throws an error
  - it take an options object must set `file` option or `data` option
- `render()` 
  - using asynchronously compiles a sass file to css, 
  - when rendering is completely will call a callback with result or error
  - it take an options object must set `file` or `data` option
- using dart-sass, `renderSync()` is almost twice as fast as `render()` by default due to overhead of evaluation process, so to avoid performance hit should pass `fiber` option to `render()`
- `info` property contain a tab-separated information string about sass-version and compilation-version

```javascript
var sass = require("sass"); // or require("node-sass");

var result = sass.renderSync({file: "style.scss"});
// ...

sass.render({
  file: "style.scss"
}, function(err, result) {
  // ...
});

console.log(sass.info); // about dart-sass
// dart-sass  1.23.3  (Sass Compiler) [Dart]
// dart2js  2.0.0 (Dart Compiler) [Dart]
```

- `result Object`: when `render(Sync)()` succees, they provide a contain compilation information result object
  - `result.css` is compiled css as a buffer, by calling `Buffer.toString()`  convert to string
  - `result.map` is compiled css to source files maps as a buffer, by calling `toString()` convert string
    - this is null or undefined unless `sourceMap` option is string or `sourceMap` option is true and set `outFile` option
    - the map uses absolute file:URLs to link sass-source or lists its URL as stdin with `data` option
  - `result.stats.includedFiles` is an array of absolute paths of all sass files loaded during compilation
    - if loaded from `importer` return the stylesheet's contents of raw string of @use or @import
  - `result.stats.entry` is:
    - absolute path of input as `file` option
    - data as `data` option
  - `result.stats.start` is milliseconds between 1970 at sass compilation began
  - `result.stats.end` is millisecond between 1970 at sass compilation ended
  - `result.stats.duration` is millisecond compile sass file equal to `start` minus `end`


```javascript
var result = sass.renderSync({file: "style.scss"});

console.log(result.css.toString());

var result = sass.renderSync({
  file: "style.scss",
  sourceMap: true,
  outFile: "style.css"
});

console.log(result.map.toString());
```

- error object: when `render(Sync)()` fail, provide an contain compilation information error object
  - `error.formatted` is error string, more detailed than `error.toString()` and `error.message`
  - `error.file` return a error string occured stylesheet
    - if loaded from disk, return absolute path
    - if loaded from importer, return a raw string of @use or @import
    - if occurred in data option, return string is `stdin` 
  - `error.line` return line in error occurred
  - `error.colum` return column in error occurred
  - `error.status` return program exit status

### options

thest options control how sass loads it input files(compatibility with all dartsass and partial libsass)

#### input, indentedSyntax, includePaths

- `file` option
  - string option is loaded file path, if file extension is .scss or no extension, is parsed as scss, .sass is parsed as indented syntax, .css parsed as plain css
  - if `file` and `data` option are both passed, `file` as path of stylesheet for error reporting, `data` as contents of stylesheet

```javascript
sass.renderSync({file: "style.scss"});
```

- `data` provide to compile stylesheet contents, unless set `file` as well, the stylesheet URL is set to "stdin"
  
```javascript
sass.renderSync({
  data: `
  h1 {
    font-size: 40px;
  }`
});
```

- `indentedSyntax` option control whether the `data` is parsed as indented syntax or not, it defaults to false, don't effect on stylesheet loaded using file option

```javascript
sass.renderSync({
  data: `
  h1
    font-size: 40px`,
    indentedSyntax: true
});
```

- `includePaths`: 
  - provide load paths from sass to look for imports string array, earlier load precedence over later
  - load paths are also loaded from SASS_PATH environment variable, and the variables should separated by `;`(only win) or `:`
  - load path from `includePaths` precedence over SASS_PATH

```javascript
sass.renderSync({
  file: "style.scss",
  includePaths: ["node_modules/bootstrap/dist/css"]
});
```
```bash
$ SASS_PATH=node_modules/bootstrap/dist/css sass.scss style.css
```

#### output

these options control how sass produces output files

- `outputStyle` is a control result css style string, have four value
  - `expanded`(default dart) each selector and declaration write on its own line
  - `compressed` remove extra characters as possible, write entire stlesheet on a single line
  - `nested`(default libsass, don't support dart) 
  - `compact`(not support dart) put each css rule on its own single line

```javascript
var source = `
h1 {
  font-size: 40px;
  code {
    font-face: Roboto Mono;
  }
}`;

var result = sass.renderSync({
  data: source, 
  outputStyle: "expanded"
});
console.log(result.css.toString());
// h1 {
//    font-size: 40px;
// }
// h1 code {
//    font-face: Roboto Mono;
// }

result = sass.renderSync({
  data: source,
  outputStyle: "compressed"
});
console.log(result.css.toString());
// h1{font-size:40px}h1 code{font-face:Roboto Mono}

result = sass.renderSync({
  data: source,
  outputStyle: "nested"
});
console.log(result.css.toString());
// h1 {
//    font-size: 40px;}
//    h1 code {
//        font-face: Roboto Mono;}

result = sass.renderSync({
  data: source,
  outputStyle: "compact"
});
console.log(result.css.toString());
// h1 { font-size: 40px; }
// h1 code { font-face: Roboto Mono; }
```

- `precision` option(no support sart), provide integer precision using generating css number, default is 5

```javascript
var result = sass.renderSync({
  data: `
  h1 {
    font-size: (100px / 3);
  }`,
  precision: 20
});

console.log(result.css.toString());
// h1 {
//    font-size: 33.333333333333336px; }

```

- `indentType` option determines whether generated css should using `space` or `tab` for indentation, default is `space`

```javascript
var result = sass.renderSync({
  file: "style.scss",
  indentType: "tab",
  indentWidth: 1
});

result.css.toString();
// "h1 {\n\tfont-size: 40px;\n}\n"
```

- `indentWidth` option control how many spaces or tabs per indentation level, default is 2, between [0, 10]

```javascript
var result = sass.renderSync({
  file: "style.scss",
  indentWidth: 4
});

console.log(result.css.toString());
// h1 {
//    font-size: 40px;
// }
```

- `linefeed` control each line ending using character string
  - `lf` uses U+000A line feed
  - `cr` uses U+000D carriage return
  - `lfcr`
  - `crlf`

```javascript
var result = sass.renderSync({
  file: "style.scss",
  linefeed: "crlf"
});

console.log(result.css.toString());
// "h1 {\r\n font-size: 40px;\r\n}\r\n"
```

- `sourceComments` option causes sass to emit comment for every style rule, default false

```javascript
var result  = sass.renderSync({
  file: "style.scss",
  sourceComments: true
});

console.log(result.css.toString());
// /* line 1, style.scss */
// h1 {
//   font-size: 40px;
// }
```

#### source Maps

- css corresponds to sass files, let source maps available using result.map field

- `sourceMap`:
  - the flag control whether source map are generated
  - if is string, it's the path that css => source map => sass source, but if `outFile` isn't passed, css will writen same directory as if `file` passed
  - if is true, the path assumed `outFile` with .map endding, but `outFile` isn't passed, it's no effect

```javascript
var result = sass.renderSync({
  file: "style.scss",
  sourceMap: "out.map"
});
console.log(result.css.toString());
// h1 {
//    font-size: 40px;  
// }
// /*# sourceMappingURL=out.map */

result = sass.renderSync({
  file: "style.scss",
  sourceMap: true,
  outFile: "out.css"
});
console.log(result.css.toString());
// h1 {
//    font-size: 40px;
// }
// /*# sourceMappingURL=out.css.map */

```

- `outFile` option is string that genetated css to be saved, but sass doesn't write the css output to the file, caler must do that themselves

```javascript
result = sass.renderSync({
  file: "style.scss",
  sourceMap: true,
  outFile: "out.css"
});
console.log(result.css.toString());
// h1 {
//    font-size: 40px;
// }
// /*# sourceMappingURL=out.css.map */
```

- `omitSourceMapUrl` flag will cause sass not to link from css to source-map

```javascript
var result = sass.renderSync({
  file: "style.scss",
  sourceMap: "out.map",
  omitSourceMpaUrl: true
});
console.log(result.css.toString());
// h1 {
//    font-size: 40px;
// }
```

- `sourceMapContents` flag to embed entire sass to css in sourcr map, it guarantees source is available on any computer

```javascript
sass.renderSync({
  file: "style.scss",
  sourceMap: "out.map",
  sourceMapContents: true
});
```

- `sourceMapEmbed` flag to embed source map to generated css

```javascript
sass.renderSync({
  file: "style.scss".
  sourceMap: "out.map",
  embedSourceMap: true                //                        is conflict
});
```

- `sourceMapRoot` flag is prepended to all link from source map to source file

#### plugins

these options use js callbacks to expand the functionality of sass compilation

- `fiber` option 
  - that `render()` using fibers package to call asynchronous importers from the synchronous code path to avoid this performance hit
  - option is allowed but no effect in nodesass or using renderSync() function


```javascript
var sass = require("sass");
var Fiber = require("fibers");

sass.render({
  file: "input.scss",
  importer: function(url, prev, done) {
    // ...
  },
  fiber: Fiber
}, function(err, result) {
  // ...
});
```

- `funtions`
  - defines additional built-in sass function but are avaliable in all stylesheet
  - it's an object that key is sass function signatures, and value is javascript function
  - if takes arbitrary arguments, function should take a single argument
  - function return sync, unless `render()`
  - function synchronously throws an error will reported to caller and stylesheet compilation fails, but async no way to report error
  - custom function should ensure all arguments is expect type

```javascript
sass.render({
  data: `
  h1 {
    font-size: pow(2, 5) * 1px;
  }`,
  function: {
    // this function uses the syncronous api, and can be passed to 
    // either rederSync() or render()
    'pow($base, $exponent)': function(base, exponent) {
      if (!(base instanceof sass.types.Number)) {
        throw "$base: expected a number.";
      } else if (base.getUnit()) {
        throw "$base: expected a unitless number";
      }
      if (!(exponent instanceof sass.types.Number)) {
        throw "$exponent:expected a number";
      } else if (exponent.getUnit()) {
        throw "$exponent:expected a unitless number";
      }

      return new sass.types.Number(
        Math.pow(base.getValue(), exponent.getValue());
      )
    },

    // this function uses the asynchronous api
    // and can only be pased to render()
    "sqrt($number)": function(number, done) {
      if (!(number instanceof sass.types.Number)) {
        throw "$number: expected a number";
      } else if (number.getUnit()) {
        throw "$number:expected a unitless number";
      }
      done(new sass.types.Number(Math.sqrt(number.getValue())));
    }
  }
}, function(err,result) {
  console.log(result.css.toString());
  // h1 {
  //    font-size: 32px;
  // }
});
```

#### importer

```javascript
sass.render({
  file: "style.scss",
  importer: [
    // this importer uses the synchronous api,
    // and can be passed to either rendersync() or render()
    function(url, prev) {
      // this generates a stylesheet from scratch for `@use "big-headers"`
      if (url != "big-headers") return null;

      return {
        contents: `
        h1 {
          font-size:40px;
        }`
      };
    },
    // this importer uses the asynchronous api
    // and can only be passed to render()
    function(url, prev, done) {
      // convert `@use "foo/bar"` to "node_modules/foo/sass/bar"
      var components = url.split("/");
      var innerPath = components.slice(1).join("/");
      done({
        file: `node_modules/${components.first}/sass/${innerPath}`
      });
    }
  ]
}, function(err, result) {
  // ...
})
```

### value type

```javascript
new sass.types.Number(0.5); // == 0.5
new sass.types.Number(10, "px");  // == 10px
new sass.types.Number(10, "px*px"); // == 10px * 1px
new sass.types.Number(10, "px/s");  // == 10px * 1s
new sass.types.Number(10, "px*px/s*s"); // 10px * 1px / 1s /1s

var number = new sass.types.Number(10, "px");
console.log(number.getVaule()); // 10

// number is `10px`
console.log(number.getUnit());  // "px"

// number is `10px / 1s`
console.log(number.getUnit());  // "px/s"

```

```javascript
new sass.types.String("Arial"); // == Arial

// string is `Arial`
string.getValue();  // "Arial"

// string is `"Helvetica Neue"`
string.getValue();  // "Helvetica Neue"

// string is `\1f46d`
string.getValue();  // "\\1f46d"

// string is `"\1f46d"`
string.getValue();  // "👭"

```


```javascript
new sass.types.Color(107, 113, 127);  // #6b717f
new sass.types.Color(0, 0, 0, 0); // rgba(0, 0, 0, 0)

new sass.types.Color(0xff6b717f); // #6b717f
new sass.types.Color(0x00000000); // rgba(0, 0, 0, 0)

// color is `#6b717f`
color.getR(); // 107

// color is `#b37399`
color.getR(); // 179

// color is `#6b717f`
color.getG(); // 113

// color is `#b37399`
color.getG(); // 115

// color is `#6b717f`
color.getB(); // 127

// color is `#b37399`
color.getB(); // 153

// color is `#6b717f`
color.getA(); // 1

// color is `transparent`
color.getA(); // 0

```


```javascript
// boolean is `true`
boolean.getValue(); // true
boolean === sass.types.Boolean.TRUE;  // true

// boolean is `false`
boolean.getValue(); // false
boolean === sass.types.Boolean.FALSE; // false
```

```javascript
var list = new sass.types.List(3);
list.setValue(0, new sass.types.Number(10, "px"));
list.setValue(1, new sass.types.Number(10, "px"));
list.setValue(2, new sass.types.Number(32, "px"));

// list is `10px, 15px, 32px`
list.getValue(0); // 10px
list.getValue(2); // 32px

// list is `10px, 15px, 32px`
list.getSeparator();  // true

list is `1px solid`
list.getSeparator();  // false

// list is `10px, 15px, 32px`
list.getLength(); // 3

// list is `1px solid`
list.getLength();// 2

// list is `10px, 15px, 32px`
list.setValue(1, new sass.types.Number(18, "px"));
list; // 10px, 18px, 32px
```

```javascript
var map = new sass.types.Map(2);
map.setKey(0, new sass.types.String("width"));
map.setValue(0, new sass.types.Number(300, "px"));
map.setKey(1, new sass.types.String("height"));
map.setValue(1, new sass.types.Number(100px, "px"));
map;  // (width: 300px, height: 100px)

// map is `(width:300px, height: 100px)`
map.getKey(0);  // width
map.getKey(1);  // height

// map is `(width: 300px, height: 100px)`
map.getValue(0);  // 300px
map.getValue(1);  // 100px

// map is `("light": 200, "medium": 400, "bold": 600)`
map.getLength();  // 3

// map is `(width: 300px, height: 100px)`
map.getLength();  // 2

// map is `("light": 200, "medium": 400, "bold": 600)`
map.setKey(0, new sass.types.String("lighter"));
map;  // (lighter: 200, "medium": 400, "bold": 600)

// map is `("light": 200, "medium": 400, "bold": 600)`
map.setKey(1, new sass.types.Number(300));
map;  // ("light": 200, "medium": 300, "bold": 600)

```

