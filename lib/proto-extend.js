var extend = function(){
  var base = arguments[0];
  var extensions = Array.prototype.slice.call(arguments, 1);

  // Object prototype may only be an Object or null
  if (typeof base !== 'object') {
    base = null;
  }

  return extensions.reduce(function(base, object){
    if (typeof object !== 'object' || object === null) {
      return base;
    }
    return Object.create(base, getOwnPropertyDescriptorMap(object));
  }, base);
};

var getOwnPropertyDescriptorMap = function(object){
  var properties = Object.getOwnPropertyNames(object);

  return properties.reduce(function(map, property) {
    map[property] = Object.getOwnPropertyDescriptor(object, property);
    return map;
  }, Object.create(null));
};

module.exports = extend;
module.exports.getOwnPropertyDescriptorMap = getOwnPropertyDescriptorMap;
