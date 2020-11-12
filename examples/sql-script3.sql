SELECT
    b.entity_code,
    b.company,
    b.account,
    b.prod_num,
    b.ccy,
    isnull (max(case when cid='46' then gl_account else null end),'*') as gl_account,
    v.prod_desc,
    v.prod_lv2,
    v.prod_lv3,
    v.prod_hier_local_id,
    v.source,
    sum(case when b.pnl_date = @pnl_date and partition_code = '0000' and cid='99' then mx else 0 end) as mv_mx
FROM TrialBal b
LEFT JOIN PHUser v ON b.entity_code = v.entity_code
    AND b.company = v.company
    AND b.prod_num = v.prod_num
WHERE b.entity_code = 'AAA'
    AND b.pnl_date IN (
        '20200930', '20200831'
        )
    AND v.source IN (
        'FaceBond', 'FactEquity'
    )
