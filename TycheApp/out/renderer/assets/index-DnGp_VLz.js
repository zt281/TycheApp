/**
* @vue/shared v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove$1 = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return ((str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  });
};
const camelizeRE = /-\w/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
/**
* @vue/reactivity v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let activeEffectScope;
class EffectScope {
  // TODO isolatedDeclarations "__v_skip"
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this._on = 0;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.__v_skip = true;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    if (++this._on === 1) {
      this.prevScope = activeEffectScope;
      activeEffectScope = this;
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (activeEffectScope === this) {
        activeEffectScope = this.prevScope;
      } else {
        let current = activeEffectScope;
        while (current) {
          if (current.prevScope === this) {
            current.prevScope = this.prevScope;
            break;
          }
          current = current.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn, failSilently = false) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed2 = false) {
  sub.flags |= 8;
  if (isComputed2) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail2 = sub.depsTail;
  let link = tail2;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail2) tail2 = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail2;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
    return;
  }
  computed2.flags |= 2;
  const dep = computed2.dep;
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2.flags |= 128;
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  // TODO isolatedDeclarations "__v_skip"
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
    this.__v_skip = true;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function getDepFromReactive(object, key) {
  const depMap = targetMap.get(object);
  return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
  const raw = /* @__PURE__ */ toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
function toWrapped(target, item) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
  }
  return toReactive(item);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toWrapped(this, value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(
      this,
      "filter",
      fn,
      thisArg,
      (v) => v.map((item) => toWrapped(this, item)),
      arguments
    );
  },
  find(fn, thisArg) {
    return apply(
      this,
      "find",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(
      this,
      "findLast",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", (item) => toWrapped(this, item));
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (!result.done) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  let wrappedFn = fn;
  let wrapInitialAccumulator = false;
  if (arr !== self2) {
    if (needsWrap) {
      wrapInitialAccumulator = args.length === 0;
      wrappedFn = function(acc, item, index) {
        if (wrapInitialAccumulator) {
          wrapInitialAccumulator = false;
          acc = toWrapped(self2, acc);
        }
        return fn.call(this, acc, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  const result = arr[method](wrappedFn, ...args);
  return wrapInitialAccumulator ? toWrapped(self2, result) : result;
}
function searchProxy(self2, method, args) {
  const arr = /* @__PURE__ */ toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
    args[0] = /* @__PURE__ */ toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = /* @__PURE__ */ toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (/* @__PURE__ */ isRef(res)) {
      const value = targetIsArray && isIntegerKey(key) ? res : res.value;
      return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
    }
    if (isObject(res)) {
      return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
    if (!this._isShallow) {
      const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
      if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
        oldValue = /* @__PURE__ */ toRaw(oldValue);
        value = /* @__PURE__ */ toRaw(value);
      }
      if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
        if (isOldValueReadonly) {
          return true;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (target === /* @__PURE__ */ toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = /* @__PURE__ */ toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return extend(
      // inheriting all iterator properties
      Object.create(innerIterator),
      {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        }
      }
    );
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
      return target.size;
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        const target = /* @__PURE__ */ toRaw(this);
        const proto = getProto(target);
        const rawValue = /* @__PURE__ */ toRaw(value);
        const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
        const hadKey = proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue);
        if (!hadKey) {
          target.add(valueToAdd);
          trigger(target, "add", valueToAdd, valueToAdd);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
          value = /* @__PURE__ */ toRaw(value);
        }
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = /* @__PURE__ */ toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
  if (/* @__PURE__ */ isReadonly(value)) {
    return /* @__PURE__ */ isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
const toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (/* @__PURE__ */ isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
    newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
// @__NO_SIDE_EFFECTS__
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, key, _defaultValue) {
    this._object = _object;
    this._defaultValue = _defaultValue;
    this["__v_isRef"] = true;
    this._value = void 0;
    this._key = isSymbol(key) ? key : String(key);
    this._raw = /* @__PURE__ */ toRaw(_object);
    let shallow = true;
    let obj = _object;
    if (!isArray(_object) || isSymbol(this._key) || !isIntegerKey(this._key)) {
      do {
        shallow = !/* @__PURE__ */ isProxy(obj) || /* @__PURE__ */ isShallow(obj);
      } while (shallow && (obj = obj["__v_raw"]));
    }
    this._shallow = shallow;
  }
  get value() {
    let val = this._object[this._key];
    if (this._shallow) {
      val = unref(val);
    }
    return this._value = val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    if (this._shallow && /* @__PURE__ */ isRef(this._raw[this._key])) {
      const nestedRef = this._object[this._key];
      if (/* @__PURE__ */ isRef(nestedRef)) {
        nestedRef.value = newVal;
        return;
      }
    }
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(this._raw, this._key);
  }
}
function propertyToRef(source, key, defaultValue) {
  return new ObjectRefImpl(source, key, defaultValue);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (/* @__PURE__ */ isRef(source)) {
    getter = () => source.value;
    forceTrigger = /* @__PURE__ */ isShallow(source);
  } else if (/* @__PURE__ */ isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
    getter = () => source.map((s) => {
      if (/* @__PURE__ */ isRef(s)) {
        return s.value;
      } else if (/* @__PURE__ */ isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove$1(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          oldValue = newValue;
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Map();
  if ((seen.get(value) || 0) >= depth) {
    return value;
  }
  seen.set(value, depth);
  depth--;
  if (/* @__PURE__ */ isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
/**
* @vue/runtime-core v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (/* @__PURE__ */ isRef(value)) {
    value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = /* @__PURE__ */ toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function withDirectives(vnode, directives) {
  if (currentRenderingInstance === null) {
    return vnode;
  }
  const instance = getComponentPublicInstance(currentRenderingInstance);
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function provide(key, value) {
  if (currentInstance) {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = getCurrentInstance();
  if (instance || currentApp) {
    let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
function hasInjectionContext() {
  return !!(getCurrentInstance() || currentApp);
}
const ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
const TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function isTemplateRefKey(refs, key) {
  let desc;
  return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = /* @__PURE__ */ toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
    if (isTemplateRefKey(refs, key)) {
      return false;
    }
    return hasOwn(rawSetupState, key);
  };
  const canSetRef = (ref22, key) => {
    if (key && isTemplateRefKey(refs, key)) {
      return false;
    }
    return true;
  };
  if (oldRef != null && oldRef !== ref3) {
    invalidatePendingSetRef(oldRawRef);
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (/* @__PURE__ */ isRef(oldRef)) {
      const oldRawRefAtom = oldRawRef;
      if (canSetRef(oldRef, oldRawRefAtom.k)) {
        oldRef.value = null;
      }
      if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = /* @__PURE__ */ isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef() || !rawRef.k ? ref3.value : refs[rawRef.k];
          if (isUnmount) {
            isArray(existing) && remove$1(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                const newVal = [refValue];
                if (canSetRef(ref3, rawRef.k)) {
                  ref3.value = newVal;
                }
                if (rawRef.k) refs[rawRef.k] = newVal;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          if (canSetRef(ref3, rawRef.k)) {
            ref3.value = value;
          }
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        const job = () => {
          doSet();
          pendingSetRefMap.delete(rawRef);
        };
        job.id = -1;
        pendingSetRefMap.set(rawRef, job);
        queuePostRenderEffect(job, parentSuspense);
      } else {
        invalidatePendingSetRef(rawRef);
        doSet();
      }
    }
  }
}
function invalidatePendingSetRef(rawRef) {
  const pendingSetRef = pendingSetRefMap.get(rawRef);
  if (pendingSetRef) {
    pendingSetRef.flags |= 8;
    pendingSetRefMap.delete(rawRef);
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove$1(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
    let needsWrap = false;
    let isReadonlySource = false;
    if (sourceIsReactiveArray) {
      needsWrap = !/* @__PURE__ */ isShallow(source);
      isReadonlySource = /* @__PURE__ */ isReadonly(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (hasOwn(props, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, props, type }
  }, key) {
    let cssModules;
    return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = /* @__PURE__ */ reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val,
          enumerable: true
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (/* @__PURE__ */ isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render2, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app2._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render2(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app2._instance,
            16
          );
          render2(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render: render2,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render2.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render22 = Component;
      if (false) ;
      result = normalizeVNode(
        render22.length > 1 ? render22(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return /* @__PURE__ */ shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render22(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
  const nextProp = nextProps[key];
  const prevProp = prevProps[key];
  if (key === "style" && isObject(nextProp) && isObject(prevProp)) {
    return !looseEqual(nextProp, prevProp);
  }
  return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.suspense.vnode.el = root.el = el;
      vnode = root;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
  if (suspense && suspense.activeBranch === vnode) {
    suspense.vnode.el = el;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = /* @__PURE__ */ toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = /* @__PURE__ */ toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || !isInternalKey(key)) {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    } else if (ref3 == null && n1 && n1.ref != null) {
      setRef(n1.ref, null, parentSuspense, n1, true);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
      try {
        if (customElement) {
          customElement._beginPatch();
        }
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } finally {
        if (customElement) {
          customElement._endPatch();
        }
      }
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        try {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        } finally {
        }
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
        initialVNode.placeholder = placeholder.el;
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce && root.ce._hasShadowRoot()) {
            root.ce._injectChildStyle(
              type,
              instance.parent ? instance.parent.type : void 0
            );
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              queuePostRenderEffect(() => {
                if (!instance.isUnmounted) update();
              }, parentSuspense);
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchorVNode = c2[nextIndex + 1];
        const anchor = nextIndex + 1 < l2 ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
        ) : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => {
          if (vnode.ctx.isUnmounted) {
            hostRemove(el);
          } else {
            hostInsert(el, container, anchor);
          }
        };
        const performLeave = () => {
          if (el._isLeaving) {
            el[leaveCbKey](
              true
              /* cancelled */
            );
          }
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex,
      memo
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      pauseTracking();
      setRef(ref3, null, parentSuspense, vnode, true);
      resetTracking();
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    const shouldInvalidateMemo = memo != null && cacheIndex == null;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        if (shouldInvalidateMemo) {
          vnode.el = null;
        }
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render2 = (vnode, container, namespace) => {
    let instance;
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
        instance = container._vnode.component;
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs(instance);
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render: render2,
    hydrate,
    createApp: createAppAPI(render2)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        if (c2.patchFlag === -1) {
          c2 = ch2[i] = cloneIfMounted(c2);
        }
        c2.el = c1.el;
      }
      if (c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
  if (anchorVnode.placeholder) {
    return anchorVnode.placeholder;
  }
  const instance = anchorVnode.component;
  if (instance) {
    return resolveAsyncComponentPlaceholder(instance.subTree);
  }
  return null;
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
const Text = /* @__PURE__ */ Symbol.for("v-txt");
const Comment = /* @__PURE__ */ Symbol.for("v-cmt");
const Static = /* @__PURE__ */ Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || /* @__PURE__ */ isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (/* @__PURE__ */ isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    placeholder: vnode.placeholder,
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        } else if (incoming == null && existing == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !isModelListener(key)) {
          ret[key] = incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized || isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])\w/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
      instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
const version = "3.5.33";
/**
* @vue/runtime-dom v3.5.33
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
const vShowHidden = /* @__PURE__ */ Symbol("_vsh");
const CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
const displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      const value = next[key];
      if (value != null) {
        if (!shouldPreserveTextareaResizeStyle(
          el,
          key,
          !isString(prev) && prev ? prev[key] : void 0,
          value
        )) {
          setStyle(style, key, value);
        }
      } else {
        setStyle(style, key, "");
      }
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
  return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && // #12408 check if it's declared prop or it's async custom element
    (shouldSetAsPropForVueCE(el, key) || // @ts-expect-error _def is private
    el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
    return false;
  }
  if (key === "sandbox" && el.tagName === "IFRAME") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
  const props = (
    // @ts-expect-error _def is private
    el._def.props
  );
  if (!props) {
    return false;
  }
  const camelKey = camelize(key);
  return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
const assignKey = /* @__PURE__ */ Symbol("_assign");
const vModelCheckbox = {
  // #4096 array checkboxes need to be deep traversed
  deep: true,
  created(el, _, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    addEventListener(el, "change", () => {
      const modelValue = el._modelValue;
      const elementValue = getValue(el);
      const checked = el.checked;
      const assign2 = el[assignKey];
      if (isArray(modelValue)) {
        const index = looseIndexOf(modelValue, elementValue);
        const found = index !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el, checked));
      }
    });
  },
  // set initial checked on mount to wait for true-value/false-value
  mounted: setChecked,
  beforeUpdate(el, binding, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    setChecked(el, binding, vnode);
  }
};
function setChecked(el, { value, oldValue }, vnode) {
  el._modelValue = value;
  let checked;
  if (isArray(value)) {
    checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    checked = value.has(vnode.props.value);
  } else {
    if (value === oldValue) return;
    checked = looseEqual(value, getCheckboxValue(el, true));
  }
  if (el.checked !== checked) {
    el.checked = checked;
  }
}
function getValue(el) {
  return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el ? el[key] : checked;
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const render = ((...args) => {
  ensureRenderer().render(...args);
});
const createApp = ((...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
});
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
/*!
 * pinia v3.0.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => /* @__PURE__ */ ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app2) {
      setActivePinia(pinia);
      pinia._a = app2;
      app2.provide(piniaSymbol, pinia);
      app2.config.globalProperties.$pinia = pinia;
      toBeInstalled.forEach((plugin) => _p.push(plugin));
      toBeInstalled = [];
    },
    use(plugin) {
      if (!this._a) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.add(callback);
  const removeSubscription = () => {
    const isDel = subscriptions.delete(callback);
    isDel && onCleanup();
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
const ACTION_MARKER = Symbol();
const ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  } else if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !/* @__PURE__ */ isRef(subPatch) && !/* @__PURE__ */ isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !Object.prototype.hasOwnProperty.call(obj, skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(/* @__PURE__ */ isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      pinia.state.value[id] = state ? state() : {};
    }
    const localState = /* @__PURE__ */ toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = { deep: true };
  let isListening;
  let isSyncListening;
  let subscriptions = /* @__PURE__ */ new Set();
  let actionSubscriptions = /* @__PURE__ */ new Set();
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    pinia.state.value[$id] = {};
  }
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop
  );
  function $dispose() {
    scope.stop();
    subscriptions.clear();
    actionSubscriptions.clear();
    pinia._s.delete($id);
  }
  const action = (fn, name = "") => {
    if (ACTION_MARKER in fn) {
      fn[ACTION_NAME] = name;
      return fn;
    }
    const wrappedAction = function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackSet = /* @__PURE__ */ new Set();
      const onErrorCallbackSet = /* @__PURE__ */ new Set();
      function after(callback) {
        afterCallbackSet.add(callback);
      }
      function onError(callback) {
        onErrorCallbackSet.add(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name: wrappedAction[ACTION_NAME],
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = fn.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackSet, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackSet, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackSet, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackSet, ret);
      return ret;
    };
    wrappedAction[ACTION_MARKER] = true;
    wrappedAction[ACTION_NAME] = name;
    return wrappedAction;
  };
  const partialStore = {
    _p: pinia,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = /* @__PURE__ */ reactive(partialStore);
  pinia._s.set($id, store);
  const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (/* @__PURE__ */ isRef(prop) && !isComputed(prop) || /* @__PURE__ */ isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (/* @__PURE__ */ isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        pinia.state.value[$id][key] = prop;
      }
    } else if (typeof prop === "function") {
      const actionValue = action(prop, key);
      setupStore[key] = actionValue;
      optionsForPlugin.actions[key] = prop;
    } else ;
  }
  assign(store, setupStore);
  assign(/* @__PURE__ */ toRaw(store), setupStore);
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineStore(id, setup, setupOptions) {
  let options;
  const isSetupStore = typeof setup === "function";
  options = isSetupStore ? setupOptions : setup;
  function useStore(pinia, hot) {
    const hasContext = hasInjectionContext();
    pinia = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia || (hasContext ? inject(piniaSymbol, null) : null);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
/**
 * dockview-core
 * @version 5.2.0
 * @link https://github.com/mathuo/dockview
 * @license MIT
 */
function styleInject(css, ref2) {
  if (ref2 === void 0) ref2 = {};
  var insertAt = ref2.insertAt;
  if (typeof document === "undefined") {
    return;
  }
  var head = document.head || document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
var css_248z = '.dv-scrollable {\n  position: relative;\n  overflow: hidden;\n}\n.dv-scrollable .dv-scrollbar {\n  position: absolute;\n  border-radius: 2px;\n  background-color: transparent;\n  /* GPU optimizations */\n  will-change: background-color, transform;\n  transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n  transition-property: background-color;\n  transition-timing-function: ease-in-out;\n  transition-duration: 1s;\n  transition-delay: 0s;\n}\n.dv-scrollable .dv-scrollbar-horizontal {\n  bottom: 0px;\n  left: 0px;\n  height: 4px;\n}\n.dv-scrollable .dv-scrollbar-vertical {\n  right: 0px;\n  top: 0px;\n  width: 4px;\n}\n.dv-scrollable:hover .dv-scrollbar, .dv-scrollable.dv-scrollable-resizing .dv-scrollbar, .dv-scrollable.dv-scrollable-scrolling .dv-scrollbar {\n  background-color: var(--dv-scrollbar-background-color, rgba(255, 255, 255, 0.25));\n}\n.dv-svg {\n  display: inline-block;\n  fill: currentcolor;\n  line-height: 1;\n  stroke: currentcolor;\n  stroke-width: 0;\n}\n.dockview-theme-dark {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-group-view-background-color: #1e1e1e;\n  --dv-tabs-and-actions-container-background-color: #252526;\n  --dv-activegroup-visiblepanel-tab-background-color: #1e1e1e;\n  --dv-activegroup-hiddenpanel-tab-background-color: #2d2d2d;\n  --dv-inactivegroup-visiblepanel-tab-background-color: #1e1e1e;\n  --dv-inactivegroup-hiddenpanel-tab-background-color: #2d2d2d;\n  --dv-tab-divider-color: #1e1e1e;\n  --dv-activegroup-visiblepanel-tab-color: white;\n  --dv-activegroup-hiddenpanel-tab-color: #969696;\n  --dv-inactivegroup-visiblepanel-tab-color: #8f8f8f;\n  --dv-inactivegroup-hiddenpanel-tab-color: #626262;\n  --dv-separator-border: rgb(68, 68, 68);\n  --dv-paneview-header-border-color: rgba(204, 204, 204, 0.2);\n}\n.dockview-theme-dark .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {\n  opacity: 0;\n  transition: none;\n}\n\n.dockview-theme-light {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-group-view-background-color: white;\n  --dv-tabs-and-actions-container-background-color: #f3f3f3;\n  --dv-activegroup-visiblepanel-tab-background-color: white;\n  --dv-activegroup-hiddenpanel-tab-background-color: #ececec;\n  --dv-inactivegroup-visiblepanel-tab-background-color: white;\n  --dv-inactivegroup-hiddenpanel-tab-background-color: #ececec;\n  --dv-tab-divider-color: white;\n  --dv-activegroup-visiblepanel-tab-color: rgb(51, 51, 51);\n  --dv-activegroup-hiddenpanel-tab-color: rgba(51, 51, 51, 0.7);\n  --dv-inactivegroup-visiblepanel-tab-color: rgba(51, 51, 51, 0.7);\n  --dv-inactivegroup-hiddenpanel-tab-color: rgba(51, 51, 51, 0.35);\n  --dv-separator-border: rgba(128, 128, 128, 0.35);\n  --dv-paneview-header-border-color: rgb(51, 51, 51);\n  --dv-scrollbar-background-color: rgba(0, 0, 0, 0.25);\n}\n.dockview-theme-light .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {\n  opacity: 0;\n  transition: none;\n}\n\n.dockview-theme-vs {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-group-view-background-color: #1e1e1e;\n  --dv-tabs-and-actions-container-background-color: #252526;\n  --dv-activegroup-visiblepanel-tab-background-color: #1e1e1e;\n  --dv-activegroup-hiddenpanel-tab-background-color: #2d2d2d;\n  --dv-inactivegroup-visiblepanel-tab-background-color: #1e1e1e;\n  --dv-inactivegroup-hiddenpanel-tab-background-color: #2d2d2d;\n  --dv-tab-divider-color: #1e1e1e;\n  --dv-activegroup-visiblepanel-tab-color: white;\n  --dv-activegroup-hiddenpanel-tab-color: #969696;\n  --dv-inactivegroup-visiblepanel-tab-color: #8f8f8f;\n  --dv-inactivegroup-hiddenpanel-tab-color: #626262;\n  --dv-separator-border: rgb(68, 68, 68);\n  --dv-paneview-header-border-color: rgba(204, 204, 204, 0.2);\n  --dv-tabs-and-actions-container-background-color: #2d2d30;\n  --dv-tabs-and-actions-container-height: 20px;\n  --dv-tabs-and-actions-container-font-size: 11px;\n  --dv-activegroup-visiblepanel-tab-background-color: #007acc;\n  --dv-inactivegroup-visiblepanel-tab-background-color: #3f3f46;\n  --dv-activegroup-visiblepanel-tab-color: white;\n  --dv-activegroup-hiddenpanel-tab-color: white;\n  --dv-inactivegroup-visiblepanel-tab-color: white;\n  --dv-inactivegroup-hiddenpanel-tab-color: white;\n}\n.dockview-theme-vs .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {\n  opacity: 0;\n  transition: none;\n}\n.dockview-theme-vs .dv-groupview.dv-active-group > .dv-tabs-and-actions-container {\n  box-sizing: content-box;\n  border-bottom: 2px solid var(--dv-activegroup-visiblepanel-tab-background-color);\n}\n.dockview-theme-vs .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tab.dv-active-tab {\n  border-top: 2px solid var(--dv-activegroup-visiblepanel-tab-background-color);\n}\n.dockview-theme-vs .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tab.dv-inactive-tab {\n  border-top: 2px solid var(--dv-activegroup-hiddenpanel-tab-background-color);\n}\n.dockview-theme-vs .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container {\n  box-sizing: content-box;\n  border-bottom: 2px solid var(--dv-inactivegroup-visiblepanel-tab-background-color);\n}\n.dockview-theme-vs .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tab.dv-active-tab {\n  border-top: 2px solid var(--dv-inactivegroup-visiblepanel-tab-background-color);\n}\n.dockview-theme-vs .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tab.dv-inactive-tab {\n  border-top: 2px solid var(--dv-inactivegroup-hiddenpanel-tab-background-color);\n}\n\n.dockview-theme-abyss {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-color-abyss-dark: #000c18;\n  --dv-color-abyss: #10192c;\n  --dv-color-abyss-light: #1c1c2a;\n  --dv-color-abyss-lighter: #2b2b4a;\n  --dv-color-abyss-accent: rgb(91, 30, 207);\n  --dv-color-abyss-primary-text: white;\n  --dv-color-abyss-secondary-text: rgb(148, 151, 169);\n  --dv-group-view-background-color: var(--dv-color-abyss-dark);\n  --dv-tabs-and-actions-container-background-color: var(\n      --dv-color-abyss-light\n  );\n  --dv-activegroup-visiblepanel-tab-background-color: var(\n      --dv-color-abyss-dark\n  );\n  --dv-activegroup-hiddenpanel-tab-background-color: var(--dv-color-abyss);\n  --dv-inactivegroup-visiblepanel-tab-background-color: var(\n      --dv-color-abyss-dark\n  );\n  --dv-inactivegroup-hiddenpanel-tab-background-color: var(--dv-color-abyss);\n  --dv-tab-divider-color: var(--dv-color-abyss-lighter);\n  --dv-activegroup-visiblepanel-tab-color: white;\n  --dv-activegroup-hiddenpanel-tab-color: rgba(255, 255, 255, 0.5);\n  --dv-inactivegroup-visiblepanel-tab-color: rgba(255, 255, 255, 0.5);\n  --dv-inactivegroup-hiddenpanel-tab-color: rgba(255, 255, 255, 0.25);\n  --dv-separator-border: var(--dv-color-abyss-lighter);\n  --dv-paneview-header-border-color: var(--dv-color-abyss-lighter);\n  --dv-paneview-active-outline-color: #596f99;\n}\n.dockview-theme-abyss .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {\n  opacity: 0;\n  transition: none;\n}\n\n.dockview-theme-dracula {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-group-view-background-color: #282a36;\n  --dv-tabs-and-actions-container-background-color: #191a21;\n  --dv-activegroup-visiblepanel-tab-background-color: #282a36;\n  --dv-activegroup-hiddenpanel-tab-background-color: #21222c;\n  --dv-inactivegroup-visiblepanel-tab-background-color: #282a36;\n  --dv-inactivegroup-hiddenpanel-tab-background-color: #21222c;\n  --dv-tab-divider-color: #191a21;\n  --dv-activegroup-visiblepanel-tab-color: rgb(248, 248, 242);\n  --dv-activegroup-hiddenpanel-tab-color: rgb(98, 114, 164);\n  --dv-inactivegroup-visiblepanel-tab-color: rgba(248, 248, 242, 0.5);\n  --dv-inactivegroup-hiddenpanel-tab-color: rgba(98, 114, 164, 0.5);\n  --dv-separator-border: #bd93f9;\n  --dv-paneview-header-border-color: #bd93f9;\n  --dv-paneview-active-outline-color: #6272a4;\n}\n.dockview-theme-dracula .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {\n  opacity: 0;\n  transition: none;\n}\n.dockview-theme-dracula .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {\n  position: relative;\n}\n.dockview-theme-dracula .dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  content: "";\n  width: 100%;\n  height: 1px;\n  background-color: #94527e;\n  z-index: 999;\n}\n.dockview-theme-dracula .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {\n  position: relative;\n}\n.dockview-theme-dracula .dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab::after {\n  position: absolute;\n  left: 0px;\n  bottom: 0px;\n  content: "";\n  width: 100%;\n  height: 1px;\n  background-color: #5e3d5a;\n  z-index: 999;\n}\n\n.dockview-theme-replit {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  box-sizing: border-box;\n  padding: 10px;\n  background-color: #ebeced;\n  --dv-group-view-background-color: #ebeced;\n  --dv-tabs-and-actions-container-background-color: #fcfcfc;\n  --dv-activegroup-visiblepanel-tab-background-color: #f0f1f2;\n  --dv-activegroup-hiddenpanel-tab-background-color: #fcfcfc;\n  --dv-inactivegroup-visiblepanel-tab-background-color: #f0f1f2;\n  --dv-inactivegroup-hiddenpanel-tab-background-color: #fcfcfc;\n  --dv-tab-divider-color: transparent;\n  --dv-activegroup-visiblepanel-tab-color: rgb(51, 51, 51);\n  --dv-activegroup-hiddenpanel-tab-color: rgb(51, 51, 51);\n  --dv-inactivegroup-visiblepanel-tab-color: rgb(51, 51, 51);\n  --dv-inactivegroup-hiddenpanel-tab-color: rgb(51, 51, 51);\n  --dv-separator-border: transparent;\n  --dv-paneview-header-border-color: rgb(51, 51, 51);\n  --dv-sash-color: #cfd1d3;\n  --dv-active-sash-color: #babbbb;\n}\n.dockview-theme-replit .dv-drop-target-container .dv-drop-target-anchor.dv-drop-target-anchor-container-changed {\n  opacity: 0;\n  transition: none;\n}\n.dockview-theme-replit .dv-resize-container:has(> .dv-groupview) {\n  border-radius: 8px;\n}\n.dockview-theme-replit .dv-resize-container {\n  border-radius: 10px !important;\n  border: none;\n}\n.dockview-theme-replit .dv-groupview {\n  overflow: hidden;\n  border-radius: 10px;\n}\n.dockview-theme-replit .dv-groupview .dv-tabs-and-actions-container {\n  border-bottom: 1px solid rgba(128, 128, 128, 0.35);\n}\n.dockview-theme-replit .dv-groupview .dv-tabs-and-actions-container .dv-tab {\n  margin: 4px;\n  border-radius: 8px;\n}\n.dockview-theme-replit .dv-groupview .dv-tabs-and-actions-container .dv-tab .dv-svg {\n  height: 8px;\n  width: 8px;\n}\n.dockview-theme-replit .dv-groupview .dv-tabs-and-actions-container .dv-tab:hover {\n  background-color: #e4e5e6 !important;\n}\n.dockview-theme-replit .dv-groupview .dv-content-container {\n  background-color: #fcfcfc;\n}\n.dockview-theme-replit .dv-groupview.dv-active-group {\n  border: 1px solid rgba(128, 128, 128, 0.35);\n}\n.dockview-theme-replit .dv-groupview.dv-inactive-group {\n  border: 1px solid transparent;\n}\n.dockview-theme-replit .dv-vertical > .dv-sash-container > .dv-sash {\n  background-color: transparent;\n}\n.dockview-theme-replit .dv-vertical > .dv-sash-container > .dv-sash:not(.disabled)::after {\n  content: "";\n  height: 4px;\n  width: 40px;\n  border-radius: 2px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: var(--dv-sash-color);\n  position: absolute;\n}\n.dockview-theme-replit .dv-vertical > .dv-sash-container > .dv-sash:not(.disabled):hover, .dockview-theme-replit .dv-vertical > .dv-sash-container > .dv-sash:not(.disabled):active {\n  background-color: transparent;\n}\n.dockview-theme-replit .dv-vertical > .dv-sash-container > .dv-sash:not(.disabled):hover::after, .dockview-theme-replit .dv-vertical > .dv-sash-container > .dv-sash:not(.disabled):active::after {\n  background-color: var(--dv-active-sash-color);\n}\n.dockview-theme-replit .dv-horizontal > .dv-sash-container > .dv-sash {\n  background-color: transparent;\n}\n.dockview-theme-replit .dv-horizontal > .dv-sash-container > .dv-sash:not(.disabled)::after {\n  content: "";\n  height: 40px;\n  width: 4px;\n  border-radius: 2px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: var(--dv-sash-color);\n  position: absolute;\n}\n.dockview-theme-replit .dv-horizontal > .dv-sash-container > .dv-sash:not(.disabled):hover, .dockview-theme-replit .dv-horizontal > .dv-sash-container > .dv-sash:not(.disabled):active {\n  background-color: transparent;\n}\n.dockview-theme-replit .dv-horizontal > .dv-sash-container > .dv-sash:not(.disabled):hover::after, .dockview-theme-replit .dv-horizontal > .dv-sash-container > .dv-sash:not(.disabled):active::after {\n  background-color: var(--dv-active-sash-color);\n}\n\n.dockview-theme-abyss-spaced {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-tab-font-size: 12px;\n  --dv-border-radius: 20px;\n  --dv-tab-margin: 0.5rem 0.25rem;\n  --dv-tabs-and-actions-container-height: 44px;\n  --dv-border-radius: 20px;\n  box-sizing: border-box;\n  --dv-color-abyss-dark: rgb(11, 6, 17);\n  --dv-color-abyss: #16121f;\n  --dv-color-abyss-light: #201d2b;\n  --dv-color-abyss-lighter: #2a2837;\n  --dv-color-abyss-accent: rgb(91, 30, 207);\n  --dv-color-abyss-primary-text: white;\n  --dv-color-abyss-secondary-text: rgb(148, 151, 169);\n  --dv-drag-over-border: 2px solid var(--dv-color-abyss-accent);\n  --dv-drag-over-background-color: "";\n  --dv-group-view-background-color: var(--dv-color-abyss-dark);\n  --dv-tabs-and-actions-container-background-color: var(--dv-color-abyss);\n  --dv-activegroup-visiblepanel-tab-background-color: var(\n      --dv-color-abyss-lighter\n  );\n  --dv-activegroup-hiddenpanel-tab-background-color: var(\n      --dv-color-abyss-light\n  );\n  --dv-inactivegroup-visiblepanel-tab-background-color: var(\n      --dv-color-abyss-lighter\n  );\n  --dv-inactivegroup-hiddenpanel-tab-background-color: var(\n      --dv-color-abyss-light\n  );\n  --dv-tab-divider-color: transparent;\n  --dv-activegroup-visiblepanel-tab-color: var(--dv-color-abyss-primary-text);\n  --dv-activegroup-hiddenpanel-tab-color: var(\n      --dv-color-abyss-secondary-text\n  );\n  --dv-inactivegroup-visiblepanel-tab-color: var(\n      --dv-color-abyss-primary-text\n  );\n  --dv-inactivegroup-hiddenpanel-tab-color: var(\n      --dv-color-abyss-secondary-text\n  );\n  --dv-separator-border: transparent;\n  --dv-paneview-header-border-color: rgb(51, 51, 51);\n  --dv-active-sash-color: var(--dv-color-abyss-accent);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.5);\n  padding: 10px;\n  background-color: var(--dv-color-abyss-dark);\n}\n.dockview-theme-abyss-spaced .dv-resize-container:has(> .dv-groupview) {\n  border-radius: 8px;\n}\n.dockview-theme-abyss-spaced .dv-sash {\n  border-radius: 4px;\n}\n.dockview-theme-abyss-spaced .dv-drop-target-anchor {\n  border-radius: calc(var(--dv-border-radius) / 4);\n}\n.dockview-theme-abyss-spaced .dv-drop-target-anchor.dv-drop-target-content {\n  border-radius: var(--dv-border-radius);\n}\n.dockview-theme-abyss-spaced .dv-resize-container {\n  border-radius: var(--dv-border-radius) !important;\n  border: none;\n}\n.dockview-theme-abyss-spaced .dv-tabs-overflow-container,\n.dockview-theme-abyss-spaced .dv-tabs-overflow-dropdown-default {\n  border-radius: 8px;\n  height: unset !important;\n}\n.dockview-theme-abyss-spaced .dv-tab {\n  border-radius: 8px;\n}\n.dockview-theme-abyss-spaced .dv-tab .dv-svg {\n  height: 8px;\n  width: 8px;\n}\n.dockview-theme-abyss-spaced .dv-groupview {\n  border-radius: var(--dv-border-radius);\n}\n.dockview-theme-abyss-spaced .dv-groupview .dv-tabs-and-actions-container {\n  padding: 0px calc(var(--dv-border-radius) / 2);\n}\n.dockview-theme-abyss-spaced .dv-groupview .dv-content-container {\n  background-color: var(--dv-tabs-and-actions-container-background-color);\n}\n.dockview-theme-abyss-spaced .dv-resize-container .dv-groupview {\n  border: 2px solid var(--dv-color-abyss-dark);\n}\n\n.dockview-theme-light-spaced {\n  --dv-paneview-active-outline-color: dodgerblue;\n  --dv-tabs-and-actions-container-font-size: 13px;\n  --dv-tabs-and-actions-container-height: 35px;\n  --dv-drag-over-background-color: rgba(83, 89, 93, 0.5);\n  --dv-drag-over-border-color: transparent;\n  --dv-tabs-container-scrollbar-color: #888;\n  --dv-icon-hover-background-color: rgba(90, 93, 94, 0.31);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(83, 89, 93, 0.5);\n  --dv-overlay-z-index: 999;\n  --dv-tab-font-size: inherit;\n  --dv-border-radius: 0px;\n  --dv-tab-margin: 0;\n  --dv-sash-color: transparent;\n  --dv-active-sash-color: transparent;\n  --dv-active-sash-transition-duration: 0.1s;\n  --dv-active-sash-transition-delay: 0.5s;\n  --dv-tab-font-size: 12px;\n  --dv-border-radius: 20px;\n  --dv-tab-margin: 0.5rem 0.25rem;\n  --dv-tabs-and-actions-container-height: 44px;\n  --dv-border-radius: 20px;\n  box-sizing: border-box;\n  --dv-drag-over-border: 2px solid rgb(91, 30, 207);\n  --dv-drag-over-background-color: "";\n  --dv-group-view-background-color: #f6f5f9;\n  --dv-tabs-and-actions-container-background-color: white;\n  --dv-activegroup-visiblepanel-tab-background-color: #ededf0;\n  --dv-activegroup-hiddenpanel-tab-background-color: #f9f9fa;\n  --dv-inactivegroup-visiblepanel-tab-background-color: #ededf0;\n  --dv-inactivegroup-hiddenpanel-tab-background-color: #f9f9fa;\n  --dv-tab-divider-color: transparent;\n  --dv-activegroup-visiblepanel-tab-color: rgb(104, 107, 130);\n  --dv-activegroup-hiddenpanel-tab-color: rgb(148, 151, 169);\n  --dv-inactivegroup-visiblepanel-tab-color: rgb(104, 107, 130);\n  --dv-inactivegroup-hiddenpanel-tab-color: rgb(148, 151, 169);\n  --dv-separator-border: transparent;\n  --dv-paneview-header-border-color: rgb(51, 51, 51);\n  --dv-active-sash-color: rgb(91, 30, 207);\n  --dv-floating-box-shadow: 8px 8px 8px 0px rgba(0, 0, 0, 0.1);\n  padding: 10px;\n  background-color: #f6f5f9;\n  --dv-scrollbar-background-color: rgba(0, 0, 0, 0.25);\n}\n.dockview-theme-light-spaced .dv-resize-container:has(> .dv-groupview) {\n  border-radius: 8px;\n}\n.dockview-theme-light-spaced .dv-sash {\n  border-radius: 4px;\n}\n.dockview-theme-light-spaced .dv-drop-target-anchor {\n  border-radius: calc(var(--dv-border-radius) / 4);\n}\n.dockview-theme-light-spaced .dv-drop-target-anchor.dv-drop-target-content {\n  border-radius: var(--dv-border-radius);\n}\n.dockview-theme-light-spaced .dv-resize-container {\n  border-radius: var(--dv-border-radius) !important;\n  border: none;\n}\n.dockview-theme-light-spaced .dv-tabs-overflow-container,\n.dockview-theme-light-spaced .dv-tabs-overflow-dropdown-default {\n  border-radius: 8px;\n  height: unset !important;\n}\n.dockview-theme-light-spaced .dv-tab {\n  border-radius: 8px;\n}\n.dockview-theme-light-spaced .dv-tab .dv-svg {\n  height: 8px;\n  width: 8px;\n}\n.dockview-theme-light-spaced .dv-groupview {\n  border-radius: var(--dv-border-radius);\n}\n.dockview-theme-light-spaced .dv-groupview .dv-tabs-and-actions-container {\n  padding: 0px calc(var(--dv-border-radius) / 2);\n}\n.dockview-theme-light-spaced .dv-groupview .dv-content-container {\n  background-color: var(--dv-tabs-and-actions-container-background-color);\n}\n.dockview-theme-light-spaced .dv-resize-container .dv-groupview {\n  border: 2px solid rgba(255, 255, 255, 0.1);\n}\n.dv-drop-target-container {\n  position: absolute;\n  z-index: 9999;\n  top: 0px;\n  left: 0px;\n  height: 100%;\n  width: 100%;\n  pointer-events: none;\n  overflow: hidden;\n  --dv-transition-duration: 300ms;\n}\n.dv-drop-target-container .dv-drop-target-anchor {\n  position: relative;\n  border: var(--dv-drag-over-border);\n  background-color: var(--dv-drag-over-background-color);\n  opacity: 1;\n  /* GPU optimizations */\n  will-change: transform, opacity;\n  transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n  contain: layout paint;\n  transition: opacity var(--dv-transition-duration) ease-in, top var(--dv-transition-duration) ease-out, left var(--dv-transition-duration) ease-out, width var(--dv-transition-duration) ease-out, height var(--dv-transition-duration) ease-out;\n}\n.dv-drop-target {\n  position: relative;\n  --dv-transition-duration: 70ms;\n}\n.dv-drop-target > .dv-drop-target-dropzone {\n  position: absolute;\n  left: 0px;\n  top: 0px;\n  height: 100%;\n  width: 100%;\n  z-index: 1000;\n  pointer-events: none;\n}\n.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection {\n  position: relative;\n  box-sizing: border-box;\n  height: 100%;\n  width: 100%;\n  border: var(--dv-drag-over-border);\n  background-color: var(--dv-drag-over-background-color);\n  transition: top var(--dv-transition-duration) ease-out, left var(--dv-transition-duration) ease-out, width var(--dv-transition-duration) ease-out, height var(--dv-transition-duration) ease-out, opacity var(--dv-transition-duration) ease-out;\n  will-change: transform;\n  pointer-events: none;\n}\n.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-top.dv-drop-target-small-vertical {\n  border-top: 1px solid var(--dv-drag-over-border-color);\n}\n.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-bottom.dv-drop-target-small-vertical {\n  border-bottom: 1px solid var(--dv-drag-over-border-color);\n}\n.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-left.dv-drop-target-small-horizontal {\n  border-left: 1px solid var(--dv-drag-over-border-color);\n}\n.dv-drop-target > .dv-drop-target-dropzone > .dv-drop-target-selection.dv-drop-target-right.dv-drop-target-small-horizontal {\n  border-right: 1px solid var(--dv-drag-over-border-color);\n}\n.dv-dockview {\n  position: relative;\n  background-color: var(--dv-group-view-background-color);\n  contain: layout;\n}\n.dv-dockview .dv-watermark-container {\n  position: absolute;\n  top: 0px;\n  left: 0px;\n  height: 100%;\n  width: 100%;\n  z-index: 1;\n}\n.dv-dockview .dv-overlay-render-container {\n  position: relative;\n}\n\n.dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {\n  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);\n  color: var(--dv-activegroup-visiblepanel-tab-color);\n}\n.dv-groupview.dv-active-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-inactive-tab {\n  background-color: var(--dv-activegroup-hiddenpanel-tab-background-color);\n  color: var(--dv-activegroup-hiddenpanel-tab-color);\n}\n.dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-active-tab {\n  background-color: var(--dv-inactivegroup-visiblepanel-tab-background-color);\n  color: var(--dv-inactivegroup-visiblepanel-tab-color);\n}\n.dv-groupview.dv-inactive-group > .dv-tabs-and-actions-container .dv-tabs-container > .dv-tab.dv-inactive-tab {\n  background-color: var(--dv-inactivegroup-hiddenpanel-tab-background-color);\n  color: var(--dv-inactivegroup-hiddenpanel-tab-color);\n}\n\n/**\n * when a tab is dragged we lose the above stylings because they are conditional on parent elements\n * therefore we also set some stylings for the dragging event\n **/\n.dv-tab.dv-tab-dragging {\n  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);\n  color: var(--dv-activegroup-visiblepanel-tab-color);\n}\n.dv-groupview {\n  display: flex;\n  height: 100%;\n  background-color: var(--dv-group-view-background-color);\n  overflow: hidden;\n  flex-direction: column;\n}\n.dv-groupview:focus {\n  outline: none;\n}\n.dv-groupview > .dv-content-container {\n  flex-grow: 1;\n  min-height: 0;\n  outline: none;\n}\n.dv-groupview.dv-groupview-header-bottom {\n  flex-direction: column-reverse;\n}\n.dv-groupview.dv-groupview-header-left {\n  flex-direction: row;\n}\n.dv-groupview.dv-groupview-header-right {\n  flex-direction: row-reverse;\n}\n.dv-root-wrapper {\n  height: 100%;\n  width: 100%;\n}\n.dv-grid-view,\n.dv-branch-node {\n  height: 100%;\n  width: 100%;\n}\n.dv-debug .dv-resize-container .dv-resize-handle-top {\n  background-color: red;\n}\n.dv-debug .dv-resize-container .dv-resize-handle-bottom {\n  background-color: green;\n}\n.dv-debug .dv-resize-container .dv-resize-handle-left {\n  background-color: yellow;\n}\n.dv-debug .dv-resize-container .dv-resize-handle-right {\n  background-color: blue;\n}\n.dv-debug .dv-resize-container .dv-resize-handle-topleft,\n.dv-debug .dv-resize-container .dv-resize-handle-topright,\n.dv-debug .dv-resize-container .dv-resize-handle-bottomleft,\n.dv-debug .dv-resize-container .dv-resize-handle-bottomright {\n  background-color: cyan;\n}\n\n.dv-resize-container {\n  --dv-overlay-z-index: var(--dv-overlay-z-index, 999);\n  position: absolute;\n  z-index: calc(var(--dv-overlay-z-index) - 2);\n  border: 1px solid var(--dv-tab-divider-color);\n  box-shadow: var(--dv-floating-box-shadow);\n  /* GPU optimizations for floating group movement */\n  will-change: transform, opacity;\n  transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n}\n.dv-resize-container.dv-hidden {\n  display: none;\n}\n.dv-resize-container.dv-resize-container-dragging {\n  opacity: 0.5;\n  /* Enhanced GPU acceleration during drag */\n  will-change: transform, opacity;\n}\n.dv-resize-container .dv-resize-handle-top {\n  height: 4px;\n  width: calc(100% - 8px);\n  left: 4px;\n  top: -2px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: ns-resize;\n}\n.dv-resize-container .dv-resize-handle-bottom {\n  height: 4px;\n  width: calc(100% - 8px);\n  left: 4px;\n  bottom: -2px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: ns-resize;\n}\n.dv-resize-container .dv-resize-handle-left {\n  height: calc(100% - 8px);\n  width: 4px;\n  left: -2px;\n  top: 4px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: ew-resize;\n}\n.dv-resize-container .dv-resize-handle-right {\n  height: calc(100% - 8px);\n  width: 4px;\n  right: -2px;\n  top: 4px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: ew-resize;\n}\n.dv-resize-container .dv-resize-handle-topleft {\n  height: 4px;\n  width: 4px;\n  top: -2px;\n  left: -2px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: nw-resize;\n}\n.dv-resize-container .dv-resize-handle-topright {\n  height: 4px;\n  width: 4px;\n  right: -2px;\n  top: -2px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: ne-resize;\n}\n.dv-resize-container .dv-resize-handle-bottomleft {\n  height: 4px;\n  width: 4px;\n  left: -2px;\n  bottom: -2px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: sw-resize;\n}\n.dv-resize-container .dv-resize-handle-bottomright {\n  height: 4px;\n  width: 4px;\n  right: -2px;\n  bottom: -2px;\n  z-index: var(--dv-overlay-z-index);\n  position: absolute;\n  cursor: se-resize;\n}\n.dv-render-overlay {\n  --dv-overlay-z-index: var(--dv-overlay-z-index, 999);\n  position: absolute;\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  contain: layout paint;\n  isolation: isolate;\n  /* GPU optimizations */\n  will-change: transform;\n  transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n}\n.dv-render-overlay.dv-render-overlay-float {\n  z-index: calc(var(--dv-overlay-z-index) - 1);\n}\n\n.dv-debug .dv-render-overlay {\n  outline: 1px solid red;\n  outline-offset: -1;\n}\n.dv-pane-container {\n  height: 100%;\n  width: 100%;\n}\n.dv-pane-container.dv-animated .dv-view {\n  /* GPU optimizations for smooth pane animations */\n  will-change: transform;\n  transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n  transition: transform 0.15s ease-out;\n}\n.dv-pane-container .dv-view {\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  padding: 0px !important;\n}\n.dv-pane-container .dv-view:not(:first-child)::before {\n  background-color: transparent !important;\n}\n.dv-pane-container .dv-view:not(:first-child) .dv-pane > .dv-pane-header {\n  border-top: 1px solid var(--dv-paneview-header-border-color);\n}\n.dv-pane-container .dv-view .dv-default-header {\n  background-color: var(--dv-group-view-background-color);\n  color: var(--dv-activegroup-visiblepanel-tab-color);\n  display: flex;\n  padding: 0px 8px;\n  cursor: pointer;\n}\n.dv-pane-container .dv-view .dv-default-header .dv-pane-header-icon {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.dv-pane-container .dv-view .dv-default-header > span {\n  padding-left: 8px;\n  flex-grow: 1;\n}\n.dv-pane-container:first-of-type > .dv-pane > .dv-pane-header {\n  border-top: none !important;\n}\n.dv-pane-container .dv-pane {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  height: 100%;\n}\n.dv-pane-container .dv-pane .dv-pane-header {\n  box-sizing: border-box;\n  user-select: none;\n  position: relative;\n  outline: none;\n}\n.dv-pane-container .dv-pane .dv-pane-header.dv-pane-draggable {\n  cursor: pointer;\n}\n.dv-pane-container .dv-pane .dv-pane-header:focus:before, .dv-pane-container .dv-pane .dv-pane-header:focus-within:before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 5;\n  content: "";\n  pointer-events: none;\n  outline: 1px solid;\n  outline-width: -1px;\n  outline-style: solid;\n  outline-offset: -1px;\n  outline-color: var(--dv-paneview-active-outline-color);\n}\n.dv-pane-container .dv-pane .dv-pane-body {\n  overflow-y: auto;\n  overflow-x: hidden;\n  flex-grow: 1;\n  position: relative;\n  outline: none;\n}\n.dv-pane-container .dv-pane .dv-pane-body:focus:before, .dv-pane-container .dv-pane .dv-pane-body:focus-within:before {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 5;\n  content: "";\n  pointer-events: none;\n  outline: 1px solid;\n  outline-width: -1px;\n  outline-style: solid;\n  outline-offset: -1px;\n  outline-color: var(--dv-paneview-active-outline-color);\n}\n.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-enabled {\n  background-color: black;\n}\n.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-disabled {\n  background-color: orange;\n}\n.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-maximum {\n  background-color: green;\n}\n.dv-debug .dv-split-view-container .dv-sash-container .dv-sash.dv-minimum {\n  background-color: red;\n}\n\n.dv-split-view-container {\n  position: relative;\n  overflow: hidden;\n  height: 100%;\n  width: 100%;\n}\n.dv-split-view-container.dv-splitview-disabled > .dv-sash-container > .dv-sash {\n  pointer-events: none;\n}\n.dv-split-view-container.dv-animation .dv-view,\n.dv-split-view-container.dv-animation .dv-sash {\n  /* GPU optimizations for smooth animations */\n  will-change: transform;\n  transform: translate3d(0, 0, 0);\n  backface-visibility: hidden;\n  transition: transform 0.15s ease-out;\n}\n.dv-split-view-container.dv-horizontal {\n  height: 100%;\n}\n.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash {\n  height: 100%;\n  width: 4px;\n}\n.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-enabled {\n  cursor: ew-resize;\n}\n.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-disabled {\n  cursor: default;\n}\n.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-maximum {\n  cursor: w-resize;\n}\n.dv-split-view-container.dv-horizontal > .dv-sash-container > .dv-sash.dv-minimum {\n  cursor: e-resize;\n}\n.dv-split-view-container.dv-horizontal > .dv-view-container > .dv-view:not(:first-child)::before {\n  height: 100%;\n  width: 1px;\n}\n.dv-split-view-container.dv-vertical {\n  width: 100%;\n}\n.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash {\n  width: 100%;\n  height: 4px;\n}\n.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-enabled {\n  cursor: ns-resize;\n}\n.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-disabled {\n  cursor: default;\n}\n.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-maximum {\n  cursor: n-resize;\n}\n.dv-split-view-container.dv-vertical > .dv-sash-container > .dv-sash.dv-minimum {\n  cursor: s-resize;\n}\n.dv-split-view-container.dv-vertical > .dv-view-container > .dv-view {\n  width: 100%;\n}\n.dv-split-view-container.dv-vertical > .dv-view-container > .dv-view:not(:first-child)::before {\n  height: 1px;\n  width: 100%;\n}\n.dv-split-view-container .dv-sash-container {\n  height: 100%;\n  width: 100%;\n  position: absolute;\n}\n.dv-split-view-container .dv-sash-container .dv-sash {\n  position: absolute;\n  z-index: 99;\n  outline: none;\n  user-select: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  touch-action: none;\n  background-color: var(--dv-sash-color, transparent);\n}\n.dv-split-view-container .dv-sash-container .dv-sash:not(.disabled):active, .dv-split-view-container .dv-sash-container .dv-sash:not(.disabled):hover {\n  background-color: var(--dv-active-sash-color, transparent);\n  transition-property: background-color;\n  transition-timing-function: ease-in-out;\n  transition-duration: var(--dv-active-sash-transition-duration, 0.1s);\n  transition-delay: var(--dv-active-sash-transition-delay, 0.5s);\n}\n.dv-split-view-container .dv-view-container {\n  position: relative;\n  height: 100%;\n  width: 100%;\n}\n.dv-split-view-container .dv-view-container .dv-view {\n  height: 100%;\n  box-sizing: border-box;\n  overflow: auto;\n  position: absolute;\n}\n.dv-split-view-container.dv-separator-border .dv-view:not(:first-child)::before {\n  content: " ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 5;\n  pointer-events: none;\n  background-color: var(--dv-separator-border);\n}\n.dv-dragged {\n  transform: translate3d(0px, 0px, 0px); /* forces tab to be drawn on a separate layer (see https://github.com/microsoft/vscode/issues/18733) */\n}\n\n.dv-tab {\n  flex-shrink: 0;\n}\n.dv-tab:focus-within, .dv-tab:focus {\n  position: relative;\n}\n.dv-tab:focus-within::after, .dv-tab:focus::after {\n  position: absolute;\n  content: "";\n  height: 100%;\n  width: 100%;\n  top: 0px;\n  left: 0px;\n  pointer-events: none;\n  outline: 1px solid var(--dv-tab-divider-color) !important;\n  outline-offset: -1px;\n  z-index: 5;\n}\n.dv-tab.dv-tab-dragging .dv-default-tab-action {\n  background-color: var(--dv-activegroup-visiblepanel-tab-color);\n}\n.dv-tab.dv-active-tab .dv-default-tab .dv-default-tab-action {\n  visibility: visible;\n}\n.dv-tab.dv-inactive-tab .dv-default-tab .dv-default-tab-action {\n  visibility: hidden;\n}\n.dv-tab.dv-inactive-tab .dv-default-tab:hover .dv-default-tab-action {\n  visibility: visible;\n}\n.dv-tab .dv-default-tab {\n  position: relative;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.dv-tab .dv-default-tab .dv-default-tab-content {\n  flex-grow: 1;\n  margin-right: 4px;\n}\n.dv-tab .dv-default-tab .dv-default-tab-action {\n  padding: 4px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n}\n.dv-tab .dv-default-tab .dv-default-tab-action:hover {\n  border-radius: 2px;\n  background-color: var(--dv-icon-hover-background-color);\n}\n.dv-tabs-overflow-dropdown-default {\n  height: 100%;\n  color: var(--dv-activegroup-hiddenpanel-tab-color);\n  margin: var(--dv-tab-margin);\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  padding: 0.25rem 0.5rem;\n  cursor: pointer;\n}\n.dv-tabs-overflow-dropdown-default > span {\n  padding-left: 0.25rem;\n}\n.dv-tabs-overflow-dropdown-default > svg {\n  transform: rotate(90deg);\n}\n.dv-tabs-overflow-dropdown-default:hover {\n  border-radius: 2px;\n  background-color: var(--dv-icon-hover-background-color);\n}\n.dv-tabs-container {\n  display: flex;\n  height: 100%;\n  overflow: auto;\n  scrollbar-width: thin;\n  /* GPU optimizations for smooth scrolling */\n  will-change: scroll-position;\n  transform: translate3d(0, 0, 0);\n  /* Track */\n  /* Handle */\n}\n.dv-tabs-container.dv-tabs-container-vertical {\n  width: 100%;\n  height: fit-content;\n  max-height: 100%;\n  writing-mode: vertical-rl;\n}\n.dv-tabs-container.dv-horizontal .dv-tab:not(:first-child)::before, .dv-tabs-container.dv-vertical .dv-tab:not(:first-child)::before {\n  content: " ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 5;\n  pointer-events: none;\n  background-color: var(--dv-tab-divider-color);\n}\n.dv-tabs-container.dv-horizontal .dv-tab:not(:first-child)::before {\n  width: 1px;\n  height: 100%;\n}\n.dv-tabs-container.dv-vertical .dv-tab:not(:first-child)::before {\n  width: 100%;\n  height: 1px;\n}\n.dv-tabs-container::-webkit-scrollbar {\n  height: 3px;\n}\n.dv-tabs-container::-webkit-scrollbar-track {\n  background: transparent;\n}\n.dv-tabs-container::-webkit-scrollbar-thumb {\n  background: var(--dv-tabs-container-scrollbar-color);\n}\n\n.dv-scrollable > .dv-tabs-container {\n  overflow: hidden;\n}\n\n.dv-tab {\n  -webkit-user-drag: element;\n  outline: none;\n  padding: 0.25rem 0.5rem;\n  cursor: pointer;\n  position: relative;\n  box-sizing: border-box;\n  font-size: var(--dv-tab-font-size);\n  margin: var(--dv-tab-margin);\n}\n.dv-tab.dv-tab--shifting {\n  will-change: margin-left;\n  transition: transform var(--dv-transition-duration, 200ms) ease-out, margin-left var(--dv-transition-duration, 200ms) ease-out;\n}\n.dv-tab.dv-tab--dragging {\n  width: 0 !important;\n  min-width: 0 !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  overflow: hidden;\n  opacity: 0;\n  pointer-events: none;\n  transition: width var(--dv-transition-duration, 200ms) ease-out, padding var(--dv-transition-duration, 200ms) ease-out, margin var(--dv-transition-duration, 200ms) ease-out, opacity var(--dv-transition-duration, 200ms) ease-out;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dv-tab {\n    transition: none !important;\n  }\n}\n.dv-tabs-container-vertical .dv-tab {\n  padding: 0.5rem 0.25rem;\n}\n\n.dv-tabs-overflow-container {\n  flex-direction: column;\n  height: unset;\n  font-size: var(--dv-tabs-and-actions-container-font-size);\n  max-height: min(50vh, 400px);\n  overflow-y: auto;\n  border: 1px solid var(--dv-tab-divider-color);\n  background-color: var(--dv-group-view-background-color);\n  /* Scrollbar styling for webkit browsers */\n  /* Firefox scrollbar */\n  scrollbar-width: thin;\n}\n.dv-tabs-overflow-container::-webkit-scrollbar {\n  width: 6px;\n}\n.dv-tabs-overflow-container::-webkit-scrollbar-track {\n  background: transparent;\n}\n.dv-tabs-overflow-container::-webkit-scrollbar-thumb {\n  background: var(--dv-tabs-container-scrollbar-color);\n  border-radius: 3px;\n}\n.dv-tabs-overflow-container .dv-tab:not(:last-child) {\n  border-bottom: 1px solid var(--dv-tab-divider-color);\n}\n.dv-tabs-overflow-container .dv-active-tab {\n  background-color: var(--dv-activegroup-visiblepanel-tab-background-color);\n  color: var(--dv-activegroup-visiblepanel-tab-color);\n}\n.dv-tabs-overflow-container .dv-inactive-tab {\n  background-color: var(--dv-activegroup-hiddenpanel-tab-background-color);\n  color: var(--dv-activegroup-hiddenpanel-tab-color);\n}\n.dv-tabs-and-actions-container {\n  display: flex;\n  background-color: var(--dv-tabs-and-actions-container-background-color);\n  flex-shrink: 0;\n  box-sizing: border-box;\n  height: var(--dv-tabs-and-actions-container-height);\n  font-size: var(--dv-tabs-and-actions-container-font-size);\n}\n.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-scrollable {\n  flex-grow: 1;\n}\n.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-tabs-container {\n  flex-grow: 1;\n}\n.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-tabs-container .dv-tab {\n  flex-grow: 1;\n  padding: 0px;\n}\n.dv-tabs-and-actions-container.dv-single-tab.dv-full-width-single-tab .dv-void-container {\n  flex-grow: 0;\n}\n.dv-tabs-and-actions-container .dv-void-container {\n  display: flex;\n  flex-grow: 1;\n}\n.dv-tabs-and-actions-container .dv-void-container.dv-draggable {\n  cursor: grab;\n}\n.dv-tabs-and-actions-container .dv-right-actions-container {\n  display: flex;\n}\n.dv-tabs-and-actions-container .dv-right-actions-container.dv-right-actions-container-vertical {\n  flex-direction: column;\n}\n.dv-tabs-and-actions-container.dv-groupview-header-vertical {\n  flex-direction: column;\n  height: auto;\n  width: var(--dv-tabs-and-actions-container-height);\n}\n.dv-watermark {\n  display: flex;\n  height: 100%;\n}';
styleInject(css_248z);
class TransferObject {
}
class PanelTransfer extends TransferObject {
  constructor(viewId, groupId, panelId) {
    super();
    this.viewId = viewId;
    this.groupId = groupId;
    this.panelId = panelId;
  }
}
class LocalSelectionTransfer {
  constructor() {
  }
  static getInstance() {
    return LocalSelectionTransfer.INSTANCE;
  }
  hasData(proto) {
    return proto && proto === this.proto;
  }
  clearData(proto) {
    if (this.hasData(proto)) {
      this.proto = void 0;
      this.data = void 0;
    }
  }
  getData(proto) {
    if (this.hasData(proto)) {
      return this.data;
    }
    return void 0;
  }
  setData(data, proto) {
    if (proto) {
      this.data = data;
      this.proto = proto;
    }
  }
}
LocalSelectionTransfer.INSTANCE = new LocalSelectionTransfer();
function getPanelData() {
  const panelTransfer = LocalSelectionTransfer.getInstance();
  const isPanelEvent = panelTransfer.hasData(PanelTransfer.prototype);
  if (!isPanelEvent) {
    return void 0;
  }
  return panelTransfer.getData(PanelTransfer.prototype)[0];
}
var Event;
(function(Event2) {
  Event2.any = (...children) => {
    return (listener) => {
      const disposables = children.map((child) => child(listener));
      return {
        dispose: () => {
          disposables.forEach((d) => {
            d.dispose();
          });
        }
      };
    };
  };
})(Event || (Event = {}));
class DockviewEvent {
  constructor() {
    this._defaultPrevented = false;
  }
  get defaultPrevented() {
    return this._defaultPrevented;
  }
  preventDefault() {
    this._defaultPrevented = true;
  }
}
class AcceptableEvent {
  constructor() {
    this._isAccepted = false;
  }
  get isAccepted() {
    return this._isAccepted;
  }
  accept() {
    this._isAccepted = true;
  }
}
class LeakageMonitor {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
  }
  get size() {
    return this.events.size;
  }
  add(event, stacktrace) {
    this.events.set(event, stacktrace);
  }
  delete(event) {
    this.events.delete(event);
  }
  clear() {
    this.events.clear();
  }
}
class Stacktrace {
  static create() {
    var _a;
    return new Stacktrace((_a = new Error().stack) !== null && _a !== void 0 ? _a : "");
  }
  constructor(value) {
    this.value = value;
  }
  print() {
    console.warn("dockview: stacktrace", this.value);
  }
}
class Listener {
  constructor(callback, stacktrace) {
    this.callback = callback;
    this.stacktrace = stacktrace;
  }
}
class Emitter {
  static setLeakageMonitorEnabled(isEnabled) {
    if (isEnabled !== Emitter.ENABLE_TRACKING) {
      Emitter.MEMORY_LEAK_WATCHER.clear();
    }
    Emitter.ENABLE_TRACKING = isEnabled;
  }
  get value() {
    return this._last;
  }
  constructor(options) {
    this.options = options;
    this._listeners = [];
    this._disposed = false;
  }
  get event() {
    if (!this._event) {
      this._event = (callback) => {
        var _a;
        if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.replay) && this._last !== void 0) {
          callback(this._last);
        }
        const listener = new Listener(callback, Emitter.ENABLE_TRACKING ? Stacktrace.create() : void 0);
        this._listeners.push(listener);
        return {
          dispose: () => {
            const index = this._listeners.indexOf(listener);
            if (index > -1) {
              this._listeners.splice(index, 1);
            }
          }
        };
      };
      if (Emitter.ENABLE_TRACKING) {
        Emitter.MEMORY_LEAK_WATCHER.add(this._event, Stacktrace.create());
      }
    }
    return this._event;
  }
  fire(e) {
    var _a;
    if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.replay) {
      this._last = e;
    }
    for (const listener of this._listeners) {
      listener.callback(e);
    }
  }
  dispose() {
    if (!this._disposed) {
      this._disposed = true;
      if (this._listeners.length > 0) {
        if (Emitter.ENABLE_TRACKING) {
          queueMicrotask(() => {
            var _a;
            for (const listener of this._listeners) {
              console.warn("dockview: stacktrace", (_a = listener.stacktrace) === null || _a === void 0 ? void 0 : _a.print());
            }
          });
        }
        this._listeners = [];
      }
      if (Emitter.ENABLE_TRACKING && this._event) {
        Emitter.MEMORY_LEAK_WATCHER.delete(this._event);
      }
    }
  }
}
Emitter.ENABLE_TRACKING = false;
Emitter.MEMORY_LEAK_WATCHER = new LeakageMonitor();
function addDisposableListener(element, type, listener, options) {
  element.addEventListener(type, listener, options);
  return {
    dispose: () => {
      element.removeEventListener(type, listener, options);
    }
  };
}
class AsapEvent {
  constructor() {
    this._onFired = new Emitter();
    this._currentFireCount = 0;
    this._queued = false;
    this.onEvent = (e) => {
      const fireCountAtTimeOfEventSubscription = this._currentFireCount;
      return this._onFired.event(() => {
        if (this._currentFireCount > fireCountAtTimeOfEventSubscription) {
          e();
        }
      });
    };
  }
  fire() {
    this._currentFireCount++;
    if (this._queued) {
      return;
    }
    this._queued = true;
    queueMicrotask(() => {
      this._queued = false;
      this._onFired.fire();
    });
  }
  dispose() {
    this._onFired.dispose();
  }
}
var Disposable;
(function(Disposable2) {
  Disposable2.NONE = {
    dispose: () => {
    }
  };
  function from(func) {
    return {
      dispose: () => {
        func();
      }
    };
  }
  Disposable2.from = from;
})(Disposable || (Disposable = {}));
class CompositeDisposable {
  get isDisposed() {
    return this._isDisposed;
  }
  constructor(...args) {
    this._isDisposed = false;
    this._disposables = new Set(args);
  }
  addDisposables(...args) {
    args.forEach((arg) => this._disposables.add(arg));
  }
  removeDisposable(disposable) {
    this._disposables.delete(disposable);
  }
  dispose() {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    this._disposables.forEach((arg) => arg.dispose());
    this._disposables.clear();
  }
}
class MutableDisposable {
  constructor() {
    this._disposable = Disposable.NONE;
  }
  set value(disposable) {
    if (this._disposable) {
      this._disposable.dispose();
    }
    this._disposable = disposable;
  }
  dispose() {
    if (this._disposable) {
      this._disposable.dispose();
      this._disposable = Disposable.NONE;
    }
  }
}
class OverflowObserver extends CompositeDisposable {
  constructor(el) {
    super();
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    this._value = null;
    this.addDisposables(this._onDidChange, watchElementResize(el, (entry) => {
      const hasScrollX = entry.target.scrollWidth > entry.target.clientWidth;
      const hasScrollY = entry.target.scrollHeight > entry.target.clientHeight;
      this._value = { hasScrollX, hasScrollY };
      this._onDidChange.fire(this._value);
    }));
  }
}
function watchElementResize(element, cb) {
  const observer = new ResizeObserver((entires) => {
    requestAnimationFrame(() => {
      const firstEntry = entires[0];
      cb(firstEntry);
    });
  });
  observer.observe(element);
  return {
    dispose: () => {
      observer.unobserve(element);
      observer.disconnect();
    }
  };
}
const removeClasses = (element, ...classes) => {
  for (const classname of classes) {
    if (element.classList.contains(classname)) {
      element.classList.remove(classname);
    }
  }
};
const addClasses = (element, ...classes) => {
  for (const classname of classes) {
    if (!element.classList.contains(classname)) {
      element.classList.add(classname);
    }
  }
};
const toggleClass = (element, className, isToggled) => {
  const hasClass = element.classList.contains(className);
  if (isToggled && !hasClass) {
    element.classList.add(className);
  }
  if (!isToggled && hasClass) {
    element.classList.remove(className);
  }
};
function isAncestor(testChild, testAncestor) {
  while (testChild) {
    if (testChild === testAncestor) {
      return true;
    }
    testChild = testChild.parentNode;
  }
  return false;
}
function trackFocus(element) {
  return new FocusTracker(element);
}
class FocusTracker extends CompositeDisposable {
  constructor(element) {
    super();
    this._onDidFocus = new Emitter();
    this.onDidFocus = this._onDidFocus.event;
    this._onDidBlur = new Emitter();
    this.onDidBlur = this._onDidBlur.event;
    this.addDisposables(this._onDidFocus, this._onDidBlur);
    let hasFocus = isAncestor(document.activeElement, element);
    let loosingFocus = false;
    const onFocus = () => {
      loosingFocus = false;
      if (!hasFocus) {
        hasFocus = true;
        this._onDidFocus.fire();
      }
    };
    const onBlur = () => {
      if (hasFocus) {
        loosingFocus = true;
        window.setTimeout(() => {
          if (loosingFocus) {
            loosingFocus = false;
            hasFocus = false;
            this._onDidBlur.fire();
          }
        }, 0);
      }
    };
    this._refreshStateHandler = () => {
      const currentNodeHasFocus = isAncestor(document.activeElement, element);
      if (currentNodeHasFocus !== hasFocus) {
        if (hasFocus) {
          onBlur();
        } else {
          onFocus();
        }
      }
    };
    this.addDisposables(addDisposableListener(element, "focus", onFocus, true));
    this.addDisposables(addDisposableListener(element, "blur", onBlur, true));
  }
  refreshState() {
    this._refreshStateHandler();
  }
}
const QUASI_PREVENT_DEFAULT_KEY = "dv-quasiPreventDefault";
function quasiPreventDefault(event) {
  event[QUASI_PREVENT_DEFAULT_KEY] = true;
}
function quasiDefaultPrevented(event) {
  return event[QUASI_PREVENT_DEFAULT_KEY];
}
function addStyles(document2, styleSheetList) {
  const styleSheets = Array.from(styleSheetList);
  for (const styleSheet of styleSheets) {
    if (styleSheet.href) {
      const link = document2.createElement("link");
      link.href = styleSheet.href;
      link.type = styleSheet.type;
      link.rel = "stylesheet";
      document2.head.appendChild(link);
    }
    let cssTexts = [];
    try {
      if (styleSheet.cssRules) {
        cssTexts = Array.from(styleSheet.cssRules).map((rule) => rule.cssText);
      }
    } catch (err) {
    }
    for (const rule of cssTexts) {
      const style = document2.createElement("style");
      style.appendChild(document2.createTextNode(rule));
      document2.head.appendChild(style);
    }
  }
}
function getDomNodePagePosition(domNode) {
  const { left, top, width, height } = domNode.getBoundingClientRect();
  return {
    left: left + window.scrollX,
    top: top + window.scrollY,
    width,
    height
  };
}
function isInDocument(element) {
  let currentElement = element;
  while (currentElement === null || currentElement === void 0 ? void 0 : currentElement.parentNode) {
    if (currentElement.parentNode === document) {
      return true;
    } else if (currentElement.parentNode instanceof DocumentFragment) {
      currentElement = currentElement.parentNode.host;
    } else {
      currentElement = currentElement.parentNode;
    }
  }
  return false;
}
function addTestId(element, id) {
  element.setAttribute("data-testid", id);
}
function allTagsNamesInclusiveOfShadowDoms(tagNames) {
  const iframes = [];
  function findIframesInNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (tagNames.includes(node.tagName)) {
        iframes.push(node);
      }
      if (node.shadowRoot) {
        findIframesInNode(node.shadowRoot);
      }
      for (const child of node.children) {
        findIframesInNode(child);
      }
    }
  }
  findIframesInNode(document.documentElement);
  return iframes;
}
function disableIframePointEvents(rootNode = document) {
  const iframes = allTagsNamesInclusiveOfShadowDoms(["IFRAME", "WEBVIEW"]);
  const original = /* @__PURE__ */ new WeakMap();
  for (const iframe of iframes) {
    original.set(iframe, iframe.style.pointerEvents);
    iframe.style.pointerEvents = "none";
  }
  return {
    release: () => {
      var _a;
      for (const iframe of iframes) {
        iframe.style.pointerEvents = (_a = original.get(iframe)) !== null && _a !== void 0 ? _a : "auto";
      }
      iframes.splice(0, iframes.length);
    }
  };
}
function getDockviewTheme(element) {
  function toClassList(element2) {
    const list = [];
    for (let i = 0; i < element2.classList.length; i++) {
      list.push(element2.classList.item(i));
    }
    return list;
  }
  let theme = void 0;
  let parent = element;
  while (parent !== null) {
    theme = toClassList(parent).find((cls) => cls.startsWith("dockview-theme-"));
    if (typeof theme === "string") {
      break;
    }
    parent = parent.parentElement;
  }
  return theme;
}
class Classnames {
  constructor(element) {
    this.element = element;
    this._classNames = [];
  }
  setClassNames(classNames) {
    for (const className of this._classNames) {
      toggleClass(this.element, className, false);
    }
    this._classNames = classNames.split(" ").filter((v) => v.trim().length > 0);
    for (const className of this._classNames) {
      toggleClass(this.element, className, true);
    }
  }
}
const DEBOUCE_DELAY = 100;
function isChildEntirelyVisibleWithinParent(child, parent) {
  const childPosition = getDomNodePagePosition(child);
  const parentPosition = getDomNodePagePosition(parent);
  if (childPosition.left < parentPosition.left) {
    return false;
  }
  if (childPosition.left + childPosition.width > parentPosition.left + parentPosition.width) {
    return false;
  }
  if (childPosition.top < parentPosition.top) {
    return false;
  }
  if (childPosition.top + childPosition.height > parentPosition.top + parentPosition.height) {
    return false;
  }
  return true;
}
function onDidWindowMoveEnd(window2) {
  const emitter = new Emitter();
  let previousScreenX = window2.screenX;
  let previousScreenY = window2.screenY;
  let timeout;
  const checkMovement = () => {
    if (window2.closed) {
      return;
    }
    const currentScreenX = window2.screenX;
    const currentScreenY = window2.screenY;
    if (currentScreenX !== previousScreenX || currentScreenY !== previousScreenY) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        emitter.fire();
      }, DEBOUCE_DELAY);
      previousScreenX = currentScreenX;
      previousScreenY = currentScreenY;
    }
    requestAnimationFrame(checkMovement);
  };
  checkMovement();
  return emitter;
}
function onDidWindowResizeEnd(element, cb) {
  let resizeTimeout;
  const disposable = new CompositeDisposable(addDisposableListener(element, "resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cb();
    }, DEBOUCE_DELAY);
  }));
  return disposable;
}
function shiftAbsoluteElementIntoView(element, root, options = { buffer: 10 }) {
  const buffer = options.buffer;
  const rect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  let translateX = 0;
  let translateY = 0;
  const left = rect.left - rootRect.left;
  const top = rect.top - rootRect.top;
  const bottom = rect.bottom - rootRect.bottom;
  const right = rect.right - rootRect.right;
  if (left < buffer) {
    translateX = buffer - left;
  } else if (right > buffer) {
    translateX = -buffer - right;
  }
  if (top < buffer) {
    translateY = buffer - top;
  } else if (bottom > buffer) {
    translateY = -bottom - buffer;
  }
  if (translateX !== 0 || translateY !== 0) {
    element.style.transform = `translate(${translateX}px, ${translateY}px)`;
  }
}
function findRelativeZIndexParent(el) {
  let tmp = el;
  while (tmp && (tmp.style.zIndex === "auto" || tmp.style.zIndex === "")) {
    tmp = tmp.parentElement;
  }
  return tmp;
}
function tail(arr) {
  if (arr.length === 0) {
    throw new Error("Invalid tail call");
  }
  return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
}
function sequenceEquals(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
function pushToStart(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
    arr.unshift(value);
  }
}
function pushToEnd(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
    arr.push(value);
  }
}
function firstIndex(array, fn) {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (fn(element)) {
      return i;
    }
  }
  return -1;
}
function remove(array, value) {
  const index = array.findIndex((t) => t === value);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
}
const clamp = (value, min, max) => {
  if (min > max) {
    return min;
  }
  return Math.min(max, Math.max(value, min));
};
const sequentialNumberGenerator = () => {
  let value = 1;
  return { next: () => (value++).toString() };
};
const range = (from, to) => {
  const result = [];
  if (typeof to !== "number") {
    to = from;
    from = 0;
  }
  if (from <= to) {
    for (let i = from; i < to; i++) {
      result.push(i);
    }
  } else {
    for (let i = from; i > to; i--) {
      result.push(i);
    }
  }
  return result;
};
class ViewItem {
  set size(size) {
    this._size = size;
  }
  get size() {
    return this._size;
  }
  get cachedVisibleSize() {
    return this._cachedVisibleSize;
  }
  get visible() {
    return typeof this._cachedVisibleSize === "undefined";
  }
  get minimumSize() {
    return this.visible ? this.view.minimumSize : 0;
  }
  get viewMinimumSize() {
    return this.view.minimumSize;
  }
  get maximumSize() {
    return this.visible ? this.view.maximumSize : 0;
  }
  get viewMaximumSize() {
    return this.view.maximumSize;
  }
  get priority() {
    return this.view.priority;
  }
  get snap() {
    return !!this.view.snap;
  }
  set enabled(enabled) {
    this.container.style.pointerEvents = enabled ? "" : "none";
  }
  constructor(container, view, size, disposable) {
    this.container = container;
    this.view = view;
    this.disposable = disposable;
    this._cachedVisibleSize = void 0;
    if (typeof size === "number") {
      this._size = size;
      this._cachedVisibleSize = void 0;
      container.classList.add("visible");
    } else {
      this._size = 0;
      this._cachedVisibleSize = size.cachedVisibleSize;
    }
  }
  setVisible(visible, size) {
    var _a;
    if (visible === this.visible) {
      return;
    }
    if (visible) {
      this.size = clamp((_a = this._cachedVisibleSize) !== null && _a !== void 0 ? _a : 0, this.viewMinimumSize, this.viewMaximumSize);
      this._cachedVisibleSize = void 0;
    } else {
      this._cachedVisibleSize = typeof size === "number" ? size : this.size;
      this.size = 0;
    }
    this.container.classList.toggle("visible", visible);
    if (this.view.setVisible) {
      this.view.setVisible(visible);
    }
  }
  dispose() {
    this.disposable.dispose();
    return this.view;
  }
}
var Orientation;
(function(Orientation2) {
  Orientation2["HORIZONTAL"] = "HORIZONTAL";
  Orientation2["VERTICAL"] = "VERTICAL";
})(Orientation || (Orientation = {}));
var SashState;
(function(SashState2) {
  SashState2[SashState2["MAXIMUM"] = 0] = "MAXIMUM";
  SashState2[SashState2["MINIMUM"] = 1] = "MINIMUM";
  SashState2[SashState2["DISABLED"] = 2] = "DISABLED";
  SashState2[SashState2["ENABLED"] = 3] = "ENABLED";
})(SashState || (SashState = {}));
var LayoutPriority;
(function(LayoutPriority2) {
  LayoutPriority2["Low"] = "low";
  LayoutPriority2["High"] = "high";
  LayoutPriority2["Normal"] = "normal";
})(LayoutPriority || (LayoutPriority = {}));
var Sizing;
(function(Sizing2) {
  Sizing2.Distribute = { type: "distribute" };
  function Split(index) {
    return { type: "split", index };
  }
  Sizing2.Split = Split;
  function Invisible(cachedVisibleSize) {
    return { type: "invisible", cachedVisibleSize };
  }
  Sizing2.Invisible = Invisible;
})(Sizing || (Sizing = {}));
class Splitview {
  get contentSize() {
    return this._contentSize;
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = value;
  }
  get orthogonalSize() {
    return this._orthogonalSize;
  }
  set orthogonalSize(value) {
    this._orthogonalSize = value;
  }
  get length() {
    return this.viewItems.length;
  }
  get proportions() {
    return this._proportions ? [...this._proportions] : void 0;
  }
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    this._orientation = value;
    const tmp = this.size;
    this.size = this.orthogonalSize;
    this.orthogonalSize = tmp;
    removeClasses(this.element, "dv-horizontal", "dv-vertical");
    this.element.classList.add(this.orientation == Orientation.HORIZONTAL ? "dv-horizontal" : "dv-vertical");
  }
  get minimumSize() {
    return this.viewItems.reduce((r, item) => r + item.minimumSize, 0);
  }
  get maximumSize() {
    return this.length === 0 ? Number.POSITIVE_INFINITY : this.viewItems.reduce((r, item) => r + item.maximumSize, 0);
  }
  get startSnappingEnabled() {
    return this._startSnappingEnabled;
  }
  set startSnappingEnabled(startSnappingEnabled) {
    if (this._startSnappingEnabled === startSnappingEnabled) {
      return;
    }
    this._startSnappingEnabled = startSnappingEnabled;
    this.updateSashEnablement();
  }
  get endSnappingEnabled() {
    return this._endSnappingEnabled;
  }
  set endSnappingEnabled(endSnappingEnabled) {
    if (this._endSnappingEnabled === endSnappingEnabled) {
      return;
    }
    this._endSnappingEnabled = endSnappingEnabled;
    this.updateSashEnablement();
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    toggleClass(this.element, "dv-splitview-disabled", value);
  }
  get margin() {
    return this._margin;
  }
  set margin(value) {
    this._margin = value;
    toggleClass(this.element, "dv-splitview-has-margin", value !== 0);
  }
  constructor(container, options) {
    var _a, _b;
    this.container = container;
    this.viewItems = [];
    this.sashes = [];
    this._size = 0;
    this._orthogonalSize = 0;
    this._contentSize = 0;
    this._proportions = void 0;
    this._startSnappingEnabled = true;
    this._endSnappingEnabled = true;
    this._disabled = false;
    this._margin = 0;
    this._onDidSashEnd = new Emitter();
    this.onDidSashEnd = this._onDidSashEnd.event;
    this._onDidAddView = new Emitter();
    this.onDidAddView = this._onDidAddView.event;
    this._onDidRemoveView = new Emitter();
    this.onDidRemoveView = this._onDidRemoveView.event;
    this.resize = (index, delta, sizes = this.viewItems.map((x) => x.size), lowPriorityIndexes, highPriorityIndexes, overloadMinDelta = Number.NEGATIVE_INFINITY, overloadMaxDelta = Number.POSITIVE_INFINITY, snapBefore, snapAfter) => {
      if (index < 0 || index > this.viewItems.length) {
        return 0;
      }
      const upIndexes = range(index, -1);
      const downIndexes = range(index + 1, this.viewItems.length);
      if (highPriorityIndexes) {
        for (const i of highPriorityIndexes) {
          pushToStart(upIndexes, i);
          pushToStart(downIndexes, i);
        }
      }
      if (lowPriorityIndexes) {
        for (const i of lowPriorityIndexes) {
          pushToEnd(upIndexes, i);
          pushToEnd(downIndexes, i);
        }
      }
      const upItems = upIndexes.map((i) => this.viewItems[i]);
      const upSizes = upIndexes.map((i) => sizes[i]);
      const downItems = downIndexes.map((i) => this.viewItems[i]);
      const downSizes = downIndexes.map((i) => sizes[i]);
      const minDeltaUp = upIndexes.reduce((_, i) => _ + this.viewItems[i].minimumSize - sizes[i], 0);
      const maxDeltaUp = upIndexes.reduce((_, i) => _ + this.viewItems[i].maximumSize - sizes[i], 0);
      const maxDeltaDown = downIndexes.length === 0 ? Number.POSITIVE_INFINITY : downIndexes.reduce((_, i) => _ + sizes[i] - this.viewItems[i].minimumSize, 0);
      const minDeltaDown = downIndexes.length === 0 ? Number.NEGATIVE_INFINITY : downIndexes.reduce((_, i) => _ + sizes[i] - this.viewItems[i].maximumSize, 0);
      const minDelta = Math.max(minDeltaUp, minDeltaDown);
      const maxDelta = Math.min(maxDeltaDown, maxDeltaUp);
      let snapped = false;
      if (snapBefore) {
        const snapView = this.viewItems[snapBefore.index];
        const visible = delta >= snapBefore.limitDelta;
        snapped = visible !== snapView.visible;
        snapView.setVisible(visible, snapBefore.size);
      }
      if (!snapped && snapAfter) {
        const snapView = this.viewItems[snapAfter.index];
        const visible = delta < snapAfter.limitDelta;
        snapped = visible !== snapView.visible;
        snapView.setVisible(visible, snapAfter.size);
      }
      if (snapped) {
        return this.resize(index, delta, sizes, lowPriorityIndexes, highPriorityIndexes, overloadMinDelta, overloadMaxDelta);
      }
      const tentativeDelta = clamp(delta, minDelta, maxDelta);
      let actualDelta = 0;
      let deltaUp = tentativeDelta;
      for (let i = 0; i < upItems.length; i++) {
        const item = upItems[i];
        const size = clamp(upSizes[i] + deltaUp, item.minimumSize, item.maximumSize);
        const viewDelta = size - upSizes[i];
        actualDelta += viewDelta;
        deltaUp -= viewDelta;
        item.size = size;
      }
      let deltaDown = actualDelta;
      for (let i = 0; i < downItems.length; i++) {
        const item = downItems[i];
        const size = clamp(downSizes[i] - deltaDown, item.minimumSize, item.maximumSize);
        const viewDelta = size - downSizes[i];
        deltaDown += viewDelta;
        item.size = size;
      }
      return delta;
    };
    this._orientation = (_a = options.orientation) !== null && _a !== void 0 ? _a : Orientation.VERTICAL;
    this.element = this.createContainer();
    this.margin = (_b = options.margin) !== null && _b !== void 0 ? _b : 0;
    this.proportionalLayout = options.proportionalLayout === void 0 ? true : !!options.proportionalLayout;
    this.viewContainer = this.createViewContainer();
    this.sashContainer = this.createSashContainer();
    this.element.appendChild(this.sashContainer);
    this.element.appendChild(this.viewContainer);
    this.container.appendChild(this.element);
    this.style(options.styles);
    if (options.descriptor) {
      this._size = options.descriptor.size;
      options.descriptor.views.forEach((viewDescriptor, index) => {
        const sizing = viewDescriptor.visible === void 0 || viewDescriptor.visible ? viewDescriptor.size : {
          type: "invisible",
          cachedVisibleSize: viewDescriptor.size
        };
        const view = viewDescriptor.view;
        this.addView(
          view,
          sizing,
          index,
          true
          // true skip layout
        );
      });
      this._contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
      this.saveProportions();
    }
  }
  style(styles) {
    if ((styles === null || styles === void 0 ? void 0 : styles.separatorBorder) === "transparent") {
      removeClasses(this.element, "dv-separator-border");
      this.element.style.removeProperty("--dv-separator-border");
    } else {
      addClasses(this.element, "dv-separator-border");
      if (styles === null || styles === void 0 ? void 0 : styles.separatorBorder) {
        this.element.style.setProperty("--dv-separator-border", styles.separatorBorder);
      }
    }
  }
  isViewVisible(index) {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }
    const viewItem = this.viewItems[index];
    return viewItem.visible;
  }
  setViewVisible(index, visible) {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }
    const viewItem = this.viewItems[index];
    viewItem.setVisible(visible, viewItem.size);
    this.distributeEmptySpace(index);
    this.layoutViews();
    this.saveProportions();
  }
  getViewSize(index) {
    if (index < 0 || index >= this.viewItems.length) {
      return -1;
    }
    return this.viewItems[index].size;
  }
  resizeView(index, size) {
    if (index < 0 || index >= this.viewItems.length) {
      return;
    }
    const indexes = range(this.viewItems.length).filter((i) => i !== index);
    const lowPriorityIndexes = [
      ...indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.Low),
      index
    ];
    const highPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.High);
    const item = this.viewItems[index];
    size = Math.round(size);
    size = clamp(size, item.minimumSize, Math.min(item.maximumSize, this._size));
    item.size = size;
    this.relayout(lowPriorityIndexes, highPriorityIndexes);
  }
  getViews() {
    return this.viewItems.map((x) => x.view);
  }
  onDidChange(item, size) {
    const index = this.viewItems.indexOf(item);
    if (index < 0 || index >= this.viewItems.length) {
      return;
    }
    size = typeof size === "number" ? size : item.size;
    size = clamp(size, item.minimumSize, item.maximumSize);
    item.size = size;
    const indexes = range(this.viewItems.length).filter((i) => i !== index);
    const lowPriorityIndexes = [
      ...indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.Low),
      index
    ];
    const highPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.High);
    this.relayout([...lowPriorityIndexes, index], highPriorityIndexes);
  }
  addView(view, size = { type: "distribute" }, index = this.viewItems.length, skipLayout) {
    const container = document.createElement("div");
    container.className = "dv-view";
    container.appendChild(view.element);
    let viewSize;
    if (typeof size === "number") {
      viewSize = size;
    } else if (size.type === "split") {
      viewSize = this.getViewSize(size.index) / 2;
    } else if (size.type === "invisible") {
      viewSize = { cachedVisibleSize: size.cachedVisibleSize };
    } else {
      viewSize = view.minimumSize;
    }
    const disposable = view.onDidChange((newSize) => this.onDidChange(viewItem, newSize.size));
    const viewItem = new ViewItem(container, view, viewSize, {
      dispose: () => {
        disposable.dispose();
        this.viewContainer.removeChild(container);
      }
    });
    if (index === this.viewItems.length) {
      this.viewContainer.appendChild(container);
    } else {
      this.viewContainer.insertBefore(container, this.viewContainer.children.item(index));
    }
    this.viewItems.splice(index, 0, viewItem);
    if (this.viewItems.length > 1) {
      const sash = document.createElement("div");
      sash.className = "dv-sash";
      const onPointerStart = (event) => {
        for (const item of this.viewItems) {
          item.enabled = false;
        }
        const iframes = disableIframePointEvents();
        const start = this._orientation === Orientation.HORIZONTAL ? event.clientX : event.clientY;
        const sashIndex = firstIndex(this.sashes, (s) => s.container === sash);
        const sizes = this.viewItems.map((x) => x.size);
        let snapBefore;
        let snapAfter;
        const upIndexes = range(sashIndex, -1);
        const downIndexes = range(sashIndex + 1, this.viewItems.length);
        const minDeltaUp = upIndexes.reduce((r, i) => r + (this.viewItems[i].minimumSize - sizes[i]), 0);
        const maxDeltaUp = upIndexes.reduce((r, i) => r + (this.viewItems[i].viewMaximumSize - sizes[i]), 0);
        const maxDeltaDown = downIndexes.length === 0 ? Number.POSITIVE_INFINITY : downIndexes.reduce((r, i) => r + (sizes[i] - this.viewItems[i].minimumSize), 0);
        const minDeltaDown = downIndexes.length === 0 ? Number.NEGATIVE_INFINITY : downIndexes.reduce((r, i) => r + (sizes[i] - this.viewItems[i].viewMaximumSize), 0);
        const minDelta = Math.max(minDeltaUp, minDeltaDown);
        const maxDelta = Math.min(maxDeltaDown, maxDeltaUp);
        const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
        const snapAfterIndex = this.findFirstSnapIndex(downIndexes);
        if (typeof snapBeforeIndex === "number") {
          const snappedViewItem = this.viewItems[snapBeforeIndex];
          const halfSize = Math.floor(snappedViewItem.viewMinimumSize / 2);
          snapBefore = {
            index: snapBeforeIndex,
            limitDelta: snappedViewItem.visible ? minDelta - halfSize : minDelta + halfSize,
            size: snappedViewItem.size
          };
        }
        if (typeof snapAfterIndex === "number") {
          const snappedViewItem = this.viewItems[snapAfterIndex];
          const halfSize = Math.floor(snappedViewItem.viewMinimumSize / 2);
          snapAfter = {
            index: snapAfterIndex,
            limitDelta: snappedViewItem.visible ? maxDelta + halfSize : maxDelta - halfSize,
            size: snappedViewItem.size
          };
        }
        const onPointerMove = (event2) => {
          const current = this._orientation === Orientation.HORIZONTAL ? event2.clientX : event2.clientY;
          const delta = current - start;
          this.resize(sashIndex, delta, sizes, void 0, void 0, minDelta, maxDelta, snapBefore, snapAfter);
          this.distributeEmptySpace();
          this.layoutViews();
        };
        const end = () => {
          for (const item of this.viewItems) {
            item.enabled = true;
          }
          iframes.release();
          this.saveProportions();
          document.removeEventListener("pointermove", onPointerMove);
          document.removeEventListener("pointerup", end);
          document.removeEventListener("pointercancel", end);
          document.removeEventListener("contextmenu", end);
          this._onDidSashEnd.fire(void 0);
        };
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", end);
        document.addEventListener("pointercancel", end);
        document.addEventListener("contextmenu", end);
      };
      sash.addEventListener("pointerdown", onPointerStart);
      const sashItem = {
        container: sash,
        disposable: () => {
          sash.removeEventListener("pointerdown", onPointerStart);
          this.sashContainer.removeChild(sash);
        }
      };
      this.sashContainer.appendChild(sash);
      this.sashes.push(sashItem);
    }
    if (!skipLayout) {
      this.relayout([index]);
    }
    if (!skipLayout && typeof size !== "number" && size.type === "distribute") {
      this.distributeViewSizes();
    }
    this._onDidAddView.fire(view);
  }
  distributeViewSizes() {
    const flexibleViewItems = [];
    let flexibleSize = 0;
    for (const item of this.viewItems) {
      if (item.maximumSize - item.minimumSize > 0) {
        flexibleViewItems.push(item);
        flexibleSize += item.size;
      }
    }
    const size = Math.floor(flexibleSize / flexibleViewItems.length);
    for (const item of flexibleViewItems) {
      item.size = clamp(size, item.minimumSize, item.maximumSize);
    }
    const indexes = range(this.viewItems.length);
    const lowPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.Low);
    const highPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.High);
    this.relayout(lowPriorityIndexes, highPriorityIndexes);
  }
  removeView(index, sizing, skipLayout = false) {
    const viewItem = this.viewItems.splice(index, 1)[0];
    viewItem.dispose();
    if (this.viewItems.length >= 1) {
      const sashIndex = Math.max(index - 1, 0);
      const sashItem = this.sashes.splice(sashIndex, 1)[0];
      sashItem.disposable();
    }
    if (!skipLayout) {
      this.relayout();
    }
    if (sizing && sizing.type === "distribute") {
      this.distributeViewSizes();
    }
    this._onDidRemoveView.fire(viewItem.view);
    return viewItem.view;
  }
  getViewCachedVisibleSize(index) {
    if (index < 0 || index >= this.viewItems.length) {
      throw new Error("Index out of bounds");
    }
    const viewItem = this.viewItems[index];
    return viewItem.cachedVisibleSize;
  }
  moveView(from, to) {
    const cachedVisibleSize = this.getViewCachedVisibleSize(from);
    const sizing = typeof cachedVisibleSize === "undefined" ? this.getViewSize(from) : Sizing.Invisible(cachedVisibleSize);
    const view = this.removeView(from, void 0, true);
    this.addView(view, sizing, to);
  }
  layout(size, orthogonalSize) {
    const previousSize = Math.max(this.size, this._contentSize);
    this.size = size;
    this.orthogonalSize = orthogonalSize;
    if (!this.proportions) {
      const indexes = range(this.viewItems.length);
      const lowPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.Low);
      const highPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.High);
      this.resize(this.viewItems.length - 1, size - previousSize, void 0, lowPriorityIndexes, highPriorityIndexes);
    } else {
      let total = 0;
      for (let i = 0; i < this.viewItems.length; i++) {
        const item = this.viewItems[i];
        const proportion = this.proportions[i];
        if (typeof proportion === "number") {
          total += proportion;
        } else {
          size -= item.size;
        }
      }
      for (let i = 0; i < this.viewItems.length; i++) {
        const item = this.viewItems[i];
        const proportion = this.proportions[i];
        if (typeof proportion === "number" && total > 0) {
          item.size = clamp(Math.round(proportion * size / total), item.minimumSize, item.maximumSize);
        }
      }
    }
    this.distributeEmptySpace();
    this.layoutViews();
  }
  relayout(lowPriorityIndexes, highPriorityIndexes) {
    const contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
    this.resize(this.viewItems.length - 1, this._size - contentSize, void 0, lowPriorityIndexes, highPriorityIndexes);
    this.distributeEmptySpace();
    this.layoutViews();
    this.saveProportions();
  }
  distributeEmptySpace(lowPriorityIndex) {
    const contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
    let emptyDelta = this.size - contentSize;
    const indexes = range(this.viewItems.length - 1, -1);
    const lowPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.Low);
    const highPriorityIndexes = indexes.filter((i) => this.viewItems[i].priority === LayoutPriority.High);
    for (const index of highPriorityIndexes) {
      pushToStart(indexes, index);
    }
    for (const index of lowPriorityIndexes) {
      pushToEnd(indexes, index);
    }
    if (typeof lowPriorityIndex === "number") {
      pushToEnd(indexes, lowPriorityIndex);
    }
    for (let i = 0; emptyDelta !== 0 && i < indexes.length; i++) {
      const item = this.viewItems[indexes[i]];
      const size = clamp(item.size + emptyDelta, item.minimumSize, item.maximumSize);
      const viewDelta = size - item.size;
      emptyDelta -= viewDelta;
      item.size = size;
    }
  }
  saveProportions() {
    if (this.proportionalLayout && this._contentSize > 0) {
      this._proportions = this.viewItems.map((i) => i.visible ? i.size / this._contentSize : void 0);
    }
  }
  /**
   * Margin explain:
   *
   * For `n` views in a splitview there will be `n-1` margins `m`.
   *
   * To fit the margins each view must reduce in size by `(m * (n - 1)) / n`.
   *
   * For each view `i` the offet must be adjusted by `m * i/(n - 1)`.
   */
  layoutViews() {
    this._contentSize = this.viewItems.reduce((r, i) => r + i.size, 0);
    this.updateSashEnablement();
    if (this.viewItems.length === 0) {
      return;
    }
    const visibleViewItems = this.viewItems.filter((i) => i.visible);
    const sashCount = Math.max(0, visibleViewItems.length - 1);
    const marginReducedSize = this.margin * sashCount / Math.max(1, visibleViewItems.length);
    let totalLeftOffset = 0;
    const viewLeftOffsets = [];
    const sashWidth = 4;
    const runningVisiblePanelCount = this.viewItems.reduce((arr, viewItem, i) => {
      const flag = viewItem.visible ? 1 : 0;
      if (i === 0) {
        arr.push(flag);
      } else {
        arr.push(arr[i - 1] + flag);
      }
      return arr;
    }, []);
    this.viewItems.forEach((view, i) => {
      totalLeftOffset += this.viewItems[i].size;
      viewLeftOffsets.push(totalLeftOffset);
      const size = view.visible ? view.size - marginReducedSize : 0;
      const visiblePanelsBeforeThisView = Math.max(0, runningVisiblePanelCount[i] - 1);
      const offset = i === 0 || visiblePanelsBeforeThisView === 0 ? 0 : viewLeftOffsets[i - 1] + visiblePanelsBeforeThisView / sashCount * marginReducedSize;
      if (i < this.viewItems.length - 1) {
        const newSize = view.visible ? offset + size - sashWidth / 2 + this.margin / 2 : offset;
        if (this._orientation === Orientation.HORIZONTAL) {
          this.sashes[i].container.style.left = `${newSize}px`;
          this.sashes[i].container.style.top = `0px`;
        }
        if (this._orientation === Orientation.VERTICAL) {
          this.sashes[i].container.style.left = `0px`;
          this.sashes[i].container.style.top = `${newSize}px`;
        }
      }
      if (this._orientation === Orientation.HORIZONTAL) {
        view.container.style.width = `${size}px`;
        view.container.style.left = `${offset}px`;
        view.container.style.top = "";
        view.container.style.height = "";
      }
      if (this._orientation === Orientation.VERTICAL) {
        view.container.style.height = `${size}px`;
        view.container.style.top = `${offset}px`;
        view.container.style.width = "";
        view.container.style.left = "";
      }
      view.view.layout(view.size - marginReducedSize, this._orthogonalSize);
    });
  }
  findFirstSnapIndex(indexes) {
    for (const index of indexes) {
      const viewItem = this.viewItems[index];
      if (!viewItem.visible) {
        continue;
      }
      if (viewItem.snap) {
        return index;
      }
    }
    for (const index of indexes) {
      const viewItem = this.viewItems[index];
      if (viewItem.visible && viewItem.maximumSize - viewItem.minimumSize > 0) {
        return void 0;
      }
      if (!viewItem.visible && viewItem.snap) {
        return index;
      }
    }
    return void 0;
  }
  updateSashEnablement() {
    let previous = false;
    const collapsesDown = this.viewItems.map((i) => previous = i.size - i.minimumSize > 0 || previous);
    previous = false;
    const expandsDown = this.viewItems.map((i) => previous = i.maximumSize - i.size > 0 || previous);
    const reverseViews = [...this.viewItems].reverse();
    previous = false;
    const collapsesUp = reverseViews.map((i) => previous = i.size - i.minimumSize > 0 || previous).reverse();
    previous = false;
    const expandsUp = reverseViews.map((i) => previous = i.maximumSize - i.size > 0 || previous).reverse();
    let position = 0;
    for (let index = 0; index < this.sashes.length; index++) {
      const sash = this.sashes[index];
      const viewItem = this.viewItems[index];
      position += viewItem.size;
      const min = !(collapsesDown[index] && expandsUp[index + 1]);
      const max = !(expandsDown[index] && collapsesUp[index + 1]);
      if (min && max) {
        const upIndexes = range(index, -1);
        const downIndexes = range(index + 1, this.viewItems.length);
        const snapBeforeIndex = this.findFirstSnapIndex(upIndexes);
        const snapAfterIndex = this.findFirstSnapIndex(downIndexes);
        const snappedBefore = typeof snapBeforeIndex === "number" && !this.viewItems[snapBeforeIndex].visible;
        const snappedAfter = typeof snapAfterIndex === "number" && !this.viewItems[snapAfterIndex].visible;
        if (snappedBefore && collapsesUp[index] && (position > 0 || this.startSnappingEnabled)) {
          this.updateSash(sash, SashState.MINIMUM);
        } else if (snappedAfter && collapsesDown[index] && (position < this._contentSize || this.endSnappingEnabled)) {
          this.updateSash(sash, SashState.MAXIMUM);
        } else {
          this.updateSash(sash, SashState.DISABLED);
        }
      } else if (min && !max) {
        this.updateSash(sash, SashState.MINIMUM);
      } else if (!min && max) {
        this.updateSash(sash, SashState.MAXIMUM);
      } else {
        this.updateSash(sash, SashState.ENABLED);
      }
    }
  }
  updateSash(sash, state) {
    toggleClass(sash.container, "dv-disabled", state === SashState.DISABLED);
    toggleClass(sash.container, "dv-enabled", state === SashState.ENABLED);
    toggleClass(sash.container, "dv-maximum", state === SashState.MAXIMUM);
    toggleClass(sash.container, "dv-minimum", state === SashState.MINIMUM);
  }
  createViewContainer() {
    const element = document.createElement("div");
    element.className = "dv-view-container";
    return element;
  }
  createSashContainer() {
    const element = document.createElement("div");
    element.className = "dv-sash-container";
    return element;
  }
  createContainer() {
    const element = document.createElement("div");
    const orientationClassname = this._orientation === Orientation.HORIZONTAL ? "dv-horizontal" : "dv-vertical";
    element.className = `dv-split-view-container ${orientationClassname}`;
    return element;
  }
  dispose() {
    this._onDidSashEnd.dispose();
    this._onDidAddView.dispose();
    this._onDidRemoveView.dispose();
    for (let i = 0; i < this.element.children.length; i++) {
      if (this.element.children.item(i) === this.element) {
        this.element.removeChild(this.element);
        break;
      }
    }
    for (const viewItem of this.viewItems) {
      viewItem.dispose();
    }
    this.element.remove();
  }
}
class LeafNode {
  get minimumWidth() {
    return this.view.minimumWidth;
  }
  get maximumWidth() {
    return this.view.maximumWidth;
  }
  get minimumHeight() {
    return this.view.minimumHeight;
  }
  get maximumHeight() {
    return this.view.maximumHeight;
  }
  get priority() {
    return this.view.priority;
  }
  get snap() {
    return this.view.snap;
  }
  get minimumSize() {
    return this.orientation === Orientation.HORIZONTAL ? this.minimumHeight : this.minimumWidth;
  }
  get maximumSize() {
    return this.orientation === Orientation.HORIZONTAL ? this.maximumHeight : this.maximumWidth;
  }
  get minimumOrthogonalSize() {
    return this.orientation === Orientation.HORIZONTAL ? this.minimumWidth : this.minimumHeight;
  }
  get maximumOrthogonalSize() {
    return this.orientation === Orientation.HORIZONTAL ? this.maximumWidth : this.maximumHeight;
  }
  get orthogonalSize() {
    return this._orthogonalSize;
  }
  get size() {
    return this._size;
  }
  get element() {
    return this.view.element;
  }
  get width() {
    return this.orientation === Orientation.HORIZONTAL ? this.orthogonalSize : this.size;
  }
  get height() {
    return this.orientation === Orientation.HORIZONTAL ? this.size : this.orthogonalSize;
  }
  constructor(view, orientation, orthogonalSize, size = 0) {
    this.view = view;
    this.orientation = orientation;
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    this._orthogonalSize = orthogonalSize;
    this._size = size;
    this._disposable = this.view.onDidChange((event) => {
      if (event) {
        this._onDidChange.fire({
          size: this.orientation === Orientation.VERTICAL ? event.width : event.height,
          orthogonalSize: this.orientation === Orientation.VERTICAL ? event.height : event.width
        });
      } else {
        this._onDidChange.fire({});
      }
    });
  }
  setVisible(visible) {
    if (this.view.setVisible) {
      this.view.setVisible(visible);
    }
  }
  layout(size, orthogonalSize) {
    this._size = size;
    this._orthogonalSize = orthogonalSize;
    this.view.layout(this.width, this.height);
  }
  dispose() {
    this._onDidChange.dispose();
    this._disposable.dispose();
  }
}
class BranchNode extends CompositeDisposable {
  get width() {
    return this.orientation === Orientation.HORIZONTAL ? this.size : this.orthogonalSize;
  }
  get height() {
    return this.orientation === Orientation.HORIZONTAL ? this.orthogonalSize : this.size;
  }
  get minimumSize() {
    return this.children.length === 0 ? 0 : Math.max(...this.children.map((c, index) => this.splitview.isViewVisible(index) ? c.minimumOrthogonalSize : 0));
  }
  get maximumSize() {
    return Math.min(...this.children.map((c, index) => this.splitview.isViewVisible(index) ? c.maximumOrthogonalSize : Number.POSITIVE_INFINITY));
  }
  get minimumOrthogonalSize() {
    return this.splitview.minimumSize;
  }
  get maximumOrthogonalSize() {
    return this.splitview.maximumSize;
  }
  get orthogonalSize() {
    return this._orthogonalSize;
  }
  get size() {
    return this._size;
  }
  get minimumWidth() {
    return this.orientation === Orientation.HORIZONTAL ? this.minimumOrthogonalSize : this.minimumSize;
  }
  get minimumHeight() {
    return this.orientation === Orientation.HORIZONTAL ? this.minimumSize : this.minimumOrthogonalSize;
  }
  get maximumWidth() {
    return this.orientation === Orientation.HORIZONTAL ? this.maximumOrthogonalSize : this.maximumSize;
  }
  get maximumHeight() {
    return this.orientation === Orientation.HORIZONTAL ? this.maximumSize : this.maximumOrthogonalSize;
  }
  get priority() {
    if (this.children.length === 0) {
      return LayoutPriority.Normal;
    }
    const priorities = this.children.map((c) => typeof c.priority === "undefined" ? LayoutPriority.Normal : c.priority);
    if (priorities.some((p2) => p2 === LayoutPriority.High)) {
      return LayoutPriority.High;
    } else if (priorities.some((p2) => p2 === LayoutPriority.Low)) {
      return LayoutPriority.Low;
    }
    return LayoutPriority.Normal;
  }
  get disabled() {
    return this.splitview.disabled;
  }
  set disabled(value) {
    this.splitview.disabled = value;
  }
  get margin() {
    return this.splitview.margin;
  }
  set margin(value) {
    this.splitview.margin = value;
    this.children.forEach((child) => {
      if (child instanceof BranchNode) {
        child.margin = value;
      }
    });
  }
  constructor(orientation, proportionalLayout, styles, size, orthogonalSize, disabled, margin, childDescriptors) {
    super();
    this.orientation = orientation;
    this.proportionalLayout = proportionalLayout;
    this.styles = styles;
    this._childrenDisposable = Disposable.NONE;
    this.children = [];
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    this._onDidVisibilityChange = new Emitter();
    this.onDidVisibilityChange = this._onDidVisibilityChange.event;
    this._orthogonalSize = orthogonalSize;
    this._size = size;
    this.element = document.createElement("div");
    this.element.className = "dv-branch-node";
    if (!childDescriptors) {
      this.splitview = new Splitview(this.element, {
        orientation: this.orientation,
        proportionalLayout,
        styles,
        margin
      });
      this.splitview.layout(this.size, this.orthogonalSize);
    } else {
      const descriptor = {
        views: childDescriptors.map((childDescriptor) => {
          return {
            view: childDescriptor.node,
            size: childDescriptor.node.size,
            visible: childDescriptor.node instanceof LeafNode && childDescriptor.visible !== void 0 ? childDescriptor.visible : true
          };
        }),
        size: this.orthogonalSize
      };
      this.children = childDescriptors.map((c) => c.node);
      this.splitview = new Splitview(this.element, {
        orientation: this.orientation,
        descriptor,
        proportionalLayout,
        styles,
        margin
      });
    }
    this.disabled = disabled;
    this.addDisposables(this._onDidChange, this._onDidVisibilityChange, this.splitview.onDidSashEnd(() => {
      this._onDidChange.fire({});
    }));
    this.setupChildrenEvents();
  }
  setVisible(_visible) {
  }
  isChildVisible(index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error("Invalid index");
    }
    return this.splitview.isViewVisible(index);
  }
  setChildVisible(index, visible) {
    if (index < 0 || index >= this.children.length) {
      throw new Error("Invalid index");
    }
    if (this.splitview.isViewVisible(index) === visible) {
      return;
    }
    const wereAllChildrenHidden = this.splitview.contentSize === 0;
    this.splitview.setViewVisible(index, visible);
    const areAllChildrenHidden = this.splitview.contentSize === 0;
    if (visible && wereAllChildrenHidden || !visible && areAllChildrenHidden) {
      this._onDidVisibilityChange.fire({ visible });
    }
  }
  moveChild(from, to) {
    if (from === to) {
      return;
    }
    if (from < 0 || from >= this.children.length) {
      throw new Error("Invalid from index");
    }
    if (from < to) {
      to--;
    }
    this.splitview.moveView(from, to);
    const child = this._removeChild(from);
    this._addChild(child, to);
  }
  getChildSize(index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error("Invalid index");
    }
    return this.splitview.getViewSize(index);
  }
  resizeChild(index, size) {
    if (index < 0 || index >= this.children.length) {
      throw new Error("Invalid index");
    }
    this.splitview.resizeView(index, size);
  }
  layout(size, orthogonalSize) {
    this._size = orthogonalSize;
    this._orthogonalSize = size;
    this.splitview.layout(orthogonalSize, size);
  }
  addChild(node, size, index, skipLayout) {
    if (index < 0 || index > this.children.length) {
      throw new Error("Invalid index");
    }
    this.splitview.addView(node, size, index, skipLayout);
    this._addChild(node, index);
  }
  getChildCachedVisibleSize(index) {
    if (index < 0 || index >= this.children.length) {
      throw new Error("Invalid index");
    }
    return this.splitview.getViewCachedVisibleSize(index);
  }
  removeChild(index, sizing) {
    if (index < 0 || index >= this.children.length) {
      throw new Error("Invalid index");
    }
    this.splitview.removeView(index, sizing);
    return this._removeChild(index);
  }
  _addChild(node, index) {
    this.children.splice(index, 0, node);
    this.setupChildrenEvents();
  }
  _removeChild(index) {
    const [child] = this.children.splice(index, 1);
    this.setupChildrenEvents();
    return child;
  }
  setupChildrenEvents() {
    this._childrenDisposable.dispose();
    this._childrenDisposable = new CompositeDisposable(Event.any(...this.children.map((c) => c.onDidChange))((e) => {
      this._onDidChange.fire({ size: e.orthogonalSize });
    }), ...this.children.map((c, i) => {
      if (c instanceof BranchNode) {
        return c.onDidVisibilityChange(({ visible }) => {
          this.setChildVisible(i, visible);
        });
      }
      return Disposable.NONE;
    }));
  }
  dispose() {
    this._childrenDisposable.dispose();
    this.splitview.dispose();
    this.children.forEach((child) => child.dispose());
    super.dispose();
  }
}
function findLeaf(candiateNode, last) {
  if (candiateNode instanceof LeafNode) {
    return candiateNode;
  }
  if (candiateNode instanceof BranchNode) {
    return findLeaf(candiateNode.children[last ? candiateNode.children.length - 1 : 0], last);
  }
  throw new Error("invalid node");
}
function cloneNode(node, size, orthogonalSize) {
  if (node instanceof BranchNode) {
    const result = new BranchNode(node.orientation, node.proportionalLayout, node.styles, size, orthogonalSize, node.disabled, node.margin);
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      result.addChild(cloneNode(child, child.size, child.orthogonalSize), child.size, 0, true);
    }
    return result;
  } else {
    return new LeafNode(node.view, node.orientation, orthogonalSize);
  }
}
function flipNode(node, size, orthogonalSize) {
  if (node instanceof BranchNode) {
    const result = new BranchNode(orthogonal(node.orientation), node.proportionalLayout, node.styles, size, orthogonalSize, node.disabled, node.margin);
    let totalSize = 0;
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      const childSize = child instanceof BranchNode ? child.orthogonalSize : child.size;
      let newSize = node.size === 0 ? 0 : Math.round(size * childSize / node.size);
      totalSize += newSize;
      if (i === 0) {
        newSize += size - totalSize;
      }
      result.addChild(flipNode(child, orthogonalSize, newSize), newSize, 0, true);
    }
    return result;
  } else {
    return new LeafNode(node.view, orthogonal(node.orientation), orthogonalSize);
  }
}
function indexInParent(element) {
  const parentElement = element.parentElement;
  if (!parentElement) {
    throw new Error("Invalid grid element");
  }
  let el = parentElement.firstElementChild;
  let index = 0;
  while (el !== element && el !== parentElement.lastElementChild && el) {
    el = el.nextElementSibling;
    index++;
  }
  return index;
}
function getGridLocation(element) {
  const parentElement = element.parentElement;
  if (!parentElement) {
    throw new Error("Invalid grid element");
  }
  if (/\bdv-grid-view\b/.test(parentElement.className)) {
    return [];
  }
  const index = indexInParent(parentElement);
  const ancestor = parentElement.parentElement.parentElement.parentElement;
  return [...getGridLocation(ancestor), index];
}
function getRelativeLocation(rootOrientation, location, direction) {
  const orientation = getLocationOrientation(rootOrientation, location);
  const directionOrientation = getDirectionOrientation(direction);
  if (orientation === directionOrientation) {
    const [rest, _index] = tail(location);
    let index = _index;
    if (direction === "right" || direction === "bottom") {
      index += 1;
    }
    return [...rest, index];
  } else {
    const index = direction === "right" || direction === "bottom" ? 1 : 0;
    return [...location, index];
  }
}
function getDirectionOrientation(direction) {
  return direction === "top" || direction === "bottom" ? Orientation.VERTICAL : Orientation.HORIZONTAL;
}
function getLocationOrientation(rootOrientation, location) {
  return location.length % 2 === 0 ? orthogonal(rootOrientation) : rootOrientation;
}
const orthogonal = (orientation) => orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
function isGridBranchNode(node) {
  return !!node.children;
}
const serializeBranchNode = (node, orientation) => {
  const size = orientation === Orientation.VERTICAL ? node.box.width : node.box.height;
  if (!isGridBranchNode(node)) {
    if (typeof node.cachedVisibleSize === "number") {
      return {
        type: "leaf",
        data: node.view.toJSON(),
        size: node.cachedVisibleSize,
        visible: false
      };
    }
    return { type: "leaf", data: node.view.toJSON(), size };
  }
  return {
    type: "branch",
    data: node.children.map((c) => serializeBranchNode(c, orthogonal(orientation))),
    size
  };
};
class Gridview {
  get length() {
    return this._root ? this._root.children.length : 0;
  }
  get orientation() {
    return this.root.orientation;
  }
  set orientation(orientation) {
    if (this.root.orientation === orientation) {
      return;
    }
    const { size, orthogonalSize } = this.root;
    this.root = flipNode(this.root, orthogonalSize, size);
    this.root.layout(size, orthogonalSize);
  }
  get width() {
    return this.root.width;
  }
  get height() {
    return this.root.height;
  }
  get minimumWidth() {
    return this.root.minimumWidth;
  }
  get minimumHeight() {
    return this.root.minimumHeight;
  }
  get maximumWidth() {
    return this.root.maximumHeight;
  }
  get maximumHeight() {
    return this.root.maximumHeight;
  }
  get locked() {
    return this._locked;
  }
  set locked(value) {
    this._locked = value;
    const branch = [this.root];
    while (branch.length > 0) {
      const node = branch.pop();
      if (node instanceof BranchNode) {
        node.disabled = value;
        branch.push(...node.children);
      }
    }
  }
  get margin() {
    return this._margin;
  }
  set margin(value) {
    this._margin = value;
    this.root.margin = value;
  }
  maximizedView() {
    var _a;
    return (_a = this._maximizedNode) === null || _a === void 0 ? void 0 : _a.leaf.view;
  }
  hasMaximizedView() {
    return this._maximizedNode !== void 0;
  }
  maximizeView(view) {
    var _a;
    const location = getGridLocation(view.element);
    const [_, node] = this.getNode(location);
    if (!(node instanceof LeafNode)) {
      return;
    }
    if (((_a = this._maximizedNode) === null || _a === void 0 ? void 0 : _a.leaf) === node) {
      return;
    }
    if (this.hasMaximizedView()) {
      this.exitMaximizedView();
    }
    serializeBranchNode(this.getView(), this.orientation);
    const hiddenOnMaximize = [];
    function hideAllViewsBut(parent, exclude) {
      for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        if (child instanceof LeafNode) {
          if (child !== exclude) {
            if (parent.isChildVisible(i)) {
              parent.setChildVisible(i, false);
            } else {
              hiddenOnMaximize.push(child);
            }
          }
        } else {
          hideAllViewsBut(child, exclude);
        }
      }
    }
    hideAllViewsBut(this.root, node);
    this._maximizedNode = { leaf: node, hiddenOnMaximize };
    this._onDidMaximizedNodeChange.fire({
      view: node.view,
      isMaximized: true
    });
  }
  exitMaximizedView() {
    if (!this._maximizedNode) {
      return;
    }
    const hiddenOnMaximize = this._maximizedNode.hiddenOnMaximize;
    function showViewsInReverseOrder(parent) {
      for (let index = parent.children.length - 1; index >= 0; index--) {
        const child = parent.children[index];
        if (child instanceof LeafNode) {
          if (!hiddenOnMaximize.includes(child)) {
            parent.setChildVisible(index, true);
          }
        } else {
          showViewsInReverseOrder(child);
        }
      }
    }
    showViewsInReverseOrder(this.root);
    const tmp = this._maximizedNode.leaf;
    this._maximizedNode = void 0;
    this._onDidMaximizedNodeChange.fire({
      view: tmp.view,
      isMaximized: false
    });
  }
  serialize() {
    const maximizedView = this.maximizedView();
    let maxmizedViewLocation;
    if (maximizedView) {
      maxmizedViewLocation = getGridLocation(maximizedView.element);
    }
    if (this.hasMaximizedView()) {
      this.exitMaximizedView();
    }
    const root = serializeBranchNode(this.getView(), this.orientation);
    const resullt = {
      root,
      width: this.width,
      height: this.height,
      orientation: this.orientation
    };
    if (maxmizedViewLocation) {
      resullt.maximizedNode = {
        location: maxmizedViewLocation
      };
    }
    if (maximizedView) {
      this.maximizeView(maximizedView);
    }
    return resullt;
  }
  dispose() {
    this.disposable.dispose();
    this._onDidChange.dispose();
    this._onDidMaximizedNodeChange.dispose();
    this._onDidViewVisibilityChange.dispose();
    this.root.dispose();
    this._maximizedNode = void 0;
    this.element.remove();
  }
  clear() {
    const orientation = this.root.orientation;
    this.root = new BranchNode(orientation, this.proportionalLayout, this.styles, this.root.size, this.root.orthogonalSize, this.locked, this.margin);
  }
  deserialize(json, deserializer) {
    const orientation = json.orientation;
    const height = orientation === Orientation.VERTICAL ? json.height : json.width;
    this._deserialize(json.root, orientation, deserializer, height);
    this.layout(json.width, json.height);
    if (json.maximizedNode) {
      const location = json.maximizedNode.location;
      const [_, node] = this.getNode(location);
      if (!(node instanceof LeafNode)) {
        return;
      }
      this.maximizeView(node.view);
    }
  }
  _deserialize(root, orientation, deserializer, orthogonalSize) {
    this.root = this._deserializeNode(root, orientation, deserializer, orthogonalSize);
  }
  _deserializeNode(node, orientation, deserializer, orthogonalSize) {
    var _a;
    let result;
    if (node.type === "branch") {
      const serializedChildren = node.data;
      const children = serializedChildren.map((serializedChild) => {
        return {
          node: this._deserializeNode(serializedChild, orthogonal(orientation), deserializer, node.size),
          visible: serializedChild.visible
        };
      });
      result = new BranchNode(
        orientation,
        this.proportionalLayout,
        this.styles,
        node.size,
        // <- orthogonal size - flips at each depth
        orthogonalSize,
        // <- size - flips at each depth,
        this.locked,
        this.margin,
        children
      );
    } else {
      const view = deserializer.fromJSON(node);
      if (typeof node.visible === "boolean") {
        (_a = view.setVisible) === null || _a === void 0 ? void 0 : _a.call(view, node.visible);
      }
      result = new LeafNode(view, orientation, orthogonalSize, node.size);
    }
    return result;
  }
  get root() {
    return this._root;
  }
  set root(root) {
    const oldRoot = this._root;
    if (oldRoot) {
      oldRoot.dispose();
      this._maximizedNode = void 0;
      this.element.removeChild(oldRoot.element);
    }
    this._root = root;
    this.element.appendChild(this._root.element);
    this.disposable.value = this._root.onDidChange((e) => {
      this._onDidChange.fire(e);
    });
  }
  normalize() {
    if (!this._root) {
      return;
    }
    if (this._root.children.length !== 1) {
      return;
    }
    const oldRoot = this.root;
    const childReference = oldRoot.children[0];
    if (childReference instanceof LeafNode) {
      return;
    }
    oldRoot.element.remove();
    const child = oldRoot.removeChild(0);
    oldRoot.dispose();
    child.dispose();
    this._root = cloneNode(childReference, childReference.size, childReference.orthogonalSize);
    this.element.appendChild(this._root.element);
    this.disposable.value = this._root.onDidChange((e) => {
      this._onDidChange.fire(e);
    });
  }
  /**
   * If the root is orientated as a VERTICAL node then nest the existing root within a new HORIZIONTAL root node
   * If the root is orientated as a HORIZONTAL node then nest the existing root within a new VERITCAL root node
   */
  insertOrthogonalSplitviewAtRoot() {
    if (!this._root) {
      return;
    }
    const oldRoot = this.root;
    oldRoot.element.remove();
    this._root = new BranchNode(orthogonal(oldRoot.orientation), this.proportionalLayout, this.styles, this.root.orthogonalSize, this.root.size, this.locked, this.margin);
    if (oldRoot.children.length === 0) ;
    else if (oldRoot.children.length === 1) {
      const childReference = oldRoot.children[0];
      const child = oldRoot.removeChild(0);
      child.dispose();
      oldRoot.dispose();
      this._root.addChild(
        /**
         * the child node will have the same orientation as the new root since
         * we are removing the inbetween node.
         * the entire 'tree' must be flipped recursively to ensure that the orientation
         * flips at each level
         */
        flipNode(childReference, childReference.orthogonalSize, childReference.size),
        Sizing.Distribute,
        0
      );
    } else {
      this._root.addChild(oldRoot, Sizing.Distribute, 0);
    }
    this.element.appendChild(this._root.element);
    this.disposable.value = this._root.onDidChange((e) => {
      this._onDidChange.fire(e);
    });
  }
  next(location) {
    return this.progmaticSelect(location);
  }
  previous(location) {
    return this.progmaticSelect(location, true);
  }
  getView(location) {
    const node = location ? this.getNode(location)[1] : this.root;
    return this._getViews(node, this.orientation);
  }
  _getViews(node, orientation, cachedVisibleSize) {
    const box = { height: node.height, width: node.width };
    if (node instanceof LeafNode) {
      return { box, view: node.view, cachedVisibleSize };
    }
    const children = [];
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const nodeCachedVisibleSize = node.getChildCachedVisibleSize(i);
      children.push(this._getViews(child, orthogonal(orientation), nodeCachedVisibleSize));
    }
    return { box, children };
  }
  progmaticSelect(location, reverse = false) {
    const [path, node] = this.getNode(location);
    if (!(node instanceof LeafNode)) {
      throw new Error("invalid location");
    }
    for (let i = path.length - 1; i > -1; i--) {
      const n = path[i];
      const l = location[i] || 0;
      const canProgressInCurrentLevel = reverse ? l - 1 > -1 : l + 1 < n.children.length;
      if (canProgressInCurrentLevel) {
        return findLeaf(n.children[reverse ? l - 1 : l + 1], reverse);
      }
    }
    return findLeaf(this.root, reverse);
  }
  constructor(proportionalLayout, styles, orientation, locked, margin) {
    this.proportionalLayout = proportionalLayout;
    this.styles = styles;
    this._locked = false;
    this._margin = 0;
    this._maximizedNode = void 0;
    this.disposable = new MutableDisposable();
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    this._onDidViewVisibilityChange = new Emitter();
    this.onDidViewVisibilityChange = this._onDidViewVisibilityChange.event;
    this._onDidMaximizedNodeChange = new Emitter();
    this.onDidMaximizedNodeChange = this._onDidMaximizedNodeChange.event;
    this.element = document.createElement("div");
    this.element.className = "dv-grid-view";
    this._locked = locked !== null && locked !== void 0 ? locked : false;
    this._margin = margin !== null && margin !== void 0 ? margin : 0;
    this.root = new BranchNode(orientation, proportionalLayout, styles, 0, 0, this.locked, this.margin);
  }
  isViewVisible(location) {
    const [rest, index] = tail(location);
    const [, parent] = this.getNode(rest);
    if (!(parent instanceof BranchNode)) {
      throw new Error("Invalid from location");
    }
    return parent.isChildVisible(index);
  }
  setViewVisible(location, visible) {
    if (this.hasMaximizedView()) {
      this.exitMaximizedView();
    }
    const [rest, index] = tail(location);
    const [, parent] = this.getNode(rest);
    if (!(parent instanceof BranchNode)) {
      throw new Error("Invalid from location");
    }
    this._onDidViewVisibilityChange.fire();
    parent.setChildVisible(index, visible);
  }
  moveView(parentLocation, from, to) {
    if (this.hasMaximizedView()) {
      this.exitMaximizedView();
    }
    const [, parent] = this.getNode(parentLocation);
    if (!(parent instanceof BranchNode)) {
      throw new Error("Invalid location");
    }
    parent.moveChild(from, to);
  }
  addView(view, size, location) {
    if (this.hasMaximizedView()) {
      this.exitMaximizedView();
    }
    const [rest, index] = tail(location);
    const [pathToParent, parent] = this.getNode(rest);
    if (parent instanceof BranchNode) {
      const node = new LeafNode(view, orthogonal(parent.orientation), parent.orthogonalSize);
      parent.addChild(node, size, index);
    } else {
      const [grandParent, ..._] = [...pathToParent].reverse();
      const [parentIndex, ...__] = [...rest].reverse();
      let newSiblingSize = 0;
      const newSiblingCachedVisibleSize = grandParent.getChildCachedVisibleSize(parentIndex);
      if (typeof newSiblingCachedVisibleSize === "number") {
        newSiblingSize = Sizing.Invisible(newSiblingCachedVisibleSize);
      }
      const child = grandParent.removeChild(parentIndex);
      child.dispose();
      const newParent = new BranchNode(parent.orientation, this.proportionalLayout, this.styles, parent.size, parent.orthogonalSize, this.locked, this.margin);
      grandParent.addChild(newParent, parent.size, parentIndex);
      const newSibling = new LeafNode(parent.view, grandParent.orientation, parent.size);
      newParent.addChild(newSibling, newSiblingSize, 0);
      if (typeof size !== "number" && size.type === "split") {
        size = { type: "split", index: 0 };
      }
      const node = new LeafNode(view, grandParent.orientation, parent.size);
      newParent.addChild(node, size, index);
    }
  }
  remove(view, sizing) {
    const location = getGridLocation(view.element);
    return this.removeView(location, sizing);
  }
  removeView(location, sizing) {
    if (this.hasMaximizedView()) {
      this.exitMaximizedView();
    }
    const [rest, index] = tail(location);
    const [pathToParent, parent] = this.getNode(rest);
    if (!(parent instanceof BranchNode)) {
      throw new Error("Invalid location");
    }
    const nodeToRemove = parent.children[index];
    if (!(nodeToRemove instanceof LeafNode)) {
      throw new Error("Invalid location");
    }
    parent.removeChild(index, sizing);
    nodeToRemove.dispose();
    if (parent.children.length !== 1) {
      return nodeToRemove.view;
    }
    const sibling = parent.children[0];
    if (pathToParent.length === 0) {
      if (sibling instanceof LeafNode) {
        return nodeToRemove.view;
      }
      parent.removeChild(0, sizing);
      this.root = sibling;
      return nodeToRemove.view;
    }
    const [grandParent, ..._] = [...pathToParent].reverse();
    const [parentIndex, ...__] = [...rest].reverse();
    const isSiblingVisible = parent.isChildVisible(0);
    parent.removeChild(0, sizing);
    const sizes = grandParent.children.map((_size, i) => grandParent.getChildSize(i));
    grandParent.removeChild(parentIndex, sizing).dispose();
    if (sibling instanceof BranchNode) {
      sizes.splice(parentIndex, 1, ...sibling.children.map((c) => c.size));
      for (let i = 0; i < sibling.children.length; i++) {
        const child = sibling.children[i];
        grandParent.addChild(child, child.size, parentIndex + i);
      }
      while (sibling.children.length > 0) {
        sibling.removeChild(0);
      }
    } else {
      const newSibling = new LeafNode(sibling.view, orthogonal(sibling.orientation), sibling.size);
      const siblingSizing = isSiblingVisible ? sibling.orthogonalSize : Sizing.Invisible(sibling.orthogonalSize);
      grandParent.addChild(newSibling, siblingSizing, parentIndex);
    }
    sibling.dispose();
    for (let i = 0; i < sizes.length; i++) {
      grandParent.resizeChild(i, sizes[i]);
    }
    return nodeToRemove.view;
  }
  layout(width, height) {
    const [size, orthogonalSize] = this.root.orientation === Orientation.HORIZONTAL ? [height, width] : [width, height];
    this.root.layout(size, orthogonalSize);
  }
  getNode(location, node = this.root, path = []) {
    if (location.length === 0) {
      return [path, node];
    }
    if (!(node instanceof BranchNode)) {
      throw new Error("Invalid location");
    }
    const [index, ...rest] = location;
    if (index < 0 || index >= node.children.length) {
      throw new Error("Invalid location");
    }
    const child = node.children[index];
    path.push(node);
    return this.getNode(rest, child, path);
  }
}
class Resizable extends CompositeDisposable {
  get element() {
    return this._element;
  }
  get disableResizing() {
    return this._disableResizing;
  }
  set disableResizing(value) {
    this._disableResizing = value;
  }
  constructor(parentElement, disableResizing = false) {
    super();
    this._disableResizing = disableResizing;
    this._element = parentElement;
    this.addDisposables(watchElementResize(this._element, (entry) => {
      if (this.isDisposed) {
        return;
      }
      if (this.disableResizing) {
        return;
      }
      if (!this._element.offsetParent) {
        return;
      }
      if (!isInDocument(this._element)) {
        return;
      }
      const { width, height } = entry.contentRect;
      this.layout(width, height);
    }));
  }
}
const nextLayoutId$1 = sequentialNumberGenerator();
function toTarget(direction) {
  switch (direction) {
    case "left":
      return "left";
    case "right":
      return "right";
    case "above":
      return "top";
    case "below":
      return "bottom";
    case "within":
    default:
      return "center";
  }
}
class BaseGrid extends Resizable {
  get id() {
    return this._id;
  }
  get size() {
    return this._groups.size;
  }
  get groups() {
    return Array.from(this._groups.values()).map((_) => _.value);
  }
  get width() {
    return this.gridview.width;
  }
  get height() {
    return this.gridview.height;
  }
  get minimumHeight() {
    return this.gridview.minimumHeight;
  }
  get maximumHeight() {
    return this.gridview.maximumHeight;
  }
  get minimumWidth() {
    return this.gridview.minimumWidth;
  }
  get maximumWidth() {
    return this.gridview.maximumWidth;
  }
  get activeGroup() {
    return this._activeGroup;
  }
  get locked() {
    return this.gridview.locked;
  }
  set locked(value) {
    this.gridview.locked = value;
  }
  constructor(container, options) {
    var _a;
    super(document.createElement("div"), options.disableAutoResizing);
    this._id = nextLayoutId$1.next();
    this._groups = /* @__PURE__ */ new Map();
    this._onDidRemove = new Emitter();
    this.onDidRemove = this._onDidRemove.event;
    this._onDidAdd = new Emitter();
    this.onDidAdd = this._onDidAdd.event;
    this._onDidMaximizedChange = new Emitter();
    this.onDidMaximizedChange = this._onDidMaximizedChange.event;
    this._onDidActiveChange = new Emitter();
    this.onDidActiveChange = this._onDidActiveChange.event;
    this._bufferOnDidLayoutChange = new AsapEvent();
    this.onDidLayoutChange = this._bufferOnDidLayoutChange.onEvent;
    this._onDidViewVisibilityChangeMicroTaskQueue = new AsapEvent();
    this.onDidViewVisibilityChangeMicroTaskQueue = this._onDidViewVisibilityChangeMicroTaskQueue.onEvent;
    this.element.style.height = "100%";
    this.element.style.width = "100%";
    this._classNames = new Classnames(this.element);
    this._classNames.setClassNames((_a = options.className) !== null && _a !== void 0 ? _a : "");
    container.appendChild(this.element);
    this.gridview = new Gridview(!!options.proportionalLayout, options.styles, options.orientation, options.locked, options.margin);
    this.gridview.locked = !!options.locked;
    this.element.appendChild(this.gridview.element);
    this.layout(0, 0, true);
    this.addDisposables(this.gridview.onDidMaximizedNodeChange((event) => {
      this._onDidMaximizedChange.fire({
        panel: event.view,
        isMaximized: event.isMaximized
      });
    }), this.gridview.onDidViewVisibilityChange(() => this._onDidViewVisibilityChangeMicroTaskQueue.fire()), this.onDidViewVisibilityChangeMicroTaskQueue(() => {
      this.layout(this.width, this.height, true);
    }), Disposable.from(() => {
      var _a2;
      (_a2 = this.element.parentElement) === null || _a2 === void 0 ? void 0 : _a2.removeChild(this.element);
    }), this.gridview.onDidChange(() => {
      this._bufferOnDidLayoutChange.fire();
    }), Event.any(this.onDidAdd, this.onDidRemove, this.onDidActiveChange)(() => {
      this._bufferOnDidLayoutChange.fire();
    }), this._onDidMaximizedChange, this._onDidViewVisibilityChangeMicroTaskQueue, this._bufferOnDidLayoutChange);
  }
  setVisible(panel, visible) {
    this.gridview.setViewVisible(getGridLocation(panel.element), visible);
    this._bufferOnDidLayoutChange.fire();
  }
  isVisible(panel) {
    return this.gridview.isViewVisible(getGridLocation(panel.element));
  }
  updateOptions(options) {
    var _a, _b, _c, _d;
    if (typeof options.proportionalLayout === "boolean") ;
    if (options.orientation) {
      this.gridview.orientation = options.orientation;
    }
    if ("disableResizing" in options) {
      this.disableResizing = (_a = options.disableAutoResizing) !== null && _a !== void 0 ? _a : false;
    }
    if ("locked" in options) {
      this.locked = (_b = options.locked) !== null && _b !== void 0 ? _b : false;
    }
    if ("margin" in options) {
      this.gridview.margin = (_c = options.margin) !== null && _c !== void 0 ? _c : 0;
    }
    if ("className" in options) {
      this._classNames.setClassNames((_d = options.className) !== null && _d !== void 0 ? _d : "");
    }
  }
  maximizeGroup(panel) {
    this.gridview.maximizeView(panel);
    this.doSetGroupActive(panel);
  }
  isMaximizedGroup(panel) {
    return this.gridview.maximizedView() === panel;
  }
  exitMaximizedGroup() {
    this.gridview.exitMaximizedView();
  }
  hasMaximizedGroup() {
    return this.gridview.hasMaximizedView();
  }
  doAddGroup(group, location = [0], size) {
    this.gridview.addView(group, size !== null && size !== void 0 ? size : Sizing.Distribute, location);
    this._onDidAdd.fire(group);
  }
  doRemoveGroup(group, options) {
    if (!this._groups.has(group.id)) {
      throw new Error("invalid operation");
    }
    const item = this._groups.get(group.id);
    const view = this.gridview.remove(group, Sizing.Distribute);
    if (item && !(options === null || options === void 0 ? void 0 : options.skipDispose)) {
      item.disposable.dispose();
      item.value.dispose();
      this._groups.delete(group.id);
      this._onDidRemove.fire(group);
    }
    if (!(options === null || options === void 0 ? void 0 : options.skipActive) && this._activeGroup === group) {
      const groups = Array.from(this._groups.values());
      this.doSetGroupActive(groups.length > 0 ? groups[0].value : void 0);
    }
    return view;
  }
  getPanel(id) {
    var _a;
    return (_a = this._groups.get(id)) === null || _a === void 0 ? void 0 : _a.value;
  }
  doSetGroupActive(group) {
    if (this._activeGroup === group) {
      return;
    }
    if (this._activeGroup) {
      this._activeGroup.setActive(false);
    }
    if (group) {
      group.setActive(true);
    }
    this._activeGroup = group;
    this._onDidActiveChange.fire(group);
  }
  removeGroup(group) {
    this.doRemoveGroup(group);
  }
  moveToNext(options) {
    var _a;
    if (!options) {
      options = {};
    }
    if (!options.group) {
      if (!this.activeGroup) {
        return;
      }
      options.group = this.activeGroup;
    }
    const location = getGridLocation(options.group.element);
    const next = (_a = this.gridview.next(location)) === null || _a === void 0 ? void 0 : _a.view;
    this.doSetGroupActive(next);
  }
  moveToPrevious(options) {
    var _a;
    if (!options) {
      options = {};
    }
    if (!options.group) {
      if (!this.activeGroup) {
        return;
      }
      options.group = this.activeGroup;
    }
    const location = getGridLocation(options.group.element);
    const next = (_a = this.gridview.previous(location)) === null || _a === void 0 ? void 0 : _a.view;
    this.doSetGroupActive(next);
  }
  layout(width, height, forceResize) {
    const different = forceResize || width !== this.width || height !== this.height;
    if (!different) {
      return;
    }
    this.gridview.element.style.height = `${height}px`;
    this.gridview.element.style.width = `${width}px`;
    this.gridview.layout(width, height);
  }
  dispose() {
    this._onDidActiveChange.dispose();
    this._onDidAdd.dispose();
    this._onDidRemove.dispose();
    for (const group of this.groups) {
      group.dispose();
    }
    this.gridview.dispose();
    super.dispose();
  }
}
class DockviewApi {
  /**
   * The unique identifier for this instance. Used to manage scope of Drag'n'Drop events.
   */
  get id() {
    return this.component.id;
  }
  /**
   * Width of the component.
   */
  get width() {
    return this.component.width;
  }
  /**
   * Height of the component.
   */
  get height() {
    return this.component.height;
  }
  /**
   * Minimum height of the component.
   */
  get minimumHeight() {
    return this.component.minimumHeight;
  }
  /**
   * Maximum height of the component.
   */
  get maximumHeight() {
    return this.component.maximumHeight;
  }
  /**
   * Minimum width of the component.
   */
  get minimumWidth() {
    return this.component.minimumWidth;
  }
  /**
   * Maximum width of the component.
   */
  get maximumWidth() {
    return this.component.maximumWidth;
  }
  /**
   * Total number of groups.
   */
  get size() {
    return this.component.size;
  }
  /**
   * Total number of panels.
   */
  get totalPanels() {
    return this.component.totalPanels;
  }
  /**
   * Invoked when the active group changes. May be undefined if no group is active.
   */
  get onDidActiveGroupChange() {
    return this.component.onDidActiveGroupChange;
  }
  /**
   * Invoked when a group is added. May be called multiple times when moving groups.
   */
  get onDidAddGroup() {
    return this.component.onDidAddGroup;
  }
  /**
   * Invoked when a group is removed. May be called multiple times when moving groups.
   */
  get onDidRemoveGroup() {
    return this.component.onDidRemoveGroup;
  }
  /**
   * Invoked when the active panel changes. May be undefined if no panel is active.
   */
  get onDidActivePanelChange() {
    return this.component.onDidActivePanelChange;
  }
  /**
   * Invoked when a panel is added. May be called multiple times when moving panels.
   */
  get onDidAddPanel() {
    return this.component.onDidAddPanel;
  }
  /**
   * Invoked when a panel is removed. May be called multiple times when moving panels.
   */
  get onDidRemovePanel() {
    return this.component.onDidRemovePanel;
  }
  get onDidMovePanel() {
    return this.component.onDidMovePanel;
  }
  /**
   * Invoked after a layout is deserialzied using the `fromJSON` method.
   */
  get onDidLayoutFromJSON() {
    return this.component.onDidLayoutFromJSON;
  }
  /**
   * Invoked when any layout change occures, an aggregation of many events.
   */
  get onDidLayoutChange() {
    return this.component.onDidLayoutChange;
  }
  /**
   * Invoked when a Drag'n'Drop event occurs that the component was unable to handle. Exposed for custom Drag'n'Drop functionality.
   */
  get onDidDrop() {
    return this.component.onDidDrop;
  }
  /**
   * Invoked when a Drag'n'Drop event occurs but before dockview handles it giving the user an opportunity to intecept and
   * prevent the event from occuring using the standard `preventDefault()` syntax.
   *
   * Preventing certain events may causes unexpected behaviours, use carefully.
   */
  get onWillDrop() {
    return this.component.onWillDrop;
  }
  /**
   * Invoked before an overlay is shown indicating a drop target.
   *
   * Calling `event.preventDefault()` will prevent the overlay being shown and prevent
   * the any subsequent drop event.
   */
  get onWillShowOverlay() {
    return this.component.onWillShowOverlay;
  }
  /**
   * Invoked before a group is dragged.
   *
   * Calling `event.nativeEvent.preventDefault()` will prevent the group drag starting.
   *
   */
  get onWillDragGroup() {
    return this.component.onWillDragGroup;
  }
  /**
   * Invoked before a panel is dragged.
   *
   * Calling `event.nativeEvent.preventDefault()` will prevent the panel drag starting.
   */
  get onWillDragPanel() {
    return this.component.onWillDragPanel;
  }
  get onUnhandledDragOverEvent() {
    return this.component.onUnhandledDragOverEvent;
  }
  get onDidPopoutGroupSizeChange() {
    return this.component.onDidPopoutGroupSizeChange;
  }
  get onDidPopoutGroupPositionChange() {
    return this.component.onDidPopoutGroupPositionChange;
  }
  get onDidOpenPopoutWindowFail() {
    return this.component.onDidOpenPopoutWindowFail;
  }
  /**
   * All panel objects.
   */
  get panels() {
    return this.component.panels;
  }
  /**
   * All group objects.
   */
  get groups() {
    return this.component.groups;
  }
  /**
   *  Active panel object.
   */
  get activePanel() {
    return this.component.activePanel;
  }
  /**
   * Active group object.
   */
  get activeGroup() {
    return this.component.activeGroup;
  }
  constructor(component) {
    this.component = component;
  }
  /**
   *  Focus the component. Will try to focus an active panel if one exists.
   */
  focus() {
    this.component.focus();
  }
  /**
   * Get a panel object given a `string` id. May return `undefined`.
   */
  getPanel(id) {
    return this.component.getGroupPanel(id);
  }
  /**
   * Force resize the component to an exact width and height. Read about auto-resizing before using.
   */
  layout(width, height, force = false) {
    this.component.layout(width, height, force);
  }
  /**
   * Add a panel and return the created object.
   */
  addPanel(options) {
    return this.component.addPanel(options);
  }
  /**
   * Remove a panel given the panel object.
   */
  removePanel(panel) {
    this.component.removePanel(panel);
  }
  /**
   * Add a group and return the created object.
   */
  addGroup(options) {
    return this.component.addGroup(options);
  }
  /**
   * Close all groups and panels.
   */
  closeAllGroups() {
    return this.component.closeAllGroups();
  }
  /**
   * Remove a group and any panels within the group.
   */
  removeGroup(group) {
    this.component.removeGroup(group);
  }
  /**
   * Get a group object given a `string` id. May return undefined.
   */
  getGroup(id) {
    return this.component.getPanel(id);
  }
  /**
   * Add a floating group
   */
  addFloatingGroup(item, options) {
    return this.component.addFloatingGroup(item, options);
  }
  /**
   * Create a component from a serialized object.
   */
  fromJSON(data, options) {
    this.component.fromJSON(data, options);
  }
  /**
   * Create a serialized object of the current component.
   */
  toJSON() {
    return this.component.toJSON();
  }
  /**
   * Reset the component back to an empty and default state.
   */
  clear() {
    this.component.clear();
  }
  /**
   * Move the focus progmatically to the next panel or group.
   */
  moveToNext(options) {
    this.component.moveToNext(options);
  }
  /**
   * Move the focus progmatically to the previous panel or group.
   */
  moveToPrevious(options) {
    this.component.moveToPrevious(options);
  }
  maximizeGroup(panel) {
    this.component.maximizeGroup(panel.group);
  }
  hasMaximizedGroup() {
    return this.component.hasMaximizedGroup();
  }
  exitMaximizedGroup() {
    this.component.exitMaximizedGroup();
  }
  get onDidMaximizedGroupChange() {
    return this.component.onDidMaximizedGroupChange;
  }
  /**
   * Add a popout group in a new Window
   */
  addPopoutGroup(item, options) {
    return this.component.addPopoutGroup(item, options);
  }
  updateOptions(options) {
    this.component.updateOptions(options);
  }
  /**
   * Release resources and teardown component. Do not call when using framework versions of dockview.
   */
  dispose() {
    this.component.dispose();
  }
}
class DragHandler extends CompositeDisposable {
  constructor(el, disabled) {
    super();
    this.el = el;
    this.disabled = disabled;
    this.dataDisposable = new MutableDisposable();
    this.pointerEventsDisposable = new MutableDisposable();
    this._onDragStart = new Emitter();
    this.onDragStart = this._onDragStart.event;
    this.addDisposables(this._onDragStart, this.dataDisposable, this.pointerEventsDisposable);
    this.configure();
  }
  setDisabled(disabled) {
    this.disabled = disabled;
  }
  isCancelled(_event) {
    return false;
  }
  configure() {
    this.addDisposables(this._onDragStart, addDisposableListener(this.el, "dragstart", (event) => {
      if (event.defaultPrevented || this.isCancelled(event) || this.disabled) {
        event.preventDefault();
        return;
      }
      const iframes = disableIframePointEvents();
      this.pointerEventsDisposable.value = {
        dispose: () => {
          iframes.release();
        }
      };
      this.el.classList.add("dv-dragged");
      setTimeout(() => this.el.classList.remove("dv-dragged"), 0);
      this.dataDisposable.value = this.getData(event);
      this._onDragStart.fire(event);
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        const hasData = event.dataTransfer.items.length > 0;
        if (!hasData) {
          event.dataTransfer.setData("text/plain", "");
        }
      }
    }), addDisposableListener(this.el, "dragend", () => {
      this.pointerEventsDisposable.dispose();
      setTimeout(() => {
        this.dataDisposable.dispose();
      }, 0);
    }));
  }
}
class DragAndDropObserver extends CompositeDisposable {
  constructor(element, callbacks) {
    super();
    this.element = element;
    this.callbacks = callbacks;
    this.target = null;
    this.registerListeners();
  }
  onDragEnter(e) {
    this.target = e.target;
    this.callbacks.onDragEnter(e);
  }
  onDragOver(e) {
    e.preventDefault();
    if (this.callbacks.onDragOver) {
      this.callbacks.onDragOver(e);
    }
  }
  onDragLeave(e) {
    if (this.target === e.target) {
      this.target = null;
      this.callbacks.onDragLeave(e);
    }
  }
  onDragEnd(e) {
    this.target = null;
    this.callbacks.onDragEnd(e);
  }
  onDrop(e) {
    this.callbacks.onDrop(e);
  }
  registerListeners() {
    this.addDisposables(addDisposableListener(this.element, "dragenter", (e) => {
      this.onDragEnter(e);
    }, true));
    this.addDisposables(addDisposableListener(this.element, "dragover", (e) => {
      this.onDragOver(e);
    }, true));
    this.addDisposables(addDisposableListener(this.element, "dragleave", (e) => {
      this.onDragLeave(e);
    }));
    this.addDisposables(addDisposableListener(this.element, "dragend", (e) => {
      this.onDragEnd(e);
    }));
    this.addDisposables(addDisposableListener(this.element, "drop", (e) => {
      this.onDrop(e);
    }));
  }
}
function setGPUOptimizedBounds(element, bounds) {
  const { top, left, width, height } = bounds;
  const topPx = `${Math.round(top)}px`;
  const leftPx = `${Math.round(left)}px`;
  const widthPx = `${Math.round(width)}px`;
  const heightPx = `${Math.round(height)}px`;
  element.style.top = topPx;
  element.style.left = leftPx;
  element.style.width = widthPx;
  element.style.height = heightPx;
  element.style.visibility = "visible";
  if (!element.style.transform || element.style.transform === "") {
    element.style.transform = "translate3d(0, 0, 0)";
  }
}
function setGPUOptimizedBoundsFromStrings(element, bounds) {
  const { top, left, width, height } = bounds;
  element.style.top = top;
  element.style.left = left;
  element.style.width = width;
  element.style.height = height;
  element.style.visibility = "visible";
  if (!element.style.transform || element.style.transform === "") {
    element.style.transform = "translate3d(0, 0, 0)";
  }
}
function checkBoundsChanged(element, bounds) {
  const { top, left, width, height } = bounds;
  const topPx = `${Math.round(top)}px`;
  const leftPx = `${Math.round(left)}px`;
  const widthPx = `${Math.round(width)}px`;
  const heightPx = `${Math.round(height)}px`;
  return element.style.top !== topPx || element.style.left !== leftPx || element.style.width !== widthPx || element.style.height !== heightPx;
}
class WillShowOverlayEvent extends DockviewEvent {
  get nativeEvent() {
    return this.options.nativeEvent;
  }
  get position() {
    return this.options.position;
  }
  constructor(options) {
    super();
    this.options = options;
  }
}
function directionToPosition(direction) {
  switch (direction) {
    case "above":
      return "top";
    case "below":
      return "bottom";
    case "left":
      return "left";
    case "right":
      return "right";
    case "within":
      return "center";
    default:
      throw new Error(`invalid direction '${direction}'`);
  }
}
function positionToDirection(position) {
  switch (position) {
    case "top":
      return "above";
    case "bottom":
      return "below";
    case "left":
      return "left";
    case "right":
      return "right";
    case "center":
      return "within";
    default:
      throw new Error(`invalid position '${position}'`);
  }
}
const DEFAULT_ACTIVATION_SIZE = {
  value: 20,
  type: "percentage"
};
const DEFAULT_SIZE = {
  value: 50,
  type: "percentage"
};
const SMALL_WIDTH_BOUNDARY = 100;
const SMALL_HEIGHT_BOUNDARY = 100;
class Droptarget extends CompositeDisposable {
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  get state() {
    return this._state;
  }
  constructor(element, options) {
    super();
    this.element = element;
    this.options = options;
    this._onDrop = new Emitter();
    this.onDrop = this._onDrop.event;
    this._onWillShowOverlay = new Emitter();
    this.onWillShowOverlay = this._onWillShowOverlay.event;
    this._disabled = false;
    this._acceptedTargetZonesSet = new Set(this.options.acceptedTargetZones);
    this.dnd = new DragAndDropObserver(this.element, {
      onDragEnter: () => {
        var _a, _b, _c;
        (_c = (_b = (_a = this.options).getOverrideTarget) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.getElements();
      },
      onDragOver: (e) => {
        var _a, _b, _c, _d, _e, _f, _g;
        Droptarget.ACTUAL_TARGET = this;
        const overrideTarget = (_b = (_a = this.options).getOverrideTarget) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (this._acceptedTargetZonesSet.size === 0) {
          if (overrideTarget) {
            return;
          }
          this.removeDropTarget();
          return;
        }
        const target = (_e = (_d = (_c = this.options).getOverlayOutline) === null || _d === void 0 ? void 0 : _d.call(_c)) !== null && _e !== void 0 ? _e : this.element;
        const width = target.offsetWidth;
        const height = target.offsetHeight;
        if (width === 0 || height === 0) {
          return;
        }
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((_f = e.clientX) !== null && _f !== void 0 ? _f : 0) - rect.left;
        const y = ((_g = e.clientY) !== null && _g !== void 0 ? _g : 0) - rect.top;
        const quadrant = this.calculateQuadrant(this._acceptedTargetZonesSet, x, y, width, height);
        if (this.isAlreadyUsed(e) || quadrant === null) {
          this.removeDropTarget();
          return;
        }
        if (!this.options.canDisplayOverlay(e, quadrant)) {
          if (overrideTarget) {
            return;
          }
          this.removeDropTarget();
          return;
        }
        const willShowOverlayEvent = new WillShowOverlayEvent({
          nativeEvent: e,
          position: quadrant
        });
        this._onWillShowOverlay.fire(willShowOverlayEvent);
        if (willShowOverlayEvent.defaultPrevented) {
          this.removeDropTarget();
          return;
        }
        this.markAsUsed(e);
        if (overrideTarget) ;
        else if (!this.targetElement) {
          this.targetElement = document.createElement("div");
          this.targetElement.className = "dv-drop-target-dropzone";
          this.overlayElement = document.createElement("div");
          this.overlayElement.className = "dv-drop-target-selection";
          this._state = "center";
          this.targetElement.appendChild(this.overlayElement);
          target.classList.add("dv-drop-target");
          target.append(this.targetElement);
        }
        this.toggleClasses(quadrant, width, height);
        this._state = quadrant;
      },
      onDragLeave: () => {
        var _a, _b;
        const target = (_b = (_a = this.options).getOverrideTarget) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (target) {
          return;
        }
        this.removeDropTarget();
      },
      onDragEnd: (e) => {
        var _a, _b;
        const target = (_b = (_a = this.options).getOverrideTarget) === null || _b === void 0 ? void 0 : _b.call(_a);
        if (target && Droptarget.ACTUAL_TARGET === this) {
          if (this._state) {
            e.stopPropagation();
            this._onDrop.fire({
              position: this._state,
              nativeEvent: e
            });
          }
        }
        this.removeDropTarget();
        target === null || target === void 0 ? void 0 : target.clear();
      },
      onDrop: (e) => {
        var _a, _b, _c;
        e.preventDefault();
        const state = this._state;
        this.removeDropTarget();
        (_c = (_b = (_a = this.options).getOverrideTarget) === null || _b === void 0 ? void 0 : _b.call(_a)) === null || _c === void 0 ? void 0 : _c.clear();
        if (state) {
          e.stopPropagation();
          this._onDrop.fire({ position: state, nativeEvent: e });
        }
      }
    });
    this.addDisposables(this._onDrop, this._onWillShowOverlay, this.dnd);
  }
  setTargetZones(acceptedTargetZones) {
    this._acceptedTargetZonesSet = new Set(acceptedTargetZones);
  }
  setOverlayModel(model) {
    this.options.overlayModel = model;
  }
  dispose() {
    this.removeDropTarget();
    super.dispose();
  }
  /**
   * Add a property to the event object for other potential listeners to check
   */
  markAsUsed(event) {
    event[Droptarget.USED_EVENT_ID] = true;
  }
  /**
   * Check is the event has already been used by another instance of DropTarget
   */
  isAlreadyUsed(event) {
    const value = event[Droptarget.USED_EVENT_ID];
    return typeof value === "boolean" && value;
  }
  toggleClasses(quadrant, width, height) {
    var _a, _b, _c, _d, _e, _f, _g;
    const target = (_b = (_a = this.options).getOverrideTarget) === null || _b === void 0 ? void 0 : _b.call(_a);
    if (!target && !this.overlayElement) {
      return;
    }
    const isSmallX = width < SMALL_WIDTH_BOUNDARY;
    const isSmallY = height < SMALL_HEIGHT_BOUNDARY;
    const isLeft = quadrant === "left";
    const isRight = quadrant === "right";
    const isTop = quadrant === "top";
    const isBottom = quadrant === "bottom";
    const rightClass = !isSmallX && isRight;
    const leftClass = !isSmallX && isLeft;
    const topClass = !isSmallY && isTop;
    const bottomClass = !isSmallY && isBottom;
    let size = 1;
    const sizeOptions = (_d = (_c = this.options.overlayModel) === null || _c === void 0 ? void 0 : _c.size) !== null && _d !== void 0 ? _d : DEFAULT_SIZE;
    if (sizeOptions.type === "percentage") {
      size = clamp(sizeOptions.value, 0, 100) / 100;
    } else {
      if (rightClass || leftClass) {
        size = clamp(0, sizeOptions.value, width) / width;
      }
      if (topClass || bottomClass) {
        size = clamp(0, sizeOptions.value, height) / height;
      }
    }
    if (target) {
      const outlineEl = (_g = (_f = (_e = this.options).getOverlayOutline) === null || _f === void 0 ? void 0 : _f.call(_e)) !== null && _g !== void 0 ? _g : this.element;
      const elBox = outlineEl.getBoundingClientRect();
      const ta = target.getElements(void 0, outlineEl);
      const el = ta.root;
      const overlay = ta.overlay;
      const bigbox = el.getBoundingClientRect();
      const rootTop = elBox.top - bigbox.top;
      const rootLeft = elBox.left - bigbox.left;
      const box2 = {
        top: rootTop,
        left: rootLeft,
        width,
        height
      };
      if (rightClass) {
        box2.left = rootLeft + width * (1 - size);
        box2.width = width * size;
      } else if (leftClass) {
        box2.width = width * size;
      } else if (topClass) {
        box2.height = height * size;
      } else if (bottomClass) {
        box2.top = rootTop + height * (1 - size);
        box2.height = height * size;
      }
      if (isSmallX && isLeft) {
        box2.width = 4;
      }
      if (isSmallX && isRight) {
        box2.left = rootLeft + width - 4;
        box2.width = 4;
      }
      if (!checkBoundsChanged(overlay, box2)) {
        return;
      }
      setGPUOptimizedBounds(overlay, box2);
      overlay.className = `dv-drop-target-anchor${this.options.className ? ` ${this.options.className}` : ""}`;
      toggleClass(overlay, "dv-drop-target-left", isLeft);
      toggleClass(overlay, "dv-drop-target-right", isRight);
      toggleClass(overlay, "dv-drop-target-top", isTop);
      toggleClass(overlay, "dv-drop-target-bottom", isBottom);
      toggleClass(overlay, "dv-drop-target-center", quadrant === "center");
      if (ta.changed) {
        toggleClass(overlay, "dv-drop-target-anchor-container-changed", true);
        setTimeout(() => {
          toggleClass(overlay, "dv-drop-target-anchor-container-changed", false);
        }, 10);
      }
      return;
    }
    if (!this.overlayElement) {
      return;
    }
    const box = { top: "0px", left: "0px", width: "100%", height: "100%" };
    if (rightClass) {
      box.left = `${100 * (1 - size)}%`;
      box.width = `${100 * size}%`;
    } else if (leftClass) {
      box.width = `${100 * size}%`;
    } else if (topClass) {
      box.height = `${100 * size}%`;
    } else if (bottomClass) {
      box.top = `${100 * (1 - size)}%`;
      box.height = `${100 * size}%`;
    }
    setGPUOptimizedBoundsFromStrings(this.overlayElement, box);
    toggleClass(this.overlayElement, "dv-drop-target-small-vertical", isSmallY);
    toggleClass(this.overlayElement, "dv-drop-target-small-horizontal", isSmallX);
    toggleClass(this.overlayElement, "dv-drop-target-left", isLeft);
    toggleClass(this.overlayElement, "dv-drop-target-right", isRight);
    toggleClass(this.overlayElement, "dv-drop-target-top", isTop);
    toggleClass(this.overlayElement, "dv-drop-target-bottom", isBottom);
    toggleClass(this.overlayElement, "dv-drop-target-center", quadrant === "center");
  }
  calculateQuadrant(overlayType, x, y, width, height) {
    var _a, _b;
    const activationSizeOptions = (_b = (_a = this.options.overlayModel) === null || _a === void 0 ? void 0 : _a.activationSize) !== null && _b !== void 0 ? _b : DEFAULT_ACTIVATION_SIZE;
    const isPercentage = activationSizeOptions.type === "percentage";
    if (isPercentage) {
      return calculateQuadrantAsPercentage(overlayType, x, y, width, height, activationSizeOptions.value);
    }
    return calculateQuadrantAsPixels(overlayType, x, y, width, height, activationSizeOptions.value);
  }
  removeDropTarget() {
    var _a;
    if (this.targetElement) {
      this._state = void 0;
      (_a = this.targetElement.parentElement) === null || _a === void 0 ? void 0 : _a.classList.remove("dv-drop-target");
      this.targetElement.remove();
      this.targetElement = void 0;
      this.overlayElement = void 0;
    }
  }
}
Droptarget.USED_EVENT_ID = "__dockview_droptarget_event_is_used__";
function calculateQuadrantAsPercentage(overlayType, x, y, width, height, threshold) {
  const xp = 100 * x / width;
  const yp = 100 * y / height;
  if (overlayType.has("left") && xp < threshold) {
    return "left";
  }
  if (overlayType.has("right") && xp > 100 - threshold) {
    return "right";
  }
  if (overlayType.has("top") && yp < threshold) {
    return "top";
  }
  if (overlayType.has("bottom") && yp > 100 - threshold) {
    return "bottom";
  }
  if (!overlayType.has("center")) {
    return null;
  }
  return "center";
}
function calculateQuadrantAsPixels(overlayType, x, y, width, height, threshold) {
  if (overlayType.has("left") && x < threshold) {
    return "left";
  }
  if (overlayType.has("right") && x > width - threshold) {
    return "right";
  }
  if (overlayType.has("top") && y < threshold) {
    return "top";
  }
  if (overlayType.has("bottom") && y > height - threshold) {
    return "bottom";
  }
  if (!overlayType.has("center")) {
    return null;
  }
  return "center";
}
class WillFocusEvent extends DockviewEvent {
  constructor() {
    super();
  }
}
class PanelApiImpl extends CompositeDisposable {
  get isFocused() {
    return this._isFocused;
  }
  get isActive() {
    return this._isActive;
  }
  get isVisible() {
    return this._isVisible;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  constructor(id, component) {
    super();
    this.id = id;
    this.component = component;
    this._isFocused = false;
    this._isActive = false;
    this._isVisible = true;
    this._width = 0;
    this._height = 0;
    this._parameters = {};
    this.panelUpdatesDisposable = new MutableDisposable();
    this._onDidDimensionChange = new Emitter();
    this.onDidDimensionsChange = this._onDidDimensionChange.event;
    this._onDidChangeFocus = new Emitter();
    this.onDidFocusChange = this._onDidChangeFocus.event;
    this._onWillFocus = new Emitter();
    this.onWillFocus = this._onWillFocus.event;
    this._onDidVisibilityChange = new Emitter();
    this.onDidVisibilityChange = this._onDidVisibilityChange.event;
    this._onWillVisibilityChange = new Emitter();
    this.onWillVisibilityChange = this._onWillVisibilityChange.event;
    this._onDidActiveChange = new Emitter();
    this.onDidActiveChange = this._onDidActiveChange.event;
    this._onActiveChange = new Emitter();
    this.onActiveChange = this._onActiveChange.event;
    this._onDidParametersChange = new Emitter();
    this.onDidParametersChange = this._onDidParametersChange.event;
    this.addDisposables(this.onDidFocusChange((event) => {
      this._isFocused = event.isFocused;
    }), this.onDidActiveChange((event) => {
      this._isActive = event.isActive;
    }), this.onDidVisibilityChange((event) => {
      this._isVisible = event.isVisible;
    }), this.onDidDimensionsChange((event) => {
      this._width = event.width;
      this._height = event.height;
    }), this.panelUpdatesDisposable, this._onDidDimensionChange, this._onDidChangeFocus, this._onDidVisibilityChange, this._onDidActiveChange, this._onWillFocus, this._onActiveChange, this._onWillFocus, this._onWillVisibilityChange, this._onDidParametersChange);
  }
  getParameters() {
    return this._parameters;
  }
  initialize(panel) {
    this.panelUpdatesDisposable.value = this._onDidParametersChange.event((parameters) => {
      this._parameters = parameters;
      panel.update({
        params: parameters
      });
    });
  }
  setVisible(isVisible) {
    this._onWillVisibilityChange.fire({ isVisible });
  }
  setActive() {
    this._onActiveChange.fire();
  }
  updateParameters(parameters) {
    this._onDidParametersChange.fire(parameters);
  }
}
class BasePanelView extends CompositeDisposable {
  get element() {
    return this._element;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get params() {
    var _a;
    return (_a = this._params) === null || _a === void 0 ? void 0 : _a.params;
  }
  constructor(id, component, api) {
    super();
    this.id = id;
    this.component = component;
    this.api = api;
    this._height = 0;
    this._width = 0;
    this._element = document.createElement("div");
    this._element.tabIndex = -1;
    this._element.style.outline = "none";
    this._element.style.height = "100%";
    this._element.style.width = "100%";
    this._element.style.overflow = "hidden";
    const focusTracker = trackFocus(this._element);
    this.addDisposables(this.api, focusTracker.onDidFocus(() => {
      this.api._onDidChangeFocus.fire({ isFocused: true });
    }), focusTracker.onDidBlur(() => {
      this.api._onDidChangeFocus.fire({ isFocused: false });
    }), focusTracker);
  }
  focus() {
    const event = new WillFocusEvent();
    this.api._onWillFocus.fire(event);
    if (event.defaultPrevented) {
      return;
    }
    this._element.focus();
  }
  layout(width, height) {
    this._width = width;
    this._height = height;
    this.api._onDidDimensionChange.fire({ width, height });
    if (this.part) {
      if (this._params) {
        this.part.update(this._params.params);
      }
    }
  }
  init(parameters) {
    this._params = parameters;
    this.part = this.getComponent();
  }
  update(event) {
    var _a, _b;
    this._params = Object.assign(Object.assign({}, this._params), { params: Object.assign(Object.assign({}, (_a = this._params) === null || _a === void 0 ? void 0 : _a.params), event.params) });
    for (const key of Object.keys(event.params)) {
      if (event.params[key] === void 0) {
        delete this._params.params[key];
      }
    }
    (_b = this.part) === null || _b === void 0 ? void 0 : _b.update({ params: this._params.params });
  }
  toJSON() {
    var _a, _b;
    const params = (_b = (_a = this._params) === null || _a === void 0 ? void 0 : _a.params) !== null && _b !== void 0 ? _b : {};
    return {
      id: this.id,
      component: this.component,
      params: Object.keys(params).length > 0 ? params : void 0
    };
  }
  dispose() {
    var _a;
    this.api.dispose();
    (_a = this.part) === null || _a === void 0 ? void 0 : _a.dispose();
    super.dispose();
  }
}
class ContentContainer extends CompositeDisposable {
  get element() {
    return this._element;
  }
  constructor(accessor, group) {
    super();
    this.accessor = accessor;
    this.group = group;
    this.disposable = new MutableDisposable();
    this._onDidFocus = new Emitter();
    this.onDidFocus = this._onDidFocus.event;
    this._onDidBlur = new Emitter();
    this.onDidBlur = this._onDidBlur.event;
    this._element = document.createElement("div");
    this._element.className = "dv-content-container";
    this._element.tabIndex = -1;
    this.addDisposables(this._onDidFocus, this._onDidBlur);
    const target = group.dropTargetContainer;
    this.dropTarget = new Droptarget(this.element, {
      getOverlayOutline: () => {
        var _a;
        return ((_a = accessor.options.theme) === null || _a === void 0 ? void 0 : _a.dndPanelOverlay) === "group" ? this.element.parentElement : null;
      },
      className: "dv-drop-target-content",
      acceptedTargetZones: ["top", "bottom", "left", "right", "center"],
      canDisplayOverlay: (event, position) => {
        if (this.group.locked === "no-drop-target" || this.group.locked && position === "center") {
          return false;
        }
        const data = getPanelData();
        if (!data && event.shiftKey && this.group.location.type !== "floating") {
          return false;
        }
        if (data && data.viewId === this.accessor.id) {
          return true;
        }
        return this.group.canDisplayOverlay(event, position, "content");
      },
      getOverrideTarget: target ? () => target.model : void 0
    });
    this.addDisposables(this.dropTarget);
  }
  show() {
    this.element.style.display = "";
  }
  hide() {
    this.element.style.display = "none";
  }
  renderPanel(panel, options = { asActive: true }) {
    const doRender = options.asActive || this.panel && this.group.isPanelActive(this.panel);
    if (this.panel && this.panel.view.content.element.parentElement === this._element) {
      this._element.removeChild(this.panel.view.content.element);
    }
    this.panel = panel;
    let container;
    switch (panel.api.renderer) {
      case "onlyWhenVisible":
        this.group.renderContainer.detatch(panel);
        if (this.panel) {
          if (doRender) {
            this._element.appendChild(this.panel.view.content.element);
          }
        }
        container = this._element;
        break;
      case "always":
        if (panel.view.content.element.parentElement === this._element) {
          this._element.removeChild(panel.view.content.element);
        }
        container = this.group.renderContainer.attach({
          panel,
          referenceContainer: this
        });
        break;
      default:
        throw new Error(`dockview: invalid renderer type '${panel.api.renderer}'`);
    }
    if (doRender) {
      const focusTracker = trackFocus(container);
      this.focusTracker = focusTracker;
      const disposable = new CompositeDisposable();
      disposable.addDisposables(focusTracker, focusTracker.onDidFocus(() => this._onDidFocus.fire()), focusTracker.onDidBlur(() => this._onDidBlur.fire()));
      this.disposable.value = disposable;
    }
  }
  openPanel(panel) {
    if (this.panel === panel) {
      return;
    }
    this.renderPanel(panel);
  }
  layout(_width, _height) {
  }
  closePanel() {
    var _a;
    if (this.panel) {
      if (this.panel.api.renderer === "onlyWhenVisible") {
        (_a = this.panel.view.content.element.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this.panel.view.content.element);
      }
    }
    this.panel = void 0;
  }
  dispose() {
    this.disposable.dispose();
    super.dispose();
  }
  /**
   * Refresh the focus tracker state to handle cases where focus state
   * gets out of sync due to programmatic panel activation
   */
  refreshFocusState() {
    var _a;
    if ((_a = this.focusTracker) === null || _a === void 0 ? void 0 : _a.refreshState) {
      this.focusTracker.refreshState();
    }
  }
}
function addGhostImage(dataTransfer, ghostElement, options) {
  var _a, _b;
  addClasses(ghostElement, "dv-dragged");
  ghostElement.style.top = "-9999px";
  document.body.appendChild(ghostElement);
  dataTransfer.setDragImage(ghostElement, (_a = options === null || options === void 0 ? void 0 : options.x) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.y) !== null && _b !== void 0 ? _b : 0);
  setTimeout(() => {
    removeClasses(ghostElement, "dv-dragged");
    ghostElement.remove();
  }, 0);
}
class TabDragHandler extends DragHandler {
  constructor(element, accessor, group, panel, disabled) {
    super(element, disabled);
    this.accessor = accessor;
    this.group = group;
    this.panel = panel;
    this.panelTransfer = LocalSelectionTransfer.getInstance();
  }
  getData(event) {
    this.panelTransfer.setData([new PanelTransfer(this.accessor.id, this.group.id, this.panel.id)], PanelTransfer.prototype);
    return {
      dispose: () => {
        this.panelTransfer.clearData(PanelTransfer.prototype);
      }
    };
  }
}
class Tab extends CompositeDisposable {
  get element() {
    return this._element;
  }
  constructor(panel, accessor, group) {
    super();
    this.panel = panel;
    this.accessor = accessor;
    this.group = group;
    this.content = void 0;
    this._onPointDown = new Emitter();
    this.onPointerDown = this._onPointDown.event;
    this._onDropped = new Emitter();
    this.onDrop = this._onDropped.event;
    this._onDragStart = new Emitter();
    this.onDragStart = this._onDragStart.event;
    this._onDragEnd = new Emitter();
    this.onDragEnd = this._onDragEnd.event;
    this._element = document.createElement("div");
    this._element.className = "dv-tab";
    this._element.tabIndex = 0;
    this._element.draggable = !this.accessor.options.disableDnd;
    toggleClass(this.element, "dv-inactive-tab", true);
    this.dragHandler = new TabDragHandler(this._element, this.accessor, this.group, this.panel, !!this.accessor.options.disableDnd);
    this.dropTarget = new Droptarget(this._element, {
      acceptedTargetZones: ["left", "right"],
      overlayModel: { activationSize: { value: 50, type: "percentage" } },
      canDisplayOverlay: (event, position) => {
        if (this.group.locked) {
          return false;
        }
        const data = getPanelData();
        if (data && this.accessor.id === data.viewId) {
          if (this.accessor.options.tabAnimation === "smooth" && data.groupId === this.group.id) {
            return false;
          }
          return true;
        }
        return this.group.model.canDisplayOverlay(event, position, "tab");
      },
      getOverrideTarget: () => {
        var _a;
        return (_a = group.model.dropTargetContainer) === null || _a === void 0 ? void 0 : _a.model;
      }
    });
    this.onWillShowOverlay = this.dropTarget.onWillShowOverlay;
    this.addDisposables(this._onPointDown, this._onDropped, this._onDragStart, this._onDragEnd, this.dragHandler.onDragStart((event) => {
      if (event.dataTransfer) {
        const style = getComputedStyle(this.element);
        const newNode = this.element.cloneNode(true);
        Array.from(style).forEach((key) => newNode.style.setProperty(key, style.getPropertyValue(key), style.getPropertyPriority(key)));
        newNode.style.position = "absolute";
        addGhostImage(event.dataTransfer, newNode, {
          y: -10,
          x: 30
        });
      }
      this._onDragStart.fire(event);
      if (this.accessor.options.tabAnimation === "smooth") {
        requestAnimationFrame(() => {
          toggleClass(this.element, "dv-tab--dragging", true);
        });
      }
    }), addDisposableListener(this._element, "dragend", (event) => {
      toggleClass(this.element, "dv-tab--dragging", false);
      this._onDragEnd.fire(event);
    }), this.dragHandler, addDisposableListener(this._element, "pointerdown", (event) => {
      this._onPointDown.fire(event);
    }), this.dropTarget.onDrop((event) => {
      this._onDropped.fire(event);
    }), this.dropTarget);
  }
  setActive(isActive) {
    toggleClass(this.element, "dv-active-tab", isActive);
    toggleClass(this.element, "dv-inactive-tab", !isActive);
  }
  setContent(part) {
    if (this.content) {
      this._element.removeChild(this.content.element);
    }
    this.content = part;
    this._element.appendChild(this.content.element);
  }
  updateDragAndDropState() {
    this._element.draggable = !this.accessor.options.disableDnd;
    this.dragHandler.setDisabled(!!this.accessor.options.disableDnd);
  }
  dispose() {
    super.dispose();
  }
}
class DockviewWillShowOverlayLocationEvent {
  get kind() {
    return this.options.kind;
  }
  get nativeEvent() {
    return this.event.nativeEvent;
  }
  get position() {
    return this.event.position;
  }
  get defaultPrevented() {
    return this.event.defaultPrevented;
  }
  get panel() {
    return this.options.panel;
  }
  get api() {
    return this.options.api;
  }
  get group() {
    return this.options.group;
  }
  preventDefault() {
    this.event.preventDefault();
  }
  getData() {
    return this.options.getData();
  }
  constructor(event, options) {
    this.event = event;
    this.options = options;
  }
}
class GroupDragHandler extends DragHandler {
  constructor(element, accessor, group, disabled) {
    super(element, disabled);
    this.accessor = accessor;
    this.group = group;
    this.panelTransfer = LocalSelectionTransfer.getInstance();
    this.addDisposables(addDisposableListener(element, "pointerdown", (e) => {
      if (e.shiftKey) {
        quasiPreventDefault(e);
      }
    }, true));
  }
  isCancelled(_event) {
    if (this.group.api.location.type === "floating" && !_event.shiftKey) {
      return true;
    }
    return false;
  }
  getData(dragEvent) {
    const dataTransfer = dragEvent.dataTransfer;
    this.panelTransfer.setData([new PanelTransfer(this.accessor.id, this.group.id, null)], PanelTransfer.prototype);
    const style = window.getComputedStyle(this.el);
    const bgColor = style.getPropertyValue("--dv-activegroup-visiblepanel-tab-background-color");
    const color = style.getPropertyValue("--dv-activegroup-visiblepanel-tab-color");
    if (dataTransfer) {
      const ghostElement = document.createElement("div");
      ghostElement.style.backgroundColor = bgColor;
      ghostElement.style.color = color;
      ghostElement.style.padding = "2px 8px";
      ghostElement.style.height = "24px";
      ghostElement.style.fontSize = "11px";
      ghostElement.style.lineHeight = "20px";
      ghostElement.style.borderRadius = "12px";
      ghostElement.style.position = "absolute";
      ghostElement.style.pointerEvents = "none";
      ghostElement.style.top = "-9999px";
      ghostElement.textContent = `Multiple Panels (${this.group.size})`;
      addGhostImage(dataTransfer, ghostElement, { y: -10, x: 30 });
    }
    return {
      dispose: () => {
        this.panelTransfer.clearData(PanelTransfer.prototype);
      }
    };
  }
}
class VoidContainer extends CompositeDisposable {
  get element() {
    return this._element;
  }
  constructor(accessor, group) {
    super();
    this.accessor = accessor;
    this.group = group;
    this._onDrop = new Emitter();
    this.onDrop = this._onDrop.event;
    this._onDragStart = new Emitter();
    this.onDragStart = this._onDragStart.event;
    this._element = document.createElement("div");
    this._element.className = "dv-void-container";
    this._element.draggable = !this.accessor.options.disableDnd;
    toggleClass(this._element, "dv-draggable", !this.accessor.options.disableDnd);
    this.addDisposables(this._onDrop, this._onDragStart, addDisposableListener(this._element, "pointerdown", () => {
      this.accessor.doSetGroupActive(this.group);
    }));
    this.handler = new GroupDragHandler(this._element, accessor, group, !!this.accessor.options.disableDnd);
    this.dropTarget = new Droptarget(this._element, {
      acceptedTargetZones: ["center"],
      canDisplayOverlay: (event, position) => {
        const data = getPanelData();
        if (data && this.accessor.id === data.viewId) {
          return true;
        }
        return group.model.canDisplayOverlay(event, position, "header_space");
      },
      getOverrideTarget: () => {
        var _a;
        return (_a = group.model.dropTargetContainer) === null || _a === void 0 ? void 0 : _a.model;
      }
    });
    this.onWillShowOverlay = this.dropTarget.onWillShowOverlay;
    this.addDisposables(this.handler, this.handler.onDragStart((event) => {
      this._onDragStart.fire(event);
    }), this.dropTarget.onDrop((event) => {
      this._onDrop.fire(event);
    }), this.dropTarget);
  }
  updateDragAndDropState() {
    this._element.draggable = !this.accessor.options.disableDnd;
    toggleClass(this._element, "dv-draggable", !this.accessor.options.disableDnd);
    this.handler.setDisabled(!!this.accessor.options.disableDnd);
  }
}
class Scrollbar extends CompositeDisposable {
  get element() {
    return this._element;
  }
  get orientation() {
    return this._orientation;
  }
  set orientation(value) {
    if (this._orientation === value) {
      return;
    }
    this._scrollOffset = 0;
    this._orientation = value;
    removeClasses(this._scrollbar, "dv-scrollbar-vertical", "dv-scrollbar-horizontal");
    if (value === "vertical") {
      addClasses(this._scrollbar, "dv-scrollbar-vertical");
    } else {
      addClasses(this._scrollbar, "dv-scrollbar-horizontal");
    }
  }
  constructor(scrollableElement) {
    super();
    this.scrollableElement = scrollableElement;
    this._scrollOffset = 0;
    this._orientation = "horizontal";
    this._element = document.createElement("div");
    this._element.className = "dv-scrollable";
    this._scrollbar = document.createElement("div");
    this._scrollbar.className = "dv-scrollbar dv-scrollbar-horizontal";
    this.element.appendChild(scrollableElement);
    this.element.appendChild(this._scrollbar);
    this.addDisposables(addDisposableListener(this.element, "wheel", (event) => {
      this._scrollOffset += event.deltaY * Scrollbar.MouseWheelSpeed;
      this.calculateScrollbarStyles();
    }), addDisposableListener(this._scrollbar, "pointerdown", (event) => {
      event.preventDefault();
      toggleClass(this.element, "dv-scrollable-scrolling", true);
      const originalClient = this._orientation === "horizontal" ? event.clientX : event.clientY;
      const originalScrollOffset = this._scrollOffset;
      const onPointerMove = (event2) => {
        const delta = this._orientation === "horizontal" ? event2.clientX - originalClient : event2.clientY - originalClient;
        const clientSize = this._orientation === "horizontal" ? this.element.clientWidth : this.element.clientHeight;
        const scrollSize = this._orientation === "horizontal" ? this.scrollableElement.scrollWidth : this.scrollableElement.scrollHeight;
        const p2 = clientSize / scrollSize;
        this._scrollOffset = originalScrollOffset + delta / p2;
        this.calculateScrollbarStyles();
      };
      const onEnd = () => {
        toggleClass(this.element, "dv-scrollable-scrolling", false);
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onEnd);
        document.removeEventListener("pointercancel", onEnd);
      };
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onEnd);
      document.addEventListener("pointercancel", onEnd);
    }), addDisposableListener(this.element, "scroll", () => {
      this.calculateScrollbarStyles();
    }), addDisposableListener(this.scrollableElement, "scroll", () => {
      this._scrollOffset = this._orientation === "horizontal" ? this.scrollableElement.scrollLeft : this.scrollableElement.scrollTop;
      this.calculateScrollbarStyles();
    }), watchElementResize(this.element, () => {
      toggleClass(this.element, "dv-scrollable-resizing", true);
      if (this._animationTimer) {
        clearTimeout(this._animationTimer);
      }
      this._animationTimer = setTimeout(() => {
        clearTimeout(this._animationTimer);
        toggleClass(this.element, "dv-scrollable-resizing", false);
      }, 500);
      this.calculateScrollbarStyles();
    }));
  }
  calculateScrollbarStyles() {
    const clientSize = this._orientation === "horizontal" ? this.element.clientWidth : this.element.clientHeight;
    const scrollSize = this._orientation === "horizontal" ? this.scrollableElement.scrollWidth : this.scrollableElement.scrollHeight;
    const hasScrollbar = scrollSize > clientSize;
    if (hasScrollbar) {
      const px = clientSize * (clientSize / scrollSize);
      if (this._orientation === "horizontal") {
        this._scrollbar.style.width = `${px}px`;
        this._scrollbar.style.height = "";
      } else {
        this._scrollbar.style.height = `${px}px`;
        this._scrollbar.style.width = "";
      }
      this._scrollOffset = clamp(this._scrollOffset, 0, scrollSize - clientSize);
      if (this._orientation === "horizontal") {
        this.scrollableElement.scrollLeft = this._scrollOffset;
      } else {
        this.scrollableElement.scrollTop = this._scrollOffset;
      }
      const percentageComplete = this._scrollOffset / (scrollSize - clientSize);
      if (this._orientation === "horizontal") {
        this._scrollbar.style.left = `${(clientSize - px) * percentageComplete}px`;
        this._scrollbar.style.top = "";
      } else {
        this._scrollbar.style.top = `${(clientSize - px) * percentageComplete}px`;
        this._scrollbar.style.left = "";
      }
    } else {
      if (this._orientation === "horizontal") {
        this._scrollbar.style.width = "0px";
        this._scrollbar.style.left = "0px";
      } else {
        this._scrollbar.style.height = "0px";
        this._scrollbar.style.top = "0px";
      }
      this._scrollOffset = 0;
    }
  }
}
Scrollbar.MouseWheelSpeed = 1;
class Tabs extends CompositeDisposable {
  get showTabsOverflowControl() {
    return this._showTabsOverflowControl;
  }
  set showTabsOverflowControl(value) {
    if (this._showTabsOverflowControl == value) {
      return;
    }
    this._showTabsOverflowControl = value;
    if (value) {
      const observer = new OverflowObserver(this._tabsList);
      this._observerDisposable.value = new CompositeDisposable(observer, observer.onDidChange((event) => {
        const hasOverflow = event.hasScrollX || event.hasScrollY;
        this.toggleDropdown({ reset: !hasOverflow });
      }), addDisposableListener(this._tabsList, "scroll", () => {
        this.toggleDropdown({ reset: false });
      }));
    }
  }
  get element() {
    return this._element;
  }
  get panels() {
    return this._tabs.map((_) => _.value.panel.id);
  }
  get size() {
    return this._tabs.length;
  }
  get tabs() {
    return this._tabs.map((_) => _.value);
  }
  get direction() {
    return this._direction;
  }
  set direction(value) {
    if (this._direction === value) {
      return;
    }
    this._direction = value;
    if (this._scrollbar) {
      this._scrollbar.orientation = value;
    }
    removeClasses(this._tabsList, "dv-horizontal", "dv-vertical");
    if (value === "vertical") {
      addClasses(this._tabsList, "dv-tabs-container-vertical", "dv-vertical");
    } else {
      removeClasses(this._tabsList, "dv-tabs-container-vertical");
      addClasses(this._tabsList, "dv-horizontal");
    }
  }
  constructor(group, accessor, options) {
    super();
    this.group = group;
    this.accessor = accessor;
    this._observerDisposable = new MutableDisposable();
    this._scrollbar = null;
    this._tabs = [];
    this.selectedIndex = -1;
    this._showTabsOverflowControl = false;
    this._direction = "horizontal";
    this._animState = null;
    this._onTabDragStart = new Emitter();
    this.onTabDragStart = this._onTabDragStart.event;
    this._onDrop = new Emitter();
    this.onDrop = this._onDrop.event;
    this._onWillShowOverlay = new Emitter();
    this.onWillShowOverlay = this._onWillShowOverlay.event;
    this._onOverflowTabsChange = new Emitter();
    this.onOverflowTabsChange = this._onOverflowTabsChange.event;
    this._tabsList = document.createElement("div");
    this._tabsList.className = "dv-tabs-container";
    this.showTabsOverflowControl = options.showTabsOverflowControl;
    if (accessor.options.scrollbars === "native") {
      this._element = this._tabsList;
    } else {
      this._scrollbar = new Scrollbar(this._tabsList);
      this._scrollbar.orientation = this.direction;
      this._element = this._scrollbar.element;
      this.addDisposables(this._scrollbar);
    }
    this.addDisposables(this._onOverflowTabsChange, this._observerDisposable, this._onWillShowOverlay, this._onDrop, this._onTabDragStart, addDisposableListener(this.element, "pointerdown", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      const isLeftClick = event.button === 0;
      if (isLeftClick) {
        this.accessor.doSetGroupActive(this.group);
      }
    }), addDisposableListener(this._tabsList, "dragover", (event) => {
      if (!this._animState) {
        if (this.accessor.options.tabAnimation !== "smooth" || this.accessor.options.disableDnd) {
          return;
        }
        const data = getPanelData();
        if (data && data.panelId && data.groupId !== this.group.id) {
          this._animState = {
            sourceTabId: data.panelId,
            sourceIndex: -1,
            tabPositions: this.snapshotTabPositions(),
            currentInsertionIndex: null
          };
        } else {
          return;
        }
      }
      this.handleDragOver(event);
    }, true), addDisposableListener(this._tabsList, "dragleave", (event) => {
      if (!this._animState) {
        return;
      }
      if (event.relatedTarget && this._tabsList.contains(event.relatedTarget)) {
        return;
      }
      this.resetTabTransforms();
      if (this._animState) {
        if (this._animState.sourceIndex === -1) {
          this._animState = null;
        } else {
          this._animState.currentInsertionIndex = null;
        }
      }
    }, true), addDisposableListener(this._tabsList, "dragend", () => {
      this.resetDragAnimation();
    }), addDisposableListener(this._tabsList, "drop", (event) => {
      if (this.accessor.options.tabAnimation !== "smooth" || !this._animState || this._animState.currentInsertionIndex === null) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      const animState = this._animState;
      this._animState = null;
      const insertionIndex = animState.currentInsertionIndex;
      const sourceIndex = animState.sourceIndex;
      const adjustedIndex = insertionIndex - (sourceIndex !== -1 && sourceIndex < insertionIndex ? 1 : 0);
      if (adjustedIndex === sourceIndex) {
        this.resetTabTransforms();
        return;
      }
      const firstPositions = this.snapshotTabPositions();
      this.resetTabTransforms();
      this._onDrop.fire({ event, index: adjustedIndex });
      this.runFlipAnimation(firstPositions, animState.sourceTabId, animState.sourceIndex === -1, {
        from: Math.min(sourceIndex, adjustedIndex),
        to: Math.max(sourceIndex, adjustedIndex)
      });
    }, true), Disposable.from(() => {
      this.resetDragAnimation();
      for (const { value, disposable } of this._tabs) {
        disposable.dispose();
        value.dispose();
      }
      this._tabs = [];
    }));
  }
  indexOf(id) {
    return this._tabs.findIndex((tab) => tab.value.panel.id === id);
  }
  isActive(tab) {
    return this.selectedIndex > -1 && this._tabs[this.selectedIndex].value === tab;
  }
  setActivePanel(panel) {
    let runningWidth = 0;
    for (const tab of this._tabs) {
      const isActivePanel = panel.id === tab.value.panel.id;
      tab.value.setActive(isActivePanel);
      if (isActivePanel) {
        const element = tab.value.element;
        const parentElement = element.parentElement;
        if (runningWidth < parentElement.scrollLeft || runningWidth + element.clientWidth > parentElement.scrollLeft + parentElement.clientWidth) {
          parentElement.scrollLeft = runningWidth;
        }
      }
      runningWidth += tab.value.element.clientWidth;
    }
  }
  openPanel(panel, index = this._tabs.length) {
    if (this._tabs.find((tab2) => tab2.value.panel.id === panel.id)) {
      return;
    }
    const tab = new Tab(panel, this.accessor, this.group);
    tab.setContent(panel.view.tab);
    const disposable = new CompositeDisposable(tab.onDragStart((event) => {
      this._onTabDragStart.fire({ nativeEvent: event, panel });
      if (this.accessor.options.tabAnimation === "smooth") {
        this._animState = {
          sourceTabId: panel.id,
          sourceIndex: this._tabs.findIndex((x) => x.value === tab),
          tabPositions: this.snapshotTabPositions(),
          currentInsertionIndex: null
        };
      }
    }), tab.onPointerDown((event) => {
      if (event.defaultPrevented) {
        return;
      }
      const isFloatingGroupsEnabled = !this.accessor.options.disableFloatingGroups;
      const isFloatingWithOnePanel = this.group.api.location.type === "floating" && this.size === 1;
      if (isFloatingGroupsEnabled && !isFloatingWithOnePanel && event.shiftKey) {
        event.preventDefault();
        const panel2 = this.accessor.getGroupPanel(tab.panel.id);
        const { top, left } = tab.element.getBoundingClientRect();
        const { top: rootTop, left: rootLeft } = this.accessor.element.getBoundingClientRect();
        this.accessor.addFloatingGroup(panel2, {
          x: left - rootLeft,
          y: top - rootTop,
          inDragMode: true
        });
        return;
      }
      switch (event.button) {
        case 0:
          if (this.group.activePanel !== panel) {
            this.group.model.openPanel(panel);
          }
          break;
      }
    }), tab.onDrop((event) => {
      const animState = this._animState;
      this._animState = null;
      const dropIndex = this._tabs.findIndex((x) => x.value === tab);
      if (animState) {
        const firstPositions = this.snapshotTabPositions();
        this.resetTabTransforms();
        this._onDrop.fire({
          event: event.nativeEvent,
          index: dropIndex
        });
        this.runFlipAnimation(firstPositions, animState.sourceTabId, animState.sourceIndex === -1, animState.sourceIndex !== -1 ? {
          from: Math.min(animState.sourceIndex, dropIndex),
          to: Math.max(animState.sourceIndex, dropIndex)
        } : void 0);
      } else {
        this._onDrop.fire({
          event: event.nativeEvent,
          index: dropIndex
        });
      }
    }), tab.onWillShowOverlay((event) => {
      this._onWillShowOverlay.fire(new DockviewWillShowOverlayLocationEvent(event, {
        kind: "tab",
        panel: this.group.activePanel,
        api: this.accessor.api,
        group: this.group,
        getData: getPanelData
      }));
    }));
    const value = { value: tab, disposable };
    this.addTab(value, index);
    if (this._animState) {
      this._animState.tabPositions = this.snapshotTabPositions();
      this.applyDragOverTransforms();
    }
  }
  delete(id) {
    var _a;
    if (((_a = this._animState) === null || _a === void 0 ? void 0 : _a.sourceTabId) === id) {
      this.resetTabTransforms();
      this._animState = null;
    }
    const index = this.indexOf(id);
    const tabToRemove = this._tabs.splice(index, 1)[0];
    const { value, disposable } = tabToRemove;
    disposable.dispose();
    value.dispose();
    value.element.remove();
    if (this._animState) {
      this._animState.tabPositions = this.snapshotTabPositions();
      this.applyDragOverTransforms();
    }
  }
  addTab(tab, index = this._tabs.length) {
    if (index < 0 || index > this._tabs.length) {
      throw new Error("invalid location");
    }
    this._tabsList.insertBefore(tab.value.element, this._tabsList.children[index]);
    this._tabs = [
      ...this._tabs.slice(0, index),
      tab,
      ...this._tabs.slice(index)
    ];
    if (this.selectedIndex < 0) {
      this.selectedIndex = index;
    }
  }
  toggleDropdown(options) {
    const tabs = options.reset ? [] : this._tabs.filter((tab) => !isChildEntirelyVisibleWithinParent(tab.value.element, this._tabsList)).map((x) => x.value.panel.id);
    this._onOverflowTabsChange.fire({ tabs, reset: options.reset });
  }
  updateDragAndDropState() {
    for (const tab of this._tabs) {
      tab.value.updateDragAndDropState();
    }
  }
  snapshotTabPositions() {
    const positions = /* @__PURE__ */ new Map();
    for (const tab of this._tabs) {
      positions.set(tab.value.panel.id, tab.value.element.getBoundingClientRect());
    }
    return positions;
  }
  getAverageTabWidth() {
    if (this._tabs.length === 0) {
      return 0;
    }
    let totalWidth = 0;
    for (const tab of this._tabs) {
      totalWidth += tab.value.element.getBoundingClientRect().width;
    }
    return totalWidth / this._tabs.length;
  }
  handleDragOver(event) {
    if (!this._animState) {
      return;
    }
    const mouseX = event.clientX;
    let insertionIndex = null;
    for (let i = 0; i < this._tabs.length; i++) {
      const tab = this._tabs[i].value;
      if (tab.panel.id === this._animState.sourceTabId) {
        continue;
      }
      const rect = tab.element.getBoundingClientRect();
      const midpoint = rect.left + rect.width / 2;
      if (mouseX < midpoint) {
        insertionIndex = i;
        break;
      }
      insertionIndex = i + 1;
    }
    if (insertionIndex === this._animState.currentInsertionIndex) {
      return;
    }
    this._animState.currentInsertionIndex = insertionIndex;
    this.applyDragOverTransforms();
  }
  applyDragOverTransforms() {
    if (!this._animState || this._animState.currentInsertionIndex === null) {
      this.resetTabTransforms();
      return;
    }
    const insertionIndex = this._animState.currentInsertionIndex;
    const sourceRect = this._animState.tabPositions.get(this._animState.sourceTabId);
    const gapWidth = sourceRect ? sourceRect.width : this.getAverageTabWidth();
    let gapApplied = false;
    for (let i = 0; i < this._tabs.length; i++) {
      const tab = this._tabs[i].value;
      if (tab.panel.id === this._animState.sourceTabId) {
        continue;
      }
      if (!gapApplied && i >= insertionIndex) {
        tab.element.style.marginLeft = `${gapWidth}px`;
        toggleClass(tab.element, "dv-tab--shifting", true);
        gapApplied = true;
      } else {
        if (tab.element.style.marginLeft) {
          tab.element.style.marginLeft = "0px";
          toggleClass(tab.element, "dv-tab--shifting", true);
          const onEnd = () => {
            tab.element.style.removeProperty("margin-left");
            toggleClass(tab.element, "dv-tab--shifting", false);
            tab.element.removeEventListener("transitionend", onEnd);
          };
          tab.element.addEventListener("transitionend", onEnd);
        } else {
          toggleClass(tab.element, "dv-tab--shifting", false);
        }
      }
    }
  }
  resetTabTransforms() {
    for (const tab of this._tabs) {
      tab.value.element.style.removeProperty("margin-left");
      tab.value.element.style.removeProperty("transform");
      toggleClass(tab.value.element, "dv-tab--shifting", false);
    }
  }
  resetDragAnimation() {
    this.resetTabTransforms();
    this._animState = null;
    for (const tab of this._tabs) {
      toggleClass(tab.value.element, "dv-tab--dragging", false);
    }
  }
  runFlipAnimation(firstPositions, sourceTabId, isCrossGroup = false, animRange) {
    let hasAnimation = false;
    for (let i = 0; i < this._tabs.length; i++) {
      const tab = this._tabs[i];
      const panelId = tab.value.panel.id;
      if (panelId === sourceTabId) {
        if (isCrossGroup) {
          const rect = tab.value.element.getBoundingClientRect();
          tab.value.element.style.transform = `translateX(${rect.width}px)`;
          toggleClass(tab.value.element, "dv-tab--shifting", true);
          hasAnimation = true;
        }
        continue;
      }
      if (animRange !== void 0 && (i < animRange.from || i > animRange.to)) {
        continue;
      }
      const firstRect = firstPositions.get(panelId);
      if (!firstRect) {
        continue;
      }
      const lastRect = tab.value.element.getBoundingClientRect();
      const deltaX = firstRect.left - lastRect.left;
      if (Math.abs(deltaX) < 1) {
        continue;
      }
      tab.value.element.style.transform = `translateX(${deltaX}px)`;
      toggleClass(tab.value.element, "dv-tab--shifting", true);
      hasAnimation = true;
    }
    if (!hasAnimation) {
      return;
    }
    requestAnimationFrame(() => {
      for (const tab of this._tabs) {
        if (tab.value.element.style.transform) {
          tab.value.element.style.transform = "";
        }
      }
      const onTransitionEnd = (event) => {
        if (event.propertyName === "transform") {
          this._tabsList.removeEventListener("transitionend", onTransitionEnd);
          for (const tab of this._tabs) {
            toggleClass(tab.value.element, "dv-tab--shifting", false);
          }
        }
      };
      this._tabsList.addEventListener("transitionend", onTransitionEnd);
    });
  }
}
const createSvgElementFromPath = (params) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "height", params.height);
  svg.setAttributeNS(null, "width", params.width);
  svg.setAttributeNS(null, "viewBox", params.viewbox);
  svg.setAttributeNS(null, "aria-hidden", "false");
  svg.setAttributeNS(null, "focusable", "false");
  svg.classList.add("dv-svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttributeNS(null, "d", params.path);
  svg.appendChild(path);
  return svg;
};
const createCloseButton = () => createSvgElementFromPath({
  width: "11",
  height: "11",
  viewbox: "0 0 28 28",
  path: "M2.1 27.3L0 25.2L11.55 13.65L0 2.1L2.1 0L13.65 11.55L25.2 0L27.3 2.1L15.75 13.65L27.3 25.2L25.2 27.3L13.65 15.75L2.1 27.3Z"
});
const createChevronRightButton = () => createSvgElementFromPath({
  width: "11",
  height: "11",
  viewbox: "0 0 15 25",
  path: "M2.15 24.1L0 21.95L9.9 12.05L0 2.15L2.15 0L14.2 12.05L2.15 24.1Z"
});
function createDropdownElementHandle() {
  const el = document.createElement("div");
  el.className = "dv-tabs-overflow-dropdown-default";
  const text = document.createElement("span");
  text.textContent = ``;
  const icon = createChevronRightButton();
  el.appendChild(icon);
  el.appendChild(text);
  return {
    element: el,
    update: (params) => {
      text.textContent = `${params.tabs}`;
    }
  };
}
class TabsContainer extends CompositeDisposable {
  get onTabDragStart() {
    return this.tabs.onTabDragStart;
  }
  get panels() {
    return this.tabs.panels;
  }
  get size() {
    return this.tabs.size;
  }
  get hidden() {
    return this._hidden;
  }
  set hidden(value) {
    this._hidden = value;
    this.element.style.display = value ? "none" : "";
  }
  get direction() {
    return this._direction;
  }
  set direction(value) {
    this._direction = value;
    if (value === "vertical") {
      addClasses(this._element, "dv-groupview-header-vertical");
      addClasses(this.rightActionsContainer, "dv-right-actions-container-vertical");
      this.tabs.direction = value;
    } else {
      removeClasses(this._element, "dv-groupview-header-vertical");
      removeClasses(this.rightActionsContainer, "dv-right-actions-container-vertical");
      this.tabs.direction = value;
    }
  }
  get element() {
    return this._element;
  }
  constructor(accessor, group) {
    super();
    this.accessor = accessor;
    this.group = group;
    this._hidden = false;
    this._direction = "horizontal";
    this.dropdownPart = null;
    this._overflowTabs = [];
    this._dropdownDisposable = new MutableDisposable();
    this._onDrop = new Emitter();
    this.onDrop = this._onDrop.event;
    this._onGroupDragStart = new Emitter();
    this.onGroupDragStart = this._onGroupDragStart.event;
    this._onWillShowOverlay = new Emitter();
    this.onWillShowOverlay = this._onWillShowOverlay.event;
    this._element = document.createElement("div");
    this._element.className = "dv-tabs-and-actions-container";
    toggleClass(this._element, "dv-full-width-single-tab", this.accessor.options.singleTabMode === "fullwidth");
    this.rightActionsContainer = document.createElement("div");
    this.rightActionsContainer.className = "dv-right-actions-container";
    this.leftActionsContainer = document.createElement("div");
    this.leftActionsContainer.className = "dv-left-actions-container";
    this.preActionsContainer = document.createElement("div");
    this.preActionsContainer.className = "dv-pre-actions-container";
    this.tabs = new Tabs(group, accessor, {
      showTabsOverflowControl: !accessor.options.disableTabsOverflowList
    });
    this.voidContainer = new VoidContainer(this.accessor, this.group);
    this._element.appendChild(this.preActionsContainer);
    this._element.appendChild(this.tabs.element);
    this._element.appendChild(this.leftActionsContainer);
    this._element.appendChild(this.voidContainer.element);
    this._element.appendChild(this.rightActionsContainer);
    this.addDisposables(this.tabs.onDrop((e) => this._onDrop.fire(e)), this.tabs.onWillShowOverlay((e) => this._onWillShowOverlay.fire(e)), accessor.onDidOptionsChange(() => {
      this.tabs.showTabsOverflowControl = !accessor.options.disableTabsOverflowList;
    }), this.tabs.onOverflowTabsChange((event) => {
      this.toggleDropdown(event);
    }), this.tabs, this._onWillShowOverlay, this._onDrop, this._onGroupDragStart, this.voidContainer, this.voidContainer.onDragStart((event) => {
      this._onGroupDragStart.fire({
        nativeEvent: event,
        group: this.group
      });
    }), this.voidContainer.onDrop((event) => {
      this._onDrop.fire({
        event: event.nativeEvent,
        index: this.tabs.size
      });
    }), this.voidContainer.onWillShowOverlay((event) => {
      this._onWillShowOverlay.fire(new DockviewWillShowOverlayLocationEvent(event, {
        kind: "header_space",
        panel: this.group.activePanel,
        api: this.accessor.api,
        group: this.group,
        getData: getPanelData
      }));
    }), addDisposableListener(this.voidContainer.element, "pointerdown", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      const isFloatingGroupsEnabled = !this.accessor.options.disableFloatingGroups;
      if (isFloatingGroupsEnabled && event.shiftKey && this.group.api.location.type !== "floating") {
        event.preventDefault();
        const { top, left } = this.element.getBoundingClientRect();
        const { top: rootTop, left: rootLeft } = this.accessor.element.getBoundingClientRect();
        this.accessor.addFloatingGroup(this.group, {
          x: left - rootLeft + 20,
          y: top - rootTop + 20,
          inDragMode: true
        });
      }
    }));
  }
  show() {
    if (!this.hidden) {
      this.element.style.display = "";
    }
  }
  hide() {
    this._element.style.display = "none";
  }
  setRightActionsElement(element) {
    if (this.rightActions === element) {
      return;
    }
    if (this.rightActions) {
      this.rightActions.remove();
      this.rightActions = void 0;
    }
    if (element) {
      this.rightActionsContainer.appendChild(element);
      this.rightActions = element;
    }
  }
  setLeftActionsElement(element) {
    if (this.leftActions === element) {
      return;
    }
    if (this.leftActions) {
      this.leftActions.remove();
      this.leftActions = void 0;
    }
    if (element) {
      this.leftActionsContainer.appendChild(element);
      this.leftActions = element;
    }
  }
  setPrefixActionsElement(element) {
    if (this.preActions === element) {
      return;
    }
    if (this.preActions) {
      this.preActions.remove();
      this.preActions = void 0;
    }
    if (element) {
      this.preActionsContainer.appendChild(element);
      this.preActions = element;
    }
  }
  isActive(tab) {
    return this.tabs.isActive(tab);
  }
  indexOf(id) {
    return this.tabs.indexOf(id);
  }
  setActive(_isGroupActive) {
  }
  delete(id) {
    this.tabs.delete(id);
    this.updateClassnames();
  }
  setActivePanel(panel) {
    this.tabs.setActivePanel(panel);
  }
  openPanel(panel, index = this.tabs.size) {
    this.tabs.openPanel(panel, index);
    this.updateClassnames();
  }
  closePanel(panel) {
    this.delete(panel.id);
  }
  updateClassnames() {
    toggleClass(this._element, "dv-single-tab", this.size === 1);
  }
  toggleDropdown(options) {
    const tabs = options.reset ? [] : options.tabs;
    this._overflowTabs = tabs;
    if (this._overflowTabs.length > 0 && this.dropdownPart) {
      this.dropdownPart.update({ tabs: tabs.length });
      return;
    }
    if (this._overflowTabs.length === 0) {
      this._dropdownDisposable.dispose();
      return;
    }
    const root = document.createElement("div");
    root.className = "dv-tabs-overflow-dropdown-root";
    const part = createDropdownElementHandle();
    part.update({ tabs: tabs.length });
    this.dropdownPart = part;
    root.appendChild(part.element);
    this.rightActionsContainer.prepend(root);
    this._dropdownDisposable.value = new CompositeDisposable(Disposable.from(() => {
      var _a, _b;
      root.remove();
      (_b = (_a = this.dropdownPart) === null || _a === void 0 ? void 0 : _a.dispose) === null || _b === void 0 ? void 0 : _b.call(_a);
      this.dropdownPart = null;
    }), addDisposableListener(root, "pointerdown", (event) => {
      event.preventDefault();
    }, { capture: true }), addDisposableListener(root, "click", (event) => {
      const el = document.createElement("div");
      el.style.overflow = "auto";
      el.className = "dv-tabs-overflow-container";
      for (const tab of this.tabs.tabs.filter((tab2) => this._overflowTabs.includes(tab2.panel.id))) {
        const panelObject = this.group.panels.find((panel) => panel === tab.panel);
        const tabComponent = panelObject.view.createTabRenderer("headerOverflow");
        const child = tabComponent.element;
        const wrapper = document.createElement("div");
        toggleClass(wrapper, "dv-tab", true);
        toggleClass(wrapper, "dv-active-tab", panelObject.api.isActive);
        toggleClass(wrapper, "dv-inactive-tab", !panelObject.api.isActive);
        wrapper.addEventListener("click", (event2) => {
          this.accessor.popupService.close();
          if (event2.defaultPrevented) {
            return;
          }
          tab.element.scrollIntoView();
          tab.panel.api.setActive();
        });
        wrapper.appendChild(child);
        el.appendChild(wrapper);
      }
      const relativeParent = findRelativeZIndexParent(root);
      this.accessor.popupService.openPopover(el, {
        x: event.clientX,
        y: event.clientY,
        zIndex: (relativeParent === null || relativeParent === void 0 ? void 0 : relativeParent.style.zIndex) ? `calc(${relativeParent.style.zIndex} * 2)` : void 0
      });
    }));
  }
  updateDragAndDropState() {
    this.tabs.updateDragAndDropState();
    this.voidContainer.updateDragAndDropState();
  }
}
class DockviewUnhandledDragOverEvent extends AcceptableEvent {
  constructor(nativeEvent, target, position, getData, group) {
    super();
    this.nativeEvent = nativeEvent;
    this.target = target;
    this.position = position;
    this.getData = getData;
    this.group = group;
  }
}
const PROPERTY_KEYS_DOCKVIEW = (() => {
  const properties = {
    disableAutoResizing: void 0,
    hideBorders: void 0,
    singleTabMode: void 0,
    disableFloatingGroups: void 0,
    floatingGroupBounds: void 0,
    popoutUrl: void 0,
    defaultRenderer: void 0,
    defaultHeaderPosition: void 0,
    debug: void 0,
    rootOverlayModel: void 0,
    locked: void 0,
    disableDnd: void 0,
    className: void 0,
    noPanelsOverlay: void 0,
    dndEdges: void 0,
    theme: void 0,
    disableTabsOverflowList: void 0,
    scrollbars: void 0,
    tabAnimation: void 0
  };
  return Object.keys(properties);
})();
function isPanelOptionsWithPanel(data) {
  if (data.referencePanel) {
    return true;
  }
  return false;
}
function isPanelOptionsWithGroup(data) {
  if (data.referenceGroup) {
    return true;
  }
  return false;
}
function isGroupOptionsWithPanel(data) {
  if (data.referencePanel) {
    return true;
  }
  return false;
}
function isGroupOptionsWithGroup(data) {
  if (data.referenceGroup) {
    return true;
  }
  return false;
}
class DockviewDidDropEvent extends DockviewEvent {
  get nativeEvent() {
    return this.options.nativeEvent;
  }
  get position() {
    return this.options.position;
  }
  get panel() {
    return this.options.panel;
  }
  get group() {
    return this.options.group;
  }
  get api() {
    return this.options.api;
  }
  constructor(options) {
    super();
    this.options = options;
  }
  getData() {
    return this.options.getData();
  }
}
class DockviewWillDropEvent extends DockviewDidDropEvent {
  get kind() {
    return this._kind;
  }
  constructor(options) {
    super(options);
    this._kind = options.kind;
  }
}
class DockviewGroupPanelModel extends CompositeDisposable {
  get element() {
    throw new Error("dockview: not supported");
  }
  get activePanel() {
    return this._activePanel;
  }
  get locked() {
    return this._locked;
  }
  set locked(value) {
    this._locked = value;
    toggleClass(this.container, "dv-locked-groupview", value === "no-drop-target" || value);
  }
  get isActive() {
    return this._isGroupActive;
  }
  get panels() {
    return this._panels;
  }
  get size() {
    return this._panels.length;
  }
  get isEmpty() {
    return this._panels.length === 0;
  }
  get hasWatermark() {
    return !!(this.watermark && this.container.contains(this.watermark.element));
  }
  get header() {
    return this.tabsContainer;
  }
  get isContentFocused() {
    if (!document.activeElement) {
      return false;
    }
    return isAncestor(document.activeElement, this.contentContainer.element);
  }
  get headerPosition() {
    var _a;
    return (_a = this._headerPosition) !== null && _a !== void 0 ? _a : "top";
  }
  set headerPosition(value) {
    var _a;
    this._headerPosition = value;
    removeClasses(this.container, "dv-groupview-header-top", "dv-groupview-header-bottom", "dv-groupview-header-left", "dv-groupview-header-right");
    addClasses(this.container, `dv-groupview-header-${value}`);
    const direction = value === "top" || value === "bottom" ? "horizontal" : "vertical";
    this.tabsContainer.direction = direction;
    this.header.direction = direction;
    if ((_a = this._activePanel) === null || _a === void 0 ? void 0 : _a.layout) {
      this._activePanel.layout(this._width, this._height);
    }
    if (this._leftHeaderActions || this._rightHeaderActions || this._prefixHeaderActions) {
      this.updateHeaderActions();
    }
  }
  get location() {
    return this._location;
  }
  set location(value) {
    this._location = value;
    toggleClass(this.container, "dv-groupview-floating", false);
    toggleClass(this.container, "dv-groupview-popout", false);
    switch (value.type) {
      case "grid":
        this.contentContainer.dropTarget.setTargetZones([
          "top",
          "bottom",
          "left",
          "right",
          "center"
        ]);
        break;
      case "floating":
        this.contentContainer.dropTarget.setTargetZones(["center"]);
        this.contentContainer.dropTarget.setTargetZones(value ? ["center"] : ["top", "bottom", "left", "right", "center"]);
        toggleClass(this.container, "dv-groupview-floating", true);
        break;
      case "popout":
        this.contentContainer.dropTarget.setTargetZones(["center"]);
        toggleClass(this.container, "dv-groupview-popout", true);
        break;
    }
    this.groupPanel.api._onDidLocationChange.fire({
      location: this.location
    });
  }
  constructor(container, accessor, id, options, groupPanel) {
    var _a, _b;
    super();
    this.container = container;
    this.accessor = accessor;
    this.id = id;
    this.options = options;
    this.groupPanel = groupPanel;
    this._isGroupActive = false;
    this._locked = false;
    this._rightHeaderActionsDisposable = new MutableDisposable();
    this._leftHeaderActionsDisposable = new MutableDisposable();
    this._prefixHeaderActionsDisposable = new MutableDisposable();
    this._location = { type: "grid" };
    this.mostRecentlyUsed = [];
    this._overwriteRenderContainer = null;
    this._overwriteDropTargetContainer = null;
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    this._width = 0;
    this._height = 0;
    this._panels = [];
    this._panelDisposables = /* @__PURE__ */ new Map();
    this._onMove = new Emitter();
    this.onMove = this._onMove.event;
    this._onDidDrop = new Emitter();
    this.onDidDrop = this._onDidDrop.event;
    this._onWillDrop = new Emitter();
    this.onWillDrop = this._onWillDrop.event;
    this._onWillShowOverlay = new Emitter();
    this.onWillShowOverlay = this._onWillShowOverlay.event;
    this._onTabDragStart = new Emitter();
    this.onTabDragStart = this._onTabDragStart.event;
    this._onGroupDragStart = new Emitter();
    this.onGroupDragStart = this._onGroupDragStart.event;
    this._onDidAddPanel = new Emitter();
    this.onDidAddPanel = this._onDidAddPanel.event;
    this._onDidPanelTitleChange = new Emitter();
    this.onDidPanelTitleChange = this._onDidPanelTitleChange.event;
    this._onDidPanelParametersChange = new Emitter();
    this.onDidPanelParametersChange = this._onDidPanelParametersChange.event;
    this._onDidRemovePanel = new Emitter();
    this.onDidRemovePanel = this._onDidRemovePanel.event;
    this._onDidActivePanelChange = new Emitter();
    this.onDidActivePanelChange = this._onDidActivePanelChange.event;
    this._onUnhandledDragOverEvent = new Emitter();
    this.onUnhandledDragOverEvent = this._onUnhandledDragOverEvent.event;
    toggleClass(this.container, "dv-groupview", true);
    this._api = new DockviewApi(this.accessor);
    this.tabsContainer = new TabsContainer(this.accessor, this.groupPanel);
    this.contentContainer = new ContentContainer(this.accessor, this);
    container.append(this.tabsContainer.element, this.contentContainer.element);
    this.header.hidden = !!options.hideHeader;
    this.locked = (_a = options.locked) !== null && _a !== void 0 ? _a : false;
    this.headerPosition = (_b = options.headerPosition) !== null && _b !== void 0 ? _b : accessor.defaultHeaderPosition;
    this.addDisposables(this._onTabDragStart, this._onGroupDragStart, this._onWillShowOverlay, this._rightHeaderActionsDisposable, this._leftHeaderActionsDisposable, this._prefixHeaderActionsDisposable, this.tabsContainer.onTabDragStart((event) => {
      this._onTabDragStart.fire(event);
    }), this.tabsContainer.onGroupDragStart((event) => {
      this._onGroupDragStart.fire(event);
    }), this.tabsContainer.onDrop((event) => {
      this.handleDropEvent("header", event.event, "center", event.index);
    }), this.contentContainer.onDidFocus(() => {
      this.accessor.doSetGroupActive(this.groupPanel);
    }), this.contentContainer.onDidBlur(() => {
    }), this.contentContainer.dropTarget.onDrop((event) => {
      this.handleDropEvent("content", event.nativeEvent, event.position);
    }), this.tabsContainer.onWillShowOverlay((event) => {
      this._onWillShowOverlay.fire(event);
    }), this.contentContainer.dropTarget.onWillShowOverlay((event) => {
      this._onWillShowOverlay.fire(new DockviewWillShowOverlayLocationEvent(event, {
        kind: "content",
        panel: this.activePanel,
        api: this._api,
        group: this.groupPanel,
        getData: getPanelData
      }));
    }), this._onMove, this._onDidChange, this._onDidDrop, this._onWillDrop, this._onDidAddPanel, this._onDidRemovePanel, this._onDidActivePanelChange, this._onUnhandledDragOverEvent, this._onDidPanelTitleChange, this._onDidPanelParametersChange);
  }
  focusContent() {
    this.contentContainer.element.focus();
  }
  set renderContainer(value) {
    this.panels.forEach((panel) => {
      this.renderContainer.detatch(panel);
    });
    this._overwriteRenderContainer = value;
    this.panels.forEach((panel) => {
      this.rerender(panel);
    });
  }
  get renderContainer() {
    var _a;
    return (_a = this._overwriteRenderContainer) !== null && _a !== void 0 ? _a : this.accessor.overlayRenderContainer;
  }
  set dropTargetContainer(value) {
    this._overwriteDropTargetContainer = value;
  }
  get dropTargetContainer() {
    var _a;
    return (_a = this._overwriteDropTargetContainer) !== null && _a !== void 0 ? _a : this.accessor.rootDropTargetContainer;
  }
  initialize() {
    if (this.options.panels) {
      this.options.panels.forEach((panel) => {
        this.doAddPanel(panel);
      });
    }
    if (this.options.activePanel) {
      this.openPanel(this.options.activePanel);
    }
    this.setActive(this.isActive, true);
    this.updateContainer();
    this.updateHeaderActions();
  }
  updateHeaderActions() {
    if (this.accessor.options.createRightHeaderActionComponent) {
      this._rightHeaderActions = this.accessor.options.createRightHeaderActionComponent(this.groupPanel);
      this._rightHeaderActionsDisposable.value = this._rightHeaderActions;
      this._rightHeaderActions.init({
        containerApi: this._api,
        api: this.groupPanel.api,
        group: this.groupPanel
      });
      this.tabsContainer.setRightActionsElement(this._rightHeaderActions.element);
    } else {
      this._rightHeaderActions = void 0;
      this._rightHeaderActionsDisposable.dispose();
      this.tabsContainer.setRightActionsElement(void 0);
    }
    if (this.accessor.options.createLeftHeaderActionComponent) {
      this._leftHeaderActions = this.accessor.options.createLeftHeaderActionComponent(this.groupPanel);
      this._leftHeaderActionsDisposable.value = this._leftHeaderActions;
      this._leftHeaderActions.init({
        containerApi: this._api,
        api: this.groupPanel.api,
        group: this.groupPanel
      });
      this.tabsContainer.setLeftActionsElement(this._leftHeaderActions.element);
    } else {
      this._leftHeaderActions = void 0;
      this._leftHeaderActionsDisposable.dispose();
      this.tabsContainer.setLeftActionsElement(void 0);
    }
    if (this.accessor.options.createPrefixHeaderActionComponent) {
      this._prefixHeaderActions = this.accessor.options.createPrefixHeaderActionComponent(this.groupPanel);
      this._prefixHeaderActionsDisposable.value = this._prefixHeaderActions;
      this._prefixHeaderActions.init({
        containerApi: this._api,
        api: this.groupPanel.api,
        group: this.groupPanel
      });
      this.tabsContainer.setPrefixActionsElement(this._prefixHeaderActions.element);
    } else {
      this._prefixHeaderActions = void 0;
      this._prefixHeaderActionsDisposable.dispose();
      this.tabsContainer.setPrefixActionsElement(void 0);
    }
  }
  rerender(panel) {
    this.contentContainer.renderPanel(panel, { asActive: false });
  }
  indexOf(panel) {
    return this.tabsContainer.indexOf(panel.id);
  }
  toJSON() {
    var _a;
    const result = {
      views: this.tabsContainer.panels,
      activeView: (_a = this._activePanel) === null || _a === void 0 ? void 0 : _a.id,
      id: this.id
    };
    if (this.locked !== false) {
      result.locked = this.locked;
    }
    if (this.header.hidden) {
      result.hideHeader = true;
    }
    if (this.headerPosition !== "top") {
      result.headerPosition = this.headerPosition;
    }
    return result;
  }
  moveToNext(options) {
    if (!options) {
      options = {};
    }
    if (!options.panel) {
      options.panel = this.activePanel;
    }
    const index = options.panel ? this.panels.indexOf(options.panel) : -1;
    let normalizedIndex;
    if (index < this.panels.length - 1) {
      normalizedIndex = index + 1;
    } else if (!options.suppressRoll) {
      normalizedIndex = 0;
    } else {
      return;
    }
    this.openPanel(this.panels[normalizedIndex]);
  }
  moveToPrevious(options) {
    if (!options) {
      options = {};
    }
    if (!options.panel) {
      options.panel = this.activePanel;
    }
    if (!options.panel) {
      return;
    }
    const index = this.panels.indexOf(options.panel);
    let normalizedIndex;
    if (index > 0) {
      normalizedIndex = index - 1;
    } else if (!options.suppressRoll) {
      normalizedIndex = this.panels.length - 1;
    } else {
      return;
    }
    this.openPanel(this.panels[normalizedIndex]);
  }
  containsPanel(panel) {
    return this.panels.includes(panel);
  }
  init(_params) {
  }
  update(_params) {
  }
  focus() {
    var _a;
    (_a = this._activePanel) === null || _a === void 0 ? void 0 : _a.focus();
  }
  openPanel(panel, options = {}) {
    if (typeof options.index !== "number" || options.index > this.panels.length) {
      options.index = this.panels.length;
    }
    const skipSetActive = !!options.skipSetActive;
    panel.updateParentGroup(this.groupPanel, {
      skipSetActive: options.skipSetActive
    });
    this.doAddPanel(panel, options.index, {
      skipSetActive
    });
    if (this._activePanel === panel) {
      this.contentContainer.renderPanel(panel, { asActive: true });
      return;
    }
    if (!skipSetActive) {
      this.doSetActivePanel(panel);
    }
    if (!options.skipSetGroupActive) {
      this.accessor.doSetGroupActive(this.groupPanel);
    }
    if (!options.skipSetActive) {
      this.updateContainer();
    }
  }
  removePanel(groupItemOrId, options = {
    skipSetActive: false
  }) {
    const id = typeof groupItemOrId === "string" ? groupItemOrId : groupItemOrId.id;
    const panelToRemove = this._panels.find((panel) => panel.id === id);
    if (!panelToRemove) {
      throw new Error("invalid operation");
    }
    return this._removePanel(panelToRemove, options);
  }
  closeAllPanels() {
    if (this.panels.length > 0) {
      const arrPanelCpy = [...this.panels];
      for (const panel of arrPanelCpy) {
        this.doClose(panel);
      }
    } else {
      this.accessor.removeGroup(this.groupPanel);
    }
  }
  closePanel(panel) {
    this.doClose(panel);
  }
  doClose(panel) {
    const isLast = this.panels.length === 1 && this.accessor.groups.length === 1;
    this.accessor.removePanel(panel, isLast && this.accessor.options.noPanelsOverlay === "emptyGroup" ? { removeEmptyGroup: false } : void 0);
  }
  isPanelActive(panel) {
    return this._activePanel === panel;
  }
  updateActions(element) {
    this.tabsContainer.setRightActionsElement(element);
  }
  setActive(isGroupActive, force = false) {
    if (!force && this.isActive === isGroupActive) {
      return;
    }
    this._isGroupActive = isGroupActive;
    toggleClass(this.container, "dv-active-group", isGroupActive);
    toggleClass(this.container, "dv-inactive-group", !isGroupActive);
    this.tabsContainer.setActive(this.isActive);
    if (!this._activePanel && this.panels.length > 0) {
      this.doSetActivePanel(this.panels[0]);
    }
    this.updateContainer();
  }
  layout(width, height) {
    var _a;
    this._width = width;
    this._height = height;
    this.contentContainer.layout(this._width, this._height);
    if ((_a = this._activePanel) === null || _a === void 0 ? void 0 : _a.layout) {
      this._activePanel.layout(this._width, this._height);
    }
  }
  _removePanel(panel, options) {
    const isActivePanel = this._activePanel === panel;
    this.doRemovePanel(panel);
    if (isActivePanel && this.panels.length > 0) {
      const nextPanel = this.mostRecentlyUsed[0];
      this.openPanel(nextPanel, {
        skipSetActive: options.skipSetActive,
        skipSetGroupActive: options.skipSetActiveGroup
      });
    }
    if (this._activePanel && this.panels.length === 0) {
      this.doSetActivePanel(void 0);
    }
    if (!options.skipSetActive) {
      this.updateContainer();
    }
    return panel;
  }
  doRemovePanel(panel) {
    const index = this.panels.indexOf(panel);
    if (this._activePanel === panel) {
      this.contentContainer.closePanel();
    }
    this.tabsContainer.delete(panel.id);
    this._panels.splice(index, 1);
    if (this.mostRecentlyUsed.includes(panel)) {
      const index2 = this.mostRecentlyUsed.indexOf(panel);
      this.mostRecentlyUsed.splice(index2, 1);
    }
    const disposable = this._panelDisposables.get(panel.id);
    if (disposable) {
      disposable.dispose();
      this._panelDisposables.delete(panel.id);
    }
    this._onDidRemovePanel.fire({ panel });
  }
  doAddPanel(panel, index = this.panels.length, options = { skipSetActive: false }) {
    const existingPanel = this._panels.indexOf(panel);
    const hasExistingPanel = existingPanel > -1;
    this.tabsContainer.show();
    this.contentContainer.show();
    this.tabsContainer.openPanel(panel, index);
    if (!options.skipSetActive) {
      this.contentContainer.openPanel(panel);
    } else if (panel.api.renderer === "always") {
      this.contentContainer.renderPanel(panel, { asActive: false });
    }
    if (hasExistingPanel) {
      return;
    }
    this.updateMru(panel);
    this.panels.splice(index, 0, panel);
    this._panelDisposables.set(panel.id, new CompositeDisposable(panel.api.onDidTitleChange((event) => this._onDidPanelTitleChange.fire(event)), panel.api.onDidParametersChange((event) => this._onDidPanelParametersChange.fire(event))));
    this._onDidAddPanel.fire({ panel });
  }
  doSetActivePanel(panel) {
    if (this._activePanel === panel) {
      return;
    }
    this._activePanel = panel;
    if (panel) {
      this.tabsContainer.setActivePanel(panel);
      this.contentContainer.openPanel(panel);
      panel.layout(this._width, this._height);
      this.updateMru(panel);
      this.contentContainer.refreshFocusState();
      this._onDidActivePanelChange.fire({
        panel
      });
    }
  }
  updateMru(panel) {
    if (this.mostRecentlyUsed.includes(panel)) {
      this.mostRecentlyUsed.splice(this.mostRecentlyUsed.indexOf(panel), 1);
    }
    this.mostRecentlyUsed = [panel, ...this.mostRecentlyUsed];
  }
  updateContainer() {
    var _a, _b;
    this.panels.forEach((panel) => panel.runEvents());
    if (this.isEmpty && !this.watermark) {
      const watermark = this.accessor.createWatermarkComponent();
      watermark.init({
        containerApi: this._api,
        group: this.groupPanel
      });
      this.watermark = watermark;
      addDisposableListener(this.watermark.element, "pointerdown", () => {
        if (!this.isActive) {
          this.accessor.doSetGroupActive(this.groupPanel);
        }
      });
      this.contentContainer.element.appendChild(this.watermark.element);
    }
    if (!this.isEmpty && this.watermark) {
      this.watermark.element.remove();
      (_b = (_a = this.watermark).dispose) === null || _b === void 0 ? void 0 : _b.call(_a);
      this.watermark = void 0;
    }
  }
  canDisplayOverlay(event, position, target) {
    const firedEvent = new DockviewUnhandledDragOverEvent(event, target, position, getPanelData, this.accessor.getPanel(this.id));
    this._onUnhandledDragOverEvent.fire(firedEvent);
    return firedEvent.isAccepted;
  }
  handleDropEvent(type, event, position, index) {
    if (this.locked === "no-drop-target") {
      return;
    }
    function getKind() {
      switch (type) {
        case "header":
          return typeof index === "number" ? "tab" : "header_space";
        case "content":
          return "content";
      }
    }
    const panel = typeof index === "number" ? this.panels[index] : void 0;
    const willDropEvent = new DockviewWillDropEvent({
      nativeEvent: event,
      position,
      panel,
      getData: () => getPanelData(),
      kind: getKind(),
      group: this.groupPanel,
      api: this._api
    });
    this._onWillDrop.fire(willDropEvent);
    if (willDropEvent.defaultPrevented) {
      return;
    }
    const data = getPanelData();
    if (data && data.viewId === this.accessor.id) {
      if (type === "content") {
        if (data.groupId === this.id) {
          if (position === "center") {
            return;
          }
          if (data.panelId === null) {
            return;
          }
        }
      }
      if (type === "header") {
        if (data.groupId === this.id) {
          if (data.panelId === null) {
            return;
          }
        }
      }
      if (data.panelId === null) {
        const { groupId: groupId2 } = data;
        this._onMove.fire({
          target: position,
          groupId: groupId2,
          index
        });
        return;
      }
      const fromSameGroup = this.tabsContainer.indexOf(data.panelId) !== -1;
      if (fromSameGroup && this.tabsContainer.size === 1) {
        return;
      }
      const { groupId, panelId } = data;
      const isSameGroup = this.id === groupId;
      if (isSameGroup && !position) {
        const oldIndex = this.tabsContainer.indexOf(panelId);
        if (oldIndex === index) {
          return;
        }
      }
      this._onMove.fire({
        target: position,
        groupId: data.groupId,
        itemId: data.panelId,
        index
      });
    } else {
      this._onDidDrop.fire(new DockviewDidDropEvent({
        nativeEvent: event,
        position,
        panel,
        getData: () => getPanelData(),
        group: this.groupPanel,
        api: this._api
      }));
    }
  }
  updateDragAndDropState() {
    this.tabsContainer.updateDragAndDropState();
  }
  dispose() {
    var _a, _b, _c;
    super.dispose();
    (_a = this.watermark) === null || _a === void 0 ? void 0 : _a.element.remove();
    (_c = (_b = this.watermark) === null || _b === void 0 ? void 0 : _b.dispose) === null || _c === void 0 ? void 0 : _c.call(_b);
    this.watermark = void 0;
    for (const panel of this.panels) {
      panel.dispose();
    }
    this.tabsContainer.dispose();
    this.contentContainer.dispose();
  }
}
class GridviewPanelApiImpl extends PanelApiImpl {
  constructor(id, component, panel) {
    super(id, component);
    this._onDidConstraintsChangeInternal = new Emitter();
    this.onDidConstraintsChangeInternal = this._onDidConstraintsChangeInternal.event;
    this._onDidConstraintsChange = new Emitter();
    this.onDidConstraintsChange = this._onDidConstraintsChange.event;
    this._onDidSizeChange = new Emitter();
    this.onDidSizeChange = this._onDidSizeChange.event;
    this.addDisposables(this._onDidConstraintsChangeInternal, this._onDidConstraintsChange, this._onDidSizeChange);
    if (panel) {
      this.initialize(panel);
    }
  }
  setConstraints(value) {
    this._onDidConstraintsChangeInternal.fire(value);
  }
  setSize(event) {
    this._onDidSizeChange.fire(event);
  }
}
class GridviewPanel extends BasePanelView {
  get priority() {
    return this._priority;
  }
  get snap() {
    return this._snap;
  }
  get minimumWidth() {
    return this.__minimumWidth();
  }
  get minimumHeight() {
    return this.__minimumHeight();
  }
  get maximumHeight() {
    return this.__maximumHeight();
  }
  get maximumWidth() {
    return this.__maximumWidth();
  }
  __minimumWidth() {
    const width = typeof this._minimumWidth === "function" ? this._minimumWidth() : this._minimumWidth;
    if (width !== this._evaluatedMinimumWidth) {
      this._evaluatedMinimumWidth = width;
      this.updateConstraints();
    }
    return width;
  }
  __maximumWidth() {
    const width = typeof this._maximumWidth === "function" ? this._maximumWidth() : this._maximumWidth;
    if (width !== this._evaluatedMaximumWidth) {
      this._evaluatedMaximumWidth = width;
      this.updateConstraints();
    }
    return width;
  }
  __minimumHeight() {
    const height = typeof this._minimumHeight === "function" ? this._minimumHeight() : this._minimumHeight;
    if (height !== this._evaluatedMinimumHeight) {
      this._evaluatedMinimumHeight = height;
      this.updateConstraints();
    }
    return height;
  }
  __maximumHeight() {
    const height = typeof this._maximumHeight === "function" ? this._maximumHeight() : this._maximumHeight;
    if (height !== this._evaluatedMaximumHeight) {
      this._evaluatedMaximumHeight = height;
      this.updateConstraints();
    }
    return height;
  }
  get isActive() {
    return this.api.isActive;
  }
  get isVisible() {
    return this.api.isVisible;
  }
  constructor(id, component, options, api) {
    super(id, component, api !== null && api !== void 0 ? api : new GridviewPanelApiImpl(id, component));
    this._evaluatedMinimumWidth = 0;
    this._evaluatedMaximumWidth = Number.MAX_SAFE_INTEGER;
    this._evaluatedMinimumHeight = 0;
    this._evaluatedMaximumHeight = Number.MAX_SAFE_INTEGER;
    this._minimumWidth = 0;
    this._minimumHeight = 0;
    this._maximumWidth = Number.MAX_SAFE_INTEGER;
    this._maximumHeight = Number.MAX_SAFE_INTEGER;
    this._snap = false;
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    if (typeof (options === null || options === void 0 ? void 0 : options.minimumWidth) === "number") {
      this._minimumWidth = options.minimumWidth;
    }
    if (typeof (options === null || options === void 0 ? void 0 : options.maximumWidth) === "number") {
      this._maximumWidth = options.maximumWidth;
    }
    if (typeof (options === null || options === void 0 ? void 0 : options.minimumHeight) === "number") {
      this._minimumHeight = options.minimumHeight;
    }
    if (typeof (options === null || options === void 0 ? void 0 : options.maximumHeight) === "number") {
      this._maximumHeight = options.maximumHeight;
    }
    this.api.initialize(this);
    this.addDisposables(this.api.onWillVisibilityChange((event) => {
      const { isVisible } = event;
      const { accessor } = this._params;
      accessor.setVisible(this, isVisible);
    }), this.api.onActiveChange(() => {
      const { accessor } = this._params;
      accessor.doSetGroupActive(this);
    }), this.api.onDidConstraintsChangeInternal((event) => {
      if (typeof event.minimumWidth === "number" || typeof event.minimumWidth === "function") {
        this._minimumWidth = event.minimumWidth;
      }
      if (typeof event.minimumHeight === "number" || typeof event.minimumHeight === "function") {
        this._minimumHeight = event.minimumHeight;
      }
      if (typeof event.maximumWidth === "number" || typeof event.maximumWidth === "function") {
        this._maximumWidth = event.maximumWidth;
      }
      if (typeof event.maximumHeight === "number" || typeof event.maximumHeight === "function") {
        this._maximumHeight = event.maximumHeight;
      }
    }), this.api.onDidSizeChange((event) => {
      this._onDidChange.fire({
        height: event.height,
        width: event.width
      });
    }), this._onDidChange);
  }
  setVisible(isVisible) {
    this.api._onDidVisibilityChange.fire({ isVisible });
  }
  setActive(isActive) {
    this.api._onDidActiveChange.fire({ isActive });
  }
  init(parameters) {
    if (parameters.maximumHeight) {
      this._maximumHeight = parameters.maximumHeight;
    }
    if (parameters.minimumHeight) {
      this._minimumHeight = parameters.minimumHeight;
    }
    if (parameters.maximumWidth) {
      this._maximumWidth = parameters.maximumWidth;
    }
    if (parameters.minimumWidth) {
      this._minimumWidth = parameters.minimumWidth;
    }
    this._priority = parameters.priority;
    this._snap = !!parameters.snap;
    super.init(parameters);
    if (typeof parameters.isVisible === "boolean") {
      this.setVisible(parameters.isVisible);
    }
  }
  updateConstraints() {
    this.api._onDidConstraintsChange.fire({
      minimumWidth: this._evaluatedMinimumWidth,
      maximumWidth: this._evaluatedMaximumWidth,
      minimumHeight: this._evaluatedMinimumHeight,
      maximumHeight: this._evaluatedMaximumHeight
    });
  }
  toJSON() {
    const state = super.toJSON();
    const maximum = (value) => value === Number.MAX_SAFE_INTEGER ? void 0 : value;
    const minimum = (value) => value <= 0 ? void 0 : value;
    return Object.assign(Object.assign({}, state), { minimumHeight: minimum(this.minimumHeight), maximumHeight: maximum(this.maximumHeight), minimumWidth: minimum(this.minimumWidth), maximumWidth: maximum(this.maximumWidth), snap: this.snap, priority: this.priority });
  }
}
const NOT_INITIALIZED_MESSAGE = "dockview: DockviewGroupPanelApiImpl not initialized";
class DockviewGroupPanelApiImpl extends GridviewPanelApiImpl {
  get location() {
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    return this._group.model.location;
  }
  constructor(id, accessor) {
    super(id, "__dockviewgroup__");
    this.accessor = accessor;
    this._onDidLocationChange = new Emitter();
    this.onDidLocationChange = this._onDidLocationChange.event;
    this._onDidActivePanelChange = new Emitter();
    this.onDidActivePanelChange = this._onDidActivePanelChange.event;
    this.addDisposables(this._onDidLocationChange, this._onDidActivePanelChange, this._onDidVisibilityChange.event((event) => {
      if (event.isVisible && this._pendingSize) {
        super.setSize(this._pendingSize);
        this._pendingSize = void 0;
      }
    }));
  }
  setSize(event) {
    this._pendingSize = Object.assign({}, event);
    super.setSize(event);
  }
  close() {
    if (!this._group) {
      return;
    }
    return this.accessor.removeGroup(this._group);
  }
  getWindow() {
    return this.location.type === "popout" ? this.location.getWindow() : window;
  }
  setHeaderPosition(position) {
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    this._group.model.headerPosition = position;
  }
  getHeaderPosition() {
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    return this._group.model.headerPosition;
  }
  moveTo(options) {
    var _a, _b, _c, _d;
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    const group = (_a = options.group) !== null && _a !== void 0 ? _a : this.accessor.addGroup({
      direction: positionToDirection((_b = options.position) !== null && _b !== void 0 ? _b : "right"),
      skipSetActive: (_c = options.skipSetActive) !== null && _c !== void 0 ? _c : false
    });
    this.accessor.moveGroupOrPanel({
      from: { groupId: this._group.id },
      to: {
        group,
        position: options.group ? (_d = options.position) !== null && _d !== void 0 ? _d : "center" : "center",
        index: options.index
      },
      skipSetActive: options.skipSetActive
    });
  }
  maximize() {
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    if (this.location.type !== "grid") {
      return;
    }
    this.accessor.maximizeGroup(this._group);
  }
  isMaximized() {
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    return this.accessor.isMaximizedGroup(this._group);
  }
  exitMaximized() {
    if (!this._group) {
      throw new Error(NOT_INITIALIZED_MESSAGE);
    }
    if (this.isMaximized()) {
      this.accessor.exitMaximizedGroup();
    }
  }
  initialize(group) {
    this._group = group;
  }
}
const MINIMUM_DOCKVIEW_GROUP_PANEL_WIDTH = 100;
const MINIMUM_DOCKVIEW_GROUP_PANEL_HEIGHT = 100;
class DockviewGroupPanel extends GridviewPanel {
  get minimumWidth() {
    var _a;
    if (typeof this._explicitConstraints.minimumWidth === "number") {
      return this._explicitConstraints.minimumWidth;
    }
    const activePanelMinimumWidth = (_a = this.activePanel) === null || _a === void 0 ? void 0 : _a.minimumWidth;
    if (typeof activePanelMinimumWidth === "number") {
      return activePanelMinimumWidth;
    }
    return super.__minimumWidth();
  }
  get minimumHeight() {
    var _a;
    if (typeof this._explicitConstraints.minimumHeight === "number") {
      return this._explicitConstraints.minimumHeight;
    }
    const activePanelMinimumHeight = (_a = this.activePanel) === null || _a === void 0 ? void 0 : _a.minimumHeight;
    if (typeof activePanelMinimumHeight === "number") {
      return activePanelMinimumHeight;
    }
    return super.__minimumHeight();
  }
  get maximumWidth() {
    var _a;
    if (typeof this._explicitConstraints.maximumWidth === "number") {
      return this._explicitConstraints.maximumWidth;
    }
    const activePanelMaximumWidth = (_a = this.activePanel) === null || _a === void 0 ? void 0 : _a.maximumWidth;
    if (typeof activePanelMaximumWidth === "number") {
      return activePanelMaximumWidth;
    }
    return super.__maximumWidth();
  }
  get maximumHeight() {
    var _a;
    if (typeof this._explicitConstraints.maximumHeight === "number") {
      return this._explicitConstraints.maximumHeight;
    }
    const activePanelMaximumHeight = (_a = this.activePanel) === null || _a === void 0 ? void 0 : _a.maximumHeight;
    if (typeof activePanelMaximumHeight === "number") {
      return activePanelMaximumHeight;
    }
    return super.__maximumHeight();
  }
  get panels() {
    return this._model.panels;
  }
  get activePanel() {
    return this._model.activePanel;
  }
  get size() {
    return this._model.size;
  }
  get model() {
    return this._model;
  }
  get locked() {
    return this._model.locked;
  }
  set locked(value) {
    this._model.locked = value;
  }
  get header() {
    return this._model.header;
  }
  constructor(accessor, id, options) {
    var _a, _b, _c, _d, _e, _f;
    super(id, "groupview_default", {
      minimumHeight: (_b = (_a = options.constraints) === null || _a === void 0 ? void 0 : _a.minimumHeight) !== null && _b !== void 0 ? _b : MINIMUM_DOCKVIEW_GROUP_PANEL_HEIGHT,
      minimumWidth: (_d = (_c = options.constraints) === null || _c === void 0 ? void 0 : _c.minimumWidth) !== null && _d !== void 0 ? _d : MINIMUM_DOCKVIEW_GROUP_PANEL_WIDTH,
      maximumHeight: (_e = options.constraints) === null || _e === void 0 ? void 0 : _e.maximumHeight,
      maximumWidth: (_f = options.constraints) === null || _f === void 0 ? void 0 : _f.maximumWidth
    }, new DockviewGroupPanelApiImpl(id, accessor));
    this._explicitConstraints = {};
    this.api.initialize(this);
    this._model = new DockviewGroupPanelModel(this.element, accessor, id, options, this);
    this.addDisposables(this.model.onDidActivePanelChange((event) => {
      this.api._onDidActivePanelChange.fire(event);
    }), this.api.onDidConstraintsChangeInternal((event) => {
      if (event.minimumWidth !== void 0) {
        this._explicitConstraints.minimumWidth = typeof event.minimumWidth === "function" ? event.minimumWidth() : event.minimumWidth;
      }
      if (event.minimumHeight !== void 0) {
        this._explicitConstraints.minimumHeight = typeof event.minimumHeight === "function" ? event.minimumHeight() : event.minimumHeight;
      }
      if (event.maximumWidth !== void 0) {
        this._explicitConstraints.maximumWidth = typeof event.maximumWidth === "function" ? event.maximumWidth() : event.maximumWidth;
      }
      if (event.maximumHeight !== void 0) {
        this._explicitConstraints.maximumHeight = typeof event.maximumHeight === "function" ? event.maximumHeight() : event.maximumHeight;
      }
    }));
  }
  focus() {
    if (!this.api.isActive) {
      this.api.setActive();
    }
    super.focus();
  }
  initialize() {
    this._model.initialize();
  }
  setActive(isActive) {
    super.setActive(isActive);
    this.model.setActive(isActive);
  }
  layout(width, height) {
    super.layout(width, height);
    this.model.layout(width, height);
  }
  getComponent() {
    return this._model;
  }
  toJSON() {
    return this.model.toJSON();
  }
}
const themeAbyss = {
  className: "dockview-theme-abyss"
};
class DockviewPanelApiImpl extends GridviewPanelApiImpl {
  get location() {
    return this.group.api.location;
  }
  get title() {
    return this.panel.title;
  }
  get isGroupActive() {
    return this.group.isActive;
  }
  get renderer() {
    return this.panel.renderer;
  }
  set group(value) {
    const oldGroup = this._group;
    if (this._group !== value) {
      this._group = value;
      this._onDidGroupChange.fire({});
      this.setupGroupEventListeners(oldGroup);
      this._onDidLocationChange.fire({
        location: this.group.api.location
      });
    }
  }
  get group() {
    return this._group;
  }
  get tabComponent() {
    return this._tabComponent;
  }
  constructor(panel, group, accessor, component, tabComponent) {
    super(panel.id, component);
    this.panel = panel;
    this.accessor = accessor;
    this._onDidTitleChange = new Emitter();
    this.onDidTitleChange = this._onDidTitleChange.event;
    this._onDidActiveGroupChange = new Emitter();
    this.onDidActiveGroupChange = this._onDidActiveGroupChange.event;
    this._onDidGroupChange = new Emitter();
    this.onDidGroupChange = this._onDidGroupChange.event;
    this._onDidRendererChange = new Emitter();
    this.onDidRendererChange = this._onDidRendererChange.event;
    this._onDidLocationChange = new Emitter();
    this.onDidLocationChange = this._onDidLocationChange.event;
    this.groupEventsDisposable = new MutableDisposable();
    this._tabComponent = tabComponent;
    this.initialize(panel);
    this._group = group;
    this.setupGroupEventListeners();
    this.addDisposables(this.groupEventsDisposable, this._onDidRendererChange, this._onDidTitleChange, this._onDidGroupChange, this._onDidActiveGroupChange, this._onDidLocationChange);
  }
  getWindow() {
    return this.group.api.getWindow();
  }
  moveTo(options) {
    var _a, _b;
    this.accessor.moveGroupOrPanel({
      from: { groupId: this._group.id, panelId: this.panel.id },
      to: {
        group: (_a = options.group) !== null && _a !== void 0 ? _a : this._group,
        position: options.group ? (_b = options.position) !== null && _b !== void 0 ? _b : "center" : "center",
        index: options.index
      },
      skipSetActive: options.skipSetActive
    });
  }
  setTitle(title) {
    this.panel.setTitle(title);
  }
  setRenderer(renderer2) {
    this.panel.setRenderer(renderer2);
  }
  close() {
    this.group.model.closePanel(this.panel);
  }
  maximize() {
    this.group.api.maximize();
  }
  isMaximized() {
    return this.group.api.isMaximized();
  }
  exitMaximized() {
    this.group.api.exitMaximized();
  }
  setupGroupEventListeners(previousGroup) {
    var _a;
    let _trackGroupActive = (_a = previousGroup === null || previousGroup === void 0 ? void 0 : previousGroup.isActive) !== null && _a !== void 0 ? _a : false;
    this.groupEventsDisposable.value = new CompositeDisposable(this.group.api.onDidVisibilityChange((event) => {
      const hasBecomeHidden = !event.isVisible && this.isVisible;
      const hasBecomeVisible = event.isVisible && !this.isVisible;
      const isActivePanel = this.group.model.isPanelActive(this.panel);
      if (hasBecomeHidden || hasBecomeVisible && isActivePanel) {
        this._onDidVisibilityChange.fire(event);
      }
    }), this.group.api.onDidLocationChange((event) => {
      if (this.group !== this.panel.group) {
        return;
      }
      this._onDidLocationChange.fire(event);
    }), this.group.api.onDidActiveChange(() => {
      if (this.group !== this.panel.group) {
        return;
      }
      if (_trackGroupActive !== this.isGroupActive) {
        _trackGroupActive = this.isGroupActive;
        this._onDidActiveGroupChange.fire({
          isActive: this.isGroupActive
        });
      }
    }));
  }
}
class DockviewPanel extends CompositeDisposable {
  get params() {
    return this._params;
  }
  get title() {
    return this._title;
  }
  get group() {
    return this._group;
  }
  get renderer() {
    var _a;
    return (_a = this._renderer) !== null && _a !== void 0 ? _a : this.accessor.renderer;
  }
  get minimumWidth() {
    return this._minimumWidth;
  }
  get minimumHeight() {
    return this._minimumHeight;
  }
  get maximumWidth() {
    return this._maximumWidth;
  }
  get maximumHeight() {
    return this._maximumHeight;
  }
  constructor(id, component, tabComponent, accessor, containerApi, group, view, options) {
    super();
    this.id = id;
    this.accessor = accessor;
    this.containerApi = containerApi;
    this.view = view;
    this._renderer = options.renderer;
    this._group = group;
    this._minimumWidth = options.minimumWidth;
    this._minimumHeight = options.minimumHeight;
    this._maximumWidth = options.maximumWidth;
    this._maximumHeight = options.maximumHeight;
    this.api = new DockviewPanelApiImpl(this, this._group, accessor, component, tabComponent);
    this.addDisposables(this.api.onActiveChange(() => {
      accessor.setActivePanel(this);
    }), this.api.onDidSizeChange((event) => {
      this.group.api.setSize(event);
    }), this.api.onDidRendererChange(() => {
      this.group.model.rerender(this);
    }));
  }
  init(params) {
    this._params = params.params;
    this.view.init(Object.assign(Object.assign({}, params), { api: this.api, containerApi: this.containerApi }));
    this.setTitle(params.title);
  }
  focus() {
    const event = new WillFocusEvent();
    this.api._onWillFocus.fire(event);
    if (event.defaultPrevented) {
      return;
    }
    if (!this.api.isActive) {
      this.api.setActive();
    }
  }
  toJSON() {
    return {
      id: this.id,
      contentComponent: this.view.contentComponent,
      tabComponent: this.view.tabComponent,
      params: Object.keys(this._params || {}).length > 0 ? this._params : void 0,
      title: this.title,
      renderer: this._renderer,
      minimumHeight: this._minimumHeight,
      maximumHeight: this._maximumHeight,
      minimumWidth: this._minimumWidth,
      maximumWidth: this._maximumWidth
    };
  }
  setTitle(title) {
    const didTitleChange = title !== this.title;
    if (didTitleChange) {
      this._title = title;
      this.api._onDidTitleChange.fire({ title });
    }
  }
  setRenderer(renderer2) {
    const didChange = renderer2 !== this.renderer;
    if (didChange) {
      this._renderer = renderer2;
      this.api._onDidRendererChange.fire({
        renderer: renderer2
      });
    }
  }
  update(event) {
    var _a;
    this._params = Object.assign(Object.assign({}, (_a = this._params) !== null && _a !== void 0 ? _a : {}), event.params);
    for (const key of Object.keys(event.params)) {
      if (event.params[key] === void 0) {
        delete this._params[key];
      }
    }
    this.view.update({
      params: this._params
    });
  }
  updateFromStateModel(state) {
    var _a, _b, _c;
    this._maximumHeight = state.maximumHeight;
    this._minimumHeight = state.minimumHeight;
    this._maximumWidth = state.maximumWidth;
    this._minimumWidth = state.minimumWidth;
    this.update({ params: (_a = state.params) !== null && _a !== void 0 ? _a : {} });
    this.setTitle((_b = state.title) !== null && _b !== void 0 ? _b : this.id);
    this.setRenderer((_c = state.renderer) !== null && _c !== void 0 ? _c : this.accessor.renderer);
  }
  updateParentGroup(group, options) {
    this._group = group;
    this.api.group = this._group;
    const isPanelVisible = this._group.model.isPanelActive(this);
    const isActive = this.group.api.isActive && isPanelVisible;
    if (!(options === null || options === void 0 ? void 0 : options.skipSetActive)) {
      if (this.api.isActive !== isActive) {
        this.api._onDidActiveChange.fire({
          isActive: this.group.api.isActive && isPanelVisible
        });
      }
    }
    if (this.api.isVisible !== isPanelVisible) {
      this.api._onDidVisibilityChange.fire({
        isVisible: isPanelVisible
      });
    }
  }
  runEvents() {
    const isPanelVisible = this._group.model.isPanelActive(this);
    const isActive = this.group.api.isActive && isPanelVisible;
    if (this.api.isActive !== isActive) {
      this.api._onDidActiveChange.fire({
        isActive: this.group.api.isActive && isPanelVisible
      });
    }
    if (this.api.isVisible !== isPanelVisible) {
      this.api._onDidVisibilityChange.fire({
        isVisible: isPanelVisible
      });
    }
  }
  layout(width, height) {
    this.api._onDidDimensionChange.fire({
      width,
      height
    });
    this.view.layout(width, height);
  }
  dispose() {
    this.api.dispose();
    this.view.dispose();
  }
}
class DefaultTab extends CompositeDisposable {
  get element() {
    return this._element;
  }
  constructor() {
    super();
    this._element = document.createElement("div");
    this._element.className = "dv-default-tab";
    this._content = document.createElement("div");
    this._content.className = "dv-default-tab-content";
    this.action = document.createElement("div");
    this.action.className = "dv-default-tab-action";
    this.action.appendChild(createCloseButton());
    this._element.appendChild(this._content);
    this._element.appendChild(this.action);
    this.render();
  }
  init(params) {
    this._title = params.title;
    this.addDisposables(params.api.onDidTitleChange((event) => {
      this._title = event.title;
      this.render();
    }), addDisposableListener(this.action, "pointerdown", (ev) => {
      ev.preventDefault();
    }), addDisposableListener(this.action, "click", (ev) => {
      if (ev.defaultPrevented) {
        return;
      }
      ev.preventDefault();
      params.api.close();
    }));
    this.render();
  }
  render() {
    var _a;
    if (this._content.textContent !== this._title) {
      this._content.textContent = (_a = this._title) !== null && _a !== void 0 ? _a : "";
    }
  }
}
class DockviewPanelModel {
  get content() {
    return this._content;
  }
  get tab() {
    return this._tab;
  }
  constructor(accessor, id, contentComponent, tabComponent) {
    this.accessor = accessor;
    this.id = id;
    this.contentComponent = contentComponent;
    this.tabComponent = tabComponent;
    this._content = this.createContentComponent(this.id, contentComponent);
    this._tab = this.createTabComponent(this.id, tabComponent);
  }
  createTabRenderer(tabLocation) {
    var _a;
    const cmp = this.createTabComponent(this.id, this.tabComponent);
    if (this._params) {
      cmp.init(Object.assign(Object.assign({}, this._params), { tabLocation }));
    }
    if (this._updateEvent) {
      (_a = cmp.update) === null || _a === void 0 ? void 0 : _a.call(cmp, this._updateEvent);
    }
    return cmp;
  }
  init(params) {
    this._params = params;
    this.content.init(params);
    this.tab.init(Object.assign(Object.assign({}, params), { tabLocation: "header" }));
  }
  layout(width, height) {
    var _a, _b;
    (_b = (_a = this.content).layout) === null || _b === void 0 ? void 0 : _b.call(_a, width, height);
  }
  update(event) {
    var _a, _b, _c, _d;
    this._updateEvent = event;
    (_b = (_a = this.content).update) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    (_d = (_c = this.tab).update) === null || _d === void 0 ? void 0 : _d.call(_c, event);
  }
  dispose() {
    var _a, _b, _c, _d;
    (_b = (_a = this.content).dispose) === null || _b === void 0 ? void 0 : _b.call(_a);
    (_d = (_c = this.tab).dispose) === null || _d === void 0 ? void 0 : _d.call(_c);
  }
  createContentComponent(id, componentName) {
    return this.accessor.options.createComponent({
      id,
      name: componentName
    });
  }
  createTabComponent(id, componentName) {
    const name = componentName !== null && componentName !== void 0 ? componentName : this.accessor.options.defaultTabComponent;
    if (name) {
      if (this.accessor.options.createTabComponent) {
        const component = this.accessor.options.createTabComponent({
          id,
          name
        });
        if (component) {
          return component;
        } else {
          return new DefaultTab();
        }
      }
      console.warn(`dockview: tabComponent '${componentName}' was not found. falling back to the default tab.`);
    }
    return new DefaultTab();
  }
}
class DefaultDockviewDeserialzier {
  constructor(accessor) {
    this.accessor = accessor;
  }
  fromJSON(panelData, group) {
    var _a, _b;
    const panelId = panelData.id;
    const params = panelData.params;
    const title = panelData.title;
    const viewData = panelData.view;
    const contentComponent = viewData ? viewData.content.id : (_a = panelData.contentComponent) !== null && _a !== void 0 ? _a : "unknown";
    const tabComponent = viewData ? (_b = viewData.tab) === null || _b === void 0 ? void 0 : _b.id : panelData.tabComponent;
    const view = new DockviewPanelModel(this.accessor, panelId, contentComponent, tabComponent);
    const panel = new DockviewPanel(panelId, contentComponent, tabComponent, this.accessor, new DockviewApi(this.accessor), group, view, {
      renderer: panelData.renderer,
      minimumWidth: panelData.minimumWidth,
      minimumHeight: panelData.minimumHeight,
      maximumWidth: panelData.maximumWidth,
      maximumHeight: panelData.maximumHeight
    });
    panel.init({
      title: title !== null && title !== void 0 ? title : panelId,
      params: params !== null && params !== void 0 ? params : {}
    });
    return panel;
  }
}
class Watermark extends CompositeDisposable {
  get element() {
    return this._element;
  }
  constructor() {
    super();
    this._element = document.createElement("div");
    this._element.className = "dv-watermark";
  }
  init(_params) {
  }
}
class AriaLevelTracker {
  constructor() {
    this._orderedList = [];
  }
  push(element) {
    this._orderedList = [
      ...this._orderedList.filter((item) => item !== element),
      element
    ];
    this.update();
  }
  destroy(element) {
    this._orderedList = this._orderedList.filter((item) => item !== element);
    this.update();
  }
  update() {
    for (let i = 0; i < this._orderedList.length; i++) {
      this._orderedList[i].setAttribute("aria-level", `${i}`);
      this._orderedList[i].style.zIndex = `calc(var(--dv-overlay-z-index, 999) + ${i * 2})`;
    }
  }
}
const arialLevelTracker = new AriaLevelTracker();
class Overlay extends CompositeDisposable {
  set minimumInViewportWidth(value) {
    this.options.minimumInViewportWidth = value;
  }
  set minimumInViewportHeight(value) {
    this.options.minimumInViewportHeight = value;
  }
  get element() {
    return this._element;
  }
  get isVisible() {
    return this._isVisible;
  }
  constructor(options) {
    super();
    this.options = options;
    this._element = document.createElement("div");
    this._onDidChange = new Emitter();
    this.onDidChange = this._onDidChange.event;
    this._onDidChangeEnd = new Emitter();
    this.onDidChangeEnd = this._onDidChangeEnd.event;
    this.addDisposables(this._onDidChange, this._onDidChangeEnd);
    this._element.className = "dv-resize-container";
    this._isVisible = true;
    this.setupResize("top");
    this.setupResize("bottom");
    this.setupResize("left");
    this.setupResize("right");
    this.setupResize("topleft");
    this.setupResize("topright");
    this.setupResize("bottomleft");
    this.setupResize("bottomright");
    this._element.appendChild(this.options.content);
    this.options.container.appendChild(this._element);
    this.setBounds(Object.assign(Object.assign(Object.assign(Object.assign({ height: this.options.height, width: this.options.width }, "top" in this.options && { top: this.options.top }), "bottom" in this.options && { bottom: this.options.bottom }), "left" in this.options && { left: this.options.left }), "right" in this.options && { right: this.options.right }));
    arialLevelTracker.push(this._element);
  }
  setVisible(isVisible) {
    if (isVisible === this.isVisible) {
      return;
    }
    this._isVisible = isVisible;
    toggleClass(this.element, "dv-hidden", !this.isVisible);
  }
  bringToFront() {
    arialLevelTracker.push(this._element);
  }
  setBounds(bounds = {}) {
    if (typeof bounds.height === "number") {
      this._element.style.height = `${bounds.height}px`;
    }
    if (typeof bounds.width === "number") {
      this._element.style.width = `${bounds.width}px`;
    }
    if ("top" in bounds && typeof bounds.top === "number") {
      this._element.style.top = `${bounds.top}px`;
      this._element.style.bottom = "auto";
      this.verticalAlignment = "top";
    }
    if ("bottom" in bounds && typeof bounds.bottom === "number") {
      this._element.style.bottom = `${bounds.bottom}px`;
      this._element.style.top = "auto";
      this.verticalAlignment = "bottom";
    }
    if ("left" in bounds && typeof bounds.left === "number") {
      this._element.style.left = `${bounds.left}px`;
      this._element.style.right = "auto";
      this.horiziontalAlignment = "left";
    }
    if ("right" in bounds && typeof bounds.right === "number") {
      this._element.style.right = `${bounds.right}px`;
      this._element.style.left = "auto";
      this.horiziontalAlignment = "right";
    }
    const containerRect = this.options.container.getBoundingClientRect();
    const overlayRect = this._element.getBoundingClientRect();
    const xOffset = Math.max(0, this.getMinimumWidth(overlayRect.width));
    const yOffset = Math.max(0, this.getMinimumHeight(overlayRect.height));
    if (this.verticalAlignment === "top") {
      const top = clamp(overlayRect.top - containerRect.top, -yOffset, Math.max(0, containerRect.height - overlayRect.height + yOffset));
      this._element.style.top = `${top}px`;
      this._element.style.bottom = "auto";
    }
    if (this.verticalAlignment === "bottom") {
      const bottom = clamp(containerRect.bottom - overlayRect.bottom, -yOffset, Math.max(0, containerRect.height - overlayRect.height + yOffset));
      this._element.style.bottom = `${bottom}px`;
      this._element.style.top = "auto";
    }
    if (this.horiziontalAlignment === "left") {
      const left = clamp(overlayRect.left - containerRect.left, -xOffset, Math.max(0, containerRect.width - overlayRect.width + xOffset));
      this._element.style.left = `${left}px`;
      this._element.style.right = "auto";
    }
    if (this.horiziontalAlignment === "right") {
      const right = clamp(containerRect.right - overlayRect.right, -xOffset, Math.max(0, containerRect.width - overlayRect.width + xOffset));
      this._element.style.right = `${right}px`;
      this._element.style.left = "auto";
    }
    this._onDidChange.fire();
  }
  toJSON() {
    const container = this.options.container.getBoundingClientRect();
    const element = this._element.getBoundingClientRect();
    const result = {};
    if (this.verticalAlignment === "top") {
      result.top = parseFloat(this._element.style.top);
    } else if (this.verticalAlignment === "bottom") {
      result.bottom = parseFloat(this._element.style.bottom);
    } else {
      result.top = element.top - container.top;
    }
    if (this.horiziontalAlignment === "left") {
      result.left = parseFloat(this._element.style.left);
    } else if (this.horiziontalAlignment === "right") {
      result.right = parseFloat(this._element.style.right);
    } else {
      result.left = element.left - container.left;
    }
    result.width = element.width;
    result.height = element.height;
    return result;
  }
  setupDrag(dragTarget, options = { inDragMode: false }) {
    const move = new MutableDisposable();
    const track2 = () => {
      let offset = null;
      const iframes = disableIframePointEvents();
      move.value = new CompositeDisposable({
        dispose: () => {
          iframes.release();
        }
      }, addDisposableListener(window, "pointermove", (e) => {
        const containerRect = this.options.container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        toggleClass(this._element, "dv-resize-container-dragging", true);
        const overlayRect = this._element.getBoundingClientRect();
        if (offset === null) {
          offset = {
            x: e.clientX - overlayRect.left,
            y: e.clientY - overlayRect.top
          };
        }
        const xOffset = Math.max(0, this.getMinimumWidth(overlayRect.width));
        const yOffset = Math.max(0, this.getMinimumHeight(overlayRect.height));
        const top = clamp(y - offset.y, -yOffset, Math.max(0, containerRect.height - overlayRect.height + yOffset));
        const bottom = clamp(offset.y - y + containerRect.height - overlayRect.height, -yOffset, Math.max(0, containerRect.height - overlayRect.height + yOffset));
        const left = clamp(x - offset.x, -xOffset, Math.max(0, containerRect.width - overlayRect.width + xOffset));
        const right = clamp(offset.x - x + containerRect.width - overlayRect.width, -xOffset, Math.max(0, containerRect.width - overlayRect.width + xOffset));
        const bounds = {};
        if (top <= bottom) {
          bounds.top = top;
        } else {
          bounds.bottom = bottom;
        }
        if (left <= right) {
          bounds.left = left;
        } else {
          bounds.right = right;
        }
        this.setBounds(bounds);
      }), addDisposableListener(window, "pointerup", () => {
        toggleClass(this._element, "dv-resize-container-dragging", false);
        move.dispose();
        this._onDidChangeEnd.fire();
      }));
    };
    this.addDisposables(move, addDisposableListener(dragTarget, "pointerdown", (event) => {
      if (event.defaultPrevented) {
        event.preventDefault();
        return;
      }
      if (quasiDefaultPrevented(event)) {
        return;
      }
      track2();
    }), addDisposableListener(this.options.content, "pointerdown", (event) => {
      if (event.defaultPrevented) {
        return;
      }
      if (quasiDefaultPrevented(event)) {
        return;
      }
      if (event.shiftKey) {
        track2();
      }
    }), addDisposableListener(this.options.content, "pointerdown", () => {
      arialLevelTracker.push(this._element);
    }, true));
    if (options.inDragMode) {
      track2();
    }
  }
  setupResize(direction) {
    const resizeHandleElement = document.createElement("div");
    resizeHandleElement.className = `dv-resize-handle-${direction}`;
    this._element.appendChild(resizeHandleElement);
    const move = new MutableDisposable();
    this.addDisposables(move, addDisposableListener(resizeHandleElement, "pointerdown", (e) => {
      e.preventDefault();
      let startPosition = null;
      const iframes = disableIframePointEvents();
      move.value = new CompositeDisposable(addDisposableListener(window, "pointermove", (e2) => {
        const containerRect = this.options.container.getBoundingClientRect();
        const overlayRect = this._element.getBoundingClientRect();
        const y = e2.clientY - containerRect.top;
        const x = e2.clientX - containerRect.left;
        if (startPosition === null) {
          startPosition = {
            originalY: y,
            originalHeight: overlayRect.height,
            originalX: x,
            originalWidth: overlayRect.width
          };
        }
        let top = void 0;
        let bottom = void 0;
        let height = void 0;
        let left = void 0;
        let right = void 0;
        let width = void 0;
        const moveTop = () => {
          const maxTop = startPosition.originalY + startPosition.originalHeight > containerRect.height ? Math.max(0, containerRect.height - Overlay.MINIMUM_HEIGHT) : Math.max(0, startPosition.originalY + startPosition.originalHeight - Overlay.MINIMUM_HEIGHT);
          top = clamp(y, 0, maxTop);
          height = startPosition.originalY + startPosition.originalHeight - top;
          bottom = containerRect.height - top - height;
        };
        const moveBottom = () => {
          top = startPosition.originalY - startPosition.originalHeight;
          const minHeight = top < 0 && typeof this.options.minimumInViewportHeight === "number" ? -top + this.options.minimumInViewportHeight : Overlay.MINIMUM_HEIGHT;
          const maxHeight = containerRect.height - Math.max(0, top);
          height = clamp(y - top, minHeight, maxHeight);
          bottom = containerRect.height - top - height;
        };
        const moveLeft = () => {
          const maxLeft = startPosition.originalX + startPosition.originalWidth > containerRect.width ? Math.max(0, containerRect.width - Overlay.MINIMUM_WIDTH) : Math.max(0, startPosition.originalX + startPosition.originalWidth - Overlay.MINIMUM_WIDTH);
          left = clamp(x, 0, maxLeft);
          width = startPosition.originalX + startPosition.originalWidth - left;
          right = containerRect.width - left - width;
        };
        const moveRight = () => {
          left = startPosition.originalX - startPosition.originalWidth;
          const minWidth = left < 0 && typeof this.options.minimumInViewportWidth === "number" ? -left + this.options.minimumInViewportWidth : Overlay.MINIMUM_WIDTH;
          const maxWidth = containerRect.width - Math.max(0, left);
          width = clamp(x - left, minWidth, maxWidth);
          right = containerRect.width - left - width;
        };
        switch (direction) {
          case "top":
            moveTop();
            break;
          case "bottom":
            moveBottom();
            break;
          case "left":
            moveLeft();
            break;
          case "right":
            moveRight();
            break;
          case "topleft":
            moveTop();
            moveLeft();
            break;
          case "topright":
            moveTop();
            moveRight();
            break;
          case "bottomleft":
            moveBottom();
            moveLeft();
            break;
          case "bottomright":
            moveBottom();
            moveRight();
            break;
        }
        const bounds = {};
        if (top <= bottom) {
          bounds.top = top;
        } else {
          bounds.bottom = bottom;
        }
        if (left <= right) {
          bounds.left = left;
        } else {
          bounds.right = right;
        }
        bounds.height = height;
        bounds.width = width;
        this.setBounds(bounds);
      }), {
        dispose: () => {
          iframes.release();
        }
      }, addDisposableListener(window, "pointerup", () => {
        move.dispose();
        this._onDidChangeEnd.fire();
      }));
    }));
  }
  getMinimumWidth(width) {
    if (typeof this.options.minimumInViewportWidth === "number") {
      return width - this.options.minimumInViewportWidth;
    }
    return 0;
  }
  getMinimumHeight(height) {
    if (typeof this.options.minimumInViewportHeight === "number") {
      return height - this.options.minimumInViewportHeight;
    }
    return 0;
  }
  dispose() {
    arialLevelTracker.destroy(this._element);
    this._element.remove();
    super.dispose();
  }
}
Overlay.MINIMUM_HEIGHT = 20;
Overlay.MINIMUM_WIDTH = 20;
class DockviewFloatingGroupPanel extends CompositeDisposable {
  constructor(group, overlay) {
    super();
    this.group = group;
    this.overlay = overlay;
    this.addDisposables(overlay);
  }
  position(bounds) {
    this.overlay.setBounds(bounds);
  }
}
const DEFAULT_FLOATING_GROUP_OVERFLOW_SIZE = 100;
const DEFAULT_FLOATING_GROUP_POSITION = {
  left: 100,
  top: 100,
  width: 300,
  height: 300
};
const DESERIALIZATION_POPOUT_DELAY_MS = 100;
class PositionCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.currentFrameId = 0;
    this.rafId = null;
  }
  getPosition(element) {
    const cached = this.cache.get(element);
    if (cached && cached.frameId === this.currentFrameId) {
      return cached.rect;
    }
    this.scheduleFrameUpdate();
    const rect = getDomNodePagePosition(element);
    this.cache.set(element, { rect, frameId: this.currentFrameId });
    return rect;
  }
  invalidate() {
    this.currentFrameId++;
  }
  scheduleFrameUpdate() {
    if (this.rafId)
      return;
    this.rafId = requestAnimationFrame(() => {
      this.currentFrameId++;
      this.rafId = null;
    });
  }
}
function createFocusableElement() {
  const element = document.createElement("div");
  element.tabIndex = -1;
  return element;
}
class OverlayRenderContainer extends CompositeDisposable {
  constructor(element, accessor) {
    super();
    this.element = element;
    this.accessor = accessor;
    this.map = {};
    this._disposed = false;
    this.positionCache = new PositionCache();
    this.pendingUpdates = /* @__PURE__ */ new Set();
    this.addDisposables(Disposable.from(() => {
      for (const value of Object.values(this.map)) {
        value.disposable.dispose();
        value.destroy.dispose();
      }
      this._disposed = true;
    }));
  }
  updateAllPositions() {
    if (this._disposed) {
      return;
    }
    this.positionCache.invalidate();
    for (const entry of Object.values(this.map)) {
      if (entry.panel.api.isVisible && entry.resize) {
        entry.resize();
      }
    }
  }
  detatch(panel) {
    if (this.map[panel.api.id]) {
      const { disposable, destroy } = this.map[panel.api.id];
      disposable.dispose();
      destroy.dispose();
      delete this.map[panel.api.id];
      return true;
    }
    return false;
  }
  attach(options) {
    const { panel, referenceContainer } = options;
    if (!this.map[panel.api.id]) {
      const element = createFocusableElement();
      element.className = "dv-render-overlay";
      element.style.visibility = "hidden";
      this.map[panel.api.id] = {
        panel,
        disposable: Disposable.NONE,
        destroy: Disposable.NONE,
        element
      };
    }
    const focusContainer = this.map[panel.api.id].element;
    if (panel.view.content.element.parentElement !== focusContainer) {
      focusContainer.appendChild(panel.view.content.element);
    }
    if (focusContainer.parentElement !== this.element) {
      this.element.appendChild(focusContainer);
    }
    const resize = () => {
      const panelId = panel.api.id;
      if (this.pendingUpdates.has(panelId)) {
        return;
      }
      this.pendingUpdates.add(panelId);
      requestAnimationFrame(() => {
        this.pendingUpdates.delete(panelId);
        if (this.isDisposed || !this.map[panelId]) {
          return;
        }
        const box = this.positionCache.getPosition(referenceContainer.element);
        const box2 = this.positionCache.getPosition(this.element);
        const left = box.left - box2.left;
        const top = box.top - box2.top;
        const width = box.width;
        const height = box.height;
        focusContainer.style.left = `${left}px`;
        focusContainer.style.top = `${top}px`;
        focusContainer.style.width = `${width}px`;
        focusContainer.style.height = `${height}px`;
        if (focusContainer.style.visibility === "hidden") {
          focusContainer.style.visibility = "";
        }
        toggleClass(focusContainer, "dv-render-overlay-float", panel.group.api.location.type === "floating");
      });
    };
    const visibilityChanged = () => {
      if (panel.api.isVisible) {
        this.positionCache.invalidate();
        resize();
      }
      focusContainer.style.display = panel.api.isVisible ? "" : "none";
    };
    const observerDisposable = new MutableDisposable();
    const correctLayerPosition = () => {
      if (panel.api.location.type === "floating") {
        queueMicrotask(() => {
          const floatingGroup = this.accessor.floatingGroups.find((group) => group.group === panel.api.group);
          if (!floatingGroup) {
            return;
          }
          const element = floatingGroup.overlay.element;
          const update = () => {
            const level = Number(element.getAttribute("aria-level"));
            focusContainer.style.zIndex = `calc(var(--dv-overlay-z-index, 999) + ${level * 2 + 1})`;
          };
          const observer = new MutationObserver(() => {
            update();
          });
          observerDisposable.value = Disposable.from(() => observer.disconnect());
          observer.observe(element, {
            attributeFilter: ["aria-level"],
            attributes: true
          });
          update();
        });
      } else {
        focusContainer.style.zIndex = "";
      }
    };
    const disposable = new CompositeDisposable(
      observerDisposable,
      /**
       * since container is positioned absoutely we must explicitly forward
       * the dnd events for the expect behaviours to continue to occur in terms of dnd
       *
       * the dnd observer does not need to be conditional on whether the panel is visible since
       * non-visible panels are 'display: none' and in such case the dnd observer will not fire.
       */
      new DragAndDropObserver(focusContainer, {
        onDragEnd: (e) => {
          referenceContainer.dropTarget.dnd.onDragEnd(e);
        },
        onDragEnter: (e) => {
          referenceContainer.dropTarget.dnd.onDragEnter(e);
        },
        onDragLeave: (e) => {
          referenceContainer.dropTarget.dnd.onDragLeave(e);
        },
        onDrop: (e) => {
          referenceContainer.dropTarget.dnd.onDrop(e);
        },
        onDragOver: (e) => {
          referenceContainer.dropTarget.dnd.onDragOver(e);
        }
      }),
      panel.api.onDidVisibilityChange(() => {
        visibilityChanged();
      }),
      panel.api.onDidDimensionsChange(() => {
        if (!panel.api.isVisible) {
          return;
        }
        resize();
      }),
      panel.api.onDidLocationChange(() => {
        correctLayerPosition();
      })
    );
    this.map[panel.api.id].destroy = Disposable.from(() => {
      var _a;
      if (panel.view.content.element.parentElement === focusContainer) {
        focusContainer.removeChild(panel.view.content.element);
      }
      (_a = focusContainer.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(focusContainer);
    });
    correctLayerPosition();
    queueMicrotask(() => {
      if (this.isDisposed) {
        return;
      }
      visibilityChanged();
    });
    this.map[panel.api.id].disposable.dispose();
    this.map[panel.api.id].disposable = disposable;
    this.map[panel.api.id].resize = resize;
    return focusContainer;
  }
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, [])).next());
  });
}
typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};
class PopoutWindow extends CompositeDisposable {
  get window() {
    var _a, _b;
    return (_b = (_a = this._window) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null;
  }
  constructor(target, className, options) {
    super();
    this.target = target;
    this.className = className;
    this.options = options;
    this._onWillClose = new Emitter();
    this.onWillClose = this._onWillClose.event;
    this._onDidClose = new Emitter();
    this.onDidClose = this._onDidClose.event;
    this._window = null;
    this.addDisposables(this._onWillClose, this._onDidClose, {
      dispose: () => {
        this.close();
      }
    });
  }
  dimensions() {
    if (!this._window) {
      return null;
    }
    const left = this._window.value.screenX;
    const top = this._window.value.screenY;
    const width = this._window.value.innerWidth;
    const height = this._window.value.innerHeight;
    return { top, left, width, height };
  }
  close() {
    var _a, _b;
    if (this._window) {
      this._onWillClose.fire();
      (_b = (_a = this.options).onWillClose) === null || _b === void 0 ? void 0 : _b.call(_a, {
        id: this.target,
        window: this._window.value
      });
      this._window.disposable.dispose();
      this._window = null;
      this._onDidClose.fire();
    }
  }
  open() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      if (this._window) {
        throw new Error("instance of popout window is already open");
      }
      const url = `${this.options.url}`;
      const features = Object.entries({
        top: this.options.top,
        left: this.options.left,
        width: this.options.width,
        height: this.options.height
      }).map(([key, value]) => `${key}=${value}`).join(",");
      const externalWindow = window.open(url, this.target, features);
      if (!externalWindow) {
        return null;
      }
      const disposable = new CompositeDisposable();
      this._window = { value: externalWindow, disposable };
      disposable.addDisposables(Disposable.from(() => {
        externalWindow.close();
      }), addDisposableListener(window, "beforeunload", () => {
        this.close();
      }));
      const container = this.createPopoutWindowContainer();
      if (this.className) {
        container.classList.add(this.className);
      }
      (_b = (_a = this.options).onDidOpen) === null || _b === void 0 ? void 0 : _b.call(_a, {
        id: this.target,
        window: externalWindow
      });
      return new Promise((resolve, reject) => {
        externalWindow.addEventListener("unload", (e) => {
        });
        externalWindow.addEventListener("load", () => {
          try {
            const externalDocument = externalWindow.document;
            externalDocument.title = document.title;
            externalDocument.body.appendChild(container);
            addStyles(externalDocument, window.document.styleSheets);
            addDisposableListener(externalWindow, "beforeunload", () => {
              this.close();
            });
            resolve(container);
          } catch (err) {
            reject(err);
          }
        });
      });
    });
  }
  createPopoutWindowContainer() {
    const el = document.createElement("div");
    el.classList.add("dv-popout-window");
    el.id = "dv-popout-window";
    el.style.position = "absolute";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.top = "0px";
    el.style.left = "0px";
    return el;
  }
}
class StrictEventsSequencing extends CompositeDisposable {
  constructor(accessor) {
    super();
    this.accessor = accessor;
    this.init();
  }
  init() {
    const panels = /* @__PURE__ */ new Set();
    const groups = /* @__PURE__ */ new Set();
    this.addDisposables(this.accessor.onDidAddPanel((panel) => {
      if (panels.has(panel.api.id)) {
        throw new Error(`dockview: Invalid event sequence. [onDidAddPanel] called for panel ${panel.api.id} but panel already exists`);
      } else {
        panels.add(panel.api.id);
      }
    }), this.accessor.onDidRemovePanel((panel) => {
      if (!panels.has(panel.api.id)) {
        throw new Error(`dockview: Invalid event sequence. [onDidRemovePanel] called for panel ${panel.api.id} but panel does not exists`);
      } else {
        panels.delete(panel.api.id);
      }
    }), this.accessor.onDidAddGroup((group) => {
      if (groups.has(group.api.id)) {
        throw new Error(`dockview: Invalid event sequence. [onDidAddGroup] called for group ${group.api.id} but group already exists`);
      } else {
        groups.add(group.api.id);
      }
    }), this.accessor.onDidRemoveGroup((group) => {
      if (!groups.has(group.api.id)) {
        throw new Error(`dockview: Invalid event sequence. [onDidRemoveGroup] called for group ${group.api.id} but group does not exists`);
      } else {
        groups.delete(group.api.id);
      }
    }));
  }
}
class PopupService extends CompositeDisposable {
  constructor(root) {
    super();
    this.root = root;
    this._active = null;
    this._activeDisposable = new MutableDisposable();
    this._element = document.createElement("div");
    this._element.className = "dv-popover-anchor";
    this._element.style.position = "relative";
    this.root.prepend(this._element);
    this.addDisposables(Disposable.from(() => {
      this.close();
    }), this._activeDisposable);
  }
  openPopover(element, position) {
    var _a;
    this.close();
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.zIndex = (_a = position.zIndex) !== null && _a !== void 0 ? _a : "var(--dv-overlay-z-index)";
    wrapper.appendChild(element);
    const anchorBox = this._element.getBoundingClientRect();
    const offsetX = anchorBox.left;
    const offsetY = anchorBox.top;
    wrapper.style.top = `${position.y - offsetY}px`;
    wrapper.style.left = `${position.x - offsetX}px`;
    this._element.appendChild(wrapper);
    this._active = wrapper;
    this._activeDisposable.value = new CompositeDisposable(addDisposableListener(window, "pointerdown", (event) => {
      var _a2;
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      let el = target;
      while (el && el !== wrapper) {
        el = (_a2 = el === null || el === void 0 ? void 0 : el.parentElement) !== null && _a2 !== void 0 ? _a2 : null;
      }
      if (el) {
        return;
      }
      this.close();
    }), addDisposableListener(window, "resize", () => {
      this.close();
    }));
    requestAnimationFrame(() => {
      shiftAbsoluteElementIntoView(wrapper, this.root);
    });
  }
  close() {
    if (this._active) {
      this._active.remove();
      this._activeDisposable.dispose();
      this._active = null;
    }
  }
}
class DropTargetAnchorContainer extends CompositeDisposable {
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    var _a;
    if (this.disabled === value) {
      return;
    }
    this._disabled = value;
    if (value) {
      (_a = this.model) === null || _a === void 0 ? void 0 : _a.clear();
    }
  }
  get model() {
    if (this.disabled) {
      return void 0;
    }
    return {
      clear: () => {
        var _a;
        if (this._model) {
          (_a = this._model.root.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(this._model.root);
        }
        this._model = void 0;
      },
      exists: () => {
        return !!this._model;
      },
      getElements: (event, outline) => {
        const changed = this._outline !== outline;
        this._outline = outline;
        if (this._model) {
          this._model.changed = changed;
          return this._model;
        }
        const container = this.createContainer();
        const anchor = this.createAnchor();
        this._model = { root: container, overlay: anchor, changed };
        container.appendChild(anchor);
        this.element.appendChild(container);
        if ((event === null || event === void 0 ? void 0 : event.target) instanceof HTMLElement) {
          const targetBox = event.target.getBoundingClientRect();
          const box = this.element.getBoundingClientRect();
          anchor.style.left = `${targetBox.left - box.left}px`;
          anchor.style.top = `${targetBox.top - box.top}px`;
        }
        return this._model;
      }
    };
  }
  constructor(element, options) {
    super();
    this.element = element;
    this._disabled = false;
    this._disabled = options.disabled;
    this.addDisposables(Disposable.from(() => {
      var _a;
      (_a = this.model) === null || _a === void 0 ? void 0 : _a.clear();
    }));
  }
  createContainer() {
    const el = document.createElement("div");
    el.className = "dv-drop-target-container";
    return el;
  }
  createAnchor() {
    const el = document.createElement("div");
    el.className = "dv-drop-target-anchor";
    el.style.visibility = "hidden";
    return el;
  }
}
const DEFAULT_ROOT_OVERLAY_MODEL = {
  activationSize: { type: "pixels", value: 10 },
  size: { type: "pixels", value: 20 }
};
function moveGroupWithoutDestroying(options) {
  const activePanel = options.from.activePanel;
  const panels = [...options.from.panels].map((panel) => {
    const removedPanel = options.from.model.removePanel(panel);
    options.from.model.renderContainer.detatch(panel);
    return removedPanel;
  });
  panels.forEach((panel) => {
    options.to.model.openPanel(panel, {
      skipSetActive: activePanel !== panel,
      skipSetGroupActive: true
    });
  });
}
class DockviewComponent extends BaseGrid {
  get orientation() {
    return this.gridview.orientation;
  }
  get totalPanels() {
    return this.panels.length;
  }
  get panels() {
    return this.groups.flatMap((group) => group.panels);
  }
  get options() {
    return this._options;
  }
  get activePanel() {
    const activeGroup = this.activeGroup;
    if (!activeGroup) {
      return void 0;
    }
    return activeGroup.activePanel;
  }
  get renderer() {
    var _a;
    return (_a = this.options.defaultRenderer) !== null && _a !== void 0 ? _a : "onlyWhenVisible";
  }
  get defaultHeaderPosition() {
    var _a;
    return (_a = this.options.defaultHeaderPosition) !== null && _a !== void 0 ? _a : "top";
  }
  get api() {
    return this._api;
  }
  get floatingGroups() {
    return this._floatingGroups;
  }
  /**
   * Promise that resolves when all popout groups from the last fromJSON call are restored.
   * Useful for tests that need to wait for delayed popout creation.
   */
  get popoutRestorationPromise() {
    return this._popoutRestorationPromise;
  }
  constructor(container, options) {
    var _a, _b, _c;
    super(container, {
      proportionalLayout: true,
      orientation: Orientation.HORIZONTAL,
      styles: options.hideBorders ? { separatorBorder: "transparent" } : void 0,
      disableAutoResizing: options.disableAutoResizing,
      locked: options.locked,
      margin: (_b = (_a = options.theme) === null || _a === void 0 ? void 0 : _a.gap) !== null && _b !== void 0 ? _b : 0,
      className: options.className
    });
    this.nextGroupId = sequentialNumberGenerator();
    this._deserializer = new DefaultDockviewDeserialzier(this);
    this._watermark = null;
    this._onWillDragPanel = new Emitter();
    this.onWillDragPanel = this._onWillDragPanel.event;
    this._onWillDragGroup = new Emitter();
    this.onWillDragGroup = this._onWillDragGroup.event;
    this._onDidDrop = new Emitter();
    this.onDidDrop = this._onDidDrop.event;
    this._onWillDrop = new Emitter();
    this.onWillDrop = this._onWillDrop.event;
    this._onWillShowOverlay = new Emitter();
    this.onWillShowOverlay = this._onWillShowOverlay.event;
    this._onUnhandledDragOverEvent = new Emitter();
    this.onUnhandledDragOverEvent = this._onUnhandledDragOverEvent.event;
    this._onDidRemovePanel = new Emitter();
    this.onDidRemovePanel = this._onDidRemovePanel.event;
    this._onDidAddPanel = new Emitter();
    this.onDidAddPanel = this._onDidAddPanel.event;
    this._onDidPopoutGroupSizeChange = new Emitter();
    this.onDidPopoutGroupSizeChange = this._onDidPopoutGroupSizeChange.event;
    this._onDidPopoutGroupPositionChange = new Emitter();
    this.onDidPopoutGroupPositionChange = this._onDidPopoutGroupPositionChange.event;
    this._onDidOpenPopoutWindowFail = new Emitter();
    this.onDidOpenPopoutWindowFail = this._onDidOpenPopoutWindowFail.event;
    this._onDidLayoutFromJSON = new Emitter();
    this.onDidLayoutFromJSON = this._onDidLayoutFromJSON.event;
    this._onDidActivePanelChange = new Emitter({ replay: true });
    this.onDidActivePanelChange = this._onDidActivePanelChange.event;
    this._onDidMovePanel = new Emitter();
    this.onDidMovePanel = this._onDidMovePanel.event;
    this._onDidMaximizedGroupChange = new Emitter();
    this.onDidMaximizedGroupChange = this._onDidMaximizedGroupChange.event;
    this._floatingGroups = [];
    this._popoutGroups = [];
    this._popoutRestorationPromise = Promise.resolve();
    this._onDidRemoveGroup = new Emitter();
    this.onDidRemoveGroup = this._onDidRemoveGroup.event;
    this._onDidAddGroup = new Emitter();
    this.onDidAddGroup = this._onDidAddGroup.event;
    this._onDidOptionsChange = new Emitter();
    this.onDidOptionsChange = this._onDidOptionsChange.event;
    this._onDidActiveGroupChange = new Emitter();
    this.onDidActiveGroupChange = this._onDidActiveGroupChange.event;
    this._moving = false;
    this._options = options;
    this.popupService = new PopupService(this.element);
    this._themeClassnames = new Classnames(this.element);
    this._api = new DockviewApi(this);
    this.rootDropTargetContainer = new DropTargetAnchorContainer(this.element, { disabled: true });
    this.overlayRenderContainer = new OverlayRenderContainer(this.gridview.element, this);
    this._rootDropTarget = new Droptarget(this.element, {
      className: "dv-drop-target-edge",
      canDisplayOverlay: (event, position) => {
        const data = getPanelData();
        if (data) {
          if (data.viewId !== this.id) {
            return false;
          }
          if (position === "center") {
            return this.gridview.length === 0;
          }
          return true;
        }
        if (position === "center" && this.gridview.length !== 0) {
          return false;
        }
        const firedEvent = new DockviewUnhandledDragOverEvent(event, "edge", position, getPanelData);
        this._onUnhandledDragOverEvent.fire(firedEvent);
        return firedEvent.isAccepted;
      },
      acceptedTargetZones: ["top", "bottom", "left", "right", "center"],
      overlayModel: (_c = options.rootOverlayModel) !== null && _c !== void 0 ? _c : DEFAULT_ROOT_OVERLAY_MODEL,
      getOverrideTarget: () => {
        var _a2;
        return (_a2 = this.rootDropTargetContainer) === null || _a2 === void 0 ? void 0 : _a2.model;
      }
    });
    this.updateDropTargetModel(options);
    toggleClass(this.gridview.element, "dv-dockview", true);
    toggleClass(this.element, "dv-debug", !!options.debug);
    this.updateTheme();
    this.updateWatermark();
    if (options.debug) {
      this.addDisposables(new StrictEventsSequencing(this));
    }
    this.addDisposables(this.rootDropTargetContainer, this.overlayRenderContainer, this._onWillDragPanel, this._onWillDragGroup, this._onWillShowOverlay, this._onDidActivePanelChange, this._onDidAddPanel, this._onDidRemovePanel, this._onDidLayoutFromJSON, this._onDidDrop, this._onWillDrop, this._onDidMovePanel, this._onDidMovePanel.event(() => {
      this.debouncedUpdateAllPositions();
    }), this._onDidAddGroup, this._onDidRemoveGroup, this._onDidActiveGroupChange, this._onUnhandledDragOverEvent, this._onDidMaximizedGroupChange, this._onDidOptionsChange, this._onDidPopoutGroupSizeChange, this._onDidPopoutGroupPositionChange, this._onDidOpenPopoutWindowFail, this.onDidViewVisibilityChangeMicroTaskQueue(() => {
      this.updateWatermark();
    }), this.onDidAdd((event) => {
      if (!this._moving) {
        this._onDidAddGroup.fire(event);
      }
    }), this.onDidRemove((event) => {
      if (!this._moving) {
        this._onDidRemoveGroup.fire(event);
      }
    }), this.onDidActiveChange((event) => {
      if (!this._moving) {
        this._onDidActiveGroupChange.fire(event);
      }
    }), this.onDidMaximizedChange((event) => {
      this._onDidMaximizedGroupChange.fire({
        group: event.panel,
        isMaximized: event.isMaximized
      });
    }), Event.any(this.onDidAdd, this.onDidRemove)(() => {
      this.updateWatermark();
    }), Event.any(this.onDidAddPanel, this.onDidRemovePanel, this.onDidAddGroup, this.onDidRemove, this.onDidMovePanel, this.onDidActivePanelChange, this.onDidPopoutGroupPositionChange, this.onDidPopoutGroupSizeChange)(() => {
      this._bufferOnDidLayoutChange.fire();
    }), Disposable.from(() => {
      for (const group of [...this._floatingGroups]) {
        group.dispose();
      }
      for (const group of [...this._popoutGroups]) {
        group.disposable.dispose();
      }
    }), this._rootDropTarget, this._rootDropTarget.onWillShowOverlay((event) => {
      if (this.gridview.length > 0 && event.position === "center") {
        return;
      }
      this._onWillShowOverlay.fire(new DockviewWillShowOverlayLocationEvent(event, {
        kind: "edge",
        panel: void 0,
        api: this._api,
        group: void 0,
        getData: getPanelData
      }));
    }), this._rootDropTarget.onDrop((event) => {
      var _a2;
      const willDropEvent = new DockviewWillDropEvent({
        nativeEvent: event.nativeEvent,
        position: event.position,
        panel: void 0,
        api: this._api,
        group: void 0,
        getData: getPanelData,
        kind: "edge"
      });
      this._onWillDrop.fire(willDropEvent);
      if (willDropEvent.defaultPrevented) {
        return;
      }
      const data = getPanelData();
      if (data) {
        this.moveGroupOrPanel({
          from: {
            groupId: data.groupId,
            panelId: (_a2 = data.panelId) !== null && _a2 !== void 0 ? _a2 : void 0
          },
          to: {
            group: this.orthogonalize(event.position),
            position: "center"
          }
        });
      } else {
        this._onDidDrop.fire(new DockviewDidDropEvent({
          nativeEvent: event.nativeEvent,
          position: event.position,
          panel: void 0,
          api: this._api,
          group: void 0,
          getData: getPanelData
        }));
      }
    }), this._rootDropTarget);
  }
  setVisible(panel, visible) {
    switch (panel.api.location.type) {
      case "grid":
        super.setVisible(panel, visible);
        break;
      case "floating": {
        const item = this.floatingGroups.find((floatingGroup) => floatingGroup.group === panel);
        if (item) {
          item.overlay.setVisible(visible);
          panel.api._onDidVisibilityChange.fire({
            isVisible: visible
          });
        }
        break;
      }
      case "popout":
        console.warn("dockview: You cannot hide a group that is in a popout window");
        break;
    }
  }
  addPopoutGroup(itemToPopout, options) {
    var _a, _b, _c, _d, _e;
    if (itemToPopout instanceof DockviewPanel && itemToPopout.group.size === 1) {
      return this.addPopoutGroup(itemToPopout.group, options);
    }
    const theme = getDockviewTheme(this.gridview.element);
    const element = this.element;
    function getBox() {
      if (options === null || options === void 0 ? void 0 : options.position) {
        return options.position;
      }
      if (itemToPopout instanceof DockviewGroupPanel) {
        return itemToPopout.element.getBoundingClientRect();
      }
      if (itemToPopout.group) {
        return itemToPopout.group.element.getBoundingClientRect();
      }
      return element.getBoundingClientRect();
    }
    const box = getBox();
    const groupId = (_b = (_a = options === null || options === void 0 ? void 0 : options.overridePopoutGroup) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : this.getNextGroupId();
    const _window = new PopoutWindow(
      `${this.id}-${groupId}`,
      // unique id
      theme !== null && theme !== void 0 ? theme : "",
      {
        url: (_e = (_c = options === null || options === void 0 ? void 0 : options.popoutUrl) !== null && _c !== void 0 ? _c : (_d = this.options) === null || _d === void 0 ? void 0 : _d.popoutUrl) !== null && _e !== void 0 ? _e : "/popout.html",
        left: window.screenX + box.left,
        top: window.screenY + box.top,
        width: box.width,
        height: box.height,
        onDidOpen: options === null || options === void 0 ? void 0 : options.onDidOpen,
        onWillClose: options === null || options === void 0 ? void 0 : options.onWillClose
      }
    );
    const popoutWindowDisposable = new CompositeDisposable(_window, _window.onDidClose(() => {
      popoutWindowDisposable.dispose();
    }));
    return _window.open().then((popoutContainer) => {
      var _a2;
      if (_window.isDisposed) {
        return false;
      }
      const referenceGroup = (options === null || options === void 0 ? void 0 : options.referenceGroup) ? options.referenceGroup : itemToPopout instanceof DockviewPanel ? itemToPopout.group : itemToPopout;
      const referenceLocation = itemToPopout.api.location.type;
      const isGroupAddedToDom = referenceGroup.element.parentElement !== null;
      let group;
      if (!isGroupAddedToDom) {
        group = referenceGroup;
      } else if (options === null || options === void 0 ? void 0 : options.overridePopoutGroup) {
        group = options.overridePopoutGroup;
      } else {
        group = this.createGroup({ id: groupId });
        if (popoutContainer) {
          this._onDidAddGroup.fire(group);
        }
      }
      if (popoutContainer === null) {
        console.error("dockview: failed to create popout. perhaps you need to allow pop-ups for this website");
        popoutWindowDisposable.dispose();
        this._onDidOpenPopoutWindowFail.fire();
        this.movingLock(() => moveGroupWithoutDestroying({
          from: group,
          to: referenceGroup
        }));
        if (!referenceGroup.api.isVisible) {
          referenceGroup.api.setVisible(true);
        }
        return false;
      }
      const gready = document.createElement("div");
      gready.className = "dv-overlay-render-container";
      const overlayRenderContainer = new OverlayRenderContainer(gready, this);
      group.model.renderContainer = overlayRenderContainer;
      group.layout(_window.window.innerWidth, _window.window.innerHeight);
      let floatingBox;
      if (!(options === null || options === void 0 ? void 0 : options.overridePopoutGroup) && isGroupAddedToDom) {
        if (itemToPopout instanceof DockviewPanel) {
          this.movingLock(() => {
            const panel = referenceGroup.model.removePanel(itemToPopout);
            group.model.openPanel(panel);
          });
        } else {
          this.movingLock(() => moveGroupWithoutDestroying({
            from: referenceGroup,
            to: group
          }));
          switch (referenceLocation) {
            case "grid":
              referenceGroup.api.setVisible(false);
              break;
            case "floating":
            case "popout":
              floatingBox = (_a2 = this._floatingGroups.find((value2) => value2.group.api.id === itemToPopout.api.id)) === null || _a2 === void 0 ? void 0 : _a2.overlay.toJSON();
              this.removeGroup(referenceGroup);
              break;
          }
        }
      }
      popoutContainer.classList.add("dv-dockview");
      popoutContainer.style.overflow = "hidden";
      popoutContainer.appendChild(gready);
      popoutContainer.appendChild(group.element);
      const anchor = document.createElement("div");
      const dropTargetContainer = new DropTargetAnchorContainer(anchor, { disabled: this.rootDropTargetContainer.disabled });
      popoutContainer.appendChild(anchor);
      group.model.dropTargetContainer = dropTargetContainer;
      group.model.location = {
        type: "popout",
        getWindow: () => _window.window,
        popoutUrl: options === null || options === void 0 ? void 0 : options.popoutUrl
      };
      if (isGroupAddedToDom && itemToPopout.api.location.type === "grid") {
        itemToPopout.api.setVisible(false);
      }
      this.doSetGroupAndPanelActive(group);
      popoutWindowDisposable.addDisposables(group.api.onDidActiveChange((event) => {
        var _a3;
        if (event.isActive) {
          (_a3 = _window.window) === null || _a3 === void 0 ? void 0 : _a3.focus();
        }
      }), group.api.onWillFocus(() => {
        var _a3;
        (_a3 = _window.window) === null || _a3 === void 0 ? void 0 : _a3.focus();
      }));
      let returnedGroup;
      const isValidReferenceGroup = isGroupAddedToDom && referenceGroup && this.getPanel(referenceGroup.id);
      const value = {
        window: _window,
        popoutGroup: group,
        referenceGroup: isValidReferenceGroup ? referenceGroup.id : void 0,
        disposable: {
          dispose: () => {
            popoutWindowDisposable.dispose();
            return returnedGroup;
          }
        }
      };
      const _onDidWindowPositionChange = onDidWindowMoveEnd(_window.window);
      popoutWindowDisposable.addDisposables(
        _onDidWindowPositionChange,
        onDidWindowResizeEnd(_window.window, () => {
          this._onDidPopoutGroupSizeChange.fire({
            width: _window.window.innerWidth,
            height: _window.window.innerHeight,
            group
          });
        }),
        _onDidWindowPositionChange.event(() => {
          this._onDidPopoutGroupPositionChange.fire({
            screenX: _window.window.screenX,
            screenY: _window.window.screenX,
            group
          });
        }),
        /**
         * ResizeObserver seems slow here, I do not know why but we don't need it
         * since we can reply on the window resize event as we will occupy the full
         * window dimensions
         */
        addDisposableListener(_window.window, "resize", () => {
          group.layout(_window.window.innerWidth, _window.window.innerHeight);
        }),
        overlayRenderContainer,
        Disposable.from(() => {
          if (this.isDisposed) {
            return;
          }
          if (isGroupAddedToDom && this.getPanel(referenceGroup.id)) {
            this.movingLock(() => moveGroupWithoutDestroying({
              from: group,
              to: referenceGroup
            }));
            if (!referenceGroup.api.isVisible) {
              referenceGroup.api.setVisible(true);
            }
            if (this.getPanel(group.id)) {
              this.doRemoveGroup(group, {
                skipPopoutAssociated: true
              });
            }
          } else if (this.getPanel(group.id)) {
            group.model.renderContainer = this.overlayRenderContainer;
            group.model.dropTargetContainer = this.rootDropTargetContainer;
            returnedGroup = group;
            const alreadyRemoved = !this._popoutGroups.find((p2) => p2.popoutGroup === group);
            if (alreadyRemoved) {
              return;
            }
            if (floatingBox) {
              this.addFloatingGroup(group, {
                height: floatingBox.height,
                width: floatingBox.width,
                position: floatingBox
              });
            } else {
              this.doRemoveGroup(group, {
                skipDispose: true,
                skipActive: true,
                skipPopoutReturn: true
              });
              group.model.location = { type: "grid" };
              this.movingLock(() => {
                this.doAddGroup(group, [0]);
              });
            }
            this.doSetGroupAndPanelActive(group);
          }
        })
      );
      this._popoutGroups.push(value);
      this.updateWatermark();
      return true;
    }).catch((err) => {
      console.error("dockview: failed to create popout.", err);
      return false;
    });
  }
  addFloatingGroup(item, options) {
    var _a, _b, _c, _d, _e;
    let group;
    if (item instanceof DockviewPanel) {
      group = this.createGroup();
      this._onDidAddGroup.fire(group);
      this.movingLock(() => this.removePanel(item, {
        removeEmptyGroup: true,
        skipDispose: true,
        skipSetActiveGroup: true
      }));
      this.movingLock(() => group.model.openPanel(item, { skipSetGroupActive: true }));
    } else {
      group = item;
      const popoutReferenceGroupId = (_a = this._popoutGroups.find((_) => _.popoutGroup === group)) === null || _a === void 0 ? void 0 : _a.referenceGroup;
      const popoutReferenceGroup = popoutReferenceGroupId ? this.getPanel(popoutReferenceGroupId) : void 0;
      const skip = typeof (options === null || options === void 0 ? void 0 : options.skipRemoveGroup) === "boolean" && options.skipRemoveGroup;
      if (!skip) {
        if (popoutReferenceGroup) {
          this.movingLock(() => moveGroupWithoutDestroying({
            from: item,
            to: popoutReferenceGroup
          }));
          this.doRemoveGroup(item, {
            skipPopoutReturn: true,
            skipPopoutAssociated: true
          });
          this.doRemoveGroup(popoutReferenceGroup, {
            skipDispose: true
          });
          group = popoutReferenceGroup;
        } else {
          this.doRemoveGroup(item, {
            skipDispose: true,
            skipPopoutReturn: true,
            skipPopoutAssociated: false
          });
        }
      }
    }
    function getAnchoredBox() {
      if (options === null || options === void 0 ? void 0 : options.position) {
        const result = {};
        if ("left" in options.position) {
          result.left = Math.max(options.position.left, 0);
        } else if ("right" in options.position) {
          result.right = Math.max(options.position.right, 0);
        } else {
          result.left = DEFAULT_FLOATING_GROUP_POSITION.left;
        }
        if ("top" in options.position) {
          result.top = Math.max(options.position.top, 0);
        } else if ("bottom" in options.position) {
          result.bottom = Math.max(options.position.bottom, 0);
        } else {
          result.top = DEFAULT_FLOATING_GROUP_POSITION.top;
        }
        if (typeof options.width === "number") {
          result.width = Math.max(options.width, 0);
        } else {
          result.width = DEFAULT_FLOATING_GROUP_POSITION.width;
        }
        if (typeof options.height === "number") {
          result.height = Math.max(options.height, 0);
        } else {
          result.height = DEFAULT_FLOATING_GROUP_POSITION.height;
        }
        return result;
      }
      return {
        left: typeof (options === null || options === void 0 ? void 0 : options.x) === "number" ? Math.max(options.x, 0) : DEFAULT_FLOATING_GROUP_POSITION.left,
        top: typeof (options === null || options === void 0 ? void 0 : options.y) === "number" ? Math.max(options.y, 0) : DEFAULT_FLOATING_GROUP_POSITION.top,
        width: typeof (options === null || options === void 0 ? void 0 : options.width) === "number" ? Math.max(options.width, 0) : DEFAULT_FLOATING_GROUP_POSITION.width,
        height: typeof (options === null || options === void 0 ? void 0 : options.height) === "number" ? Math.max(options.height, 0) : DEFAULT_FLOATING_GROUP_POSITION.height
      };
    }
    const anchoredBox = getAnchoredBox();
    const overlay = new Overlay(Object.assign(Object.assign({ container: this.gridview.element, content: group.element }, anchoredBox), { minimumInViewportWidth: this.options.floatingGroupBounds === "boundedWithinViewport" ? void 0 : (_c = (_b = this.options.floatingGroupBounds) === null || _b === void 0 ? void 0 : _b.minimumWidthWithinViewport) !== null && _c !== void 0 ? _c : DEFAULT_FLOATING_GROUP_OVERFLOW_SIZE, minimumInViewportHeight: this.options.floatingGroupBounds === "boundedWithinViewport" ? void 0 : (_e = (_d = this.options.floatingGroupBounds) === null || _d === void 0 ? void 0 : _d.minimumHeightWithinViewport) !== null && _e !== void 0 ? _e : DEFAULT_FLOATING_GROUP_OVERFLOW_SIZE }));
    const el = group.element.querySelector(".dv-void-container");
    if (!el) {
      throw new Error("dockview: failed to find drag handle");
    }
    overlay.setupDrag(el, {
      inDragMode: typeof (options === null || options === void 0 ? void 0 : options.inDragMode) === "boolean" ? options.inDragMode : false
    });
    const floatingGroupPanel = new DockviewFloatingGroupPanel(group, overlay);
    const disposable = new CompositeDisposable(group.api.onDidActiveChange((event) => {
      if (event.isActive) {
        overlay.bringToFront();
      }
    }), watchElementResize(group.element, (entry) => {
      const { width, height } = entry.contentRect;
      group.layout(width, height);
    }));
    floatingGroupPanel.addDisposables(overlay.onDidChange(() => {
      group.layout(group.width, group.height);
    }), overlay.onDidChangeEnd(() => {
      this._bufferOnDidLayoutChange.fire();
    }), group.onDidChange((event) => {
      overlay.setBounds({
        height: event === null || event === void 0 ? void 0 : event.height,
        width: event === null || event === void 0 ? void 0 : event.width
      });
    }), {
      dispose: () => {
        disposable.dispose();
        remove(this._floatingGroups, floatingGroupPanel);
        group.model.location = { type: "grid" };
        this.updateWatermark();
      }
    });
    this._floatingGroups.push(floatingGroupPanel);
    group.model.location = { type: "floating" };
    if (!(options === null || options === void 0 ? void 0 : options.skipActiveGroup)) {
      this.doSetGroupAndPanelActive(group);
    }
    this.updateWatermark();
  }
  orthogonalize(position, options) {
    this.gridview.normalize();
    switch (position) {
      case "top":
      case "bottom":
        if (this.gridview.orientation === Orientation.HORIZONTAL) {
          this.gridview.insertOrthogonalSplitviewAtRoot();
        }
        break;
      case "left":
      case "right":
        if (this.gridview.orientation === Orientation.VERTICAL) {
          this.gridview.insertOrthogonalSplitviewAtRoot();
        }
        break;
    }
    switch (position) {
      case "top":
      case "left":
      case "center":
        return this.createGroupAtLocation([0], void 0, options);
      // insert into first position
      case "bottom":
      case "right":
        return this.createGroupAtLocation([this.gridview.length], void 0, options);
      // insert into last position
      default:
        throw new Error(`dockview: unsupported position ${position}`);
    }
  }
  updateOptions(options) {
    var _a, _b;
    super.updateOptions(options);
    if ("floatingGroupBounds" in options) {
      for (const group of this._floatingGroups) {
        switch (options.floatingGroupBounds) {
          case "boundedWithinViewport":
            group.overlay.minimumInViewportHeight = void 0;
            group.overlay.minimumInViewportWidth = void 0;
            break;
          case void 0:
            group.overlay.minimumInViewportHeight = DEFAULT_FLOATING_GROUP_OVERFLOW_SIZE;
            group.overlay.minimumInViewportWidth = DEFAULT_FLOATING_GROUP_OVERFLOW_SIZE;
            break;
          default:
            group.overlay.minimumInViewportHeight = (_a = options.floatingGroupBounds) === null || _a === void 0 ? void 0 : _a.minimumHeightWithinViewport;
            group.overlay.minimumInViewportWidth = (_b = options.floatingGroupBounds) === null || _b === void 0 ? void 0 : _b.minimumWidthWithinViewport;
        }
        group.overlay.setBounds();
      }
    }
    this.updateDropTargetModel(options);
    const oldDisableDnd = this.options.disableDnd;
    this._options = Object.assign(Object.assign({}, this.options), options);
    const newDisableDnd = this.options.disableDnd;
    if (oldDisableDnd !== newDisableDnd) {
      this.updateDragAndDropState();
    }
    if ("theme" in options) {
      this.updateTheme();
    }
    if ("createRightHeaderActionComponent" in options || "createLeftHeaderActionComponent" in options || "createPrefixHeaderActionComponent" in options) {
      for (const group of this.groups) {
        group.model.updateHeaderActions();
      }
    }
    this.layout(this.gridview.width, this.gridview.height, true);
  }
  layout(width, height, forceResize) {
    super.layout(width, height, forceResize);
    if (this._floatingGroups) {
      for (const floating of this._floatingGroups) {
        floating.overlay.setBounds();
      }
    }
  }
  updateDragAndDropState() {
    for (const group of this.groups) {
      group.model.updateDragAndDropState();
    }
  }
  focus() {
    var _a;
    (_a = this.activeGroup) === null || _a === void 0 ? void 0 : _a.focus();
  }
  getGroupPanel(id) {
    return this.panels.find((panel) => panel.id === id);
  }
  setActivePanel(panel) {
    panel.group.model.openPanel(panel);
    this.doSetGroupAndPanelActive(panel.group);
  }
  moveToNext(options = {}) {
    var _a;
    if (!options.group) {
      if (!this.activeGroup) {
        return;
      }
      options.group = this.activeGroup;
    }
    if (options.includePanel && options.group) {
      if (options.group.activePanel !== options.group.panels[options.group.panels.length - 1]) {
        options.group.model.moveToNext({ suppressRoll: true });
        return;
      }
    }
    const location = getGridLocation(options.group.element);
    const next = (_a = this.gridview.next(location)) === null || _a === void 0 ? void 0 : _a.view;
    this.doSetGroupAndPanelActive(next);
  }
  moveToPrevious(options = {}) {
    var _a;
    if (!options.group) {
      if (!this.activeGroup) {
        return;
      }
      options.group = this.activeGroup;
    }
    if (options.includePanel && options.group) {
      if (options.group.activePanel !== options.group.panels[0]) {
        options.group.model.moveToPrevious({ suppressRoll: true });
        return;
      }
    }
    const location = getGridLocation(options.group.element);
    const next = (_a = this.gridview.previous(location)) === null || _a === void 0 ? void 0 : _a.view;
    if (next) {
      this.doSetGroupAndPanelActive(next);
    }
  }
  /**
   * Serialize the current state of the layout
   *
   * @returns A JSON respresentation of the layout
   */
  toJSON() {
    var _a;
    const data = this.gridview.serialize();
    const panels = this.panels.reduce((collection, panel) => {
      collection[panel.id] = panel.toJSON();
      return collection;
    }, {});
    const floats = this._floatingGroups.map((group) => {
      return {
        data: group.group.toJSON(),
        position: group.overlay.toJSON()
      };
    });
    const popoutGroups = this._popoutGroups.map((group) => {
      return {
        data: group.popoutGroup.toJSON(),
        gridReferenceGroup: group.referenceGroup,
        position: group.window.dimensions(),
        url: group.popoutGroup.api.location.type === "popout" ? group.popoutGroup.api.location.popoutUrl : void 0
      };
    });
    const result = {
      grid: data,
      panels,
      activeGroup: (_a = this.activeGroup) === null || _a === void 0 ? void 0 : _a.id
    };
    if (floats.length > 0) {
      result.floatingGroups = floats;
    }
    if (popoutGroups.length > 0) {
      result.popoutGroups = popoutGroups;
    }
    return result;
  }
  fromJSON(data, options) {
    var _a, _b;
    const existingPanels = /* @__PURE__ */ new Map();
    let tempGroup;
    if (options === null || options === void 0 ? void 0 : options.reuseExistingPanels) {
      tempGroup = this.createGroup();
      this._groups.delete(tempGroup.api.id);
      const newPanels = Object.keys(data.panels);
      for (const panel of this.panels) {
        if (newPanels.includes(panel.api.id)) {
          existingPanels.set(panel.api.id, panel);
        }
      }
      this.movingLock(() => {
        Array.from(existingPanels.values()).forEach((panel) => {
          this.moveGroupOrPanel({
            from: {
              groupId: panel.api.group.api.id,
              panelId: panel.api.id
            },
            to: {
              group: tempGroup,
              position: "center"
            },
            keepEmptyGroups: true
          });
        });
      });
    }
    this.clear();
    if (typeof data !== "object" || data === null) {
      throw new Error("dockview: serialized layout must be a non-null object");
    }
    const { grid, panels, activeGroup } = data;
    if (grid.root.type !== "branch" || !Array.isArray(grid.root.data)) {
      throw new Error("dockview: root must be of type branch");
    }
    try {
      const width = this.width;
      const height = this.height;
      const createGroupFromSerializedState = (data2) => {
        const { id, locked, hideHeader, headerPosition, views, activeView } = data2;
        if (typeof id !== "string") {
          throw new Error("dockview: group id must be of type string");
        }
        const group = this.createGroup({
          id,
          locked: !!locked,
          hideHeader: !!hideHeader,
          headerPosition
        });
        this._onDidAddGroup.fire(group);
        const createdPanels = [];
        for (const child of views) {
          const existingPanel = existingPanels.get(child);
          if (tempGroup && existingPanel) {
            this.movingLock(() => {
              tempGroup.model.removePanel(existingPanel);
            });
            createdPanels.push(existingPanel);
            existingPanel.updateFromStateModel(panels[child]);
          } else {
            const panel = this._deserializer.fromJSON(panels[child], group);
            createdPanels.push(panel);
          }
        }
        for (let i = 0; i < views.length; i++) {
          const panel = createdPanels[i];
          const isActive = typeof activeView === "string" && activeView === panel.id;
          const hasExisting = existingPanels.has(panel.api.id);
          if (hasExisting) {
            this.movingLock(() => {
              group.model.openPanel(panel, {
                skipSetActive: !isActive,
                skipSetGroupActive: true
              });
            });
          } else {
            group.model.openPanel(panel, {
              skipSetActive: !isActive,
              skipSetGroupActive: true
            });
          }
        }
        if (!group.activePanel && group.panels.length > 0) {
          group.model.openPanel(group.panels[group.panels.length - 1], {
            skipSetGroupActive: true
          });
        }
        return group;
      };
      this.gridview.deserialize(grid, {
        fromJSON: (node) => {
          return createGroupFromSerializedState(node.data);
        }
      });
      this.layout(width, height, true);
      const serializedFloatingGroups = (_a = data.floatingGroups) !== null && _a !== void 0 ? _a : [];
      for (const serializedFloatingGroup of serializedFloatingGroups) {
        const { data: data2, position } = serializedFloatingGroup;
        const group = createGroupFromSerializedState(data2);
        this.addFloatingGroup(group, {
          position,
          width: position.width,
          height: position.height,
          skipRemoveGroup: true,
          inDragMode: false
        });
      }
      const serializedPopoutGroups = (_b = data.popoutGroups) !== null && _b !== void 0 ? _b : [];
      const popoutPromises = [];
      serializedPopoutGroups.forEach((serializedPopoutGroup, index) => {
        const { data: data2, position, gridReferenceGroup, url } = serializedPopoutGroup;
        const group = createGroupFromSerializedState(data2);
        const popoutPromise = new Promise((resolve) => {
          setTimeout(() => {
            this.addPopoutGroup(group, {
              position: position !== null && position !== void 0 ? position : void 0,
              overridePopoutGroup: gridReferenceGroup ? group : void 0,
              referenceGroup: gridReferenceGroup ? this.getPanel(gridReferenceGroup) : void 0,
              popoutUrl: url
            });
            resolve();
          }, index * DESERIALIZATION_POPOUT_DELAY_MS);
        });
        popoutPromises.push(popoutPromise);
      });
      this._popoutRestorationPromise = Promise.all(popoutPromises).then(() => void 0);
      for (const floatingGroup of this._floatingGroups) {
        floatingGroup.overlay.setBounds();
      }
      if (typeof activeGroup === "string") {
        const panel = this.getPanel(activeGroup);
        if (panel) {
          this.doSetGroupAndPanelActive(panel);
        }
      }
    } catch (err) {
      console.error("dockview: failed to deserialize layout. Reverting changes", err);
      for (const group of this.groups) {
        for (const panel of group.panels) {
          this.removePanel(panel, {
            removeEmptyGroup: false,
            skipDispose: false
          });
        }
      }
      for (const group of this.groups) {
        group.dispose();
        this._groups.delete(group.id);
        this._onDidRemoveGroup.fire(group);
      }
      for (const floatingGroup of [...this._floatingGroups]) {
        floatingGroup.dispose();
      }
      this.clear();
      throw err;
    }
    this.updateWatermark();
    this.debouncedUpdateAllPositions();
    this._onDidLayoutFromJSON.fire();
  }
  clear() {
    const groups = Array.from(this._groups.values()).map((_) => _.value);
    const hasActiveGroup = !!this.activeGroup;
    for (const group of groups) {
      this.removeGroup(group, { skipActive: true });
    }
    if (hasActiveGroup) {
      this.doSetGroupAndPanelActive(void 0);
    }
    this.gridview.clear();
  }
  closeAllGroups() {
    for (const entry of this._groups.entries()) {
      const [_, group] = entry;
      group.value.model.closeAllPanels();
    }
  }
  addPanel(options) {
    var _a, _b;
    if (this.panels.find((_) => _.id === options.id)) {
      throw new Error(`dockview: panel with id ${options.id} already exists`);
    }
    let referenceGroup;
    if (options.position && options.floating) {
      throw new Error("dockview: you can only provide one of: position, floating as arguments to .addPanel(...)");
    }
    const initial = {
      width: options.initialWidth,
      height: options.initialHeight
    };
    let index;
    if (options.position) {
      if (isPanelOptionsWithPanel(options.position)) {
        const referencePanel = typeof options.position.referencePanel === "string" ? this.getGroupPanel(options.position.referencePanel) : options.position.referencePanel;
        index = options.position.index;
        if (!referencePanel) {
          throw new Error(`dockview: referencePanel '${options.position.referencePanel}' does not exist`);
        }
        referenceGroup = this.findGroup(referencePanel);
      } else if (isPanelOptionsWithGroup(options.position)) {
        referenceGroup = typeof options.position.referenceGroup === "string" ? (_a = this._groups.get(options.position.referenceGroup)) === null || _a === void 0 ? void 0 : _a.value : options.position.referenceGroup;
        index = options.position.index;
        if (!referenceGroup) {
          throw new Error(`dockview: referenceGroup '${options.position.referenceGroup}' does not exist`);
        }
      } else {
        const group = this.orthogonalize(directionToPosition(options.position.direction));
        const panel2 = this.createPanel(options, group);
        group.model.openPanel(panel2, {
          skipSetActive: options.inactive,
          skipSetGroupActive: options.inactive,
          index
        });
        if (!options.inactive) {
          this.doSetGroupAndPanelActive(group);
        }
        group.api.setSize({
          height: initial === null || initial === void 0 ? void 0 : initial.height,
          width: initial === null || initial === void 0 ? void 0 : initial.width
        });
        return panel2;
      }
    } else {
      referenceGroup = this.activeGroup;
    }
    let panel;
    if (referenceGroup) {
      const target = toTarget(((_b = options.position) === null || _b === void 0 ? void 0 : _b.direction) || "within");
      if (options.floating) {
        const group = this.createGroup();
        this._onDidAddGroup.fire(group);
        const floatingGroupOptions = typeof options.floating === "object" && options.floating !== null ? options.floating : {};
        this.addFloatingGroup(group, Object.assign(Object.assign({}, floatingGroupOptions), { inDragMode: false, skipRemoveGroup: true, skipActiveGroup: true }));
        panel = this.createPanel(options, group);
        group.model.openPanel(panel, {
          skipSetActive: options.inactive,
          skipSetGroupActive: options.inactive,
          index
        });
      } else if (referenceGroup.api.location.type === "floating" || target === "center") {
        panel = this.createPanel(options, referenceGroup);
        referenceGroup.model.openPanel(panel, {
          skipSetActive: options.inactive,
          skipSetGroupActive: options.inactive,
          index
        });
        referenceGroup.api.setSize({
          width: initial === null || initial === void 0 ? void 0 : initial.width,
          height: initial === null || initial === void 0 ? void 0 : initial.height
        });
        if (!options.inactive) {
          this.doSetGroupAndPanelActive(referenceGroup);
        }
      } else {
        const location = getGridLocation(referenceGroup.element);
        const relativeLocation = getRelativeLocation(this.gridview.orientation, location, target);
        const group = this.createGroupAtLocation(relativeLocation, this.orientationAtLocation(relativeLocation) === Orientation.VERTICAL ? initial === null || initial === void 0 ? void 0 : initial.height : initial === null || initial === void 0 ? void 0 : initial.width);
        panel = this.createPanel(options, group);
        group.model.openPanel(panel, {
          skipSetActive: options.inactive,
          skipSetGroupActive: options.inactive,
          index
        });
        if (!options.inactive) {
          this.doSetGroupAndPanelActive(group);
        }
      }
    } else if (options.floating) {
      const group = this.createGroup();
      this._onDidAddGroup.fire(group);
      const coordinates = typeof options.floating === "object" && options.floating !== null ? options.floating : {};
      this.addFloatingGroup(group, Object.assign(Object.assign({}, coordinates), { inDragMode: false, skipRemoveGroup: true, skipActiveGroup: true }));
      panel = this.createPanel(options, group);
      group.model.openPanel(panel, {
        skipSetActive: options.inactive,
        skipSetGroupActive: options.inactive,
        index
      });
    } else {
      const group = this.createGroupAtLocation([0], this.gridview.orientation === Orientation.VERTICAL ? initial === null || initial === void 0 ? void 0 : initial.height : initial === null || initial === void 0 ? void 0 : initial.width);
      panel = this.createPanel(options, group);
      group.model.openPanel(panel, {
        skipSetActive: options.inactive,
        skipSetGroupActive: options.inactive,
        index
      });
      if (!options.inactive) {
        this.doSetGroupAndPanelActive(group);
      }
    }
    return panel;
  }
  removePanel(panel, options = {
    removeEmptyGroup: true
  }) {
    const group = panel.group;
    if (!group) {
      throw new Error(`dockview: cannot remove panel ${panel.id}. it's missing a group.`);
    }
    group.model.removePanel(panel, {
      skipSetActiveGroup: options.skipSetActiveGroup
    });
    if (!options.skipDispose) {
      panel.group.model.renderContainer.detatch(panel);
      panel.dispose();
    }
    if (group.size === 0 && options.removeEmptyGroup) {
      this.removeGroup(group, { skipActive: options.skipSetActiveGroup });
    }
  }
  createWatermarkComponent() {
    if (this.options.createWatermarkComponent) {
      return this.options.createWatermarkComponent();
    }
    return new Watermark();
  }
  updateWatermark() {
    var _a, _b;
    if (this.groups.filter((x) => x.api.location.type === "grid" && x.api.isVisible).length === 0) {
      if (!this._watermark) {
        this._watermark = this.createWatermarkComponent();
        this._watermark.init({
          containerApi: new DockviewApi(this)
        });
        const watermarkContainer = document.createElement("div");
        watermarkContainer.className = "dv-watermark-container";
        addTestId(watermarkContainer, "watermark-component");
        watermarkContainer.appendChild(this._watermark.element);
        this.gridview.element.appendChild(watermarkContainer);
      }
    } else if (this._watermark) {
      this._watermark.element.parentElement.remove();
      (_b = (_a = this._watermark).dispose) === null || _b === void 0 ? void 0 : _b.call(_a);
      this._watermark = null;
    }
  }
  addGroup(options) {
    var _a;
    if (options) {
      let referenceGroup;
      if (isGroupOptionsWithPanel(options)) {
        const referencePanel = typeof options.referencePanel === "string" ? this.panels.find((panel) => panel.id === options.referencePanel) : options.referencePanel;
        if (!referencePanel) {
          throw new Error(`dockview: reference panel ${options.referencePanel} does not exist`);
        }
        referenceGroup = this.findGroup(referencePanel);
        if (!referenceGroup) {
          throw new Error(`dockview: reference group for reference panel ${options.referencePanel} does not exist`);
        }
      } else if (isGroupOptionsWithGroup(options)) {
        referenceGroup = typeof options.referenceGroup === "string" ? (_a = this._groups.get(options.referenceGroup)) === null || _a === void 0 ? void 0 : _a.value : options.referenceGroup;
        if (!referenceGroup) {
          throw new Error(`dockview: reference group ${options.referenceGroup} does not exist`);
        }
      } else {
        const group2 = this.orthogonalize(directionToPosition(options.direction), options);
        if (!options.skipSetActive) {
          this.doSetGroupAndPanelActive(group2);
        }
        return group2;
      }
      const target = toTarget(options.direction || "within");
      const location = getGridLocation(referenceGroup.element);
      const relativeLocation = getRelativeLocation(this.gridview.orientation, location, target);
      const group = this.createGroup(options);
      const size = this.getLocationOrientation(relativeLocation) === Orientation.VERTICAL ? options.initialHeight : options.initialWidth;
      this.doAddGroup(group, relativeLocation, size);
      if (!options.skipSetActive) {
        this.doSetGroupAndPanelActive(group);
      }
      return group;
    } else {
      const group = this.createGroup(options);
      this.doAddGroup(group);
      this.doSetGroupAndPanelActive(group);
      return group;
    }
  }
  getLocationOrientation(location) {
    return location.length % 2 == 0 && this.gridview.orientation === Orientation.HORIZONTAL ? Orientation.HORIZONTAL : Orientation.VERTICAL;
  }
  removeGroup(group, options) {
    this.doRemoveGroup(group, options);
  }
  doRemoveGroup(group, options) {
    var _a;
    const panels = [...group.panels];
    if (!(options === null || options === void 0 ? void 0 : options.skipDispose)) {
      for (const panel of panels) {
        this.removePanel(panel, {
          removeEmptyGroup: false,
          skipDispose: (_a = options === null || options === void 0 ? void 0 : options.skipDispose) !== null && _a !== void 0 ? _a : false
        });
      }
    }
    const activePanel = this.activePanel;
    if (group.api.location.type === "floating") {
      const floatingGroup = this._floatingGroups.find((_) => _.group === group);
      if (floatingGroup) {
        if (!(options === null || options === void 0 ? void 0 : options.skipDispose)) {
          floatingGroup.group.dispose();
          this._groups.delete(group.id);
          this._onDidRemoveGroup.fire(group);
        }
        remove(this._floatingGroups, floatingGroup);
        floatingGroup.dispose();
        if (!(options === null || options === void 0 ? void 0 : options.skipActive) && this._activeGroup === group) {
          const groups = Array.from(this._groups.values());
          this.doSetGroupAndPanelActive(groups.length > 0 ? groups[0].value : void 0);
        }
        return floatingGroup.group;
      }
      throw new Error("dockview: failed to find floating group");
    }
    if (group.api.location.type === "popout") {
      const selectedGroup = this._popoutGroups.find((_) => _.popoutGroup === group);
      if (selectedGroup) {
        if (!(options === null || options === void 0 ? void 0 : options.skipDispose)) {
          if (!(options === null || options === void 0 ? void 0 : options.skipPopoutAssociated)) {
            const refGroup = selectedGroup.referenceGroup ? this.getPanel(selectedGroup.referenceGroup) : void 0;
            if (refGroup && refGroup.panels.length === 0) {
              this.removeGroup(refGroup);
            }
          }
          selectedGroup.popoutGroup.dispose();
          this._groups.delete(group.id);
          this._onDidRemoveGroup.fire(group);
        }
        remove(this._popoutGroups, selectedGroup);
        const removedGroup = selectedGroup.disposable.dispose();
        if (!(options === null || options === void 0 ? void 0 : options.skipPopoutReturn) && removedGroup) {
          this.doAddGroup(removedGroup, [0]);
          this.doSetGroupAndPanelActive(removedGroup);
        }
        if (!(options === null || options === void 0 ? void 0 : options.skipActive) && this._activeGroup === group) {
          const groups = Array.from(this._groups.values());
          this.doSetGroupAndPanelActive(groups.length > 0 ? groups[0].value : void 0);
        }
        this.updateWatermark();
        return selectedGroup.popoutGroup;
      }
      throw new Error("dockview: failed to find popout group");
    }
    const re = super.doRemoveGroup(group, options);
    if (!(options === null || options === void 0 ? void 0 : options.skipActive)) {
      if (this.activePanel !== activePanel) {
        this._onDidActivePanelChange.fire(this.activePanel);
      }
    }
    return re;
  }
  debouncedUpdateAllPositions() {
    if (this._updatePositionsFrameId !== void 0) {
      cancelAnimationFrame(this._updatePositionsFrameId);
    }
    this._updatePositionsFrameId = requestAnimationFrame(() => {
      this._updatePositionsFrameId = void 0;
      this.overlayRenderContainer.updateAllPositions();
    });
  }
  movingLock(func) {
    const isMoving = this._moving;
    try {
      this._moving = true;
      return func();
    } finally {
      this._moving = isMoving;
    }
  }
  moveGroupOrPanel(options) {
    var _a;
    const destinationGroup = options.to.group;
    const sourceGroupId = options.from.groupId;
    const sourceItemId = options.from.panelId;
    const destinationTarget = options.to.position;
    const destinationIndex = options.to.index;
    const sourceGroup = sourceGroupId ? (_a = this._groups.get(sourceGroupId)) === null || _a === void 0 ? void 0 : _a.value : void 0;
    if (!sourceGroup) {
      throw new Error(`dockview: Failed to find group id ${sourceGroupId}`);
    }
    if (sourceItemId === void 0) {
      this.moveGroup({
        from: { group: sourceGroup },
        to: {
          group: destinationGroup,
          position: destinationTarget
        },
        skipSetActive: options.skipSetActive
      });
      return;
    }
    if (!destinationTarget || destinationTarget === "center") {
      const removedPanel = this.movingLock(() => sourceGroup.model.removePanel(sourceItemId, {
        skipSetActive: false,
        skipSetActiveGroup: true
      }));
      if (!removedPanel) {
        throw new Error(`dockview: No panel with id ${sourceItemId}`);
      }
      if (!options.keepEmptyGroups && sourceGroup.model.size === 0) {
        this.doRemoveGroup(sourceGroup, { skipActive: true });
      }
      const isDestinationGroupEmpty = destinationGroup.model.size === 0;
      this.movingLock(() => {
        var _a2;
        return destinationGroup.model.openPanel(removedPanel, {
          index: destinationIndex,
          skipSetActive: ((_a2 = options.skipSetActive) !== null && _a2 !== void 0 ? _a2 : false) && !isDestinationGroupEmpty,
          skipSetGroupActive: true
        });
      });
      if (!options.skipSetActive) {
        this.doSetGroupAndPanelActive(destinationGroup);
      }
      this._onDidMovePanel.fire({
        panel: removedPanel,
        from: sourceGroup
      });
    } else {
      const referenceLocation = getGridLocation(destinationGroup.element);
      const targetLocation = getRelativeLocation(this.gridview.orientation, referenceLocation, destinationTarget);
      if (sourceGroup.size < 2) {
        const [targetParentLocation, to] = tail(targetLocation);
        if (sourceGroup.api.location.type === "grid") {
          const sourceLocation = getGridLocation(sourceGroup.element);
          const [sourceParentLocation, from] = tail(sourceLocation);
          if (sequenceEquals(sourceParentLocation, targetParentLocation)) {
            this.gridview.moveView(sourceParentLocation, from, to);
            this._onDidMovePanel.fire({
              panel: this.getGroupPanel(sourceItemId),
              from: sourceGroup
            });
            return;
          }
        }
        if (sourceGroup.api.location.type === "popout") {
          const popoutGroup = this._popoutGroups.find((group) => group.popoutGroup === sourceGroup);
          const removedPanel = this.movingLock(() => popoutGroup.popoutGroup.model.removePanel(popoutGroup.popoutGroup.panels[0], {
            skipSetActive: true,
            skipSetActiveGroup: true
          }));
          this.doRemoveGroup(sourceGroup, { skipActive: true });
          const newGroup = this.createGroupAtLocation(targetLocation);
          this.movingLock(() => newGroup.model.openPanel(removedPanel, {
            skipSetActive: true
          }));
          this.doSetGroupAndPanelActive(newGroup);
          this._onDidMovePanel.fire({
            panel: this.getGroupPanel(sourceItemId),
            from: sourceGroup
          });
          return;
        }
        const targetGroup = this.movingLock(() => this.doRemoveGroup(sourceGroup, {
          skipActive: true,
          skipDispose: true
        }));
        const updatedReferenceLocation = getGridLocation(destinationGroup.element);
        const location = getRelativeLocation(this.gridview.orientation, updatedReferenceLocation, destinationTarget);
        this.movingLock(() => this.doAddGroup(targetGroup, location));
        this.doSetGroupAndPanelActive(targetGroup);
        this._onDidMovePanel.fire({
          panel: this.getGroupPanel(sourceItemId),
          from: sourceGroup
        });
      } else {
        const removedPanel = this.movingLock(() => sourceGroup.model.removePanel(sourceItemId, {
          skipSetActive: false,
          skipSetActiveGroup: true
        }));
        if (!removedPanel) {
          throw new Error(`dockview: No panel with id ${sourceItemId}`);
        }
        const dropLocation = getRelativeLocation(this.gridview.orientation, referenceLocation, destinationTarget);
        const group = this.createGroupAtLocation(dropLocation);
        this.movingLock(() => group.model.openPanel(removedPanel, {
          skipSetGroupActive: true
        }));
        this.doSetGroupAndPanelActive(group);
        this._onDidMovePanel.fire({
          panel: removedPanel,
          from: sourceGroup
        });
      }
    }
  }
  moveGroup(options) {
    const from = options.from.group;
    const to = options.to.group;
    const target = options.to.position;
    if (target === "center") {
      const activePanel = from.activePanel;
      const panels = this.movingLock(() => [...from.panels].map((p2) => from.model.removePanel(p2.id, {
        skipSetActive: true
      })));
      if ((from === null || from === void 0 ? void 0 : from.model.size) === 0) {
        this.doRemoveGroup(from, { skipActive: true });
      }
      this.movingLock(() => {
        for (const panel of panels) {
          to.model.openPanel(panel, {
            skipSetActive: panel !== activePanel,
            skipSetGroupActive: true
          });
        }
      });
      if (options.skipSetActive !== true) {
        this.doSetGroupAndPanelActive(to);
      } else if (!this.activePanel) {
        this.doSetGroupAndPanelActive(to);
      }
    } else {
      switch (from.api.location.type) {
        case "grid":
          this.gridview.removeView(getGridLocation(from.element));
          break;
        case "floating": {
          const selectedFloatingGroup = this._floatingGroups.find((x) => x.group === from);
          if (!selectedFloatingGroup) {
            throw new Error("dockview: failed to find floating group");
          }
          selectedFloatingGroup.dispose();
          break;
        }
        case "popout": {
          const selectedPopoutGroup = this._popoutGroups.find((x) => x.popoutGroup === from);
          if (!selectedPopoutGroup) {
            throw new Error("dockview: failed to find popout group");
          }
          const index = this._popoutGroups.indexOf(selectedPopoutGroup);
          if (index >= 0) {
            this._popoutGroups.splice(index, 1);
          }
          if (selectedPopoutGroup.referenceGroup) {
            const referenceGroup = this.getPanel(selectedPopoutGroup.referenceGroup);
            if (referenceGroup && !referenceGroup.api.isVisible) {
              this.doRemoveGroup(referenceGroup, {
                skipActive: true
              });
            }
          }
          selectedPopoutGroup.window.dispose();
          if (to.api.location.type === "grid") {
            from.model.renderContainer = this.overlayRenderContainer;
            from.model.dropTargetContainer = this.rootDropTargetContainer;
            from.model.location = { type: "grid" };
          } else if (to.api.location.type === "floating") {
            from.model.renderContainer = this.overlayRenderContainer;
            from.model.dropTargetContainer = this.rootDropTargetContainer;
            from.model.location = { type: "floating" };
          }
          break;
        }
      }
      if (to.api.location.type === "grid") {
        const referenceLocation = getGridLocation(to.element);
        const dropLocation = getRelativeLocation(this.gridview.orientation, referenceLocation, target);
        let size;
        switch (this.gridview.orientation) {
          case Orientation.VERTICAL:
            size = referenceLocation.length % 2 == 0 ? from.api.width : from.api.height;
            break;
          case Orientation.HORIZONTAL:
            size = referenceLocation.length % 2 == 0 ? from.api.height : from.api.width;
            break;
        }
        this.gridview.addView(from, size, dropLocation);
      } else if (to.api.location.type === "floating") {
        const targetFloatingGroup = this._floatingGroups.find((x) => x.group === to);
        if (targetFloatingGroup) {
          const box = targetFloatingGroup.overlay.toJSON();
          let left, top;
          if ("left" in box) {
            left = box.left + 50;
          } else if ("right" in box) {
            left = Math.max(0, box.right - box.width - 50);
          } else {
            left = 50;
          }
          if ("top" in box) {
            top = box.top + 50;
          } else if ("bottom" in box) {
            top = Math.max(0, box.bottom - box.height - 50);
          } else {
            top = 50;
          }
          this.addFloatingGroup(from, {
            height: box.height,
            width: box.width,
            position: {
              left,
              top
            }
          });
        }
      }
    }
    from.panels.forEach((panel) => {
      this._onDidMovePanel.fire({ panel, from });
    });
    this.debouncedUpdateAllPositions();
    if (options.skipSetActive === false) {
      const targetGroup = to !== null && to !== void 0 ? to : from;
      this.doSetGroupAndPanelActive(targetGroup);
    }
  }
  doSetGroupActive(group) {
    super.doSetGroupActive(group);
    const activePanel = this.activePanel;
    if (!this._moving && activePanel !== this._onDidActivePanelChange.value) {
      this._onDidActivePanelChange.fire(activePanel);
    }
  }
  doSetGroupAndPanelActive(group) {
    super.doSetGroupActive(group);
    const activePanel = this.activePanel;
    if (group && this.hasMaximizedGroup() && !this.isMaximizedGroup(group)) {
      this.exitMaximizedGroup();
    }
    if (!this._moving && activePanel !== this._onDidActivePanelChange.value) {
      this._onDidActivePanelChange.fire(activePanel);
    }
  }
  getNextGroupId() {
    let id = this.nextGroupId.next();
    while (this._groups.has(id)) {
      id = this.nextGroupId.next();
    }
    return id;
  }
  createGroup(options) {
    if (!options) {
      options = {};
    }
    let id = options === null || options === void 0 ? void 0 : options.id;
    if (id && this._groups.has(options.id)) {
      console.warn(`dockview: Duplicate group id ${options === null || options === void 0 ? void 0 : options.id}. reassigning group id to avoid errors`);
      id = void 0;
    }
    if (!id) {
      id = this.nextGroupId.next();
      while (this._groups.has(id)) {
        id = this.nextGroupId.next();
      }
    }
    const view = new DockviewGroupPanel(this, id, options);
    view.init({ params: {}, accessor: this });
    if (!this._groups.has(view.id)) {
      const disposable = new CompositeDisposable(view.model.onTabDragStart((event) => {
        this._onWillDragPanel.fire(event);
      }), view.model.onGroupDragStart((event) => {
        this._onWillDragGroup.fire(event);
      }), view.model.onMove((event) => {
        const { groupId, itemId, target, index } = event;
        this.moveGroupOrPanel({
          from: { groupId, panelId: itemId },
          to: {
            group: view,
            position: target,
            index
          }
        });
      }), view.model.onDidDrop((event) => {
        this._onDidDrop.fire(event);
      }), view.model.onWillDrop((event) => {
        this._onWillDrop.fire(event);
      }), view.model.onWillShowOverlay((event) => {
        if (this.options.disableDnd) {
          event.preventDefault();
          return;
        }
        this._onWillShowOverlay.fire(event);
      }), view.model.onUnhandledDragOverEvent((event) => {
        this._onUnhandledDragOverEvent.fire(event);
      }), view.model.onDidAddPanel((event) => {
        if (this._moving) {
          return;
        }
        this._onDidAddPanel.fire(event.panel);
      }), view.model.onDidRemovePanel((event) => {
        if (this._moving) {
          return;
        }
        this._onDidRemovePanel.fire(event.panel);
      }), view.model.onDidActivePanelChange((event) => {
        if (this._moving) {
          return;
        }
        if (event.panel !== this.activePanel) {
          return;
        }
        if (this._onDidActivePanelChange.value !== event.panel) {
          this._onDidActivePanelChange.fire(event.panel);
        }
      }), Event.any(view.model.onDidPanelTitleChange, view.model.onDidPanelParametersChange)(() => {
        this._bufferOnDidLayoutChange.fire();
      }));
      this._groups.set(view.id, { value: view, disposable });
    }
    view.initialize();
    return view;
  }
  createPanel(options, group) {
    var _a, _b, _c;
    const contentComponent = options.component;
    const tabComponent = (_a = options.tabComponent) !== null && _a !== void 0 ? _a : this.options.defaultTabComponent;
    const view = new DockviewPanelModel(this, options.id, contentComponent, tabComponent);
    const panel = new DockviewPanel(options.id, contentComponent, tabComponent, this, this._api, group, view, {
      renderer: options.renderer,
      minimumWidth: options.minimumWidth,
      minimumHeight: options.minimumHeight,
      maximumWidth: options.maximumWidth,
      maximumHeight: options.maximumHeight
    });
    panel.init({
      title: (_b = options.title) !== null && _b !== void 0 ? _b : options.id,
      params: (_c = options === null || options === void 0 ? void 0 : options.params) !== null && _c !== void 0 ? _c : {}
    });
    return panel;
  }
  createGroupAtLocation(location, size, options) {
    const group = this.createGroup(options);
    this.doAddGroup(group, location, size);
    return group;
  }
  findGroup(panel) {
    var _a;
    return (_a = Array.from(this._groups.values()).find((group) => group.value.model.containsPanel(panel))) === null || _a === void 0 ? void 0 : _a.value;
  }
  orientationAtLocation(location) {
    const rootOrientation = this.gridview.orientation;
    return location.length % 2 == 1 ? rootOrientation : orthogonal(rootOrientation);
  }
  updateDropTargetModel(options) {
    if ("dndEdges" in options) {
      this._rootDropTarget.disabled = typeof options.dndEdges === "boolean" && options.dndEdges === false;
      if (typeof options.dndEdges === "object" && options.dndEdges !== null) {
        this._rootDropTarget.setOverlayModel(options.dndEdges);
      } else {
        this._rootDropTarget.setOverlayModel(DEFAULT_ROOT_OVERLAY_MODEL);
      }
    }
    if ("rootOverlayModel" in options) {
      this.updateDropTargetModel({ dndEdges: options.dndEdges });
    }
  }
  updateTheme() {
    var _a, _b;
    const theme = (_a = this._options.theme) !== null && _a !== void 0 ? _a : themeAbyss;
    this._themeClassnames.setClassNames(theme.className);
    this.gridview.margin = (_b = theme.gap) !== null && _b !== void 0 ? _b : 0;
    switch (theme.dndOverlayMounting) {
      case "absolute":
        this.rootDropTargetContainer.disabled = false;
        break;
      case "relative":
      default:
        this.rootDropTargetContainer.disabled = true;
        break;
    }
  }
}
function createDockview(element, options) {
  const component = new DockviewComponent(element, options);
  return component.api;
}
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function findComponent(parent, name) {
  var _a, _b;
  let instance = parent;
  let component = null;
  while (!component && instance) {
    component = (_a = instance.components) == null ? void 0 : _a[name];
    instance = instance.parent;
  }
  if (!component) {
    component = (_b = parent.appContext.components) == null ? void 0 : _b[name];
  }
  if (!component) {
    throw new Error(`Failed to find Vue Component '${name}'`);
  }
  return component;
}
function mountVueComponent(component, parent, props, element) {
  let vNode = createVNode(component, Object.freeze(props));
  vNode.appContext = parent.appContext;
  vNode.appContext.provides = {
    ...vNode.appContext.provides ? vNode.appContext.provides : {},
    ...parent.provides ? parent.provides : {}
  };
  render(vNode, element);
  let runningProps = props;
  return {
    update: (newProps) => {
      runningProps = { ...props, ...newProps };
      vNode = cloneVNode(vNode, runningProps);
      render(vNode, element);
    },
    dispose: () => {
      render(null, element);
    }
  };
}
class AbstractVueRenderer {
  constructor(component, parent) {
    __publicField(this, "_element");
    this.component = component;
    this.parent = parent;
    this._element = document.createElement("div");
    this.element.className = "dv-vue-part";
    this.element.style.height = "100%";
    this.element.style.width = "100%";
  }
  get element() {
    return this._element;
  }
}
class VueRenderer extends AbstractVueRenderer {
  constructor() {
    super(...arguments);
    __publicField(this, "_renderDisposable");
    __publicField(this, "_api");
    __publicField(this, "_containerApi");
  }
  init(parameters) {
    var _a;
    this._api = parameters.api;
    this._containerApi = parameters.containerApi;
    const props = {
      params: parameters.params,
      api: parameters.api,
      containerApi: parameters.containerApi,
      tabLocation: parameters.tabLocation
    };
    (_a = this._renderDisposable) == null ? void 0 : _a.dispose();
    this._renderDisposable = mountVueComponent(
      this.component,
      this.parent,
      { params: props },
      this.element
    );
  }
  update(event) {
    var _a;
    if (!this._api || !this._containerApi) {
      return;
    }
    const params = event.params;
    (_a = this._renderDisposable) == null ? void 0 : _a.update({
      params: {
        params,
        api: this._api,
        containerApi: this._containerApi
      }
    });
  }
  dispose() {
    var _a;
    (_a = this._renderDisposable) == null ? void 0 : _a.dispose();
  }
}
class VueWatermarkRenderer extends AbstractVueRenderer {
  constructor() {
    super(...arguments);
    __publicField(this, "_renderDisposable");
  }
  get element() {
    return this._element;
  }
  init(parameters) {
    var _a;
    const props = {
      group: parameters.group,
      containerApi: parameters.containerApi
    };
    (_a = this._renderDisposable) == null ? void 0 : _a.dispose();
    this._renderDisposable = mountVueComponent(
      this.component,
      this.parent,
      { params: props },
      this.element
    );
  }
  update(event) {
  }
  dispose() {
    var _a;
    (_a = this._renderDisposable) == null ? void 0 : _a.dispose();
  }
}
class VueHeaderActionsRenderer extends AbstractVueRenderer {
  constructor(component, parent, group) {
    super(component, parent);
    __publicField(this, "_renderDisposable");
    __publicField(this, "_mutableDisposable", new MutableDisposable());
    __publicField(this, "_baseProps");
    this.group = group;
  }
  get element() {
    return this._element;
  }
  init(props) {
    var _a;
    this._baseProps = props;
    this._mutableDisposable.value = new CompositeDisposable(
      this.group.model.onDidAddPanel(() => {
        this.updateProps();
      }),
      this.group.model.onDidRemovePanel(() => {
        this.updateProps();
      }),
      this.group.model.onDidActivePanelChange(() => {
        this.updateProps();
      }),
      props.api.onDidActiveChange(() => {
        this.updateProps();
      })
    );
    (_a = this._renderDisposable) == null ? void 0 : _a.dispose();
    this._renderDisposable = mountVueComponent(
      this.component,
      this.parent,
      { params: this.buildEnrichedProps() },
      this.element
    );
  }
  dispose() {
    var _a;
    this._mutableDisposable.dispose();
    (_a = this._renderDisposable) == null ? void 0 : _a.dispose();
  }
  buildEnrichedProps() {
    return {
      ...this._baseProps,
      panels: this.group.model.panels,
      activePanel: this.group.model.activePanel,
      isGroupActive: this.group.api.isActive,
      group: this.group,
      headerPosition: this.group.model.headerPosition
    };
  }
  updateProps() {
    var _a;
    (_a = this._renderDisposable) == null ? void 0 : _a.update({ params: this.buildEnrichedProps() });
  }
}
const _sfc_main$3$1 = /* @__PURE__ */ defineComponent({
  __name: "dockview",
  props: {
    disableAutoResizing: { type: Boolean },
    hideBorders: { type: Boolean },
    singleTabMode: {},
    disableFloatingGroups: { type: Boolean },
    floatingGroupBounds: {},
    popoutUrl: {},
    defaultRenderer: {},
    defaultHeaderPosition: {},
    debug: { type: Boolean },
    dndEdges: { type: [Boolean, Object] },
    rootOverlayModel: {},
    disableDnd: { type: Boolean },
    locked: { type: Boolean },
    className: {},
    noPanelsOverlay: {},
    theme: {},
    disableTabsOverflowList: { type: Boolean },
    scrollbars: {},
    tabAnimation: {},
    watermarkComponent: {},
    defaultTabComponent: {},
    rightHeaderActionsComponent: {},
    leftHeaderActionsComponent: {},
    prefixHeaderActionsComponent: {}
  },
  emits: ["ready"],
  setup(__props, { emit: __emit }) {
    function extractCoreOptions(props2) {
      const coreOptions = PROPERTY_KEYS_DOCKVIEW.reduce((obj, key) => {
        obj[key] = props2[key];
        return obj;
      }, {});
      return coreOptions;
    }
    const emit2 = __emit;
    const props = __props;
    const el = /* @__PURE__ */ ref(null);
    const instance = /* @__PURE__ */ ref(null);
    PROPERTY_KEYS_DOCKVIEW.forEach((coreOptionKey) => {
      watch(
        () => props[coreOptionKey],
        (newValue, oldValue) => {
          if (instance.value) {
            instance.value.updateOptions({ [coreOptionKey]: newValue });
          }
        }
      );
    });
    onMounted(() => {
      if (!el.value) {
        throw new Error("dockview-vue: element is not mounted");
      }
      const inst = getCurrentInstance();
      if (!inst) {
        throw new Error("dockview-vue: getCurrentInstance() returned null");
      }
      const frameworkOptions = {
        createComponent(options) {
          const component = findComponent(inst, options.name);
          return new VueRenderer(component, inst);
        },
        createTabComponent(options) {
          let component = findComponent(inst, options.name);
          if (!component && props.defaultTabComponent) {
            component = findComponent(inst, props.defaultTabComponent);
          }
          if (component) {
            return new VueRenderer(component, inst);
          }
          return void 0;
        },
        createWatermarkComponent: props.watermarkComponent ? () => {
          const component = findComponent(
            inst,
            props.watermarkComponent
          );
          return new VueWatermarkRenderer(component, inst);
        } : void 0,
        createLeftHeaderActionComponent: props.leftHeaderActionsComponent ? (group) => {
          const component = findComponent(
            inst,
            props.leftHeaderActionsComponent
          );
          return new VueHeaderActionsRenderer(component, inst, group);
        } : void 0,
        createPrefixHeaderActionComponent: props.prefixHeaderActionsComponent ? (group) => {
          const component = findComponent(
            inst,
            props.prefixHeaderActionsComponent
          );
          return new VueHeaderActionsRenderer(component, inst, group);
        } : void 0,
        createRightHeaderActionComponent: props.rightHeaderActionsComponent ? (group) => {
          const component = findComponent(
            inst,
            props.rightHeaderActionsComponent
          );
          return new VueHeaderActionsRenderer(component, inst, group);
        } : void 0
      };
      const api = createDockview(el.value, {
        ...extractCoreOptions(props),
        ...frameworkOptions
      });
      const { clientWidth, clientHeight } = el.value;
      api.layout(clientWidth, clientHeight);
      instance.value = markRaw(api);
      emit2("ready", { api });
    });
    onBeforeUnmount(() => {
      if (instance.value) {
        instance.value.dispose();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el
      }, null, 512);
    };
  }
});
const useEngineStore = /* @__PURE__ */ defineStore("engine", () => {
  const state = /* @__PURE__ */ ref("DISCONNECTED");
  const status = /* @__PURE__ */ ref(null);
  const modules = /* @__PURE__ */ ref([]);
  const events = /* @__PURE__ */ ref([]);
  const maxEvents = 1e3;
  const isConnected = computed(() => state.value === "CONNECTED");
  function setState(s) {
    state.value = s;
  }
  function setStatus(s) {
    status.value = s;
  }
  function setModules(m) {
    modules.value = m;
  }
  function addEvent(evt) {
    events.value.push(evt);
    if (events.value.length > maxEvents) {
      events.value = events.value.slice(-maxEvents);
    }
  }
  function clearEvents() {
    events.value = [];
  }
  async function connect() {
    setState("CONNECTING");
    try {
      await window.api.engine.connect();
    } catch {
      setState("DISCONNECTED");
    }
  }
  async function disconnect() {
    await window.api.engine.disconnect();
  }
  async function refreshStatus() {
    status.value = await window.api.engine.queryStatus();
  }
  async function refreshModules() {
    modules.value = await window.api.engine.queryModules();
  }
  return {
    state,
    status,
    modules,
    events,
    isConnected,
    setState,
    setStatus,
    setModules,
    addEvent,
    clearEvents,
    connect,
    disconnect,
    refreshStatus,
    refreshModules
  };
});
const _hoisted_1$3 = { class: "connection-panel" };
const _hoisted_2$2 = { class: "header" };
const _hoisted_3$2 = { class: "actions" };
const _hoisted_4$2 = ["disabled"];
const _hoisted_5$2 = ["disabled"];
const _hoisted_6$2 = ["disabled"];
const _hoisted_7$2 = ["disabled"];
const _hoisted_8$1 = {
  key: 0,
  class: "status"
};
const _hoisted_9$1 = { class: "row" };
const _hoisted_10 = { class: "row" };
const _hoisted_11 = { class: "row" };
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ConnectionPanel",
  setup(__props) {
    const store = useEngineStore();
    function formatUptime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      const s = Math.floor(seconds % 60);
      return `${h}h ${m}m ${s}s`;
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$2, [
          _cache[4] || (_cache[4] = createBaseVNode("h3", null, "Engine Connection", -1)),
          createBaseVNode("span", {
            class: normalizeClass(["badge", unref(store).state.toLowerCase()])
          }, toDisplayString(unref(store).state), 3)
        ]),
        createBaseVNode("div", _hoisted_3$2, [
          createBaseVNode("button", {
            disabled: unref(store).isConnected,
            onClick: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => unref(store).connect && unref(store).connect(...args))
          }, "Connect", 8, _hoisted_4$2),
          createBaseVNode("button", {
            disabled: !unref(store).isConnected,
            onClick: _cache[1] || (_cache[1] = //@ts-ignore
            (...args) => unref(store).disconnect && unref(store).disconnect(...args))
          }, "Disconnect", 8, _hoisted_5$2),
          createBaseVNode("button", {
            disabled: !unref(store).isConnected,
            onClick: _cache[2] || (_cache[2] = //@ts-ignore
            (...args) => unref(store).refreshStatus && unref(store).refreshStatus(...args))
          }, "Refresh Status", 8, _hoisted_6$2),
          createBaseVNode("button", {
            disabled: !unref(store).isConnected,
            onClick: _cache[3] || (_cache[3] = //@ts-ignore
            (...args) => unref(store).refreshModules && unref(store).refreshModules(...args))
          }, "Refresh Modules", 8, _hoisted_7$2)
        ]),
        unref(store).status ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
          createBaseVNode("div", _hoisted_9$1, [
            _cache[5] || (_cache[5] = createBaseVNode("label", null, "Uptime:", -1)),
            createBaseVNode("span", null, toDisplayString(formatUptime(unref(store).status.uptime)), 1)
          ]),
          createBaseVNode("div", _hoisted_10, [
            _cache[6] || (_cache[6] = createBaseVNode("label", null, "Modules:", -1)),
            createBaseVNode("span", null, toDisplayString(unref(store).status.module_count), 1)
          ]),
          createBaseVNode("div", _hoisted_11, [
            _cache[7] || (_cache[7] = createBaseVNode("label", null, "Events:", -1)),
            createBaseVNode("span", null, toDisplayString(unref(store).status.event_count), 1)
          ])
        ])) : createCommentVNode("", true)
      ]);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const ConnectionPanel = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-f1348c4e"]]);
const _hoisted_1$2 = { class: "event-panel" };
const _hoisted_2$1 = { class: "header" };
const _hoisted_3$1 = { class: "filters" };
const _hoisted_4$1 = ["value"];
const _hoisted_5$1 = { class: "list" };
const _hoisted_6$1 = { class: "time" };
const _hoisted_7$1 = { class: "type" };
const _hoisted_8 = { class: "sender" };
const _hoisted_9 = { class: "name" };
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "EventPanel",
  setup(__props) {
    const store = useEngineStore();
    const eventTypes = ["on", "on_common", "ack", "whisper", "broadcast", "unknown"];
    const selectedTypes = /* @__PURE__ */ ref([...eventTypes]);
    const filteredEvents = computed(
      () => store.events.filter((e) => selectedTypes.value.includes(e._type)).slice(-200)
    );
    function formatTime(ts) {
      if (!ts) return "--:--:--";
      const d = new Date(ts * 1e3);
      return d.toLocaleTimeString("en-US", { hour12: false });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$1, [
          _cache[2] || (_cache[2] = createBaseVNode("h3", null, "Event Stream", -1)),
          createBaseVNode("button", {
            onClick: _cache[0] || (_cache[0] = //@ts-ignore
            (...args) => unref(store).clearEvents && unref(store).clearEvents(...args))
          }, "Clear")
        ]),
        createBaseVNode("div", _hoisted_3$1, [
          (openBlock(), createElementBlock(Fragment, null, renderList(eventTypes, (t) => {
            return createBaseVNode("label", { key: t }, [
              withDirectives(createBaseVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedTypes.value = $event),
                type: "checkbox",
                value: t
              }, null, 8, _hoisted_4$1), [
                [vModelCheckbox, selectedTypes.value]
              ]),
              createTextVNode(" " + toDisplayString(t), 1)
            ]);
          }), 64))
        ]),
        createBaseVNode("div", _hoisted_5$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(filteredEvents.value, (evt, i) => {
            return openBlock(), createElementBlock("div", {
              key: i,
              class: normalizeClass(["event-row", evt._type])
            }, [
              createBaseVNode("span", _hoisted_6$1, toDisplayString(formatTime(evt.timestamp)), 1),
              createBaseVNode("span", _hoisted_7$1, toDisplayString(evt._type), 1),
              createBaseVNode("span", _hoisted_8, toDisplayString(evt.sender), 1),
              createBaseVNode("span", _hoisted_9, toDisplayString(evt.event), 1)
            ], 2);
          }), 128))
        ])
      ]);
    };
  }
});
const EventPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-2f78e208"]]);
const _hoisted_1$1 = { class: "module-panel" };
const _hoisted_2 = { class: "header" };
const _hoisted_3 = { class: "count" };
const _hoisted_4 = { class: "list" };
const _hoisted_5 = { class: "top" };
const _hoisted_6 = { class: "id" };
const _hoisted_7 = { class: "interfaces" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ModulePanel",
  setup(__props) {
    const store = useEngineStore();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2, [
          _cache[0] || (_cache[0] = createBaseVNode("h3", null, "Modules", -1)),
          createBaseVNode("span", _hoisted_3, toDisplayString(unref(store).modules.length), 1)
        ]),
        createBaseVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(store).modules, (mod) => {
            return openBlock(), createElementBlock("div", {
              key: mod.id,
              class: "module-row"
            }, [
              createBaseVNode("div", _hoisted_5, [
                createBaseVNode("span", _hoisted_6, toDisplayString(mod.id), 1),
                createBaseVNode("span", {
                  class: normalizeClass(["badge", mod.status.toLowerCase()])
                }, toDisplayString(mod.status), 3)
              ]),
              createBaseVNode("div", _hoisted_7, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(mod.interfaces, (iface) => {
                  return openBlock(), createElementBlock("span", {
                    key: iface,
                    class: "tag"
                  }, toDisplayString(iface), 1);
                }), 128))
              ])
            ]);
          }), 128))
        ])
      ]);
    };
  }
});
const ModulePanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0ea14240"]]);
const _hoisted_1 = { class: "app" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const store = useEngineStore();
    const components = {
      connection: ConnectionPanel,
      events: EventPanel,
      modules: ModulePanel
    };
    const Watermark2 = () => null;
    function onReady(event) {
      const api = event.api;
      api.addPanel({
        id: "connection",
        component: "connection",
        title: "Connection",
        position: { direction: "left", size: 250 }
      });
      api.addPanel({
        id: "events",
        component: "events",
        title: "Events",
        position: { direction: "center" }
      });
      api.addPanel({
        id: "modules",
        component: "modules",
        title: "Modules",
        position: { direction: "right", size: 300 }
      });
    }
    onMounted(() => {
      window.api.engine.onStateChange((s) => store.setState(s));
      window.api.engine.onEvent((e) => store.addEvent(e));
      window.api.engine.onHeartbeat(() => store.refreshModules());
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(unref(_sfc_main$3$1), {
          components,
          "watermark-component": Watermark2,
          onReady
        })
      ]);
    };
  }
});
const app = createApp(_sfc_main);
app.use(createPinia());
app.mount("#app");
