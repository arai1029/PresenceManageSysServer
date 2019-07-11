
// jsonをcsvで保存するfunction
function exportCSV(content){
    Object.assign = require('object-assign')
    require('date-utils');
    const Json2csvParser = require('json2csv').Parser;
    var fs = require('fs');
    var newLine= "\r\n";
    var fields = ['time','rssi','count']
    
    const json2csvParser = new Json2csvParser({ fields:fields, header: false });
    const csv = json2csvParser.parse(content) + newLine; 
    
    fs.appendFile('beacon.csv', csv, 'utf8', function (err) {
        if (err) {
          console.log('保存できませんでした');
        } else {
          console.log('保存できました');
        }
      });
    }
