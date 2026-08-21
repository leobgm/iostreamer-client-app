'use strict';
// Auto-generated. Loads bytecode-embedded EJS templates and overrides Express's
// render so res.render('name', data) works with no .ejs files on disk.
require('bytenode');
const path = require('path');
const RAW = require(path.join(__dirname, '__protected_views.jsc'));

function escapeXML(m){
  return m == undefined ? '' : String(m)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&#34;').replace(/'/g,'&#39;');
}
function rethrow(err){ throw err; }
function norm(n){ return String(n).replace(/\\/g,'/').replace(/\.ejs$/,'').replace(/^\.\//,''); }
function resolveKey(name, baseDir){
  const n = norm(name);
  if (n.charAt(0) === '/') return n.replace(/^\/+/,'');           // views-root absolute
  return path.posix.normalize(path.posix.join(baseDir, n)).replace(/^\.?\//,''); // relative to template
}
const _cache = {};
function getRender(key){
  if (Object.prototype.hasOwnProperty.call(_cache, key)) return _cache[key];
  const fn = RAW[key];
  if (!fn){ _cache[key] = null; return null; }
  const baseDir = path.posix.dirname(key);
  const render = function(locals){
    const own = locals || {};
    const include = function(name, includeData){
      const rk = resolveKey(name, baseDir);
      const child = getRender(rk);
      if (!child) throw new Error('EJS include not found: ' + name + ' (resolved: ' + rk + ')');
      // EJS semantics: an include inherits the parent's locals, overridden by any passed data.
      const merged = includeData ? Object.assign({}, own, includeData) : own;
      return child(merged);
    };
    // Match stock EJS (compiled via new Function): let templates read Node globals
    // that the app sets (e.g. mainServerAddress). Locals still take precedence.
    const scope = Object.assign(Object.create(globalThis), own);
    return fn(scope, escapeXML, include, rethrow);
  };
  _cache[key] = render;
  return render;
}

try {
  const app = require('express').application;
  const orig = app.render;
  app.render = function(name, options, callback){
    if (typeof options === 'function'){ callback = options; options = {}; }
    const r = getRender(norm(name));
    if (!r) return orig.call(this, name, options, callback);   // fall back for non-protected views
    const opts = {};
    Object.assign(opts, this.locals);
    if (options && options._locals) Object.assign(opts, options._locals);
    Object.assign(opts, options || {});
    delete opts._locals;
    try { callback(null, r(opts)); } catch (e){ callback(e); }
  };
} catch (e) { /* express not present; renderers still available below */ }

module.exports = {
  render: function(name, locals){
    const r = getRender(norm(name));
    if (!r) throw new Error('protected view not found: ' + name);
    return r(locals || {});
  },
};
