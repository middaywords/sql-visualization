(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.sqlLexer = factory()
  }
}(this, function () {
'use strict'

const reserved = [
  "ACCESSIBLE", "ADD", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC",
  "ASENSITIVE", "BEFORE", "BETWEEN", "BIGINT", "BINARY", "BLOB", "BOTH", "BY",
  "CALL", "CASCADE", "CASE", "CHANGE", "CHAR", "CHARACTER", "CHECK",
  "COLLATE", "COLUMN", "CONDITION", "CONSTRAINT", "CONTINUE", "CONVERT",
  "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP",
  "CURRENT_USER", "CURSOR", "DATABASE", "DATABASES", "DAY_HOUR",
  "DAY_MICROSECOND", "DAY_MINUTE", "DAY_SECOND", "DEC", "DECIMAL", "DECLARE",
  "DEFAULT", "DELAYED", "DELETE", "DESC", "DESCRIBE", "DETERMINISTIC",
  "DISTINCT", "DIV", "DOUBLE", "DROP", "DUAL", "EACH", "ELSE", "ELSEIF",
  "ENCLOSED", "END", "ESCAPED", "EXISTS", "EXIT", "EXPLAIN", "FALSE", "FETCH",
  "FLOAT", "FLOAT4", "FLOAT8", "FOR", "FORCE", "FOREIGN", "FROM", "FULLTEXT",
  "GET", "GRANT", "GROUP", "HAVING", "HIGH_PRIORITY", "HOUR_MICROSECOND",
  "HOUR_MINUTE", "HOUR_SECOND", "IF", "IGNORE", "IN", "INDEX", "INFILE",
  "INNER", "INOUT", "INSENSITIVE", "INSERT", "INT", "INT1", "INT2", "INT3",
  "INT4", "INT8", "INTEGER", "INTERVAL", "INTO", "IO_AFTER_GTIDS",
  "IO_BEFORE_GTIDS", "IS", "ITERATE", "JOIN", "KEY", "KEYS", "KILL",
  "LEADING", "LEAVE", "LEFT", "LIKE", "LIMIT", "LINEAR", "LINES", "LOAD",
  "LOCALTIME", "LOCALTIMESTAMP", "LOCK", "LONG", "LONGBLOB", "LONGTEXT",
  "LOOP", "LOW_PRIORITY", "MASTER_BIND", "MASTER_SSL_VERIFY_SERVER_CERT",
  "MATCH", "MAXVALUE", "MEDIUMBLOB", "MEDIUMINT", "MEDIUMTEXT", "MIDDLEINT",
  "MINUTE_MICROSECOND", "MINUTE_SECOND", "MOD", "MODIFIES", "NATURAL", "NOT",
  "NO_WRITE_TO_BINLOG", "NULL", "NUMERIC", "ON", "OPTIMIZE", "OPTION",
  "OPTIONALLY", "OR", "ORDER", "OUT", "OUTER", "OUTFILE", "PARTITION",
  "PRECISION", "PRIMARY", "PROCEDURE", "PURGE", "RANGE", "READ", "READS",
  "READ_WRITE", "REAL", "REFERENCES", "REGEXP", "RELEASE", "RENAME",
  "REQUIRE", "RESIGNAL", "RESTRICT", "RETURN", "REVOKE", "RIGHT", "RLIKE",
  "SCHEMA", "SCHEMAS", "SECOND_MICROSECOND", "SELECT", "SENSITIVE",
  "SEPARATOR", "SET", "SHOW", "SMALLINT", "SPATIAL", "SPECIFIC", "SQL",
  "SQLEXCEPTION", "SQLSTATE", "SQLWARNING", "SQL_BIG_RESULT",
  "SQL_CALC_FOUND_ROWS", "SQL_SMALL_RESULT", "SSL", "STARTING",
  "STRAIGHT_JOIN", "TABLE", "TERMINATED", "THEN", "TINYBLOB", "TINYINT",
  "TINYTEXT", "TO", "TOP", "TRAILING", "TRIGGER", "TRUE", "UNDO", "UNION",
  "UNIQUE", "UNLOCK", "UNSIGNED", "UPDATE", "USAGE", "USE", "USING",
  "UTC_DATE", "UTC_TIME", "UTC_TIMESTAMP", "VALUES", "VARBINARY", "VARCHAR",
  "VARCHARACTER", "VARYING", "WHEN", "WHERE", "WHILE", "WITH", "WRITE",
  "XOR", "YEAR_MONTH", "ZEROFILL"
];

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
    type: caseInsensitiveKeywords({keyword: reserved,}),
    value: x => {
      let upperX = x.toUpperCase()
      return reserved.includes(upperX) ? upperX : x
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
