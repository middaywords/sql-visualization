(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.getMockData = factory()
    }
}(this, function () {
    'use strict'

    function getMockData(selectExample) {
        const exampleName = selectExample.value
        if (!exampleName) {
            return null
        }
        switch (exampleName) {
            case 'sql-script2':
                return [
                    {
                        prod_num: 15,
                        mspa_qty: 20,
                        px_move: 50,
                        diff: -30
                    },
                    {
                        prod_num: 47,
                        mspa_qty: 107,
                        px_move: 103,
                        diff: 4
                    },
                    {
                        prod_num: 22,
                        mspa_qty: 262,
                        px_move: 288,
                        diff: -26
                    },
                    {
                        prod_num: 51,
                        mspa_qty: 414,
                        px_move: 375,
                        diff: 39
                    },
                    {
                        prod_num: 17,
                        mspa_qty: 248,
                        px_move: 300,
                        diff: -52
                    }
                ];
            case 'sql-script3':
                return [
                    {
                        entity_code: 'China',
                        company: 'Fakebook',
                        account: 'd0b7cec8-fec6-4fee-94c3-a0bcea6b62be',
                        prod_num: 15,
                        ccy: 'CNY',
                        gl_account: 'f4e8116d-1bec-4418-a1d5-4eba06498fd5',
                        prod_desc: 'Bond',
                        prod_lv2: 'Securities',
                        prod_lv3: 'Interest rate',
                        prod_hier_local_id: '0e5a5962-7c03-4151-8889-383e027d0ea2',
                        source: 'FaceBond',
                        mv_mx: '100'
                    },
                    {
                        entity_code: 'China',
                        company: 'TechLei',
                        account: 'd0b7cec8-fec6-4fee-94c3-a0bcea6b62be',
                        prod_num: 47,
                        ccy: 'CNY',
                        gl_account: 'f4e8116d-1bec-4418-a1d5-4eba06498fd5',
                        prod_desc: 'Commodity Forward',
                        prod_lv2: 'Securities',
                        prod_lv3: 'Forward',
                        prod_hier_local_id: '4d4b7d93-4593-4e4c-9328-1c027fdcf67f',
                        source: 'FactEquity',
                        mv_mx: '-80'
                    },
                    {
                        entity_code: 'China',
                        company: 'YouChat',
                        account: 'd0b7cec8-fec6-4fee-94c3-a0bcea6b62be',
                        prod_num: 47,
                        ccy: 'CNY',
                        gl_account: 'f4e8116d-1bec-4418-a1d5-4eba06498fd5',
                        prod_desc: 'IR Option',
                        prod_lv2: 'Securities',
                        prod_lv3: 'Option',
                        prod_hier_local_id: '06798f84-2ece-4a34-be1a-17ce72d8d619',
                        source: 'FaceBond',
                        mv_mx: '-20'
                    }
                ];
            default:
                return null;
        }
    }

    return getMockData
}))