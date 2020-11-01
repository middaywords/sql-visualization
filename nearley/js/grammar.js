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

function cdar (d) {
  return d[1]
}

function cddar (d) {
  return d[2]
}


function makeTableRef(d, onOffset, usingOffset) {
  return {
    type: 'table_ref',
    side: d[1],
    left: d[0],
    right: d[3],
    on: d[onOffset],
    using: d[usingOffset],
  }
}


function postfixExpr (token) {
  if (Array.isArray(token.operator)) {
    token.operator = token.operator[0]
  }
  token.operator.type = 'operator'
  if (token.modifier) {
    if (Array.isArray(token.modifier)) {
      token.modifier = token.modifier[0]
    }
    token.modifier.type = 'modifier'
  }
  if (token.right.type === 'keyword') {
    token.right.type = 'const'
  }
  return token
}

function makeUnaryExpr (d) {
  return postfixExpr({
    type: 'expr',
    operator: d[0],
    modifier: undefined,
    left: d[1],
    right: undefined,
    third: undefined,
  })
}

function makeBinaryExpr (d) {
  return postfixExpr({
    type: 'expr',
    operator: d[1],
    modifier: undefined,
    left: d[0],
    right: d[2],
    third: d[3],
  })
}

function makeCompondOpExpr (d) {
  return postfixExpr({
    type: 'expr',
    operator: d[1],
    modifier: d[2],
    left: d[0],
    right: d[3],
    third: d[4],
  })
}

function makeReversedCompondOpExpr (d) {
  return postfixExpr({
    type: 'expr',
    operator: d[2],
    modifier: d[1],
    left: d[0],
    right: d[3],
    third: d[4],
  })
}


function makeType(d) {
  d[0].type = 'base_type'
  return {
    type: 'type',
    baseType: d[0],
    qualifier: d[1] && d[1][1],
    secondQualifier: d[1] && d[1][3],
  }
}


