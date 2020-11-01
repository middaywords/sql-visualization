@lexer sqlLexer

# https://github.com/AlecStrong/sqlite-bnf/blob/master/sqlite.bnf

@{%
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
%}

main -> sql_stmt (";" main:?):? {% d => [d[0]].concat(d[2] && d[2][1] ? d[2][1] : []) %}

sql_stmt ->
    "(" sql_stmt ")" {% cdar %}
  | post_select_stmt {% car %}

select_stmt ->
    "(" select_stmt ")" {% cdar %}
  | post_select_stmt {% car %}

post_select_stmt ->
    "SELECT" top_spec:? all_distinct:? selection table_expr:? {%
      d => ({
        type: 'select',
        top: d[1],
        all_distinct: d[2],
        selection: d[3],
        table: d[4]
      })
    %}
  | select_stmt "UNION" select_stmt {%
      d => ({
        type: 'union',
        left: d[0],
        right: d[4]
      })
    %}

top_spec -> "TOP" %number {% cdar %}

all_distinct -> "ALL" | "DISTINCT"

selection ->
    "*" {% d => [] %}
  | selection_column_comma_list {% car %}

selection_column_comma_list -> (selection_column_comma_list ","):? selection_column {%
  d => makeList(d[0] && d[0][0], d[1])
%}

selection_column -> expr ("AS" identifier):? {% d => ({type: 'selection_column', expression: d[0], alias: d[1] && d[1][1]}) %}

table_expr -> from_clause where_clause:? group_by_clause:? having_clause:? order_clause:? limit_clause:? {%
  d => ({
    type: 'from_table',
    from: d[0],
    where: d[1],
    groupby: d[2],
    having: d[3],
    order: d[4],
    limit: d[5],
  })
%}

from_clause ->
    "FROM" table_ref_commalist {% d => ({type: 'from', table_refs: d[1]}) %}
  | "FROM" subquery {% d => ({type: 'from', subquery: d[1]}) %}

table_ref_commalist -> (table_ref_commalist ","):? table_ref {%
  d => makeList(d[0] && d[0][0], d[1])
%}

@{%
function makeTableRef(d, onOffset, usingOffset) {
  return {
    type: 'table_join',
    side: d[1] && d[1][0],
    left: d[0],
    right: d[3],
    on: d[onOffset],
    using: d[usingOffset],
  }
}
%}

table_ref ->
    "(" table_ref ")" {% cdar %}
  | table_ref ("LEFT" | "RIGHT" | "INNER"):? "JOIN" table "ON" expr {% d => makeTableRef(d, 5, -1) %}
  | table_ref ("LEFT" | "RIGHT" | "INNER"):? "JOIN" table "ON" "(" expr ")" {% d => makeTableRef(d, 6, -1) %}
  | table_ref ("LEFT" | "RIGHT" | "INNER"):? "JOIN" table "USING" "(" identifier_comma_list ")" {% d => makeTableRef(d, -1, 6) %}
  | table {% car %}

table ->
    identifier ("." identifier):? ("AS":? identifier):? {% d => ({
      type: 'table',
      alias: d[2] && d[2][1],
      table: d[0],
      subTable: d[1] && d[1][1],
    }) %}
  | subquery "AS":? identifier {% d => ({
      type: 'table',
      alias: d[2],
      subquery: d[0],
    }) %}

subquery -> "(" select_stmt ")" {% cdar %}

where_clause -> "WHERE" "(":? expr ")":? {% cddar %}

group_by_clause -> "GROUP" "BY" "(":? selection_column_comma_list ")":? ("WITH" "ROLLUP"):? {%
  d => ({
    type: 'group_by',
    columns: d[3],
    with_rollup: !!d[5],
  })
%}

having_clause -> "HAVING" "(":? expr ")":? {% cddar %}

order_clause -> "ORDER" "BY" "(":? order_substat_comma_list ")":? {% d => d[3] %}

order_substat_comma_list -> (order_substat_comma_list ","):? order_substat {%
  d => makeList(d[0] && d[0][0], d[1])
%}

