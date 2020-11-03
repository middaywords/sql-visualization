// Generated automatically by nearley, version undefined
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

function makeList (list, item) {
  if (!item) {
    return list;
  }
  if (!list) {
    return [item];
  }
  return list.concat([item])
}

function car (d) {
  return d[0]
}

function caar (d) {
  return d[0][0]
}

function cdar (d) {
  return d[1]
}

function cddar (d) {
  return d[2]
}

function drill (l) {
  return Array.isArray(l) ? Array.prototype.concat.apply([], l.filter(x => x).map(drill)) : [l]
}

function undrill (l) {
  return l.filter((e, i) => i % 2 === 0)
}

function drillString (l) {
  return Array.isArray(l) ? l.filter(x => x).map(drillString).join(' ') : l && l.value
}


function makeUnaryExpr (d) {
  return new AST.UnaryOpExpression(d, drillString(d[0]), d[1])
}

function makeBinaryExpr (d) {
  return new AST.BinaryOpExpression(d, drillString(d[1]), d[0], d[2])
}


function makeType(d) {
  d[0].type = 'base_type'
  return {
    type: 'type',
    baseType: d[0],
    qualifier: d[1] && d[1][0],
    secondQualifier: d[1] && d[1][1],
  }
}
var grammar = {
    Lexer: sqlLexer,
    ParserRules: [
    {"name": "main$macrocall$2", "symbols": ["sql_stmt"]},
    {"name": "main$macrocall$3", "symbols": [{"literal":";","pos":68}]},
    {"name": "main$macrocall$1$ebnf$1", "symbols": []},
    {"name": "main$macrocall$1$ebnf$1$subexpression$1", "symbols": ["main$macrocall$3", "main$macrocall$2"]},
    {"name": "main$macrocall$1$ebnf$1", "symbols": ["main$macrocall$1$ebnf$1$subexpression$1", "main$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "main$macrocall$1", "symbols": ["main$macrocall$2", "main$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "main", "symbols": ["main$macrocall$1"], "postprocess": car},
    {"name": "as_clause$ebnf$1", "symbols": [{"literal":"AS","pos":77}], "postprocess": id},
    {"name": "as_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "as_clause", "symbols": ["as_clause$ebnf$1", "identifier"]},
    {"name": "sql_stmt", "symbols": [{"literal":"(","pos":86}, "sql_stmt", {"literal":")","pos":90}], "postprocess": cdar},
    {"name": "sql_stmt", "symbols": ["post_select_stmt"], "postprocess": car},
    {"name": "select_stmt", "symbols": [{"literal":"(","pos":104}, "select_stmt", {"literal":")","pos":108}], "postprocess": cdar},
    {"name": "select_stmt", "symbols": ["post_select_stmt"], "postprocess": car},
    {"name": "post_select_stmt$ebnf$1$subexpression$1", "symbols": [{"literal":"TOP","pos":125}, (sqlLexer.has("number") ? {type: "number"} : number)]},
    {"name": "post_select_stmt$ebnf$1", "symbols": ["post_select_stmt$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt$ebnf$2$subexpression$1", "symbols": [{"literal":"ALL","pos":133}]},
    {"name": "post_select_stmt$ebnf$2$subexpression$1", "symbols": [{"literal":"DISTINCT","pos":137}]},
    {"name": "post_select_stmt$ebnf$2", "symbols": ["post_select_stmt$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt$ebnf$3", "symbols": ["from_clause"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt", "symbols": [{"literal":"SELECT","pos":122}, "post_select_stmt$ebnf$1", "post_select_stmt$ebnf$2", "selection_column_list", "post_select_stmt$ebnf$3"], "postprocess":
        d => new AST.Select(
          d, d[1] && d[1][1], d[2] && d[2][0].value === 'ALL',
          d[2] && d[2][0].value === 'DISTINCT',
          d[3].value === '*' ? null : d[3], d[4]
        )
            },
    {"name": "post_select_stmt", "symbols": ["select_stmt", {"literal":"UNION","pos":152}, "select_stmt"], "postprocess":
        d => new AST.Union(d, d[0], d[2])
            },
    {"name": "selection_column_list$macrocall$2", "symbols": ["selection_column"]},
    {"name": "selection_column_list$macrocall$3", "symbols": [{"literal":",","pos":167}]},
    {"name": "selection_column_list$macrocall$1$ebnf$1", "symbols": []},
    {"name": "selection_column_list$macrocall$1$ebnf$1$subexpression$1", "symbols": ["selection_column_list$macrocall$3", "selection_column_list$macrocall$2"]},
    {"name": "selection_column_list$macrocall$1$ebnf$1", "symbols": ["selection_column_list$macrocall$1$ebnf$1$subexpression$1", "selection_column_list$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "selection_column_list$macrocall$1", "symbols": ["selection_column_list$macrocall$2", "selection_column_list$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "selection_column_list", "symbols": ["selection_column_list$macrocall$1"], "postprocess":
        d => new AST.SelectionSet(d, undrill(d[0]))
        },
    {"name": "selection_column$ebnf$1", "symbols": ["as_clause"], "postprocess": id},
    {"name": "selection_column$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selection_column", "symbols": ["post_selection_column", "selection_column$ebnf$1"], "postprocess":
        d => new AST.ColumnSelection(d, d[0], d[1] && d[1][1])
        },
    {"name": "post_selection_column", "symbols": ["expr"], "postprocess": car},
    {"name": "post_selection_column", "symbols": [{"literal":"*","pos":193}], "postprocess": d => new AST.Keyword(d[0], d[0].value)},
    {"name": "post_selection_column", "symbols": ["identifier", {"literal":".","pos":201}, {"literal":"*","pos":203}], "postprocess": d => new AST.Column(d, d[0], new AST.Keyword(d[2], d[2].value))},
    {"name": "from_clause$ebnf$1", "symbols": ["where_clause"], "postprocess": id},
    {"name": "from_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "from_clause$ebnf$2", "symbols": ["group_by_clause"], "postprocess": id},
    {"name": "from_clause$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "from_clause$ebnf$3", "symbols": ["having_clause"], "postprocess": id},
    {"name": "from_clause$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "from_clause$ebnf$4", "symbols": ["order_clause"], "postprocess": id},
    {"name": "from_clause$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "from_clause$ebnf$5", "symbols": ["limit_clause"], "postprocess": id},
    {"name": "from_clause$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "from_clause", "symbols": [{"literal":"FROM","pos":211}, "table_ref_commalist", "from_clause$ebnf$1", "from_clause$ebnf$2", "from_clause$ebnf$3", "from_clause$ebnf$4", "from_clause$ebnf$5"], "postprocess":
        d => new AST.From(d, undrill(d[1]), d[2] && d[2][1], d[3] && d[3][1], d[4] && d[4][1], d[5] && d[5][1], d[6] && d[6][1])
        },
    {"name": "table_ref_commalist$macrocall$2", "symbols": ["table_ref"]},
    {"name": "table_ref_commalist$macrocall$3", "symbols": [{"literal":",","pos":241}]},
    {"name": "table_ref_commalist$macrocall$1$ebnf$1", "symbols": []},
    {"name": "table_ref_commalist$macrocall$1$ebnf$1$subexpression$1", "symbols": ["table_ref_commalist$macrocall$3", "table_ref_commalist$macrocall$2"]},
    {"name": "table_ref_commalist$macrocall$1$ebnf$1", "symbols": ["table_ref_commalist$macrocall$1$ebnf$1$subexpression$1", "table_ref_commalist$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "table_ref_commalist$macrocall$1", "symbols": ["table_ref_commalist$macrocall$2", "table_ref_commalist$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "table_ref_commalist", "symbols": ["table_ref_commalist$macrocall$1"], "postprocess": car},
    {"name": "table_ref", "symbols": [{"literal":"(","pos":250}, "table_ref", {"literal":")","pos":254}], "postprocess": cdar},
    {"name": "table_ref$ebnf$1$subexpression$1$ebnf$1", "symbols": [{"literal":"NATURAL","pos":263}], "postprocess": id},
    {"name": "table_ref$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": [{"literal":"OUTER","pos":269}], "postprocess": id},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"LEFT","pos":267}, "table_ref$ebnf$1$subexpression$1$subexpression$1$ebnf$1"]},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"RIGHT","pos":274}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": ["table_ref$ebnf$1$subexpression$1$ebnf$1", "table_ref$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"INNER","pos":279}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"CROSS","pos":283}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"FULL","pos":287}]},
    {"name": "table_ref$ebnf$1", "symbols": ["table_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref", "symbols": ["table_ref", "table_ref$ebnf$1", {"literal":"JOIN","pos":291}, "table", "join_constraint"], "postprocess":
        d => new AST.Join(d, drillString(d[1]), d[0], d[3], d[4][0], d[4][1])
            },
    {"name": "table_ref", "symbols": ["table"], "postprocess": car},
    {"name": "join_constraint", "symbols": [{"literal":"ON","pos":309}, "expr"], "postprocess": d => [d[1], null]},
    {"name": "join_constraint", "symbols": [{"literal":"ON","pos":317}, {"literal":"(","pos":319}, "expr", {"literal":")","pos":323}], "postprocess": d => [d[2], null]},
    {"name": "join_constraint", "symbols": [{"literal":"USING","pos":329}, {"literal":"(","pos":331}, "identifier_list", {"literal":")","pos":335}], "postprocess": d => [null, d[2]]},
    {"name": "table", "symbols": ["post_table", "as_clause"], "postprocess": d => new AST.TableAlias(d, d[0], d[1] && d[1][1])},
    {"name": "table", "symbols": ["post_table"], "postprocess": car},
    {"name": "post_table$ebnf$1$subexpression$1", "symbols": [{"literal":".","pos":362}, "identifier"], "postprocess": cdar},
    {"name": "post_table$ebnf$1", "symbols": ["post_table$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "post_table$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_table", "symbols": ["identifier", "post_table$ebnf$1"], "postprocess": d => new AST.Table(d, d[0], d[1])},
    {"name": "post_table", "symbols": ["subquery"], "postprocess": car},
    {"name": "where_clause", "symbols": [{"literal":"WHERE","pos":382}, "expr"]},
    {"name": "group_by_clause$subexpression$1", "symbols": [{"literal":"(","pos":395}, "selection_column_list", {"literal":")","pos":399}], "postprocess": cdar},
    {"name": "group_by_clause$subexpression$1", "symbols": ["selection_column_list"], "postprocess": car},
    {"name": "group_by_clause$ebnf$1$subexpression$1", "symbols": [{"literal":"WITH","pos":411}, {"literal":"ROLLUP","pos":413}]},
    {"name": "group_by_clause$ebnf$1", "symbols": ["group_by_clause$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "group_by_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_by_clause", "symbols": [{"literal":"GROUP","pos":390}, {"literal":"BY","pos":392}, "group_by_clause$subexpression$1", "group_by_clause$ebnf$1"], "postprocess":
        d => new AST.GroupBy(d, d[3], !!d[5])
        },
    {"name": "having_clause", "symbols": [{"literal":"HAVING","pos":423}, "expr"]},
    {"name": "order_clause$subexpression$1", "symbols": [{"literal":"ORDER","pos":432}, {"literal":"BY","pos":434}]},
    {"name": "order_clause", "symbols": ["order_clause$subexpression$1", "order_substat_list"]},
    {"name": "order_substat_list", "symbols": [{"literal":"(","pos":443}, "order_substat_list", {"literal":")","pos":447}], "postprocess": cdar},
    {"name": "order_substat_list$macrocall$2", "symbols": ["order_substat"]},
    {"name": "order_substat_list$macrocall$3", "symbols": [{"literal":",","pos":458}]},
    {"name": "order_substat_list$macrocall$1$ebnf$1", "symbols": []},
    {"name": "order_substat_list$macrocall$1$ebnf$1$subexpression$1", "symbols": ["order_substat_list$macrocall$3", "order_substat_list$macrocall$2"]},
    {"name": "order_substat_list$macrocall$1$ebnf$1", "symbols": ["order_substat_list$macrocall$1$ebnf$1$subexpression$1", "order_substat_list$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "order_substat_list$macrocall$1", "symbols": ["order_substat_list$macrocall$2", "order_substat_list$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "order_substat_list", "symbols": ["order_substat_list$macrocall$1"]},
    {"name": "order_substat$ebnf$1$subexpression$1", "symbols": [{"literal":"ASC","pos":468}]},
    {"name": "order_substat$ebnf$1$subexpression$1", "symbols": [{"literal":"DESC","pos":472}]},
    {"name": "order_substat$ebnf$1", "symbols": ["order_substat$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "order_substat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_substat", "symbols": ["expr", "order_substat$ebnf$1"], "postprocess": d => new AST.Order(d, d[0], d[1] && d[1][0].value)},
    {"name": "limit_clause", "symbols": [{"literal":"LIMIT","pos":482}, (sqlLexer.has("number") ? {type: "number"} : number)]},
    {"name": "expr_list$macrocall$2", "symbols": ["expr"]},
    {"name": "expr_list$macrocall$3", "symbols": [{"literal":",","pos":528}]},
    {"name": "expr_list$macrocall$1$ebnf$1", "symbols": []},
    {"name": "expr_list$macrocall$1$ebnf$1$subexpression$1", "symbols": ["expr_list$macrocall$3", "expr_list$macrocall$2"]},
    {"name": "expr_list$macrocall$1$ebnf$1", "symbols": ["expr_list$macrocall$1$ebnf$1$subexpression$1", "expr_list$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "expr_list$macrocall$1", "symbols": ["expr_list$macrocall$2", "expr_list$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "expr_list", "symbols": ["expr_list$macrocall$1"], "postprocess": d => new AST.ExpressionList(d, undrill(d[0]))},
    {"name": "expr", "symbols": [{"literal":"(","pos":537}, "expr", {"literal":")","pos":541}], "postprocess": cdar},
    {"name": "expr", "symbols": ["post_two_op_expr"], "postprocess": car},
    {"name": "two_op_expr$macrocall$2", "symbols": ["post_two_op_expr"]},
    {"name": "two_op_expr$macrocall$1", "symbols": ["two_op_expr$macrocall$2"], "postprocess": caar},
    {"name": "two_op_expr$macrocall$1$subexpression$1", "symbols": ["two_op_expr$macrocall$2"], "postprocess": caar},
    {"name": "two_op_expr$macrocall$1", "symbols": [{"literal":"(","pos":506}, "two_op_expr$macrocall$1$subexpression$1", {"literal":")","pos":515}], "postprocess": makeUnaryExpr},
    {"name": "two_op_expr", "symbols": ["two_op_expr$macrocall$1"], "postprocess": car},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"OR","pos":569}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"XOR","pos":573}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"AND","pos":577}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [(sqlLexer.has("condBinaryOp") ? {type: "condBinaryOp"} : condBinaryOp)]},
    {"name": "post_two_op_expr", "symbols": ["expr", "post_two_op_expr$subexpression$1", "one_op_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_two_op_expr", "symbols": ["post_one_op_expr"], "postprocess": car},
    {"name": "one_op_expr$macrocall$2", "symbols": ["post_one_op_expr"]},
    {"name": "one_op_expr$macrocall$1", "symbols": ["one_op_expr$macrocall$2"], "postprocess": caar},
    {"name": "one_op_expr$macrocall$1$subexpression$1", "symbols": ["one_op_expr$macrocall$2"], "postprocess": caar},
    {"name": "one_op_expr$macrocall$1", "symbols": [{"literal":"(","pos":506}, "one_op_expr$macrocall$1$subexpression$1", {"literal":")","pos":515}], "postprocess": makeUnaryExpr},
    {"name": "one_op_expr", "symbols": ["one_op_expr$macrocall$1"], "postprocess": car},
    {"name": "post_one_op_expr$subexpression$1", "symbols": [{"literal":"NOT","pos":611}]},
    {"name": "post_one_op_expr$subexpression$1", "symbols": [{"literal":"!","pos":615}]},
    {"name": "post_one_op_expr", "symbols": ["post_one_op_expr$subexpression$1", "boolean_primary"], "postprocess": makeUnaryExpr},
    {"name": "post_one_op_expr$subexpression$2$ebnf$1", "symbols": [{"literal":"NOT","pos":629}], "postprocess": id},
    {"name": "post_one_op_expr$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_one_op_expr$subexpression$2", "symbols": [{"literal":"IS","pos":627}, "post_one_op_expr$subexpression$2$ebnf$1"]},
    {"name": "post_one_op_expr$subexpression$3", "symbols": ["boolean"]},
    {"name": "post_one_op_expr$subexpression$3", "symbols": ["unknown"]},
    {"name": "post_one_op_expr", "symbols": ["boolean_primary", "post_one_op_expr$subexpression$2", "post_one_op_expr$subexpression$3"], "postprocess": makeBinaryExpr},
    {"name": "post_one_op_expr", "symbols": ["post_boolean_primary"], "postprocess": car},
    {"name": "boolean_primary$macrocall$2", "symbols": ["post_boolean_primary"]},
    {"name": "boolean_primary$macrocall$1", "symbols": ["boolean_primary$macrocall$2"], "postprocess": caar},
    {"name": "boolean_primary$macrocall$1$subexpression$1", "symbols": ["boolean_primary$macrocall$2"], "postprocess": caar},
    {"name": "boolean_primary$macrocall$1", "symbols": [{"literal":"(","pos":506}, "boolean_primary$macrocall$1$subexpression$1", {"literal":")","pos":515}], "postprocess": makeUnaryExpr},
    {"name": "boolean_primary", "symbols": ["boolean_primary$macrocall$1"], "postprocess": car},
    {"name": "post_boolean_primary$subexpression$1$ebnf$1", "symbols": [{"literal":"NOT","pos":669}], "postprocess": id},
    {"name": "post_boolean_primary$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_boolean_primary$subexpression$1", "symbols": [{"literal":"IS","pos":667}, "post_boolean_primary$subexpression$1$ebnf$1"]},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", "post_boolean_primary$subexpression$1", "null_"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", (sqlLexer.has("boolBinaryOp") ? {type: "boolBinaryOp"} : boolBinaryOp), "predicate"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary$subexpression$2$subexpression$1", "symbols": [{"literal":"ANY","pos":697}]},
    {"name": "post_boolean_primary$subexpression$2$subexpression$1", "symbols": [{"literal":"ALL","pos":701}]},
    {"name": "post_boolean_primary$subexpression$2", "symbols": [(sqlLexer.has("boolBinaryOp") ? {type: "boolBinaryOp"} : boolBinaryOp), "post_boolean_primary$subexpression$2$subexpression$1"]},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", "post_boolean_primary$subexpression$2", "subquery"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary", "symbols": ["post_predicate"], "postprocess": car},
    {"name": "predicate$macrocall$2", "symbols": ["post_predicate"]},
    {"name": "predicate$macrocall$1", "symbols": ["predicate$macrocall$2"], "postprocess": caar},
    {"name": "predicate$macrocall$1$subexpression$1", "symbols": ["predicate$macrocall$2"], "postprocess": caar},
    {"name": "predicate$macrocall$1", "symbols": [{"literal":"(","pos":506}, "predicate$macrocall$1$subexpression$1", {"literal":")","pos":515}], "postprocess": makeUnaryExpr},
    {"name": "predicate", "symbols": ["predicate$macrocall$1"], "postprocess": car},
    {"name": "post_predicate$subexpression$1$ebnf$1", "symbols": [{"literal":"NOT","pos":733}], "postprocess": id},
    {"name": "post_predicate$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$1", "symbols": ["post_predicate$subexpression$1$ebnf$1", {"literal":"IN","pos":736}]},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$1", "subquery"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate$subexpression$2$ebnf$1", "symbols": [{"literal":"NOT","pos":748}], "postprocess": id},
    {"name": "post_predicate$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$2", "symbols": ["post_predicate$subexpression$2$ebnf$1", {"literal":"IN","pos":751}]},
    {"name": "post_predicate$subexpression$3", "symbols": [{"literal":"(","pos":755}, "expr_list", {"literal":")","pos":759}], "postprocess": cdar},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$2", "post_predicate$subexpression$3"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate$subexpression$4$ebnf$1", "symbols": [{"literal":"NOT","pos":771}], "postprocess": id},
    {"name": "post_predicate$subexpression$4$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$4", "symbols": ["post_predicate$subexpression$4$ebnf$1", {"literal":"BETWEEN","pos":774}]},
    {"name": "post_predicate$subexpression$5", "symbols": ["bit_expr", {"literal":"AND","pos":780}, "bit_expr"]},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$4", "post_predicate$subexpression$5"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate$subexpression$6$ebnf$1", "symbols": [{"literal":"NOT","pos":792}], "postprocess": id},
    {"name": "post_predicate$subexpression$6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$6", "symbols": ["post_predicate$subexpression$6$ebnf$1", {"literal":"LIKE","pos":795}]},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$6", "bit_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate", "symbols": ["post_bit_expr"], "postprocess": car},
    {"name": "bit_expr$macrocall$2", "symbols": ["post_bit_expr"]},
    {"name": "bit_expr$macrocall$1", "symbols": ["bit_expr$macrocall$2"], "postprocess": caar},
    {"name": "bit_expr$macrocall$1$subexpression$1", "symbols": ["bit_expr$macrocall$2"], "postprocess": caar},
    {"name": "bit_expr$macrocall$1", "symbols": [{"literal":"(","pos":506}, "bit_expr$macrocall$1$subexpression$1", {"literal":")","pos":515}], "postprocess": makeUnaryExpr},
    {"name": "bit_expr", "symbols": ["bit_expr$macrocall$1"], "postprocess": car},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"DIV","pos":826}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"MOD","pos":830}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"*","pos":834}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [(sqlLexer.has("arithBinaryOp") ? {type: "arithBinaryOp"} : arithBinaryOp)]},
    {"name": "post_bit_expr", "symbols": ["bit_expr", "post_bit_expr$subexpression$1", "simple_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_bit_expr$subexpression$2", "symbols": [{"literal":"+","pos":851}]},
    {"name": "post_bit_expr$subexpression$2", "symbols": [{"literal":"-","pos":855}]},
    {"name": "post_bit_expr", "symbols": ["bit_expr", "post_bit_expr$subexpression$2", "interval_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_bit_expr", "symbols": ["interval_expr"], "postprocess": car},
    {"name": "post_bit_expr", "symbols": ["post_simple_expr"], "postprocess": car},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MICROSECOND","pos":885}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"SECOND","pos":889}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MINUTE","pos":893}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR","pos":897}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY","pos":901}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"WEEK","pos":905}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MONTH","pos":909}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"QUARTER","pos":913}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"YEAR","pos":917}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"SECOND_MICROSECOND","pos":921}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MINUTE_MICROSECOND","pos":925}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MINUTE_SECOND","pos":929}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR_MICROSECOND","pos":933}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR_SECOND","pos":937}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR_MINUTE","pos":941}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_MICROSECOND","pos":945}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_SECOND","pos":949}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_MINUTE","pos":953}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_HOUR","pos":957}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"YEAR_MONTH","pos":961}]},
    {"name": "interval_expr$subexpression$1", "symbols": ["interval_expr$subexpression$1$subexpression$1"], "postprocess": caar},
    {"name": "interval_expr", "symbols": [{"literal":"INTERVAL","pos":878}, "expr", "interval_expr$subexpression$1"], "postprocess": makeBinaryExpr},
    {"name": "simple_expr$macrocall$2", "symbols": ["post_simple_expr"]},
    {"name": "simple_expr$macrocall$1", "symbols": ["simple_expr$macrocall$2"], "postprocess": caar},
    {"name": "simple_expr$macrocall$1$subexpression$1", "symbols": ["simple_expr$macrocall$2"], "postprocess": caar},
    {"name": "simple_expr$macrocall$1", "symbols": [{"literal":"(","pos":506}, "simple_expr$macrocall$1$subexpression$1", {"literal":")","pos":515}], "postprocess": makeUnaryExpr},
    {"name": "simple_expr", "symbols": ["simple_expr$macrocall$1"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["identifier"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"@","pos":991}, "identifier"], "postprocess": d => new AST.Variable(d, d[0])},
    {"name": "post_simple_expr", "symbols": ["identifier", {"literal":".","pos":1001}, "identifier"], "postprocess": d => new AST.Column(d, d[0], d[2])},
    {"name": "post_simple_expr", "symbols": ["literal"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"BINARY","pos":1015}, "simple_expr"], "postprocess": makeUnaryExpr},
    {"name": "post_simple_expr", "symbols": ["function_call"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["subquery"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"EXISTS","pos":1035}, "subquery"], "postprocess": makeUnaryExpr},
    {"name": "post_simple_expr", "symbols": ["case_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["if_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["cast_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["convert_expr"], "postprocess": car},
    {"name": "literal", "symbols": [(sqlLexer.has("string") ? {type: "string"} : string)], "postprocess": d => new AST.String(d, d[0].value)},
    {"name": "literal", "symbols": ["number"], "postprocess": car},
    {"name": "literal", "symbols": ["boolean"], "postprocess": car},
    {"name": "literal", "symbols": ["null_"], "postprocess": car},
    {"name": "boolean", "symbols": [{"literal":"TRUE","pos":1096}], "postprocess": d => new AST.Boolean(d, true)},
    {"name": "boolean", "symbols": [{"literal":"FALSE","pos":1102}], "postprocess": d => new AST.Boolean(d, false)},
    {"name": "null_", "symbols": [{"literal":"NULL","pos":1110}], "postprocess": d => new AST.Null(d)},
    {"name": "unknown", "symbols": [{"literal":"UNKNOWN","pos":1118}], "postprocess": d => new AST.Unknown(d)},
    {"name": "number$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"+","pos":1128}]},
    {"name": "number$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"-","pos":1132}]},
    {"name": "number$ebnf$1$subexpression$1", "symbols": ["number$ebnf$1$subexpression$1$subexpression$1"], "postprocess": caar},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$ebnf$1", "post_number"], "postprocess":
        d => new AST.Number(d, d[0] && d[0].value === '-' ? -d[1].value : d[1].value)
        },
    {"name": "post_number", "symbols": [{"literal":"(","pos":1147}, "post_number", {"literal":")","pos":1151}], "postprocess": cdar},
    {"name": "post_number", "symbols": [(sqlLexer.has("number") ? {type: "number"} : number)], "postprocess": car},
    {"name": "post_number", "symbols": [(sqlLexer.has("float") ? {type: "float"} : float)], "postprocess": car},
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1175}, "function_parameters", {"literal":")","pos":1179}], "postprocess":  d => new AST.FunctionCall(
          d, d[0], d[2][0] instanceof AST.ExpressionList ? d[2][0] : d[2][1],
          d[2][0] && d[2][0].value === 'DISTINCT', d[2][0] && d[2][0].value === 'ALL'
        ) },
    {"name": "function_identifier$subexpression$1", "symbols": [(sqlLexer.has("btstring") ? {type: "btstring"} : btstring)]},
    {"name": "function_identifier$subexpression$1", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"LEFT","pos":1198}]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"RIGHT","pos":1202}]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"REPLACE","pos":1206}]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"MOD","pos":1210}]},
    {"name": "function_identifier", "symbols": ["function_identifier$subexpression$1"], "postprocess":
        d => new AST.Identifier(d, d[0][0].value)
        },
    {"name": "function_parameters", "symbols": [{"literal":"DISTINCT","pos":1219}, "column"]},
    {"name": "function_parameters", "symbols": [{"literal":"ALL","pos":1225}, "expr"]},
    {"name": "function_parameters", "symbols": []},
    {"name": "function_parameters", "symbols": ["expr_list"]},
    {"name": "column$ebnf$1", "symbols": ["as_clause"], "postprocess": id},
    {"name": "column$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column", "symbols": ["identifier", "column$ebnf$1"], "postprocess": d => new AST.ColumnSelection(d, d[0], d[1] && d[1][1])},
    {"name": "subquery", "symbols": [{"literal":"(","pos":1252}, "select_stmt", {"literal":")","pos":1256}], "postprocess":
        d => new AST.Subquery(d, d[1])
        },
    {"name": "case_expr$ebnf$1", "symbols": ["expr"], "postprocess": id},
    {"name": "case_expr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_expr$ebnf$2$subexpression$1", "symbols": [{"literal":"WHEN","pos":1270}, "expr", {"literal":"THEN","pos":1274}, "expr"]},
    {"name": "case_expr$ebnf$2", "symbols": ["case_expr$ebnf$2$subexpression$1"]},
    {"name": "case_expr$ebnf$2$subexpression$2", "symbols": [{"literal":"WHEN","pos":1270}, "expr", {"literal":"THEN","pos":1274}, "expr"]},
    {"name": "case_expr$ebnf$2", "symbols": ["case_expr$ebnf$2$subexpression$2", "case_expr$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "case_expr$ebnf$3$subexpression$1", "symbols": [{"literal":"ELSE","pos":1281}, "expr"]},
    {"name": "case_expr$ebnf$3", "symbols": ["case_expr$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "case_expr$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_expr", "symbols": [{"literal":"CASE","pos":1264}, "case_expr$ebnf$1", "case_expr$ebnf$2", "case_expr$ebnf$3", {"literal":"END","pos":1287}], "postprocess":
        d => new AST.Case(d, d[1], d[2].map(l => [l[1], l[3]]), d[3] && d[3][1])
        },
    {"name": "if_expr", "symbols": [{"literal":"IF","pos":1295}, {"literal":"(","pos":1297}, "expr", {"literal":",","pos":1301}, "expr", {"literal":",","pos":1305}, "expr", {"literal":")","pos":1309}], "postprocess":
        d => new AST.If(d, d[2], d[4], d[6])
        },
    {"name": "cast_expr", "symbols": [{"literal":"CAST","pos":1317}, {"literal":"(","pos":1319}, "expr", {"literal":"AS","pos":1323}, "data_type", {"literal":")","pos":1327}], "postprocess":
        d => ({
          type: 'expression',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: null,
        })
        },
    {"name": "data_type$ebnf$1$subexpression$1", "symbols": [{"literal":"(","pos":1341}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1346}], "postprocess": cdar},
    {"name": "data_type$ebnf$1", "symbols": ["data_type$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "data_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_type", "symbols": [{"literal":"BINARY","pos":1338}, "data_type$ebnf$1"]},
    {"name": "data_type$ebnf$2$subexpression$1", "symbols": [{"literal":"(","pos":1357}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1362}], "postprocess": cdar},
    {"name": "data_type$ebnf$2", "symbols": ["data_type$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "data_type$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_type", "symbols": [{"literal":"CHAR","pos":1354}, "data_type$ebnf$2"]},
    {"name": "data_type", "symbols": [{"literal":"DATE","pos":1370}]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1374}]},
    {"name": "data_type$subexpression$1", "symbols": [{"literal":"(","pos":1381}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1386}], "postprocess": cdar},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1378}, "data_type$subexpression$1"]},
    {"name": "data_type$subexpression$2", "symbols": [{"literal":"(","pos":1396}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":",","pos":1401}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1406}], "postprocess": d => [d[1], d[3]]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1393}, "data_type$subexpression$2"]},
    {"name": "data_type", "symbols": [{"literal":"FLOAT","pos":1413}]},
    {"name": "data_type", "symbols": [{"literal":"NCHAR","pos":1417}]},
    {"name": "data_type", "symbols": [{"literal":"SIGNED","pos":1421}]},
    {"name": "data_type", "symbols": [{"literal":"TIME","pos":1425}]},
    {"name": "data_type", "symbols": [{"literal":"UNSIGNED","pos":1429}]},
    {"name": "convert_expr", "symbols": [{"literal":"CONVERT","pos":1435}, {"literal":"(","pos":1437}, "expr", {"literal":"USING","pos":1441}, "identifier", {"literal":")","pos":1445}], "postprocess":
        d => ({
          type: 'expression',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: null,
        })
        },
    {"name": "identifier_list$macrocall$2", "symbols": ["identifier"]},
    {"name": "identifier_list$macrocall$3", "symbols": [{"literal":",","pos":1460}]},
    {"name": "identifier_list$macrocall$1$ebnf$1", "symbols": []},
    {"name": "identifier_list$macrocall$1$ebnf$1$subexpression$1", "symbols": ["identifier_list$macrocall$3", "identifier_list$macrocall$2"]},
    {"name": "identifier_list$macrocall$1$ebnf$1", "symbols": ["identifier_list$macrocall$1$ebnf$1$subexpression$1", "identifier_list$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "identifier_list$macrocall$1", "symbols": ["identifier_list$macrocall$2", "identifier_list$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "identifier_list", "symbols": ["identifier_list$macrocall$1"], "postprocess": car},
    {"name": "identifier$subexpression$1", "symbols": [(sqlLexer.has("btstring") ? {type: "btstring"} : btstring)]},
    {"name": "identifier$subexpression$1", "symbols": [(sqlLexer.has("bkidentifier") ? {type: "bkidentifier"} : bkidentifier)]},
    {"name": "identifier$subexpression$1", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "identifier", "symbols": ["identifier$subexpression$1"], "postprocess": d => new AST.Identifier(d, d[0][0].value)}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
