import mq from 'js-mq';
import camelcase from 'camelcase';

const prefix                = 'data-mq-';
const selector              = '.js-mq';
const propValDelimiter      = '--';

const elMap = new Map();
const frameUpdatesAdding = new Map();
const frameUpdatesRemoving = new Map();

export default {
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

      rules.push({el, mq, property, value});
    }
  }

  return rules;
}

document.addEventListener('DOMContentLoaded', collectElements);




function parseStyleString(value) {
  return (value.indexOf(';') === -1 ? [value] : value.split(';'))
      .map((s) => {
        if (s) {
          const arr = s.split(':');
          return {
            property: arr[0],
            value: arr[1]
          }
        } else {
          return null;
        }
      })
      .filter(o => o !== null);
}

function clearElementStyles(el, styles) {
  applyElementStyles(el, styles, true);
}

function applyElementStyles(el, styles, remove = false) {
  if (typeof styles === 'string') {
    styles = parseStyleString(styles);
  }
  for (const style of styles) {
    const propertyCamelCase = camelcase(style.property);
    el.style[propertyCamelCase] = remove ? '' : style.value;
  }
}

function removeElementRule({el, mq, property, value}) {
  switch (property) {
    case 'style':
      clearElementStyles(el, value);
      break;
    default:
      el.removeAttribute(property);
      break;
  }
}
function addElementRule({el, mq, property, value}) {
  switch (property) {
    case 'style':
      applyElementStyles(el, value);
      break;
    default:
      el.setAttribute(property, value);
      break;
  }
}