order_substat -> expr ("ASC" | "DESC") {% d => ({type:'order', value:d[0], direction: d[1]}) %}

limit_clause -> "LIMIT" %number {% cdar %}


### EXPR ###
@{%
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
%}


expr_comma_list -> (expr_comma_list ","):? expr {%
  d => ({type:'expr_comma_list', exprs: makeList(d[0] && d[0][0] && d[0][0].exprs, d[1])})
%}

expr -> two_op_expr {% car %}

two_op_expr ->
    "(" two_op_expr ")" {% cdar %}
  | post_two_op_expr {% car %}

post_two_op_expr ->
    expr ("OR" | "XOR" | "AND" | %condBinaryOp) one_op_expr {% makeBinaryExpr %}
  | post_one_op_expr {% car %}

one_op_expr ->
    "(" one_op_expr ")" {% cdar %}
  | post_one_op_expr {% car %}

post_one_op_expr ->
  ("NOT" | "!") boolean_primary {% makeUnaryExpr %}
  | boolean_primary "IS" "NOT":? ("TRUE" | "FALSE" | "UNKNOWN") {% makeCompondOpExpr %}
  | post_boolean_primary {% car %}

boolean_primary ->
    "(" boolean_primary ")" {% cdar %}
  | post_boolean_primary {% car %}

post_boolean_primary ->
    boolean_primary "IS" "NOT":? "NULL" {% makeCompondOpExpr %}
  | boolean_primary %boolBinaryOp predicate {% makeBinaryExpr %}
  | boolean_primary %boolBinaryOp ("ANY" | "ALL") subquery {% makeCompondOpExpr %}
  | post_predicate {% car %}

predicate ->
    "(" predicate ")" {% cdar %}
  | post_predicate {% car %}

post_predicate ->
    bit_expr "NOT":? "IN" subquery {% makeReversedCompondOpExpr %}
  | bit_expr "NOT":? "IN" "(" expr_comma_list ")" {%
      d => {
        let token = makeReversedCompondOpExpr(d)
        token.right = d[4]
        token.third = undefined
        return token
      } %}
  | bit_expr "NOT":? "BETWEEN" bit_expr "AND" bit_expr {%
      d => {
        let token = makeReversedCompondOpExpr(d)
        token.third = d[5]
        return token
      } %}
  | bit_expr "NOT":? "LIKE" bit_expr {% makeReversedCompondOpExpr %}
  | post_bit_expr {% car %}

bit_expr ->
    "(" bit_expr ")" {% cdar %}
  | post_bit_expr {% car %}

post_bit_expr ->
    bit_expr ("DIV" | "MOD" | "*" | %arithBinaryOp) simple_expr {% makeBinaryExpr %}
  | bit_expr ("+" | "-") interval_expr {% makeBinaryExpr %}
  | interval_expr {% car %}
  | post_simple_expr {% car %}

interval_expr ->
  "INTERVAL" expr (
    "MICROSECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" |
    "QUARTER" | "YEAR" | "SECOND_MICROSECOND" | "MINUTE_MICROSECOND" |
    "MINUTE_SECOND" | "HOUR_MICROSECOND" | "HOUR_SECOND" | "HOUR_MINUTE" |
    "DAY_MICROSECOND" | "DAY_SECOND" | "DAY_MINUTE" | "DAY_HOUR" | "YEAR_MONTH"
  ) {% makeBinaryExpr %}

simple_expr ->
    "(" simple_expr ")" {% cdar %}
  | post_simple_expr {% car %}

post_simple_expr ->
    %identifier {% car %}
  | "@" %identifier {% d => {
      d[1].type = 'variable'
      return d[1]
    } %}
  | %identifier "." %identifier {% d => ({type: 'column', table: d[0], name: d[2]}) %}
  | literal {% car %}
  | "(" expr_comma_list ")" {% cdar %}
  | "BINARY" simple_expr {% makeUnaryExpr %}
  | function_call {% car %}
  | subquery {% car %}
  | "EXISTS" subquery {% makeUnaryExpr %}
  | case_expr {% car %}
  | if_expr {% car %}
  | case_expr {% car %}
  | convert_expr {% car %}

