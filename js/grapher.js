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
  }

  get (key) {
    if (this.has(key)) {
      return super.get(key)
    }
    const value = this.factory(key)
    this.set(key, value)
    return value
  }

  add (key) {
    return this.get(key)
  }
}

class Node {
  constructor (ast, name) {
    this.asts = [ast]
    this.name = name
    this.referrers = []
  }

  get ast () {
    return this.asts[0]
  }

  set ast (ast) {
    this.asts[0] = ast
  }

  getLino () {
    return 'L' + this.ast.getStart().map(x => x + 1).join('C')
  }

  toString () {
    // used by sorting, must be unique
    return this.constructor.name + this.getLino()
  }

  getChildren () { }

  forEach (f, viewed) {
    viewed = viewed || new Set
    viewed.add(this)

    f(this)

    const children = this.getChildren()
    if (children) {
      for (let child of children) {
        if (!viewed.has(child)) {
          child.forEach(f, viewed)
        }
      }
    }
  }

  static formatInfo (result) {
    return [
      'Views:', result.views.length,
      'ViewColumns:', result.viewColumns.length,
      'Variables:', result.variables.length,
      'Tables:', result.tables.length,
      'Columns:', result.tableColumns.length,
    ].join(',\t')
  }

  flat () {
    const result = {
      graph: this,
      views: [],
      viewColumns: [],
      variables: [],
      tables: [],
      tableColumns: [],
    }
    this.forEach(x => {
      if (x.constructor.type) {
        result[x.constructor.type + 's'].push(x)
      }
    })
    return result
  }

  trackReferrers () {
    const children = this.getChildren()
    if (children) {
      for (let child of children) {
        child.trackReferrers()
        child.referrers.push(this)
      }
    }
  }

  postfix () {
    let graphInfo = this.flat()
    for (let view of graphInfo.views) {
      // find columns for table
      view.buildDeps()
      view.vPostfix(this)
      // changed: tableColumns
    }
    for (let variable of graphInfo.variables) {
      // infer columns for table
      if (variable.froms.length === 1) {
        const column = variable.froms[0]
        const table = column.table
        if (table.maybe && table.maybe.has(column.name)) {
          console.debug('Found table', table, 'has column', column)
          table.add(column.name)
        }
      }
    }

    this.forEach(x => {x.referrers = []})
    graphInfo = this.flat()

    console.debug(Node.formatInfo(graphInfo))
    this.trackReferrers()
    return graphInfo
  }
}

class ColumnLike extends Node {
  constructor (ast, table, name) {
    super(ast, name)
    this.table = table
  }
}

class TableLike extends Node {
}

class TableColumn extends ColumnLike {
  constructor (table, name) {
    super(undefined, table, name)
  }

  static type = 'tableColumn'

  describe () {
    return [`${this.table.name}.${this.name}${this.table.has(this.name) ? '' : ' (?)' }`]
  }

  toString () {
    return this.table.name + '.' + this.name
  }
}

class Table extends TableLike {
  constructor (ast, name) {
    super(ast, name || (ast && ast.name.name))
    const columnFactory = x => new TableColumn(this, x)
    this.columns = new DefaultMap(columnFactory)
    this.maybe = new DefaultMap(columnFactory)
  }

  static type = 'table'

  describe () {
    return [
      `Table ${this.name} has ${this.columns.size} columns:`,
      Array.from(this.columns).map(([name, column]) => name + ',')
    ].concat(this.maybe.size === 0 ? [] : [
      `and maybe has ${this.maybe.size} more columns:`,
      Array.from(this.maybe).map(([name, column]) => name + ',')
    ])
  }

  getChildren () {
    return [...this.columns, ...this.maybe].map(([_, x]) => x)
  }

  add (columnName, thisScope) {
    if (!thisScope) {
      return this.addMaybe(columnName)
    }

    if (this.maybe.has(columnName)) {
      const column = this.maybe.get(columnName)
      this.maybe.delete(columnName)
      this.columns.set(columnName, column)
      return column
    } else {
      return this.columns.get(columnName)
    }
  }

  addMaybe (columnName) {
    return this.maybe.get(columnName)
  }

