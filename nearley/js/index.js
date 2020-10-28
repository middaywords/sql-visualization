"use strict"

let sql = 'select * from users;'

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))
parser.feed(sql)
console.log(parser.results)
