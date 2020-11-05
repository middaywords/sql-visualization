// Generated automatically by nearley, version undefined
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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

function parenthesized (d) {
  d[1].tokens.push(d[2])
  d[1].tokens.unshift(d[0])
  return d[1]
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
    {"name": "main$macrocall$3", "symbols": [{"literal":";","pos":45}]},
    {"name": "main$macrocall$1$ebnf$1", "symbols": []},
    {"name": "main$macrocall$1$ebnf$1$subexpression$1", "symbols": ["main$macrocall$3", "main$macrocall$2"]},
    {"name": "main$macrocall$1$ebnf$1", "symbols": ["main$macrocall$1$ebnf$1$subexpression$1", "main$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "main$macrocall$1", "symbols": ["main$macrocall$2", "main$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "main", "symbols": ["main$macrocall$1"], "postprocess": car},
    {"name": "as_clause$ebnf$1", "symbols": [{"literal":"AS","pos":54}], "postprocess": id},
    {"name": "as_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "as_clause", "symbols": ["as_clause$ebnf$1", "identifier"]},
    {"name": "sql_stmt", "symbols": [{"literal":"(","pos":63}, "sql_stmt", {"literal":")","pos":67}], "postprocess": cdar},
    {"name": "sql_stmt", "symbols": ["post_select_stmt"], "postprocess": car},
    {"name": "select_stmt", "symbols": [{"literal":"(","pos":81}, "select_stmt", {"literal":")","pos":85}], "postprocess": cdar},
    {"name": "select_stmt", "symbols": ["post_select_stmt"], "postprocess": car},
    {"name": "post_select_stmt$ebnf$1$subexpression$1", "symbols": [{"literal":"TOP","pos":102}, (sqlLexer.has("number") ? {type: "number"} : number)]},
    {"name": "post_select_stmt$ebnf$1", "symbols": ["post_select_stmt$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt$ebnf$2$subexpression$1", "symbols": [{"literal":"ALL","pos":110}]},
    {"name": "post_select_stmt$ebnf$2$subexpression$1", "symbols": [{"literal":"DISTINCT","pos":114}]},
    {"name": "post_select_stmt$ebnf$2", "symbols": ["post_select_stmt$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt$ebnf$3", "symbols": ["from_clause"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt", "symbols": [{"literal":"SELECT","pos":99}, "post_select_stmt$ebnf$1", "post_select_stmt$ebnf$2", "selection_column_list", "post_select_stmt$ebnf$3"], "postprocess": 
        d => new AST.Select(
          d, d[1] && d[1][1], d[2] && d[2][0].value === 'ALL',
          d[2] && d[2][0].value === 'DISTINCT',
          d[3].value === '*' ? null : d[3], d[4]
        )
            },
    {"name": "post_select_stmt", "symbols": ["select_stmt", {"literal":"UNION","pos":129}, "select_stmt"], "postprocess": 
        d => new AST.Union(d, d[0], d[2])
            },
    {"name": "selection_column_list$macrocall$2", "symbols": ["selection_column"]},
    {"name": "selection_column_list$macrocall$3", "symbols": [{"literal":",","pos":144}]},
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
    {"name": "post_selection_column", "symbols": [{"literal":"*","pos":170}], "postprocess": d => new AST.Keyword(d[0], d[0].value)},
    {"name": "post_selection_column", "symbols": ["identifier", {"literal":".","pos":178}, {"literal":"*","pos":180}], "postprocess": d => new AST.Column(d, d[0], new AST.Keyword(d[2], d[2].value))},
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
    {"name": "from_clause", "symbols": [{"literal":"FROM","pos":188}, "table_ref_commalist", "from_clause$ebnf$1", "from_clause$ebnf$2", "from_clause$ebnf$3", "from_clause$ebnf$4", "from_clause$ebnf$5"], "postprocess": 
        d => new AST.From(d, undrill(d[1]), d[2] && d[2][1], d[3], d[4] && d[4][1], d[5] && undrill(d[5][1]), d[6] && d[6][1])
        },
    {"name": "table_ref_commalist$macrocall$2", "symbols": ["table_ref"]},
    {"name": "table_ref_commalist$macrocall$3", "symbols": [{"literal":",","pos":218}]},
    {"name": "table_ref_commalist$macrocall$1$ebnf$1", "symbols": []},
    {"name": "table_ref_commalist$macrocall$1$ebnf$1$subexpression$1", "symbols": ["table_ref_commalist$macrocall$3", "table_ref_commalist$macrocall$2"]},
    {"name": "table_ref_commalist$macrocall$1$ebnf$1", "symbols": ["table_ref_commalist$macrocall$1$ebnf$1$subexpression$1", "table_ref_commalist$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "table_ref_commalist$macrocall$1", "symbols": ["table_ref_commalist$macrocall$2", "table_ref_commalist$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "table_ref_commalist", "symbols": ["table_ref_commalist$macrocall$1"], "postprocess": car},
    {"name": "table_ref", "symbols": [{"literal":"(","pos":227}, "table_ref", {"literal":")","pos":231}], "postprocess": cdar},
    {"name": "table_ref$ebnf$1$subexpression$1$ebnf$1", "symbols": [{"literal":"NATURAL","pos":240}], "postprocess": id},
    {"name": "table_ref$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": [{"literal":"OUTER","pos":246}], "postprocess": id},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"LEFT","pos":244}, "table_ref$ebnf$1$subexpression$1$subexpression$1$ebnf$1"]},
    {"name": "table_ref$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"RIGHT","pos":251}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": ["table_ref$ebnf$1$subexpression$1$ebnf$1", "table_ref$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"INNER","pos":256}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"CROSS","pos":260}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"FULL","pos":264}]},
    {"name": "table_ref$ebnf$1", "symbols": ["table_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref", "symbols": ["table_ref", "table_ref$ebnf$1", {"literal":"JOIN","pos":268}, "table", "join_constraint"], "postprocess": 
        d => new AST.Join(d, drillString(d[1]), d[0], d[3], d[4][0], d[4][1])
            },
    {"name": "table_ref", "symbols": ["table"], "postprocess": car},
    {"name": "join_constraint", "symbols": [{"literal":"ON","pos":286}, "expr"], "postprocess": d => [d[1], null]},
    {"name": "join_constraint", "symbols": [{"literal":"ON","pos":294}, {"literal":"(","pos":296}, "expr", {"literal":")","pos":300}], "postprocess": d => [d[2], null]},
    {"name": "join_constraint", "symbols": [{"literal":"USING","pos":306}, {"literal":"(","pos":308}, "identifier_list", {"literal":")","pos":312}], "postprocess": d => [null, d[2]]},
    {"name": "table", "symbols": ["post_table", "as_clause"], "postprocess": d => new AST.TableAlias(d, d[0], d[1] && d[1][1])},
    {"name": "table", "symbols": ["post_table"], "postprocess": car},
    {"name": "post_table$ebnf$1$subexpression$1", "symbols": [{"literal":".","pos":339}, "identifier"], "postprocess": cdar},
    {"name": "post_table$ebnf$1", "symbols": ["post_table$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "post_table$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_table", "symbols": ["identifier", "post_table$ebnf$1"], "postprocess": d => new AST.Table(d, d[0], d[1])},
    {"name": "post_table", "symbols": ["subquery"], "postprocess": car},
    {"name": "where_clause", "symbols": [{"literal":"WHERE","pos":359}, "expr"]},
    {"name": "group_by_clause$subexpression$1", "symbols": [{"literal":"(","pos":372}, "selection_column_list", {"literal":")","pos":376}]},
    {"name": "group_by_clause$subexpression$1", "symbols": ["selection_column_list"]},
    {"name": "group_by_clause$ebnf$1$subexpression$1", "symbols": [{"literal":"WITH","pos":384}, {"literal":"ROLLUP","pos":386}]},
    {"name": "group_by_clause$ebnf$1", "symbols": ["group_by_clause$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "group_by_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_by_clause", "symbols": [{"literal":"GROUP","pos":367}, {"literal":"BY","pos":369}, "group_by_clause$subexpression$1", "group_by_clause$ebnf$1"], "postprocess": 
        d => new AST.GroupBy(d, d[2][0].text === '(' ? d[2][1] : d[2][0], !!d[3])
        },
    {"name": "having_clause", "symbols": [{"literal":"HAVING","pos":396}, "expr"]},
    {"name": "order_clause$subexpression$1", "symbols": [{"literal":"ORDER","pos":405}, {"literal":"BY","pos":407}]},
    {"name": "order_clause", "symbols": ["order_clause$subexpression$1", "order_substat_list"]},
    {"name": "order_substat_list", "symbols": [{"literal":"(","pos":416}, "order_substat_list", {"literal":")","pos":420}], "postprocess": cdar},
    {"name": "order_substat_list$macrocall$2", "symbols": ["order_substat"]},
    {"name": "order_substat_list$macrocall$3", "symbols": [{"literal":",","pos":431}]},
    {"name": "order_substat_list$macrocall$1$ebnf$1", "symbols": []},
    {"name": "order_substat_list$macrocall$1$ebnf$1$subexpression$1", "symbols": ["order_substat_list$macrocall$3", "order_substat_list$macrocall$2"]},
    {"name": "order_substat_list$macrocall$1$ebnf$1", "symbols": ["order_substat_list$macrocall$1$ebnf$1$subexpression$1", "order_substat_list$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "order_substat_list$macrocall$1", "symbols": ["order_substat_list$macrocall$2", "order_substat_list$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "order_substat_list", "symbols": ["order_substat_list$macrocall$1"]},
    {"name": "order_substat$ebnf$1$subexpression$1", "symbols": [{"literal":"ASC","pos":441}]},
    {"name": "order_substat$ebnf$1$subexpression$1", "symbols": [{"literal":"DESC","pos":445}]},
    {"name": "order_substat$ebnf$1", "symbols": ["order_substat$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "order_substat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_substat", "symbols": ["expr", "order_substat$ebnf$1"], "postprocess": d => new AST.Order(d, d[0], d[1] && d[1][0].value)},
    {"name": "limit_clause", "symbols": [{"literal":"LIMIT","pos":455}, (sqlLexer.has("number") ? {type: "number"} : number)]},
    {"name": "expr_list$macrocall$2", "symbols": ["expr"]},
    {"name": "expr_list$macrocall$3", "symbols": [{"literal":",","pos":474}]},
    {"name": "expr_list$macrocall$1$ebnf$1", "symbols": []},
    {"name": "expr_list$macrocall$1$ebnf$1$subexpression$1", "symbols": ["expr_list$macrocall$3", "expr_list$macrocall$2"]},
    {"name": "expr_list$macrocall$1$ebnf$1", "symbols": ["expr_list$macrocall$1$ebnf$1$subexpression$1", "expr_list$macrocall$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "expr_list$macrocall$1", "symbols": ["expr_list$macrocall$2", "expr_list$macrocall$1$ebnf$1"], "postprocess": d => drill(d)},
    {"name": "expr_list", "symbols": ["expr_list$macrocall$1"], "postprocess": d => new AST.ExpressionList(d, undrill(d[0]))},
    {"name": "expr", "symbols": ["two_op_expr"], "postprocess": car},
    {"name": "two_op_expr", "symbols": ["post_two_op_expr"], "postprocess": car},
    {"name": "two_op_expr", "symbols": [{"literal":"(","pos":497}, "two_op_expr", {"literal":")","pos":501}], "postprocess": parenthesized},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"OR","pos":512}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"XOR","pos":516}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"AND","pos":520}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [(sqlLexer.has("condBinaryOp") ? {type: "condBinaryOp"} : condBinaryOp)]},
    {"name": "post_two_op_expr", "symbols": ["expr", "post_two_op_expr$subexpression$1", "one_op_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_two_op_expr", "symbols": ["post_one_op_expr"], "postprocess": car},
    {"name": "one_op_expr", "symbols": ["post_one_op_expr"], "postprocess": car},
    {"name": "one_op_expr", "symbols": [{"literal":"(","pos":548}, "one_op_expr", {"literal":")","pos":552}], "postprocess": parenthesized},
    {"name": "post_one_op_expr$subexpression$1", "symbols": [{"literal":"NOT","pos":561}]},
    {"name": "post_one_op_expr$subexpression$1", "symbols": [{"literal":"!","pos":565}]},
    {"name": "post_one_op_expr", "symbols": ["post_one_op_expr$subexpression$1", "boolean_primary"], "postprocess": makeUnaryExpr},
    {"name": "post_one_op_expr$subexpression$2$ebnf$1", "symbols": [{"literal":"NOT","pos":579}], "postprocess": id},
    {"name": "post_one_op_expr$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_one_op_expr$subexpression$2", "symbols": [{"literal":"IS","pos":577}, "post_one_op_expr$subexpression$2$ebnf$1"]},
    {"name": "post_one_op_expr$subexpression$3", "symbols": ["boolean"]},
    {"name": "post_one_op_expr$subexpression$3", "symbols": ["unknown"]},
    {"name": "post_one_op_expr", "symbols": ["boolean_primary", "post_one_op_expr$subexpression$2", "post_one_op_expr$subexpression$3"], "postprocess": makeBinaryExpr},
    {"name": "post_one_op_expr", "symbols": ["post_boolean_primary"], "postprocess": car},
    {"name": "boolean_primary", "symbols": ["post_boolean_primary"], "postprocess": car},
    {"name": "boolean_primary", "symbols": [{"literal":"(","pos":609}, "boolean_primary", {"literal":")","pos":613}], "postprocess": parenthesized},
    {"name": "post_boolean_primary$subexpression$1$ebnf$1", "symbols": [{"literal":"NOT","pos":626}], "postprocess": id},
    {"name": "post_boolean_primary$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_boolean_primary$subexpression$1", "symbols": [{"literal":"IS","pos":624}, "post_boolean_primary$subexpression$1$ebnf$1"]},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", "post_boolean_primary$subexpression$1", "null_"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", (sqlLexer.has("boolBinaryOp") ? {type: "boolBinaryOp"} : boolBinaryOp), "predicate"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary$subexpression$2$subexpression$1", "symbols": [{"literal":"ANY","pos":654}]},
    {"name": "post_boolean_primary$subexpression$2$subexpression$1", "symbols": [{"literal":"ALL","pos":658}]},
    {"name": "post_boolean_primary$subexpression$2", "symbols": [(sqlLexer.has("boolBinaryOp") ? {type: "boolBinaryOp"} : boolBinaryOp), "post_boolean_primary$subexpression$2$subexpression$1"]},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", "post_boolean_primary$subexpression$2", "subquery"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary", "symbols": ["post_predicate"], "postprocess": car},
    {"name": "predicate", "symbols": ["post_predicate"], "postprocess": car},
    {"name": "predicate", "symbols": [{"literal":"(","pos":682}, "predicate", {"literal":")","pos":686}], "postprocess": parenthesized},
    {"name": "post_predicate$subexpression$1$ebnf$1", "symbols": [{"literal":"NOT","pos":697}], "postprocess": id},
    {"name": "post_predicate$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$1", "symbols": ["post_predicate$subexpression$1$ebnf$1", {"literal":"IN","pos":700}]},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$1", "subquery"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate$subexpression$2$ebnf$1", "symbols": [{"literal":"NOT","pos":712}], "postprocess": id},
    {"name": "post_predicate$subexpression$2$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$2", "symbols": ["post_predicate$subexpression$2$ebnf$1", {"literal":"IN","pos":715}]},
    {"name": "post_predicate$subexpression$3", "symbols": [{"literal":"(","pos":719}, "expr_list", {"literal":")","pos":723}], "postprocess": cdar},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$2", "post_predicate$subexpression$3"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate$subexpression$4$ebnf$1", "symbols": [{"literal":"NOT","pos":735}], "postprocess": id},
    {"name": "post_predicate$subexpression$4$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$4", "symbols": ["post_predicate$subexpression$4$ebnf$1", {"literal":"BETWEEN","pos":738}]},
    {"name": "post_predicate$subexpression$5", "symbols": ["bit_expr", {"literal":"AND","pos":744}, "bit_expr"]},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$4", "post_predicate$subexpression$5"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate$subexpression$6$ebnf$1", "symbols": [{"literal":"NOT","pos":756}], "postprocess": id},
    {"name": "post_predicate$subexpression$6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate$subexpression$6", "symbols": ["post_predicate$subexpression$6$ebnf$1", {"literal":"LIKE","pos":759}]},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$subexpression$6", "bit_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_predicate", "symbols": ["post_bit_expr"], "postprocess": car},
    {"name": "bit_expr", "symbols": ["post_bit_expr"], "postprocess": car},
    {"name": "bit_expr", "symbols": [{"literal":"(","pos":782}, "bit_expr", {"literal":")","pos":786}], "postprocess": parenthesized},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"DIV","pos":797}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"MOD","pos":801}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"*","pos":805}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [(sqlLexer.has("arithBinaryOp") ? {type: "arithBinaryOp"} : arithBinaryOp)]},
    {"name": "post_bit_expr", "symbols": ["bit_expr", "post_bit_expr$subexpression$1", "simple_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_bit_expr$subexpression$2", "symbols": [{"literal":"+","pos":822}]},
    {"name": "post_bit_expr$subexpression$2", "symbols": [{"literal":"-","pos":826}]},
    {"name": "post_bit_expr", "symbols": ["bit_expr", "post_bit_expr$subexpression$2", "interval_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_bit_expr", "symbols": ["interval_expr"], "postprocess": car},
    {"name": "post_bit_expr", "symbols": ["post_simple_expr"], "postprocess": car},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MICROSECOND","pos":856}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"SECOND","pos":860}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MINUTE","pos":864}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR","pos":868}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY","pos":872}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"WEEK","pos":876}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MONTH","pos":880}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"QUARTER","pos":884}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"YEAR","pos":888}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"SECOND_MICROSECOND","pos":892}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MINUTE_MICROSECOND","pos":896}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"MINUTE_SECOND","pos":900}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR_MICROSECOND","pos":904}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR_SECOND","pos":908}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"HOUR_MINUTE","pos":912}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_MICROSECOND","pos":916}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_SECOND","pos":920}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_MINUTE","pos":924}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"DAY_HOUR","pos":928}]},
    {"name": "interval_expr$subexpression$1$subexpression$1", "symbols": [{"literal":"YEAR_MONTH","pos":932}]},
    {"name": "interval_expr$subexpression$1", "symbols": ["interval_expr$subexpression$1$subexpression$1"], "postprocess": caar},
    {"name": "interval_expr", "symbols": [{"literal":"INTERVAL","pos":849}, "expr", "interval_expr$subexpression$1"], "postprocess": makeBinaryExpr},
    {"name": "simple_expr", "symbols": ["post_simple_expr"], "postprocess": car},
    {"name": "simple_expr", "symbols": [{"literal":"(","pos":951}, "simple_expr", {"literal":")","pos":955}], "postprocess": cdar},
    {"name": "post_simple_expr", "symbols": ["identifier"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"@","pos":969}, "identifier"], "postprocess": d => new AST.Variable(d, d[0])},
    {"name": "post_simple_expr", "symbols": ["identifier", {"literal":".","pos":979}, "identifier"], "postprocess": d => new AST.Column(d, d[0], d[2])},
    {"name": "post_simple_expr", "symbols": ["literal"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"BINARY","pos":993}, "simple_expr"], "postprocess": makeUnaryExpr},
    {"name": "post_simple_expr", "symbols": ["function_call"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["subquery"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"EXISTS","pos":1013}, "subquery"], "postprocess": makeUnaryExpr},
    {"name": "post_simple_expr", "symbols": ["case_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["if_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["cast_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["convert_expr"], "postprocess": car},
    {"name": "literal", "symbols": [(sqlLexer.has("string") ? {type: "string"} : string)], "postprocess": d => new AST.String(d, d[0].value)},
    {"name": "literal", "symbols": ["number"], "postprocess": car},
    {"name": "literal", "symbols": ["boolean"], "postprocess": car},
    {"name": "literal", "symbols": ["null_"], "postprocess": car},
    {"name": "boolean", "symbols": [{"literal":"TRUE","pos":1074}], "postprocess": d => new AST.Boolean(d, true)},
    {"name": "boolean", "symbols": [{"literal":"FALSE","pos":1080}], "postprocess": d => new AST.Boolean(d, false)},
    {"name": "null_", "symbols": [{"literal":"NULL","pos":1088}], "postprocess": d => new AST.Null(d)},
    {"name": "unknown", "symbols": [{"literal":"UNKNOWN","pos":1096}], "postprocess": d => new AST.Unknown(d)},
    {"name": "number$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"+","pos":1106}]},
    {"name": "number$ebnf$1$subexpression$1$subexpression$1", "symbols": [{"literal":"-","pos":1110}]},
    {"name": "number$ebnf$1$subexpression$1", "symbols": ["number$ebnf$1$subexpression$1$subexpression$1"], "postprocess": caar},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "number$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$ebnf$1", "post_number"], "postprocess": 
        d => new AST.Number(d, d[0] && d[0].value === '-' ? -d[1].value : d[1].value)
        },
    {"name": "post_number", "symbols": [{"literal":"(","pos":1125}, "post_number", {"literal":")","pos":1129}], "postprocess": cdar},
    {"name": "post_number", "symbols": [(sqlLexer.has("number") ? {type: "number"} : number)], "postprocess": car},
    {"name": "post_number", "symbols": [(sqlLexer.has("float") ? {type: "float"} : float)], "postprocess": car},
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1153}, "function_parameters", {"literal":")","pos":1157}], "postprocess":  d => new AST.FunctionCall(
          d, d[0], d[2][0] instanceof AST.ExpressionList ? d[2][0] : d[2][1],
          d[2][0] && d[2][0].value === 'DISTINCT', d[2][0] && d[2][0].value === 'ALL'
        ) },
    {"name": "function_identifier$subexpression$1", "symbols": [(sqlLexer.has("btstring") ? {type: "btstring"} : btstring)]},
    {"name": "function_identifier$subexpression$1", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"LEFT","pos":1176}]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"RIGHT","pos":1180}]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"REPLACE","pos":1184}]},
    {"name": "function_identifier$subexpression$1", "symbols": [{"literal":"MOD","pos":1188}]},
    {"name": "function_identifier", "symbols": ["function_identifier$subexpression$1"], "postprocess": 
        d => new AST.Identifier(d, d[0][0].value)
        },
    {"name": "function_parameters", "symbols": [{"literal":"DISTINCT","pos":1197}, "column"]},
    {"name": "function_parameters", "symbols": [{"literal":"ALL","pos":1203}, "expr"]},
    {"name": "function_parameters", "symbols": []},
    {"name": "function_parameters", "symbols": ["expr_list"]},
    {"name": "column$ebnf$1", "symbols": ["as_clause"], "postprocess": id},
    {"name": "column$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "column", "symbols": ["identifier", "column$ebnf$1"], "postprocess": d => new AST.ColumnSelection(d, d[0], d[1] && d[1][1])},
    {"name": "subquery", "symbols": [{"literal":"(","pos":1230}, "select_stmt", {"literal":")","pos":1234}], "postprocess": 
        d => new AST.Subquery(d, d[1])
        },
    {"name": "case_expr$ebnf$1", "symbols": ["expr"], "postprocess": id},
    {"name": "case_expr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_expr$ebnf$2$subexpression$1", "symbols": [{"literal":"WHEN","pos":1248}, "expr", {"literal":"THEN","pos":1252}, "expr"]},
    {"name": "case_expr$ebnf$2", "symbols": ["case_expr$ebnf$2$subexpression$1"]},
    {"name": "case_expr$ebnf$2$subexpression$2", "symbols": [{"literal":"WHEN","pos":1248}, "expr", {"literal":"THEN","pos":1252}, "expr"]},
    {"name": "case_expr$ebnf$2", "symbols": ["case_expr$ebnf$2$subexpression$2", "case_expr$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "case_expr$ebnf$3$subexpression$1", "symbols": [{"literal":"ELSE","pos":1259}, "expr"]},
    {"name": "case_expr$ebnf$3", "symbols": ["case_expr$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "case_expr$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_expr", "symbols": [{"literal":"CASE","pos":1242}, "case_expr$ebnf$1", "case_expr$ebnf$2", "case_expr$ebnf$3", {"literal":"END","pos":1265}], "postprocess": 
        d => new AST.Case(d, d[1], d[2].map(l => [l[1], l[3]]), d[3] && d[3][1])
        },
    {"name": "if_expr", "symbols": [{"literal":"IF","pos":1273}, {"literal":"(","pos":1275}, "expr", {"literal":",","pos":1279}, "expr", {"literal":",","pos":1283}, "expr", {"literal":")","pos":1287}], "postprocess": 
        d => new AST.If(d, d[2], d[4], d[6])
        },
    {"name": "cast_expr", "symbols": [{"literal":"CAST","pos":1295}, {"literal":"(","pos":1297}, "expr", {"literal":"AS","pos":1301}, "data_type", {"literal":")","pos":1305}], "postprocess": 
        d => ({
          type: 'expression',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: null,
        })
        },
    {"name": "data_type$ebnf$1$subexpression$1", "symbols": [{"literal":"(","pos":1319}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1324}], "postprocess": cdar},
    {"name": "data_type$ebnf$1", "symbols": ["data_type$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "data_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_type", "symbols": [{"literal":"BINARY","pos":1316}, "data_type$ebnf$1"]},
    {"name": "data_type$ebnf$2$subexpression$1", "symbols": [{"literal":"(","pos":1335}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1340}], "postprocess": cdar},
    {"name": "data_type$ebnf$2", "symbols": ["data_type$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "data_type$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_type", "symbols": [{"literal":"CHAR","pos":1332}, "data_type$ebnf$2"]},
    {"name": "data_type", "symbols": [{"literal":"DATE","pos":1348}]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1352}]},
    {"name": "data_type$subexpression$1", "symbols": [{"literal":"(","pos":1359}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1364}], "postprocess": cdar},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1356}, "data_type$subexpression$1"]},
    {"name": "data_type$subexpression$2", "symbols": [{"literal":"(","pos":1374}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":",","pos":1379}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1384}], "postprocess": d => [d[1], d[3]]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1371}, "data_type$subexpression$2"]},
    {"name": "data_type", "symbols": [{"literal":"FLOAT","pos":1391}]},
    {"name": "data_type", "symbols": [{"literal":"NCHAR","pos":1395}]},
    {"name": "data_type", "symbols": [{"literal":"SIGNED","pos":1399}]},
    {"name": "data_type", "symbols": [{"literal":"TIME","pos":1403}]},
    {"name": "data_type", "symbols": [{"literal":"UNSIGNED","pos":1407}]},
    {"name": "convert_expr", "symbols": [{"literal":"CONVERT","pos":1413}, {"literal":"(","pos":1415}, "expr", {"literal":"USING","pos":1419}, "identifier", {"literal":")","pos":1423}], "postprocess": 
        d => ({
          type: 'expression',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: null,
        })
        },
    {"name": "identifier_list$macrocall$2", "symbols": ["identifier"]},
    {"name": "identifier_list$macrocall$3", "symbols": [{"literal":",","pos":1438}]},
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