function makeIdentifier(d) {
  d[0].type = 'identifier'
  return d[0]
}
var grammar = {
    Lexer: sqlLexer,
    ParserRules: [
    {"name": "main$ebnf$1$subexpression$1$ebnf$1", "symbols": ["main"], "postprocess": id},
    {"name": "main$ebnf$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main$ebnf$1$subexpression$1", "symbols": [{"literal":";","pos":17}, "main$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "main$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["sql_stmt", "main$ebnf$1"], "postprocess": d => [d[0]].concat(d[2] && d[2][1] ? d[2][1] : [])},
    {"name": "sql_stmt", "symbols": [{"literal":"(","pos":30}, "sql_stmt", {"literal":")","pos":34}], "postprocess": cdar},
    {"name": "sql_stmt", "symbols": ["post_select_stmt"], "postprocess": car},
    {"name": "select_stmt", "symbols": [{"literal":"(","pos":48}, "select_stmt", {"literal":")","pos":52}], "postprocess": cdar},
    {"name": "select_stmt", "symbols": ["post_select_stmt"], "postprocess": car},
    {"name": "post_select_stmt$ebnf$1", "symbols": ["top_spec"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt$ebnf$2", "symbols": ["all_distinct"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt$ebnf$3", "symbols": ["table_expr"], "postprocess": id},
    {"name": "post_select_stmt$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_select_stmt", "symbols": [{"literal":"SELECT","pos":66}, "post_select_stmt$ebnf$1", "post_select_stmt$ebnf$2", "selection", "post_select_stmt$ebnf$3"], "postprocess": 
        d => ({
          type: 'select',
          top: d[1],
          all_distinct: d[2],
          selection: d[3],
          table: d[4]
        })
            },
    {"name": "post_select_stmt", "symbols": ["select_stmt", {"literal":"UNION","pos":85}, "select_stmt"], "postprocess": 
        d => ({
          type: 'union',
          left: d[0],
          right: d[4]
        })
            },
    {"name": "top_spec", "symbols": [{"literal":"TOP","pos":95}, (sqlLexer.has("number") ? {type: "number"} : number)], "postprocess": cdar},
    {"name": "all_distinct", "symbols": [{"literal":"ALL","pos":106}]},
    {"name": "all_distinct", "symbols": [{"literal":"DISTINCT","pos":110}]},
    {"name": "selection", "symbols": [{"literal":"*","pos":116}], "postprocess": d => []},
    {"name": "selection", "symbols": ["selection_column_comma_list"], "postprocess": car},
    {"name": "selection_column_comma_list$ebnf$1$subexpression$1", "symbols": ["selection_column_comma_list", {"literal":",","pos":133}]},
    {"name": "selection_column_comma_list$ebnf$1", "symbols": ["selection_column_comma_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "selection_column_comma_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selection_column_comma_list", "symbols": ["selection_column_comma_list$ebnf$1", "selection_column"], "postprocess": 
        d => makeList(d[0] && d[0][0], d[1])
        },
    {"name": "selection_column$ebnf$1$subexpression$1", "symbols": [{"literal":"AS","pos":148}, "identifier"]},
    {"name": "selection_column$ebnf$1", "symbols": ["selection_column$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "selection_column$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "selection_column", "symbols": ["expr", "selection_column$ebnf$1"], "postprocess": d => ({type: 'selection_column', expression: d[0], alias: d[1] && d[1][1]})},
    {"name": "table_expr$ebnf$1", "symbols": ["where_clause"], "postprocess": id},
    {"name": "table_expr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expr$ebnf$2", "symbols": ["group_by_clause"], "postprocess": id},
    {"name": "table_expr$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expr$ebnf$3", "symbols": ["having_clause"], "postprocess": id},
    {"name": "table_expr$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expr$ebnf$4", "symbols": ["order_clause"], "postprocess": id},
    {"name": "table_expr$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expr$ebnf$5", "symbols": ["limit_clause"], "postprocess": id},
    {"name": "table_expr$ebnf$5", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_expr", "symbols": ["from_clause", "table_expr$ebnf$1", "table_expr$ebnf$2", "table_expr$ebnf$3", "table_expr$ebnf$4", "table_expr$ebnf$5"], "postprocess": 
        d => ({
          type: 'from_table',
          from: d[0],
          where: d[1],
          groupby: d[2],
          having: d[3],
          order: d[4],
          limit: d[5],
        })
        },
    {"name": "from_clause", "symbols": [{"literal":"FROM","pos":183}, "table_ref_commalist"], "postprocess": d => ({type: 'from', table_refs: d[1]})},
    {"name": "from_clause", "symbols": [{"literal":"FROM","pos":191}, "subquery"], "postprocess": d => ({type: 'from', subquery: d[1]})},
    {"name": "table_ref_commalist$ebnf$1$subexpression$1", "symbols": ["table_ref_commalist", {"literal":",","pos":204}]},
    {"name": "table_ref_commalist$ebnf$1", "symbols": ["table_ref_commalist$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_ref_commalist$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref_commalist", "symbols": ["table_ref_commalist$ebnf$1", "table_ref"], "postprocess": 
        d => makeList(d[0] && d[0][0], d[1])
        },
    {"name": "table_ref", "symbols": [{"literal":"(","pos":219}, "table_ref", {"literal":")","pos":223}], "postprocess": cdar},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"LEFT","pos":232}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"RIGHT","pos":236}]},
    {"name": "table_ref$ebnf$1$subexpression$1", "symbols": [{"literal":"INNER","pos":240}]},
    {"name": "table_ref$ebnf$1", "symbols": ["table_ref$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table_ref$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref", "symbols": ["table_ref", "table_ref$ebnf$1", {"literal":"JOIN","pos":244}, "table", {"literal":"ON","pos":248}, "expr"], "postprocess": d => makeTableRef(d, 5, -1)},
    {"name": "table_ref$ebnf$2$subexpression$1", "symbols": [{"literal":"LEFT","pos":259}]},
    {"name": "table_ref$ebnf$2$subexpression$1", "symbols": [{"literal":"RIGHT","pos":263}]},
    {"name": "table_ref$ebnf$2$subexpression$1", "symbols": [{"literal":"INNER","pos":267}]},
    {"name": "table_ref$ebnf$2", "symbols": ["table_ref$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "table_ref$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref", "symbols": ["table_ref", "table_ref$ebnf$2", {"literal":"JOIN","pos":271}, "table", {"literal":"ON","pos":275}, {"literal":"(","pos":277}, "expr", {"literal":")","pos":281}], "postprocess": d => makeTableRef(d, 6, -1)},
    {"name": "table_ref$ebnf$3$subexpression$1", "symbols": [{"literal":"LEFT","pos":290}]},
    {"name": "table_ref$ebnf$3$subexpression$1", "symbols": [{"literal":"RIGHT","pos":294}]},
    {"name": "table_ref$ebnf$3$subexpression$1", "symbols": [{"literal":"INNER","pos":298}]},
    {"name": "table_ref$ebnf$3", "symbols": ["table_ref$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "table_ref$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table_ref", "symbols": ["table_ref", "table_ref$ebnf$3", {"literal":"JOIN","pos":302}, "table", {"literal":"USING","pos":306}, {"literal":"(","pos":308}, "identifier_comma_list", {"literal":")","pos":312}], "postprocess": d => makeTableRef(d, -1, 6)},
    {"name": "table_ref", "symbols": ["table"], "postprocess": car},
    {"name": "table$ebnf$1$subexpression$1", "symbols": [{"literal":".","pos":329}, "identifier"]},
    {"name": "table$ebnf$1", "symbols": ["table$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "table$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table$ebnf$2$subexpression$1$ebnf$1", "symbols": [{"literal":"AS","pos":336}], "postprocess": id},
    {"name": "table$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table$ebnf$2$subexpression$1", "symbols": ["table$ebnf$2$subexpression$1$ebnf$1", "identifier"]},
    {"name": "table$ebnf$2", "symbols": ["table$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "table$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table", "symbols": ["identifier", "table$ebnf$1", "table$ebnf$2"], "postprocess":  d => ({
          type: 'table',
          alias: d[2] && d[2][1],
          table: d[0],
          subTable: d[1] && d[1][1],
        }) },
    {"name": "table$ebnf$3", "symbols": [{"literal":"AS","pos":349}], "postprocess": id},
    {"name": "table$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "table", "symbols": ["subquery", "table$ebnf$3", "identifier"], "postprocess":  d => ({
          type: 'table',
          alias: d[2],
          subquery: d[0],
        }) },
    {"name": "subquery", "symbols": [{"literal":"(","pos":360}, "select_stmt", {"literal":")","pos":364}], "postprocess": cdar},
    {"name": "where_clause$ebnf$1", "symbols": [{"literal":"(","pos":374}], "postprocess": id},
    {"name": "where_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "where_clause$ebnf$2", "symbols": [{"literal":")","pos":379}], "postprocess": id},
    {"name": "where_clause$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "where_clause", "symbols": [{"literal":"WHERE","pos":372}, "where_clause$ebnf$1", "expr", "where_clause$ebnf$2"], "postprocess": cddar},
    {"name": "group_by_clause$ebnf$1", "symbols": [{"literal":"(","pos":392}], "postprocess": id},
    {"name": "group_by_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_by_clause$ebnf$2", "symbols": [{"literal":")","pos":397}], "postprocess": id},
    {"name": "group_by_clause$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_by_clause$ebnf$3$subexpression$1", "symbols": [{"literal":"WITH","pos":401}, {"literal":"ROLLUP","pos":403}]},
    {"name": "group_by_clause$ebnf$3", "symbols": ["group_by_clause$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "group_by_clause$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_by_clause", "symbols": [{"literal":"GROUP","pos":388}, {"literal":"BY","pos":390}, "group_by_clause$ebnf$1", "selection_column_comma_list", "group_by_clause$ebnf$2", "group_by_clause$ebnf$3"], "postprocess": 
        d => ({
          type: 'group_by',
          columns: d[3],
          with_rollup: !!d[5],
        })
        },
    {"name": "having_clause$ebnf$1", "symbols": [{"literal":"(","pos":415}], "postprocess": id},
    {"name": "having_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "having_clause$ebnf$2", "symbols": [{"literal":")","pos":420}], "postprocess": id},
    {"name": "having_clause$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "having_clause", "symbols": [{"literal":"HAVING","pos":413}, "having_clause$ebnf$1", "expr", "having_clause$ebnf$2"], "postprocess": cddar},
    {"name": "order_clause$ebnf$1", "symbols": [{"literal":"(","pos":433}], "postprocess": id},
    {"name": "order_clause$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_clause$ebnf$2", "symbols": [{"literal":")","pos":438}], "postprocess": id},
    {"name": "order_clause$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_clause", "symbols": [{"literal":"ORDER","pos":429}, {"literal":"BY","pos":431}, "order_clause$ebnf$1", "order_substat_comma_list", "order_clause$ebnf$2"], "postprocess": d => d[3]},
    {"name": "order_substat_comma_list$ebnf$1$subexpression$1", "symbols": ["order_substat_comma_list", {"literal":",","pos":450}]},
    {"name": "order_substat_comma_list$ebnf$1", "symbols": ["order_substat_comma_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "order_substat_comma_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "order_substat_comma_list", "symbols": ["order_substat_comma_list$ebnf$1", "order_substat"], "postprocess": 
        d => makeList(d[0] && d[0][0], d[1])
        },
    {"name": "order_substat$subexpression$1", "symbols": [{"literal":"ASC","pos":465}]},
    {"name": "order_substat$subexpression$1", "symbols": [{"literal":"DESC","pos":469}]},
    {"name": "order_substat", "symbols": ["expr", "order_substat$subexpression$1"], "postprocess": d => ({type:'order', value:d[0], direction: d[1]})},
    {"name": "limit_clause", "symbols": [{"literal":"LIMIT","pos":478}, (sqlLexer.has("number") ? {type: "number"} : number)], "postprocess": cdar},
    {"name": "expr_comma_list$ebnf$1$subexpression$1", "symbols": ["expr_comma_list", {"literal":",","pos":497}]},
    {"name": "expr_comma_list$ebnf$1", "symbols": ["expr_comma_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "expr_comma_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "expr_comma_list", "symbols": ["expr_comma_list$ebnf$1", "expr"], "postprocess": 
        d => ({type:'expr_comma_list', exprs: makeList(d[0] && d[0][0] && d[0][0].exprs, d[1])})
        },
    {"name": "expr", "symbols": ["two_op_expr"], "postprocess": car},
    {"name": "two_op_expr", "symbols": [{"literal":"(","pos":517}, "two_op_expr", {"literal":")","pos":521}], "postprocess": cdar},
    {"name": "two_op_expr", "symbols": ["post_two_op_expr"], "postprocess": car},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"OR","pos":538}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"XOR","pos":542}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [{"literal":"AND","pos":546}]},
    {"name": "post_two_op_expr$subexpression$1", "symbols": [(sqlLexer.has("condBinaryOp") ? {type: "condBinaryOp"} : condBinaryOp)]},
    {"name": "post_two_op_expr", "symbols": ["expr", "post_two_op_expr$subexpression$1", "one_op_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_two_op_expr", "symbols": ["post_one_op_expr"], "postprocess": car},
    {"name": "one_op_expr", "symbols": [{"literal":"(","pos":568}, "one_op_expr", {"literal":")","pos":572}], "postprocess": cdar},
    {"name": "one_op_expr", "symbols": ["post_one_op_expr"], "postprocess": car},
    {"name": "post_one_op_expr$subexpression$1", "symbols": [{"literal":"NOT","pos":587}]},
    {"name": "post_one_op_expr$subexpression$1", "symbols": [{"literal":"!","pos":591}]},
    {"name": "post_one_op_expr", "symbols": ["post_one_op_expr$subexpression$1", "boolean_primary"], "postprocess": makeUnaryExpr},
    {"name": "post_one_op_expr$ebnf$1", "symbols": [{"literal":"NOT","pos":604}], "postprocess": id},
    {"name": "post_one_op_expr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_one_op_expr$subexpression$2", "symbols": [{"literal":"TRUE","pos":608}]},
    {"name": "post_one_op_expr$subexpression$2", "symbols": [{"literal":"FALSE","pos":612}]},
    {"name": "post_one_op_expr$subexpression$2", "symbols": [{"literal":"UNKNOWN","pos":616}]},
    {"name": "post_one_op_expr", "symbols": ["boolean_primary", {"literal":"IS","pos":602}, "post_one_op_expr$ebnf$1", "post_one_op_expr$subexpression$2"], "postprocess": makeCompondOpExpr},
    {"name": "post_one_op_expr", "symbols": ["post_boolean_primary"], "postprocess": car},
    {"name": "boolean_primary", "symbols": [{"literal":"(","pos":631}, "boolean_primary", {"literal":")","pos":635}], "postprocess": cdar},
    {"name": "boolean_primary", "symbols": ["post_boolean_primary"], "postprocess": car},
    {"name": "post_boolean_primary$ebnf$1", "symbols": [{"literal":"NOT","pos":653}], "postprocess": id},
    {"name": "post_boolean_primary$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", {"literal":"IS","pos":651}, "post_boolean_primary$ebnf$1", {"literal":"NULL","pos":656}], "postprocess": makeCompondOpExpr},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", (sqlLexer.has("boolBinaryOp") ? {type: "boolBinaryOp"} : boolBinaryOp), "predicate"], "postprocess": makeBinaryExpr},
    {"name": "post_boolean_primary$subexpression$1", "symbols": [{"literal":"ANY","pos":679}]},
    {"name": "post_boolean_primary$subexpression$1", "symbols": [{"literal":"ALL","pos":683}]},
    {"name": "post_boolean_primary", "symbols": ["boolean_primary", (sqlLexer.has("boolBinaryOp") ? {type: "boolBinaryOp"} : boolBinaryOp), "post_boolean_primary$subexpression$1", "subquery"], "postprocess": makeCompondOpExpr},
    {"name": "post_boolean_primary", "symbols": ["post_predicate"], "postprocess": car},
    {"name": "predicate", "symbols": [{"literal":"(","pos":700}, "predicate", {"literal":")","pos":704}], "postprocess": cdar},
    {"name": "predicate", "symbols": ["post_predicate"], "postprocess": car},
    {"name": "post_predicate$ebnf$1", "symbols": [{"literal":"NOT","pos":720}], "postprocess": id},
    {"name": "post_predicate$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$ebnf$1", {"literal":"IN","pos":723}, "subquery"], "postprocess": makeReversedCompondOpExpr},
    {"name": "post_predicate$ebnf$2", "symbols": [{"literal":"NOT","pos":733}], "postprocess": id},
    {"name": "post_predicate$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$ebnf$2", {"literal":"IN","pos":736}, {"literal":"(","pos":738}, "expr_comma_list", {"literal":")","pos":742}], "postprocess": 
        d => {
          let token = makeReversedCompondOpExpr(d)
          token.right = d[4]
          token.third = undefined
          return token
        } },
    {"name": "post_predicate$ebnf$3", "symbols": [{"literal":"NOT","pos":750}], "postprocess": id},
    {"name": "post_predicate$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$ebnf$3", {"literal":"BETWEEN","pos":753}, "bit_expr", {"literal":"AND","pos":757}, "bit_expr"], "postprocess": 
        d => {
          let token = makeReversedCompondOpExpr(d)
          token.third = d[5]
          return token
        } },
    {"name": "post_predicate$ebnf$4", "symbols": [{"literal":"NOT","pos":767}], "postprocess": id},
    {"name": "post_predicate$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "post_predicate", "symbols": ["bit_expr", "post_predicate$ebnf$4", {"literal":"LIKE","pos":770}, "bit_expr"], "postprocess": makeReversedCompondOpExpr},
    {"name": "post_predicate", "symbols": ["post_bit_expr"], "postprocess": car},
    {"name": "bit_expr", "symbols": [{"literal":"(","pos":786}, "bit_expr", {"literal":")","pos":790}], "postprocess": cdar},
    {"name": "bit_expr", "symbols": ["post_bit_expr"], "postprocess": car},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"DIV","pos":807}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"MOD","pos":811}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [{"literal":"*","pos":815}]},
    {"name": "post_bit_expr$subexpression$1", "symbols": [(sqlLexer.has("arithBinaryOp") ? {type: "arithBinaryOp"} : arithBinaryOp)]},
    {"name": "post_bit_expr", "symbols": ["bit_expr", "post_bit_expr$subexpression$1", "simple_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_bit_expr$subexpression$2", "symbols": [{"literal":"+","pos":832}]},
    {"name": "post_bit_expr$subexpression$2", "symbols": [{"literal":"-","pos":836}]},
    {"name": "post_bit_expr", "symbols": ["bit_expr", "post_bit_expr$subexpression$2", "interval_expr"], "postprocess": makeBinaryExpr},
    {"name": "post_bit_expr", "symbols": ["interval_expr"], "postprocess": car},
    {"name": "post_bit_expr", "symbols": ["post_simple_expr"], "postprocess": car},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"MICROSECOND","pos":865}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"SECOND","pos":869}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"MINUTE","pos":873}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"HOUR","pos":877}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"DAY","pos":881}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"WEEK","pos":885}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"MONTH","pos":889}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"QUARTER","pos":893}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"YEAR","pos":897}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"SECOND_MICROSECOND","pos":901}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"MINUTE_MICROSECOND","pos":905}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"MINUTE_SECOND","pos":909}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"HOUR_MICROSECOND","pos":913}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"HOUR_SECOND","pos":917}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"HOUR_MINUTE","pos":921}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"DAY_MICROSECOND","pos":925}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"DAY_SECOND","pos":929}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"DAY_MINUTE","pos":933}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"DAY_HOUR","pos":937}]},
    {"name": "interval_expr$subexpression$1", "symbols": [{"literal":"YEAR_MONTH","pos":941}]},
    {"name": "interval_expr", "symbols": [{"literal":"INTERVAL","pos":859}, "expr", "interval_expr$subexpression$1"], "postprocess": makeBinaryExpr},
    {"name": "simple_expr", "symbols": [{"literal":"(","pos":951}, "simple_expr", {"literal":")","pos":955}], "postprocess": cdar},
    {"name": "simple_expr", "symbols": ["post_simple_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"@","pos":976}, (sqlLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess":  d => {
          d[1].type = 'variable'
          return d[1]
        } },
    {"name": "post_simple_expr", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier), {"literal":".","pos":988}, (sqlLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": d => ({type: 'column', table: d[0], name: d[2]})},
    {"name": "post_simple_expr", "symbols": ["literal"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"(","pos":1003}, "expr_comma_list", {"literal":")","pos":1007}], "postprocess": cdar},
    {"name": "post_simple_expr", "symbols": [{"literal":"BINARY","pos":1013}, "simple_expr"], "postprocess": makeUnaryExpr},
    {"name": "post_simple_expr", "symbols": ["function_call"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["subquery"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": [{"literal":"EXISTS","pos":1033}, "subquery"], "postprocess": makeUnaryExpr},
    {"name": "post_simple_expr", "symbols": ["case_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["if_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["case_expr"], "postprocess": car},
    {"name": "post_simple_expr", "symbols": ["convert_expr"], "postprocess": car},
    {"name": "literal", "symbols": [(sqlLexer.has("string") ? {type: "string"} : string)], "postprocess": car},
    {"name": "literal$ebnf$1$subexpression$1", "symbols": [{"literal":"+","pos":1075}]},
    {"name": "literal$ebnf$1$subexpression$1", "symbols": [{"literal":"-","pos":1079}]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "literal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "literal", "symbols": ["literal$ebnf$1", (sqlLexer.has("number") ? {type: "number"} : number)], "postprocess":  d => {
          if (d[0] && d[0][0].value === '-') {
            d[1].value = -d[1].value
          }
          return d[1]
        } },
    {"name": "literal", "symbols": [(sqlLexer.has("float") ? {type: "float"} : float)], "postprocess": car},
    {"name": "literal$subexpression$1", "symbols": [{"literal":"NULL","pos":1098}]},
    {"name": "literal$subexpression$1", "symbols": [{"literal":"TRUE","pos":1102}]},
    {"name": "literal$subexpression$1", "symbols": [{"literal":"FALSE","pos":1106}]},
    {"name": "literal", "symbols": ["literal$subexpression$1"], "postprocess":  d => {
          d[0][0].type = 'const'
          return d[0][0]
        } },
    {"name": "function_identifier", "symbols": [(sqlLexer.has("btstring") ? {type: "btstring"} : btstring)], "postprocess": makeIdentifier},
    {"name": "function_identifier", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess":  (d, l, reject) => {
          const valid_function_identifiers = ['LEFT', 'RIGHT', 'REPLACE', 'MOD']
          if (valid_function_identifiers.includes(d[0].value)) {
            return reject;
          }
          return makeIdentifier(d);
        } },
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1133}, {"literal":"*","pos":1135}, {"literal":")","pos":1137}], "postprocess":  d => ({
          type:' function_call',
          name: d[0],
          parameters: [d[2]],
          modifier: undefined,
        }) },
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1145}, {"literal":"DISTINCT","pos":1147}, "column", {"literal":")","pos":1151}], "postprocess":  d => ({
          type: 'function_call',
          name: d[0],
          parameters: [d[3]],
          modifier: d[2],
        })},
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1159}, {"literal":"ALL","pos":1161}, "expr", {"literal":")","pos":1165}], "postprocess":  d => ({
          type: 'function_call',
          name: d[0],
          parameters: [d[3]],
          modifier: d[2],
        })},
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1173}, {"literal":")","pos":1175}], "postprocess":  d => ({
          type: 'function_call',
          name: d[0],
          parameters: [],
          modifier: undefined,
        })},
    {"name": "function_call", "symbols": ["function_identifier", {"literal":"(","pos":1183}, "expr_comma_list", {"literal":")","pos":1187}], "postprocess":  d => ({
          type: 'function_call',
          name: d[0],
          parameters: d[2].exprs,
          modifier: undefined,
        })},
    {"name": "column", "symbols": ["identifier"], "postprocess": d => ({type: 'column', name: d[0]})},
    {"name": "column", "symbols": ["identifier", {"literal":"AS","pos":1203}, "identifier"], "postprocess": d => ({type: 'column', name: d[0], alias: d[2]})},
    {"name": "case_expr$ebnf$1", "symbols": ["expr"], "postprocess": id},
    {"name": "case_expr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_expr$ebnf$2$subexpression$1", "symbols": [{"literal":"ELSE","pos":1221}, "expr"]},
    {"name": "case_expr$ebnf$2", "symbols": ["case_expr$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "case_expr$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "case_expr", "symbols": [{"literal":"CASE","pos":1213}, "case_expr$ebnf$1", "when_subexpr_list", "case_expr$ebnf$2", {"literal":"END","pos":1227}], "postprocess": 
        d => postfixExpr({
          type: 'expr',
          operator: d[0],
          left: d[1],
          right: d[2],
          third: d[3] && d[3][1],
        })
        },
    {"name": "when_subexpr_list$ebnf$1", "symbols": ["when_subexpr_list"], "postprocess": id},
    {"name": "when_subexpr_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "when_subexpr_list", "symbols": ["when_subexpr_list$ebnf$1", "when_subexpr"], "postprocess": d => makeList(d[0], d[1])},
    {"name": "when_subexpr", "symbols": [{"literal":"WHEN","pos":1246}, "expr", {"literal":"THEN","pos":1250}, "expr"], "postprocess": d => [d[1], d[3]]},
    {"name": "if_expr", "symbols": [{"literal":"IF","pos":1260}, {"literal":"(","pos":1262}, "expr", {"literal":",","pos":1266}, "expr", {"literal":",","pos":1270}, "expr", {"literal":")","pos":1274}], "postprocess": 
        d => postfixExpr({
          type: 'expr',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: d[6],
        })
        },
    {"name": "case_expr", "symbols": [{"literal":"CAST","pos":1282}, {"literal":"(","pos":1284}, "expr", {"literal":"AS","pos":1288}, "data_type", {"literal":")","pos":1292}], "postprocess": 
        d => postfixExpr({
          type: 'expr',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: undefined,
        })
        },
    {"name": "data_type$ebnf$1$subexpression$1", "symbols": [{"literal":"(","pos":1306}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1311}]},
    {"name": "data_type$ebnf$1", "symbols": ["data_type$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "data_type$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_type", "symbols": [{"literal":"BINARY","pos":1303}, "data_type$ebnf$1"]},
    {"name": "data_type$ebnf$2$subexpression$1", "symbols": [{"literal":"(","pos":1320}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1325}]},
    {"name": "data_type$ebnf$2", "symbols": ["data_type$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "data_type$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "data_type", "symbols": [{"literal":"CHAR","pos":1317}, "data_type$ebnf$2"]},
    {"name": "data_type", "symbols": [{"literal":"DATE","pos":1331}]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1335}]},
    {"name": "data_type$subexpression$1", "symbols": [{"literal":"(","pos":1342}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1347}]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1339}, "data_type$subexpression$1"]},
    {"name": "data_type$subexpression$2", "symbols": [{"literal":"(","pos":1355}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":",","pos":1360}, (sqlLexer.has("number") ? {type: "number"} : number), {"literal":")","pos":1365}]},
    {"name": "data_type", "symbols": [{"literal":"DECIMAL","pos":1352}, "data_type$subexpression$2"]},
    {"name": "data_type", "symbols": [{"literal":"FLOAT","pos":1370}]},
    {"name": "data_type", "symbols": [{"literal":"NCHAR","pos":1374}]},
    {"name": "data_type", "symbols": [{"literal":"SIGNED","pos":1378}]},
    {"name": "data_type", "symbols": [{"literal":"TIME","pos":1382}]},
    {"name": "data_type", "symbols": [{"literal":"UNSIGNED","pos":1386}]},
    {"name": "convert_expr", "symbols": [{"literal":"CONVERT","pos":1392}, {"literal":"(","pos":1394}, "expr", {"literal":"USING","pos":1398}, "identifier", {"literal":")","pos":1402}], "postprocess": 
        d => postfixExpr({
          type: 'expr',
          operator: d[0],
          left: d[2],
          right: d[4],
          third: undefined,
        })
        },
    {"name": "identifier_comma_list$ebnf$1$subexpression$1", "symbols": ["identifier_comma_list", {"literal":",","pos":1415}]},
    {"name": "identifier_comma_list$ebnf$1", "symbols": ["identifier_comma_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "identifier_comma_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "identifier_comma_list", "symbols": ["identifier_comma_list$ebnf$1", "identifier"], "postprocess": 
        d => makeList(d[0] && d[0][0], d[1])
        },
    {"name": "identifier", "symbols": [(sqlLexer.has("btstring") ? {type: "btstring"} : btstring)], "postprocess": makeIdentifier},
    {"name": "identifier", "symbols": [(sqlLexer.has("bkidentifier") ? {type: "bkidentifier"} : bkidentifier)], "postprocess": makeIdentifier},
    {"name": "identifier", "symbols": [(sqlLexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": makeIdentifier}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
