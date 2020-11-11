(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AST = factory()
  }
}(this, function () {
'use strict'

function drill (l) {
  return Array.isArray(l) ? Array.prototype.concat.apply([], l.filter(x => x).map(drill)) : [l]
}

class Node {
  constructor (tokens) {
    this.tokens = drill(tokens)
  }

  traverse (f) {
    let result = []

    const ret = f(this)
    const [cont, retval] = Array.isArray(ret) ? ret : [ret]
    if (retval !== undefined) {
      result.push(retval)
    }
    if (cont) {
      const tokens = Array.isArray(cont) ? cont : this.tokens
      for (let i = 0; i < tokens.length; i++) {
        const node = tokens[i]
        if (node instanceof Node) {
          result = result.concat(node.traverse(f))
        }
      }
    }

    return result
  }

  toString () {
    return this.tokens.join(' ')
  }

  analyse () {
    console.warn('Analysing for', this, ' Unimplemented')
  }

  getRange () {
    const firstToken = this.traverse(node => {
      const firstToken = node.tokens[0]
      return firstToken instanceof Node ? [[firstToken]]: [false, firstToken]
    })[0]
    const lastToken = this.traverse(node => {
      const lastToken = node.tokens[node.tokens.length - 1]
      return lastToken instanceof Node ? [[lastToken]]: [false, lastToken]
    })[0]
    return new ace.Range(
      firstToken.line - 1, firstToken.col - 1,
      lastToken.line - 1, lastToken.col + lastToken.text.length - 1
    )
  }
}

class Statement extends Node { }

class Select extends Statement {
  constructor (tokens, top, all, distinct, selections, from) {
    super(tokens)
    this.top = top
    this.all = all
    this.distinct = distinct
    this.selections = selections
    this.from = from
  }

  analyse () {
    const result = this.from ? this.from.analyse() : new Graph.View(this)
    result.columns = this.selections.analyse(result)
    result.ast = this
    if (this.from) {
      this.from.postAnalyse(result)
    }
    return result
  }
}

class Union extends Statement {
  constructor (tokens, left, right) {
    super(tokens)
    this.left = left
    this.right = right
  }
}

class Clause extends Node { }

class Alias extends Clause {
  constructor (tokens, expr, alias) {
    super(tokens)
    this.expr = expr
    this.alias = alias
  }

  analyse (view) {
    const result = this.expr.analyse(view)
    result.name = this.alias.name
    result.ast = this
    return result
  }
}

class ColumnSelection extends Alias {
  analyse (view) {
    let result = this.expr.analyse(view)
    result.name = this.alias ? this.alias.name :
        this.expr instanceof Identifier ? this.expr.name :
        this.expr instanceof Column ? this.expr.column.name :
        Graph.Column.anonymous
    result.ast = this
    return result
  }
}

class TableAlias extends Alias {
  constructor (tokens, table, alias) {
    super(tokens)
    this.table = table
    this.alias = alias
  }

  analyse (view) {
    let result = this.table.analyse(view)
    if (!(result instanceof Graph.View)) {
      result = new Graph.View(this, [result])
    }
    result.name = this.alias.name
    result.ast = this
    return result
  }
}

class SelectionSet extends Clause {
  constructor (tokens, selections) {
    super(tokens)
    this.selections = selections
    for (let i = 0; i < selections.length; i++) {
      this[i] = selections[i]
    }
    this.length = selections.length
  }

  toString () {
    return this.selections.join(', ')
  }

  analyse (view) {
    return this.selections.map(x => x.analyse(view))
  }
}

class From extends Clause {
  constructor (tokens, tables, where, groupBy, having, orders, limit) {
    super(tokens)
    this.tables = tables
    this.where = where
    this.groupBy = groupBy
    this.having = having
    this.orders = orders
    this.limit = limit
  }

  toString () {
    return 'FROM ' + this.tables.map(x => x.toString()).join(', ') +
      (this.where ? ' WHERE ' + this.where : '') +
      (this.groupBy ? ' ' + this.groupBy : '') +
      (this.having ? ' HAVING ' + this.having : '') +
      (this.orders ? ' ORDER BY ' + this.orders.join(', ') : '') +
      (this.limit ? ' LIMIT ' + this.limit : '')
  }

  analyse () {
    return new Graph.View(this, this.tables.map(x => x.analyse()))
  }

  postAnalyse (view) {
    view._postAnalysing = true
    if (this.where) {
      view.addDepend(this.where.analyse(view))
    }
    if (this.groupBy) {
      this.groupBy.analyse(view).forEach(e => view.addDepend(e))
    }
    if (this.having) {
      view.addDepend(this.having.analyse(view))
    }
    if (this.orders) {
      this.orders.forEach(e => view.addDepend(e.analyse(view)))
    }
    view._postAnalysing = false
  }
}

class Join extends Clause {
  constructor (tokens, operator, left, right, on, using) {
    super(tokens)
    this.operator = operator
    this.left = left
    this.right = right
    this.on = on
    this.using = using
  }

  toString () {
    return [
      this.left, this.operator, 'JOIN', this.right,
      this.on ? 'ON' : 'USING', this.on || `(${this.using})`
    ].join(' ')
  }

  analyse () {
    const result = new Graph.View(
      this, [this.left.analyse(), this.right.analyse()]
    )
    if (this.on) {
      result.addDepend(this.on.analyse(result))
    }
    if (this.using) {
      result.addDepend(this.using.analyse(result))
    }
    return result
  }
}

class GroupBy extends Clause {
  constructor (tokens, columns, with_rollup) {
    super(tokens)
    this.columns = columns
    this.with_rollup = with_rollup
  }

  analyse (view) {
    return this.columns.analyse(view)
  }
}

class Order extends Clause {
  constructor (tokens, value, with_rollup) {
    super(tokens)
    this.value = value
    this.direction = direction
  }

  analyse (view) {
    const result = this.value.analyse(view)
    result.ast = this
    return result
  }
}

class Expression extends Node {
  static _updateVariables (variables, propNode) {
    if (propNode instanceof Graph.Expression) {
      for (let i of propNode.variables) {
        variables.add(i)
      }
    } else if (propNode instanceof Graph.Node) {
      variables.add(propNode)
    }
  }

  getVariables (view) {
    const variables = new Set
    for (let prop in this) {
      if (this[prop] instanceof Node) {
        Expression._updateVariables(variables, this[prop].analyse(view))
      }
    }
    return variables
  }

  analyse (view) {
    return new Graph.Expression(this, this.getVariables(view))
  }
}

class ExpressionList extends Expression {
  constructor (tokens, exprs) {
    super(tokens)
    this.exprs = exprs
  }

  toString () {
    return this.exprs.join(', ')
  }

  getVariables (view) {
    const variables = new Set
    for (let i = 0; i < this.exprs.length; i++) {
      Expression._updateVariables(variables, this.exprs[i].analyse(view))
    }
    return variables
  }
}

class BinaryOpExpression extends Expression {
  constructor (tokens, operator, left, right) {
    super(tokens)
    this.operator = operator
    this.left = left
    this.right = right
  }

  toString () {
    if (this.operator.endsWith('IN') && this.right instanceof ExpressionList) {
      return [this.left, this.operator, '(' + this.right + ')'].join(' ')
    } else {
      return super.toString()
    }
  }
}

class UnaryOpExpression extends Expression {
  constructor (tokens, operator, operand) {
    super(tokens)
    this.operator = operator
    this.operand = operand
  }

  toString () {
    return this.tokens.join('')
  }
}

class FunctionCall extends Expression {
  constructor (tokens, func, parameters, distinct, all) {
    super(tokens)
    this.func = func
    this.parameters = parameters
    this.distinct = distinct
    this.all = all
  }

  toString () {
    return this.func + '(' + this.parameters + ')'
  }

  getVariables (view) {
    return this.parameters.getVariables(view)
  }
}

class Subquery extends Expression {
  constructor (tokens, query) {
    super(tokens)
    this.query = query
  }

  toString () {
    return this.tokens.join('')
  }

  analyse () {
    const result = this.query.analyse()
    result.ast = this
    return result
  }
}

class Case extends Expression {
  constructor (tokens, expr, whenList, else_) {
    super(tokens)
    this.expr = expr
    this.whenList = whenList
    this.else_ = else_
  }

  getVariables (view) {
    const variables = new Set
    if (this.expr) {
      Expression._updateVariables(variables, this.expr.analyse(view))
    }
    for (let i = 0; i < this.whenList.length; i++) {
      Expression._updateVariables(variables, this.whenList[i][0].analyse(view))
      Expression._updateVariables(variables, this.whenList[i][1].analyse(view))
    }
    if (this.else_) {
      Expression._updateVariables(variables, this.else_.analyse(view))
    }
    return variables
  }

  toString () {
    return 'CASE' + (this.expr ? ' ' + this.expr : '') + ' ' +
      this.whenList.map(l => 'WHEN ' + l[0] + ' THEN ' + l[1]).join(' ') +
      (this.else_ ? ' ELSE ' + this.else_ : '') + ' END'
  }
}

class If extends Expression {
  constructor (tokens, cond, true_, false_) {
    super(tokens)
    this.cond = cond
    this.true_ = true_
    this.false_ = false_
  }

  toString () {
    return `IF(${this.cond}, ${this.true_}, ${this.false_})`
  }
}

class Immediate extends Expression {
  toString () {
    return this.tokens.join('')
  }

  getVariables (view) {
    return new Set
  }
}

class Column extends Immediate {
  constructor (tokens, table, column) {
    super(tokens)
    this.table = table
    this.column = column
  }

  analyse (view) {
    return new Graph.Column(this, this.column.name, view, this.table.name)
  }
}

class Variable extends Immediate {
  constructor (tokens, name) {
    super(tokens)
    this.name = name
  }
}

class Identifier extends Immediate {
  constructor (tokens, name) {
    super(tokens)
    this.name = name
  }

  toString () {
    return this.tokens[0].text
  }

  analyse (view) {
    return new Graph.Column(this, this.name, view)
  }
}

class Table extends Identifier {
  toString () {
    return this.name.toString()
  }

  analyse () {
    return new Graph.Table(this)
  }
}

class Literial extends Immediate {
  constructor (tokens, value) {
    super(tokens)
    this.value = value
  }
}

class Number_ extends Literial { }

class String_ extends Literial {
  toString () {
    return this.tokens[0].text
  }
}

class Boolean_ extends Literial { }

class Null extends Literial {
  constructor (tokens) {
    super(tokens, null)
  }
}

class Unknown extends Literial {
  constructor (tokens) {
    super(tokens, undefined)
  }
}

class Keyword extends Node {
  static keywords = [
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
  ]
  static validFunctionIdentifiers = ['LEFT', 'RIGHT', 'REPLACE', 'MOD']

  constructor (tokens, keyword) {
    super(tokens)
    this.keyword = keyword
  }
}

function parse (text) {
  return new nearley.Parser(grammar).feed(text).results[0]
}


return {
  Node,
  Statement,
    Select, Union,
  Clause,
    Alias,
      ColumnSelection, TableAlias,
    SelectionSet, From, Join, GroupBy, Order,
  Expression,
    ExpressionList,
    BinaryOpExpression, UnaryOpExpression,
    FunctionCall, Subquery, Case, If,
    Immediate,
      Column, Variable,
      Identifier,
        Table,
      Literial,
        Number: Number_, String: String_, Boolean: Boolean_, Null, Unknown,
  Keyword,
  parse,
}}))
