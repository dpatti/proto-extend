var expect = require('chai').expect;
var extend = require('../lib/proto-extend');
var getOwnPropertyDescriptorMap = extend.getOwnPropertyDescriptorMap;
var flatten = extend.flatten;

describe('extend()', function(){
  it('returns a new object', function(){
    var a = {};
    var b = {};
    var result = extend(a, b);
    expect(result).to.not.equal(a);
    expect(result).to.not.equal(b);
  });

  it('uses the prototype chain to extend', function(){
    var a = {};
    var result = extend(a, {});
    expect(Object.getPrototypeOf(result)).to.equal(a);
  });

  it('retains the property descriptors', function(){
    var i = 0;
    var a = { get foo(){ return i; } };
    var result = extend(a, {});
    expect(result.foo).to.equal(0);
    i++;
    expect(result.foo).to.equal(1);
  });

  it('uses null for invalid bases', function(){
    var result = extend(undefined, {});
    expect(Object.getPrototypeOf(result)).to.equal(null);
  });

  it('ignores extensions that are not objects', function(){
    var base = {};
    var result = extend(base, null, undefined, 1, true, "hello");
    expect(Object.getPrototypeOf(result)).to.equal(Object.prototype);
  });
});

describe('getOwnPropertyDescriptorMap()', function(){
  it('returns a map of key -> descriptor', function(){
    var descriptor = {
      foo: {
        value: [],
        enumerable: true
      }
    };
    var result = Object.create(null, descriptor)
    var map = getOwnPropertyDescriptorMap(result);
    expect(map).to.have.property('foo')
      .with.property('value', descriptor.foo.value);
    expect(map).to.have.property('foo')
      .with.property('enumerable', true);
  });
});

describe('flatten()', function(){
  it('returns a new object', function(){
    var a = {};
    expect(flatten(a)).to.not.equal(a);
  });

  it('iterates the entire prototype chain', function(){
    var a = { id: 'a', foo: 1 };
    var b = { id: 'b', bar: 2 };
    var c = { id: 'c', baz: 3 };

    var chained = extend(a, b, c);
    var flattened = flatten(chained);

    expect(flattened).to.have.property('id', 'c');
    expect(flattened).to.have.property('foo', 1);
    expect(flattened).to.have.property('bar', 2);
    expect(flattened).to.have.property('baz', 3);
  });

  it('retains the property descriptors', function(){
    var i = 0;
    var a = { get foo(){ return i; } };
    var flattened = flatten(extend(a, {}));
    expect(flattened.foo).to.equal(0);
    i++;
    expect(flattened.foo).to.equal(1);
  });

  it('stops at Object.prototype by default', function(){
    var a = {};
    expect(Object.getPrototypeOf(flatten({}))).to.equal(Object.prototype);
  });

  it('only flattens to the specified base', function(){
    var a = {};
    var flattened = flatten(extend(a, {}), a);
    expect(Object.getPrototypeOf(flattened)).to.equal(a);
  });

  it('stops at the null prototype if specified was not found', function(){
    var a = {};
    var flattened = flatten(extend(a, {}), {});
    expect(Object.getPrototypeOf(flattened)).to.equal(null);
  });
});
