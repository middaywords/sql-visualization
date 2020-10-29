"use strict"

const sqlExample = `SELECT
    mspa.prod_num AS prod_num,
    mspa_qty AS mspa_qty,
    isnull(px_mdve, 0.0) AS px_move,
    mspa.mspa_qcy - isnull(px.px_move, 0.0) AS diff
FROM
(
SELECT
    prod_num,
    sum(dr_qty - cr_qty) AS mspa_qty
FROM
    IL_Cash_3
WHERE pnl_date = @pnl_date
GROUP BY prod_num
) AS mspa
LEFT JOIN
(
SELECT
    prod_num,
    sum(CASE
            WHEN pnl_date = @pnl_date
            then closing_position
            ELSE -1 * (closing_position)
            END
    ) AS px_move
FROM IL_Cash
WHERE pnl_date IN (
                @pnl_date,
                @prev_me_date
            )
AND prod_type <> 'Monetary Claim'
GROUP BY prod_num
) px
ON mspa.prod_num = px.prod_oum`
'select * from users;'

const editor = ace.edit("editor")
editor.session.setMode("ace/mode/sql")
editor.setValue(sqlExample)


function displayContents (txt) {
  let el = document.getElementById('sql-content')
  el.innerHTML = txt
  displayContents(inputText)
  console.log(parser.results)
}


document.getElementById('file-input').onchange = async function (event) {
  const inputFile = event.target.files[0]
  const inputText = await inputFile.text()
  editor.setValue(inputText)
}


document.getElementById('start-parse').onclick = function (event) {
  const sql = editor.getValue()
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  parser.feed(sql)
  console.log(parser.results)
}
