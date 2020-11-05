(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Graph = factory()
  }
}(this, function () {
'use strict'

function setConcat (a, b) {
  for (let i of b) {
    a.add(i)
  }
}

class DefaultMap extends Map {
  constructor (factory, entries) {
    super(entries)
    this.factory = factory
    this.length = 0
  }

  get (key) {
    if (this.has(key)) {
      return super.get(key)
    }
    const value = this.factory(key)
    this.set(key, value)
    return value
  }

  push (value) {
    this.set(this.length, value)
    this.length++
  }

  pop () {
    this.length--
    const value = super.get(this.length)
    this.remove(this.length)
    return value
  }
}

class Node {
  constructor (ast, name) {
    this.asts = [ast]
    this.name = name
    this.parents = new Set
  }

  get ast () {
    return this.asts[0]
  }

  set ast (ast) {
    this.asts[0] = ast
  }

  dig () {
    return this
  }

  getChildren () { }

  trackParent () {
    if (this.parents.size === 0) {
      this.parents.add(this)
      const children = this.getChildren()
      if (children) {
        for (let child of children) {
          child.trackParent()
          child.parents.add(this)
        }
      }
      this.parents.delete(this)
    }
  }

  postfix () {
    this.trackParent()
    let graphInfo = this.analyse()
    let reduced = false

    const uniqueColumns = new DefaultMap(x => [])
    for (let column of graphInfo.columns) {
      // 1. merge same nodes
      const columnFroms = column.getSortedFrom()
      const identicalColumn = uniqueColumns.get(column.name).filter(i => {
        const otherFroms = i.getSortedFrom()
        return otherFroms.length === columnFroms.length &&
          otherFroms.reduce(((a, e, i) => a && e == columnFroms[i]), true)
      })[0]
      if (identicalColumn) {
        reduced = true
        console.debug('Merge into column', identicalColumn, 'from', column)
        for (let parent of column.parents) {
          parent.replace(column, identicalColumn)
          identicalColumn.parents.add(parent)
        }
        identicalColumn.asts = identicalColumn.asts.concat(column.asts)
        continue
      } else {
        uniqueColumns.get(column.name).push(column)
      }
      // 2. fix dangling column references
      if (column.froms.size === 1) {
        const table = column.getFirstFrom()
        if (table.maybe && table.maybe.has(column.name)) {
          console.debug('Found table', table, 'has column', column)
          table.add(column.name)
        }
      }
    }

    if (reduced) {
      const oldGraphInfo = graphInfo
      graphInfo = this.analyse()
      console.debug(
        'Reducer: Before:', Node.formatAnalyse(oldGraphInfo),
        '\n          After:', Node.formatAnalyse(graphInfo)
      )
    }
    return graphInfo
  }

  static formatAnalyse (result) {
    return [
      'Tables:\t' + result.tables.size,
      'Columns:\t' + result.columns.size,
      'Expressions:\t' + result.expressions.size,
      'Views:\t' + result.views.size,
    ].join(',\t')
  }

  analyse (stack) {
    stack = [this].concat(stack)

    const result = {
      graph: this,
      tables: new Set,
      columns: new Set,
      expressions: new Set,
      views: new Set,
    }
    result[this.constructor.type + 's'].add(this)

    const children = this.getChildren()
    if (children) {
      for (let child of children) {
        if (!stack.includes(child)) {
          const subresult = child.analyse(stack)
          setConcat(result.tables, subresult.tables)
          setConcat(result.columns, subresult.columns)
          setConcat(result.expressions, subresult.expressions)
          setConcat(result.views, subresult.views)
        }
      }
    }
    return result
  }
}

class Table extends Node {
  constructor (ast, name) {
    super(ast, name || (ast && ast.name.name))
    this.structure = new Set
    this.maybe = new Set
  }

  describe (column) {
    return [`Table ${this.name}${this.has(column.name) ? '' : ' (maybe)' };`]
  }

  static type = 'table'

  add (columnName) {
    this.structure.add(columnName)
    this.maybe.delete(columnName)
    return columnName
  }

  has (columnName) {
    return this.structure.has(columnName)
  }

  dig (columnName, thisScope) {
    if (!this.has(columnName)) {
      if (typeof thisScope === 'boolean' && thisScope) {
        this.add(columnName)
      } else {
        this.maybe.add(columnName)
      }
    }
    return new Set([this])
  }
}

class Condition extends Node {
  constructor (ast, name, cases) {
    super(ast, name)
    this.cases = cases
  }
}

class Case extends Node {
  static caseName = {
    toString: x => 'CASE',
    render: x => '<i>anonymous</i>',
  }

  constructor (ast, cond, then) {
    super(ast, caseName)
    this.cond = cond
    this.then = then
  }
}

class Expression extends Node {
  constructor (ast, variables) {
    super(ast)
    this.text = ast.toString()
    this.variables = variables
  }

  describe () {
    return this.variables ? [
      `${this.name} from "${this.text}", which depends on:`,
      ...Array.from(this.variables).map(variable => variable.describe())
    ] : [
      `${this.name} from "${this.text}";`
    ]
  }

  static type = 'expression'

  getChildren () {
    return this.variables
  }

  replace (from, to) {
    if (this.variables.delete(from)) {
      this.variables.add(to)
    }
  }
}

class View extends Node {
  constructor (ast, froms) {
    super(ast)
    this.columns = []
    this.depends = new Set
    this.froms = new DefaultMap(x => new Table(null, x))
    if (froms) {
      froms.map(x => {
        this.froms.push(x)
        if (x.name) {
          this.froms.set(x.name, x)
        }
        if (x instanceof View) {
          for (let [name, tableLike] of x.froms) {
            if (typeof name !== 'number') {
              this.froms.set(name, tableLike)
            }
          }
        }
      })
    }
    this._postAnalysing = false
  }

  describe () {
    return [
      `Select ${this.columns.length} columns:`,
      ...this.columns.map(column => column.describe())
    ]
  }

  static type = 'view'

  getChildren () {
    return new Set([
      ...this.columns, ...Array.from(this.froms.entries()).map(x => x[1]),
      ...Array.from(this.depends)
    ])
  }

  replace (from, to) {
    const index = this.columns.indexOf(from)
    if (index !== -1) {
      this.columns[index] = to
    }
    for (let [name, tableLike] of this.froms) {
      if (tableLike === from) {
        this.froms.set(name, to)
      }
    }
    for (let depend of this.depends) {
      if (depend === from) {
        this.depends.delete(from)
        this.depends.add(to)
      }
    }
  }

  addDepend (node) {
    this.depends.add(node)
  }

  get (tableName) {
    return tableName === true ? this : this.froms.get(tableName)
  }

  dig (columnName, tableName) {
    if (typeof tableName === 'string') {
      // table name specified
      return this.get(tableName).dig(columnName, true)
    }
    if (this.columns.length > 0) {
      // view is a subquery with selected columns
      for (let viewColoum of this.columns) {
        if (viewColoum.name === columnName) {
          // dig column
          return new Set([viewColoum.dig()])
        }
      }
      if (!this._postAnalysing) {
        // a warning should appear
        return new Set
      }
    }
    if (this.froms.length === 1) {
      // view has only one source
      return this.froms.get(0).dig(columnName, tableName)
    } else {
      const columnFroms = new Set
      for (let i = 0; i < this.froms.length; i++) {
        const columnFrom = this.froms.get(i).dig(columnName, false)
        if (columnFrom) {
          setConcat(columnFroms, columnFrom)
        }
      }
      return columnFroms
    }
  }
}

class Column extends Node {
  static anonymous = {
    type: 'anonymous',
    toString: x => 'anonymous',
    render: x => '<i>anonymous</i>',
  }

  constructor (ast, name, view, tableName) {
    super(ast, name)
    tableName = tableName || true
    this.froms = view.dig(name, tableName)
    this.dangling = !this.froms || this.froms.size === 0
    if (this.dangling) {
      console.debug(
        'Column',
        (typeof tableName === 'string' ? tableName + '.' : '') + name,
        'has no source'
      )
      this.froms = new Set([view.get(tableName)])
    }
  }

  describe () {
    const tableNames = this.describeTableNames()
    return !this.dangling ? [
      this.name + (tableNames ? '@' + tableNames : '') + ', which is from:',
      ...this.getSortedFrom().map(from => from.describe(this))
    ] : [
      this.name + (tableNames ? '@' + tableNames : '') + ', which should be from:',
      this.getSortedFrom().map(from => from.name + ','),
      'but I can not find it!'
    ]
  }

  describeTableNames () {
    const tableNames =  Array.from(this.parents).map(x => x.name || x.ast.tokens[0].value)
    return tableNames.length > 1 ? '[' + tableNames.join(', ') + ']' : tableNames.join(', ')
  }

  static type = 'column'

  getChildren () {
    return this.froms
  }

  replace (from, to) {
    if (this.froms.delete(from)) {
      this.froms.add(to)
    }
  }

  getSortedFrom () {
    return Array.from(this.froms).sort()
  }

  getFirstFrom () {
    return this.froms.entries().next().value[0]
  }

  dig () {
    if (this.froms.size === 1) {
      return this.getFirstFrom()
    }
    return this
  }
}


return {
  Node, Table, Condition, Case, Expression, View, Column,
}}))
