#@builtin "postprocessors.ne"

delimited[el, delim] -> $el ($delim $el):* {% d => drill(d) %}

@lexer sqlLexer

# https://github.com/AlecStrong/sqlite-bnf/blob/master/sqlite.bnf

@{%
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
%}

main -> delimited[sql_stmt, ";"] {% car %}

as_clause -> "AS":? identifier

sql_stmt ->
    "(" sql_stmt ")" {% cdar %}
  | post_select_stmt {% car %}

select_stmt ->
    "(" select_stmt ")" {% cdar %}
  | post_select_stmt {% car %}

post_select_stmt ->
    "SELECT" ("TOP" %number):? ("ALL" | "DISTINCT"):? selection_column_list from_clause:? {%
      d => new AST.Select(
        d, d[1] && d[1][1], d[2] && d[2][0].value === 'ALL',
        d[2] && d[2][0].value === 'DISTINCT',
        d[3].value === '*' ? null : d[3], d[4]
      )
    %}
  | select_stmt "UNION" select_stmt {%
      d => new AST.Union(d, d[0], d[2])
    %}

selection_column_list -> delimited[selection_column, ","] {%
  d => new AST.SelectionSet(d, undrill(d[0]))
%}

selection_column -> post_selection_column as_clause:? {%
  d => new AST.ColumnSelection(d, d[0], d[1] && d[1][1])
%}

post_selection_column ->
    expr {% car %}
  | "*" {% d => new AST.Keyword(d[0], d[0].value) %}
  | identifier "." "*" {% d => new AST.Column(d, d[0], new AST.Keyword(d[2], d[2].value)) %}

from_clause -> "FROM" table_ref_commalist where_clause:? group_by_clause:? having_clause:? order_clause:? limit_clause:? {%
  d => new AST.From(d, undrill(d[1]), d[2] && d[2][1], d[3], d[4] && d[4][1], d[5] && undrill(d[5][1]), d[6] && d[6][1])
%}

table_ref_commalist -> delimited[table_ref, ","] {% car %}

table_ref ->
    "(" table_ref ")" {% cdar %}
  | table_ref ("NATURAL":? ("LEFT" "OUTER":? | "RIGHT") | "INNER" | "CROSS" | "FULL"):? "JOIN" table join_constraint {%
      d => new AST.Join(d, drillString(d[1]), d[0], d[3], d[4][0], d[4][1])
    %}
  | table {% car %}

join_constraint ->
    "ON" expr {% d => [d[1], null] %}
  | "ON" "(" expr ")" {% d => [d[2], null] %}
  | "USING" "(" identifier_list ")" {% d => [null, d[2]] %}

table ->
    post_table as_clause {% d => new AST.TableAlias(d, d[0], d[1] && d[1][1]) %}
  | post_table {% car %}

post_table ->
    identifier ("." identifier {% cdar %}):? {% d => new AST.Table(d, d[0], d[1]) %}
  | subquery {% car %}

where_clause -> "WHERE" expr

group_by_clause -> "GROUP" "BY" ("(" selection_column_list ")" | selection_column_list) ("WITH" "ROLLUP"):? {%
  d => new AST.GroupBy(d, d[2][0].text === '(' ? d[2][1] : d[2][0], !!d[3])
%}

having_clause -> "HAVING" expr

order_clause -> ("ORDER" "BY") order_substat_list

order_substat_list ->
    "(" order_substat_list ")" {% cdar %}
  | delimited[order_substat, ","]

order_substat -> expr ("ASC" | "DESC"):? {% d => new AST.Order(d, d[0], d[1] && d[1][0].value) %}

limit_clause -> "LIMIT" %number


### EXPR ###
@{%
function makeUnaryExpr (d) {
  return new AST.UnaryOpExpression(d, drillString(d[0]), d[1])
}

function makeBinaryExpr (d) {
  return new AST.BinaryOpExpression(d, drillString(d[1]), d[0], d[2])
}
%}

expr_list -> delimited[expr, ","] {% d => new AST.ExpressionList(d, undrill(d[0])) %}

expr -> two_op_expr {% car %}

two_op_expr ->
    post_two_op_expr {% car %}
  | "(" two_op_expr ")" {% parenthesized %}

post_two_op_expr ->
    expr ("OR" | "XOR" | "AND" | %condBinaryOp) one_op_expr {% makeBinaryExpr %}
  | post_one_op_expr {% car %}

one_op_expr ->
    post_one_op_expr {% car %}
  | "(" one_op_expr ")" {% parenthesized %}

post_one_op_expr ->
    ("NOT" | "!") boolean_primary {% makeUnaryExpr %}
  | boolean_primary ("IS" "NOT":?) (boolean | unknown) {% makeBinaryExpr %}
  | post_boolean_primary {% car %}

boolean_primary ->
    post_boolean_primary {% car %}
  | "(" boolean_primary ")" {% parenthesized %}

post_boolean_primary ->
    boolean_primary ("IS" "NOT":?) null_ {% makeBinaryExpr %}
  | boolean_primary %boolBinaryOp predicate {% makeBinaryExpr %}
  | boolean_primary (%boolBinaryOp ("ANY" | "ALL")) subquery {% makeBinaryExpr %}
  | post_predicate {% car %}

predicate ->
    post_predicate {% car %}
  | "(" predicate ")" {% parenthesized %}