literal ->
    %string {% car %}
  | ("+" | "-"):? %number {% d => {
      if (d[0] && d[0][0].value === '-') {
        d[1].value = -d[1].value
      }
      return d[1]
    } %}
  | %float {% car %}
  | ("NULL" | "TRUE" | "FALSE") {% d => {
      d[0][0].type = 'const'
      return d[0][0]
    } %}

function_identifier ->
    %btstring {% makeIdentifier %}
  | %identifier {% (d, l, reject) => {
    const valid_function_identifiers = ['LEFT', 'RIGHT', 'REPLACE', 'MOD']
    if (valid_function_identifiers.includes(d[0].value)) {
      return reject;
    }
    return makeIdentifier(d);
  } %}

function_call ->
    function_identifier "(" "*" ")" {% d => ({
      type:' function_call',
      name: d[0],
      parameters: [d[2]],
      modifier: undefined,
    }) %}
  | function_identifier "(" "DISTINCT" column ")" {% d => ({
      type: 'function_call',
      name: d[0],
      parameters: [d[3]],
      modifier: d[2],
    })%}
  | function_identifier "(" "ALL" expr ")" {% d => ({
      type: 'function_call',
      name: d[0],
      parameters: [d[3]],
      modifier: d[2],
    })%}
  | function_identifier "(" ")" {% d => ({
      type: 'function_call',
      name: d[0],
      parameters: [],
      modifier: undefined,
    })%}
  | function_identifier "(" expr_comma_list ")" {% d => ({
      type: 'function_call',
      name: d[0],
      parameters: d[2].exprs,
      modifier: undefined,
    })%}

column ->
    identifier {% d => ({type: 'column', name: d[0]}) %}
  | identifier "AS" identifier {% d => ({type: 'column', name: d[0], alias: d[2]}) %}

case_expr -> "CASE" expr:? when_subexpr_list ("ELSE" expr):? "END" {%
  d => postfixExpr({
    type: 'expr',
    operator: d[0],
    left: d[1],
    right: d[2],
    third: d[3] && d[3][1],
  })
%}

when_subexpr_list -> when_subexpr_list:? when_subexpr {% d => makeList(d[0], d[1]) %}

when_subexpr -> "WHEN" expr "THEN" expr {% d => [d[1], d[3]] %}

if_expr -> "IF" "(" expr "," expr "," expr ")" {%
  d => postfixExpr({
    type: 'expr',
    operator: d[0],
    left: d[2],
    right: d[4],
    third: d[6],
  })
%}

case_expr -> "CAST" "(" expr "AS" data_type ")" {%
  d => postfixExpr({
    type: 'expr',
    operator: d[0],
    left: d[2],
    right: d[4],
    third: undefined,
  })
%}

@{%
function makeType(d) {
  d[0].type = 'base_type'
  return {
    type: 'type',
    baseType: d[0],
    qualifier: d[1] && d[1][1],
    secondQualifier: d[1] && d[1][3],
  }
}
%}

data_type ->
    "BINARY" ("(" %number ")"):?
  | "CHAR" ("(" %number ")"):?
  | "DATE"
  | "DECIMAL"
  | "DECIMAL" ("(" %number ")")
  | "DECIMAL" ("(" %number "," %number ")")
  | "FLOAT"
  | "NCHAR"
  | "SIGNED"
  | "TIME"
  | "UNSIGNED"

convert_expr -> "CONVERT" "(" expr "USING" identifier ")" {%
  d => postfixExpr({
    type: 'expr',
    operator: d[0],
    left: d[2],
    right: d[4],
    third: undefined,
  })
%}


### IDENTIFIER ###
identifier_comma_list -> (identifier_comma_list ","):? identifier {%
  d => makeList(d[0] && d[0][0], d[1])
%}

@{%
function makeIdentifier(d) {
  d[0].type = 'identifier'
  return d[0]
}
%}

identifier ->
    %btstring {% makeIdentifier %}
  | %bkidentifier {% makeIdentifier %}
  | %identifier {% makeIdentifier %}
