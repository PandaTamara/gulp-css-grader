Gulp-css-grader
=======================

Plugin for Gulp for grader css property by user wish. Check it examples.

## Installation

Install package with NPM and add it to your development dependencies:

`npm install --save-dev gulp-css-grader`

## Usage

The main purpose of this plugin is to help prepare color schemes for the site template. For example you compile your Sass files to css by Gulp and get following css:

```css
.container {
    width: 100% !important;
    padding-right: 0.75rem;
    color: #fff;
    background-color: #000;
}

@media (min-width: 576px) {
    .container {
        max-width: 540px;
    }

    .btn {
        width: 100px;
        color: #000 !important;
    }
}
```

To get all the rules that contain color properties add this pipe to your gulp task

```
.pipe(grader('get', {properties: ['color', 'background-color', 'border-color', 'background', 'box-shadow', 'border']}))
```

The result is

```css
.container {
    color: #fff;
    background-color: #000;
}

@media (min-width: 576px) {
    .btn {
        color: #000 !important;
    }
}
```


If you want to get all the rules except for some properties, add this pipe to your gulp task

```
.pipe(grader('remove', {properties: ['color', 'background-color']}))
```

The result is

```css
.container {
    width: 100% !important;
    padding-right: 0.75rem;
}

@media (min-width: 576px) {
    .container {
        max-width: 540px;
    }

    .btn {
        width: 100px;
    }
}
```

Voila!