post_predicate ->
    bit_expr ("NOT":? "IN") subquery {% makeBinaryExpr %}
  | bit_expr ("NOT":? "IN") ("(" expr_list ")" {% cdar %}) {% makeBinaryExpr %}
  | bit_expr ("NOT":? "BETWEEN") (bit_expr "AND" bit_expr) {% makeBinaryExpr %}
  | bit_expr ("NOT":? "LIKE") bit_expr {% makeBinaryExpr %}
  | post_bit_expr {% car %}

bit_expr ->
    post_bit_expr {% car %}
  | "(" bit_expr ")" {% parenthesized %}

post_bit_expr ->
    bit_expr ("DIV" | "MOD" | "*" | %arithBinaryOp) simple_expr {% makeBinaryExpr %}
  | bit_expr ("+" | "-") interval_expr {% makeBinaryExpr %}
  | interval_expr {% car %}
  | post_simple_expr {% car %}

interval_expr ->
  "INTERVAL" expr ((
    "MICROSECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY" | "WEEK" | "MONTH" |
    "QUARTER" | "YEAR" | "SECOND_MICROSECOND" | "MINUTE_MICROSECOND" |
    "MINUTE_SECOND" | "HOUR_MICROSECOND" | "HOUR_SECOND" | "HOUR_MINUTE" |
    "DAY_MICROSECOND" | "DAY_SECOND" | "DAY_MINUTE" | "DAY_HOUR" | "YEAR_MONTH"
 ) {% caar %}) {% makeBinaryExpr %}

simple_expr ->
    post_simple_expr {% car %}
  | "(" simple_expr ")" {% cdar %}

post_simple_expr ->
    identifier {% car %}
  | "@" identifier {% d => new AST.Variable(d, d[0]) %}
  | identifier "." identifier {% d => new AST.Column(d, d[0], d[2]) %}
  | literal {% car %}
  | "BINARY" simple_expr {% makeUnaryExpr %}
  | function_call {% car %}
  | subquery {% car %}
  | "EXISTS" subquery {% makeUnaryExpr %}
  | case_expr {% car %}
  | if_expr {% car %}
  | cast_expr {% car %}
  | convert_expr {% car %}

literal ->
    %string {% d => new AST.String(d, d[0].value) %}
  | number {% car %}
  | boolean {% car %}
  | null_ {% car %}

boolean ->
    "TRUE" {% d => new AST.Boolean(d, true) %}
  | "FALSE" {% d => new AST.Boolean(d, false) %}

null_ -> "NULL" {% d => new AST.Null(d) %}

unknown -> "UNKNOWN" {% d => new AST.Unknown(d) %}

number -> (("+" | "-") {% caar %}):? post_number {%
  d => new AST.Number(d, d[0] && d[0].value === '-' ? -d[1].value : d[1].value)
%}

post_number ->
    "(" post_number ")" {% cdar %}
  | %number {% car %}
  | %float {% car %}

function_call -> function_identifier "(" function_parameters ")" {% d => new AST.FunctionCall(
  d, d[0], d[2][0] instanceof AST.ExpressionList ? d[2][0] : d[2][1],
  d[2][0] && d[2][0].value === 'DISTINCT', d[2][0] && d[2][0].value === 'ALL'
) %}

function_identifier -> (%btstring | %identifier | "LEFT" | "RIGHT" | "REPLACE" | "MOD") {%
  d => new AST.Identifier(d, d[0][0].value)
%}

function_parameters ->
    "DISTINCT" column
  | "ALL" expr
  | null
  | expr_list

column -> identifier as_clause:? {% d => new AST.ColumnSelection(d, d[0], d[1] && d[1][1]) %}

subquery -> "(" select_stmt ")" {%
  d => new AST.Subquery(d, d[1])
%}

case_expr -> "CASE" expr:? ("WHEN" expr "THEN" expr):+ ("ELSE" expr):? "END" {%
  d => new AST.Case(d, d[1], d[2].map(l => [l[1], l[3]]), d[3] && d[3][1])
%}

if_expr -> "IF" "(" expr "," expr "," expr ")" {%
  d => new AST.If(d, d[2], d[4], d[6])
%}

cast_expr -> "CAST" "(" expr "AS" data_type ")" {%
  d => ({
    type: 'expression',
    operator: d[0],
    left: d[2],
    right: d[4],
    third: null,
  })
%}

@{%
function makeType(d) {
  d[0].type = 'base_type'
  return {
    type: 'type',
    baseType: d[0],
    qualifier: d[1] && d[1][0],
    secondQualifier: d[1] && d[1][1],
  }
}
%}

data_type ->
    "BINARY" ("(" %number ")" {% cdar %}):?
  | "CHAR" ("(" %number ")" {% cdar %}):?
  | "DATE"
  | "DECIMAL"
  | "DECIMAL" ("(" %number ")" {% cdar %})
  | "DECIMAL" ("(" %number "," %number ")" {% d => [d[1], d[3]] %})
  | "FLOAT"
  | "NCHAR"
  | "SIGNED"
  | "TIME"
  | "UNSIGNED"

convert_expr -> "CONVERT" "(" expr "USING" identifier ")" {%
  d => ({
    type: 'expression',
    operator: d[0],
    left: d[2],
    right: d[4],
    third: null,
  })
%}


### IDENTIFIER ###
identifier_list -> delimited[identifier, ","] {% car %}

identifier -> (%btstring | %bkidentifier | %identifier) {% d => new AST.Identifier(d, d[0][0].value) %}