  has (columnName) {
    return this.columns.has(columnName)
  }

  dig (columnName, thisScope) {
    return [this.has(columnName) ? this.columns.get(columnName) :
      this.add(columnName, thisScope === true)]
  }
}

class Variable extends Node {
  constructor (ast, name, tableName) {
    super(ast, name)
    this.view = undefined
    this.tableName = tableName
    this.froms = undefined
    this.dangling = undefined
  }

  static type = 'variable'

  vPostfix (type) {
    this.froms = this.view.dig(this.name, this.tableName || true, type)
    this.dangling = this.froms.size === 0
  }

  toString () {
    return (this.tableName ? (this.tableName + '.' + this.name) : this.name) + ' @ ' + this.getLino()
  }

  describe () {
    return [
      this.toString() + ' =>',
      !this.dangling ? this.froms.map(from => from.describe(this)).flat() :
        [(this.tableName || this.view) + ' !!!']
    ]
  }

  getChildren () {
    return this.froms
  }
}

class ViewColumn extends ColumnLike {
  static anonymous = {
    type: 'anonymous',
    toString: x => 'anonymous',
    render: x => '<i>anonymous</i>',
  }

  constructor (ast, name, variables) {
    super(ast, undefined, name)
    this.text = ast ? ast.expr.toString().trim() : ''
    this.variables = variables
  }

  static type = 'viewColumn'

  describe () {
    return this.variables ? [
      `${this.name} <- "${this.text}" @ ${this.table} =>`,
      this.variables.map(variable => variable.describe()).flat()
    ] : [
      `${this.name} <- "${this.text}" @ ${this.table};`
    ]
  }

  getChildren () {
    return this.variables
  }

  replace (from, to) {
    //
  }
}

class View extends TableLike {
  constructor (ast, froms) {
    super(ast)
    this.columns = []
    this.depends = []
    this.froms = froms || []
    this.locals = new Map
    for (let from of this.froms) {
      if (from.name) {
        this.locals.set(from.name, from)
      }
      if (from instanceof View) {
        for (let [name, tableLike] of from.locals) {
          this.locals.set(name, tableLike)
        }
      }
    }
    this.globals = new DefaultMap(x => new Table(null, x))
    this.top = undefined
  }

  static type = 'view'

  buildDeps () {
    for (let column of this.columns) {
      column.table = this
      for (let variable of column.variables) {
        variable.view = this
      }
    }
    for (let variable of this.depends) {
      variable.view = this
    }
  }

  vPostfix (top) {
    this.top = top
    for (let column of this.columns) {
      for (let variable of column.variables) {
        variable.vPostfix(1)
      }
    }
    for (let variable of this.depends) {
      variable.vPostfix(2)
    }
  }

  describe () {
    return [
      `Select ${this.columns.length} columns:`,
      this.columns.map(column => column.describe()).flat()
    ]
  }

  getChildren () {
    return this.columns.concat(this.depends).concat(this.froms)
  }

  replace (from, to) {
    //
  }

  addDepend (node) {
    this.depends = this.depends.concat(node)
  }

  get (tableName) {
    return tableName === true ? this :
      typeof tableName === 'number' ? this.froms[tableName] :
      (this.locals.get(tableName) || this.top.globals.get(tableName))
  }

  digColoums (columnName) {
    return this.columns.filter(x => x.name === columnName)
  }

  digFroms (columnName, thisScope) {
    return this.froms.length === 1 ?
      // view has only one source
      this.froms[0].dig(columnName, thisScope) :
      // dig every source table
      this.froms.map(x => x.dig(columnName)).flat()
  }

  dig (columnName, thisScope, type) {
    if (typeof thisScope === 'string') {
      // table name specified
      return this.get(thisScope).dig(columnName, true)
    }
    switch (type) {
      case 1:  // select
        return this.digFroms(columnName, thisScope)
      case 2:  // qualifier
        return this.digColoums(columnName).concat(this.digFroms(columnName, thisScope))
      default:  // refer
        return this.columns.length > 0 ? this.digColoums(columnName) : this.digFroms(columnName, thisScope)
    }
  }
}


return {
  Node, TableColumn, Table, Variable, View, ViewColumn,
}}))
