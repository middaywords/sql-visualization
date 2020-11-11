(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.sqlLexer = factory()
  }
}(this, function () {
'use strict'

const caseInsensitiveKeywords = map => {
  const transform = moo.keywords(map)
  return text => transform(text.toUpperCase())
}

function processString (s) {
  return unescape(s.slice(1, -1))
}
const sqlLexer = moo.compile({
  WS:         { match: /[ \t\n\v\f]+/, lineBreaks: true },
  comment:    /(?:#|--).*$/,
  identifier:    {
    match: /[a-zA-Z_][a-zA-Z0-9_]*/,
    type: caseInsensitiveKeywords({keyword: AST.Keyword.keywords,}),
    value: x => {
      let upperX = x.toUpperCase()
      return AST.Keyword.keywords.includes(upperX) ? upperX : x
    },
  },
  bkidentifier: {
    match: /\[(?:[^\]]|\\])+\]/,
    value: processString,
  },
  float:      {
    match: /(?:(?:0|[1-9][0-9]*)(?:\.\d*(?:[eE][+-]?\d+)?|[eE][+-]?\d+)|\.\d+(?:[eE][+-]?\d+)?)/,
    value: parseFloat,
  },
  number:     {
    match: /0|[1-9][0-9]*/,
    value: parseInt,
  },
  string:     {
    match: /"(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*'/,
    value: processString,
  },
  btstring:   {
    match: /`[^`]*`/,
    value: processString,
  },
  lparen:     '(',
  rparen:     ')',
  semicolon:  ';',
  comma:      ',',
  dot:        '.',
  asterisk:   '*',
  at:         '@',
  unaryOp:    {
    match: /[!~]/,
  },
  arithBinaryOp: {
    match: ["+", "-", "/", "%", "&", "|", "^", "<<", ">>"], // "*",
  },
  boolBinaryOp: {
    match: ['=', '<=>', '<>', '<', '<=', '>', '>=', '!='],
  },
  condBinaryOp: {
    match: ['||', '&&'],
  },
})


return sqlLexer
}))
