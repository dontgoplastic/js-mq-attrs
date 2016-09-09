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
		return str;
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

const prefix = 'data-mq-';
const selector = '.js-mq';
const propValDelimiter = '--';

const elMap = new Map();
const frameUpdatesAdding = new Map();
const frameUpdatesRemoving = new Map();

var jsMqAttrs = {
  registerNewEls: collectElements
};

function collectElements() {

  const els = Array.from(document.querySelectorAll(selector));

  if (els.length === 0) return;

  for (const el of els) {
    if (elMap.has(el) === false) {
      elMap.set(el, parseElementRules(el));
    }
  }

  for (const [el, rules] of elMap.entries()) {
    for (const rule of rules) {
      mq.on(rule.mq, () => {
        scheduleForUpdate(el, 'add', rule);
      }, () => {
        scheduleForUpdate(el, 'remove', rule);
      });
    }
  }
}

function processUpdates() {
  for (const [el, updates] of frameUpdatesRemoving.entries()) {
    for (const update of updates) {
      removeElementRule(update);
    }
  }
  for (const [el, updates] of frameUpdatesAdding.entries()) {
    for (const update of updates) {
      addElementRule(update);
    }
  }

  frameUpdatesAdding.clear();
  frameUpdatesRemoving.clear();
  updating = false;
}

let updating = false;
function scheduleForUpdate(el, type, rule) {

  const targetMap = type === 'add' ? frameUpdatesAdding : frameUpdatesRemoving;

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

  const rules = [];
  const attrs = el.attributes;
  const attrsLength = attrs.length;

  for (let i = 0; i < attrsLength; i++) {
    const attr = attrs[i];
    const attrName = attr.name;

    if (attrName.startsWith(prefix)) {

      // 'data-mq-xs--class' => ['xs', 'class']
      const arr = attrName.substring(prefix.length).split(propValDelimiter);

      const mq = arr[0];
      const property = arr[1];
      const value = attr.value;

      rules.push({ el, mq, property, value });
    }
  }

  return rules;
}

document.addEventListener('DOMContentLoaded', collectElements);

function parseStyleString(value) {
  return (value.indexOf(';') === -1 ? [value] : value.split(';')).map(s => {
    if (s) {
      const arr = s.split(':');
      return {
        property: arr[0],
        value: arr[1]
      };
    } else {
      return null;
    }
  }).filter(o => o !== null);
}

function clearElementStyles(el, styles) {
  applyElementStyles(el, styles, true);
}

function applyElementStyles(el, styles, remove = false) {
  if (typeof styles === 'string') {
    styles = parseStyleString(styles);
  }
  for (const style of styles) {
    const propertyCamelCase = index(style.property);
    el.style[propertyCamelCase] = remove ? '' : style.value;
  }
}

function removeElementRule({ el, mq, property, value }) {
  switch (property) {
    case 'style':
      clearElementStyles(el, value);
      break;
    default:
      el.removeAttribute(property);
      break;
  }
}
function addElementRule({ el, mq, property, value }) {
  switch (property) {
    case 'style':
      applyElementStyles(el, value);
      break;
    default:
      el.setAttribute(property, value);
      break;
  }
}

return jsMqAttrs;

})));
//# sourceMappingURL=js-mq-attrs.js.map