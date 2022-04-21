/**
 * GS1 Barcode Object
 */

var parser = require('./BarcodeParser');

var AIMap = {
    ai00: 'SSCC',
    ai01: 'GTIN',
    ai02: 'product',
    ai10: 'lot',
    ai11: 'prodDate',    //生产日期
    ai13: 'packDate',    //包装日期
    ai15: 'safeDate',    //保质期, Best Before Date
    ai17: 'exp',
    ai21: 'serial',  //序列号
    ai37: 'count'   //物流单位内含商品品项数
}

function buildGS1BarcodeObj(barcode) {
    barcode = barcode.replace(/\(/g, String.fromCharCode(29)).replace(/\)/g, "");
    barcode = barcode.replace(/[^A-Za-z0-9]+/g, "");    //只提取里面的字母和数字，禁止图像编码中的特殊字符扫入
    var parseData = parser.decode(barcode);
    var parsedCodeItems = parseData.parsedCodeItems;
    var itemsCount = parsedCodeItems.length;
    var i = 0;
    var buildedObj = {};
    var ai;
    var item;
    var prop;

    for (i = 0; i < itemsCount; i++) {
        item = parsedCodeItems[i];
        ai = item.ai;
        prop = AIMap["ai" + ai];
        if (!(prop === null || prop === undefined))
            buildedObj[prop] = item.data;
    }

    return buildedObj
}

module.exports = {
    decode: buildGS1BarcodeObj
};
