# proto-extend

A tiny library that provides a function to create a prototype chain from
multiple objects.

Stop writing this:

```javascript
var Child = Object.create(Parent, {
  foo: {
    "value": 10
  },
  bar: {
    "value": function() { /* ... */ }
  }
});
```

And start writing this:

```javascript
var Child = extend(Parent, {
  foo: 10,
  bar: function() { /* ... */ }
});
```

## Usage

```javascript
var extend = require('proto-extend');
var a = { id: 'a', foo: 1 };
var b = { id: 'b', bar: 2 };
var c = { id: 'c', baz: 3 };

var chain = extend(a, b, c);
```

The above returns a new object with a prototype chain of the following:

```
c -> b -> a -> Object.prototype
```

and has the properties:

```javascript
{
  id: 'c',
  foo: 1,
  bar: 2,
  baz: 3
}
```

For more information on how the prototype chain works, see the MDN article
[Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain).

## API

### `extend(base, extensions...) -> Object`

The main export. Takes a base and any number of extension objects and returns a
new object. If the base is not an object, `null` will be used instead. Each
extension is converted to a property descriptor map and a new object is created.
Extensions that are not an object are ignored.

### `extend.getOwnPropertyDescriptorMap(object) -> Object`

A helper function used internally but exposed for convenience. It uses the
native methods on Object for getting a list of property names and property
descriptors and creates a map. The main purpose is to feed the second argument
of [`Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create).
