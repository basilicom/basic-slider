# basic-slider

jQuery basic content slider. Not funky but usefull.

Demo: http://labs.marco-senkpiel.de/demos/basic-slider/

## Usage

```js
$(elements).basicSlider();
```

## Options

**width** (Number - default: 600)
**height** (Number - default: 300)
**duration** (Number - default: 500)
**easing** (String - default: 'swing'): you can use jQuery easing plugin to alter this behavior
**onStart** (Function - default: null)
**onComplete** (Function - default: null)
**navigationContainer** (jQueryElement - default: null): you can use a class selector for multiple navigation's

## Methods

**next()**
**prev()**
**goToSlide(int)** e.g. 1-3
**goToIndex(int)** e.g. 0-2

## Calling a Method

```js
$('#slider').basicSlider('method', arguments);
```

## Change Log

### Version 1.1

+ added new option <em>navigationContainer</em> - if it set (an jquery object) an navigation item of each element will be appended to this container

### Version 1.0

+ base slider functionality added