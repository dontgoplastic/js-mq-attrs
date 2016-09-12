(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('js-mq')) :
	typeof define === 'function' && define.amd ? define(['js-mq'], factory) :
	(global.mq = global.mq || {}, global.mq.attrs = factory(global.mq));
}(this, (function (mq) { 'use strict';

mq = 'default' in mq ? mq['default'] : mq;

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module) {
'use strict';

function preserveCamelCase(str) {
	var isLastCharLower = false;

	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);

		if (isLastCharLower && (/[a-zA-Z]/).test(c) && c.toUpperCase() === c) {
			str = str.substr(0, i) + '-' + str.substr(i);
			isLastCharLower = false;
			i++;
		} else {
			isLastCharLower = (c.toLowerCase() === c);
		}
	}

	return str;
}

module.exports = function () {
	var str = [].map.call(arguments, function (str) {
		return str.trim();
	}).filter(function (str) {
		return str.length;
	}).join('-');

	if (!str.length) {
		return '';
	}

	if (str.length === 1) {
		return str.toLowerCase();
	}

	if (!(/[_.\- ]+/).test(str)) {
		if (str === str.toUpperCase()) {
			return str.toLowerCase();
		}

		if (str[0] !== str[0].toLowerCase()) {
			return str[0].toLowerCase() + str.slice(1);
		}

		return str;
	}

	str = preserveCamelCase(str);

	return str
	.replace(/^[_.\- ]+/, '')
	.toLowerCase()
	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
};
});

var ready = createCommonjsModule(function (module) {
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var config = {
  prefix: 'data-mq-',
  identifyingClass: 'js-mq',
  propValDelimiter: '--'
};

var elMap = new Map();
var frameUpdatesAdding = new Map();
var frameUpdatesRemoving = new Map();

function collectElements() {

  var els = Array.from(document.querySelectorAll('.' + config.identifyingClass));

  if (els.length === 0) return;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = els[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var el = _step.value;

      if (elMap.has(el) === false) {
        elMap.set(el, parseElementRules(el));
      }
      // @TODO allow re-eval of previously added elements
      el.classList.remove(config.identifyingClass);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    var _loop = function _loop() {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var el = _step2$value[0];
      var rules = _step2$value[1];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop2 = function _loop2() {
          var rule = _step3.value;

          mq.on(rule.queryName, function () {
            scheduleForUpdate(el, 'add', rule);
          }, function () {
            scheduleForUpdate(el, 'remove', rule);
          });
        };

        for (var _iterator3 = rules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          _loop2();
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    };

    for (var _iterator2 = elMap.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function processUpdates() {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = frameUpdatesRemoving.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _slicedToArray(_step4.value, 2);

      var el = _step4$value[0];
      var updates = _step4$value[1];
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = updates[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var update = _step6.value;

          removeElementRule(update);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  var _iteratorNormalCompletion5 = true;
  var _didIteratorError5 = false;
  var _iteratorError5 = undefined;

  try {
    for (var _iterator5 = frameUpdatesAdding.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
      var _step5$value = _slicedToArray(_step5.value, 2);

      var el = _step5$value[0];
      var updates = _step5$value[1];
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = updates[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var _update = _step7.value;

          addElementRule(_update);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError5 = true;
    _iteratorError5 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion5 && _iterator5.return) {
        _iterator5.return();
      }
    } finally {
      if (_didIteratorError5) {
        throw _iteratorError5;
      }
    }
  }

  frameUpdatesAdding.clear();
  frameUpdatesRemoving.clear();
  updating = false;
}

var updating = false;
function scheduleForUpdate(el, type, rule) {

  var targetMap = type === 'add' ? frameUpdatesAdding : frameUpdatesRemoving;

  if (updating === false) {
    updating = true;
    window.requestAnimationFrame(processUpdates);
  }
  if (targetMap.has(el) === false) {
    targetMap.set(el, []);
  }
  targetMap.get(el).push(rule);
}

function parseElementRules(el) {

  var rules = [];
  var attrs = el.attributes;
  var attrsLength = attrs.length;

  for (var i = 0; i < attrsLength; i++) {
    var attr = attrs[i];
    var attrName = attr.name;

    if (attrName.startsWith(config.prefix)) {

      // 'data-mq-xs--class' => ['xs', 'class']
      var arr = attrName.substring(config.prefix.length).split(config.propValDelimiter);

      var queryName = arr[0];
      var property = arr[1];
      var value = attr.value;

      rules.push({ el: el, queryName: queryName, property: property, value: value });
    }
  }

  return rules;
}

ready(collectElements);

function parseStyleString(value) {
  return (value.indexOf(';') === -1 ? [value] : value.split(';')).map(function (s) {
    if (s) {
      var arr = s.split(':');
      return {
        property: arr[0],
        value: arr[1]
      };
    } else {
      return null;
    }
  }).filter(function (o) {
    return o !== null;
  });
}

function clearElementStyles(el, styles) {
  applyElementStyles(el, styles, true);
}

function applyElementStyles(el, styles) {
  var remove = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  if (typeof styles === 'string') {
    styles = parseStyleString(styles);
  }
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = styles[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var style = _step8.value;

      var propertyCamelCase = index(style.property);
      el.style[propertyCamelCase] = remove ? '' : style.value;
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return) {
        _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }
}

function removeElementRule(_ref) {
  var el = _ref.el;
  var queryName = _ref.queryName;
  var property = _ref.property;
  var value = _ref.value;

  switch (property) {
    case 'style':
      clearElementStyles(el, value);
      break;
    default:
      el.removeAttribute(property);
      break;
  }
}
function addElementRule(_ref2) {
  var el = _ref2.el;
  var queryName = _ref2.queryName;
  var property = _ref2.property;
  var value = _ref2.value;

  switch (property) {
    case 'style':
      applyElementStyles(el, value);
      break;
    default:
      el.setAttribute(property, value);
      break;
  }
}

var jsMqAttrs = {
  config: config,
  registerNewEls: collectElements
};

return jsMqAttrs;

})));
//# sourceMappingURL=js-mq-attrs.js.map
