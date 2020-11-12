function isObject (val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

function isWindow (val) {
  /* jshint eqeqeq:false */
  var doc, docWin;
  return !!(
    val
    && typeof val === 'object'
    && typeof val.window === 'object'
    && val.window == val
    && val.setTimeout
    && val.alert
    && (doc = val.document)
    && typeof doc === 'object'
    && (docWin = doc.defaultView || doc.parentWindow)
    && typeof docWin === 'object'
    && docWin == val
  );
}

function isNode (val) {
  if (!isObject(val) || !isWindow(window) || typeof window.Node !== 'function') {
    return false
  }

  return typeof val.nodeType === 'number' &&
    typeof val.nodeName === 'string'
}
