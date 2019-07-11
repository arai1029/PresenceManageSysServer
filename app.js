

var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var http= require('https');
require('date-utils');
var dateFormat = require('dateformat');



//client
var WebSocketServer = require('ws').Server


var wss = new WebSocketServer({
    port : 8443,
   //"path"   : '/update' // パス指定すると、このパスのみ生きるっぽい
});

var app = express()

module.exports = app;


console.log("websocket server created")


var stocks = {"1": 0,
              "2": 0,
              "3": 0,
              "4": 0,
              "5": 0,
              "6": 0,
              "7": 0,
              "8": 0,
              "9": 0,
              "10": 0,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 0,
              "15": 0,
              "16": 0
      }
    
var seat_list = [ 
    {seatID:1,state:0,date:null},
    {seatID:2,state:0,date:null},
    {seatID:3,state:0,date:null},
    {seatID:4,state:0,date:null},
    {seatID:5,state:0,date:null},
    {seatID:6,state:0,date:null},
    {seatID:7,state:0,date:null},
    {seatID:8,state:0,date:null},
    {seatID:9,state:0,date:null},
    {seatID:10,state:0,date:null},
    {seatID:11,state:0,date:null},
    {seatID:12,state:0,date:null},
    {seatID:13,state:0,date:null},
    {seatID:14,state:0,date:null},
    {seatID:15,state:0,date:null},
    {seatID:16,state:0,date:null}]

var timer1 = null;
var timer2 = null;
var timer3 = null;
var timer4 = null;
var timer5 = null;
var timer6 = null;
var timer7 = null;
var timer8 = null;
var timer9 = null;
var timer10 = null;
var timer11 = null;
var timer12 = null;
var timer13 = null;
var timer14 = null;
var timer15 = null;
var timer16 = null;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 静的ファイルは無条件に公開
app.use('/public', express.static('public'));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.get('/seatUpdate', function(req, res){
    console.log(stocks);
    //res.send(stocks);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify({"stocks":stocks}));
  
  });

app.post('/', function(req, res) {
    // リクエストボディを出力
    console.log(req.body);
    
    // パラメータ名、nameを出力
    res.set('Content-Type', 'application/json');
    
     
    // if(req.body.area == 0){
    //     clearTimeout(timer1);
    //     console.log("1番席在席")
    //     if(seat_list[0].state == 0){
    //         seat_list[0].state = 1
    //         seat_list[0].date = dateFormat(Date());
    //         //exportCSV(seat_list[0]);
    //         stocks["1"] = 1
        
    //     }
    //     //離席処理
    //     timer1 = setTimeout(function () { 
    //         seat_list[0].state = 0
    //         seat_list[0].date = dateFormat(Date());
    //         stocks["1"] =0
    //         //exportCSV(seat_list[0]);
    //         //ログ処理
    //         console.log("１番席離席しました")
    //     },30000);
    // }

    console.log("set Attendnace")
    // console.log("req.body.area",req.body.area);
    // console.log("req.body.seat1",req.body.seat1);
    // console.log("req.body.seat2",req.body.seat2);
    console.log((parseInt(req.body.area)-1)*4+1);
    // areaは1~4の値が入る
    // areaによってseat_listのどこに値が入るかを決める
    for(let i=0;i<4;i++){
        seat_list[(req.body.area-1)*4+i].state = parseInt(req.body.seat[i]);
        // stocksはなんか知らんけど1ずれる
        stocks[(req.body.area-1)*4+i+1] = parseInt(req.body.seat[i]);
    }
    
    // seat_list[(parseInt(req.body.area)-1)*4+1].state = req.body.seat2;
    // stocks[(req.body.area-1)*4+2] = parseInt(req.body.seat2);
    
    console.log(seat_list[0])

    res.send('POST request to the homepage');
})

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}




// jsonをcsvで保存するfunction
function exportCSV(content){
    Object.assign = require('object-assign')
    require('date-utils');
    const Json2csvParser = require('json2csv').Parser;
    var fs = require('fs');
    var newLine= "\r\n";
    var fields = ['seatID','date','state']
    
    const json2csvParser = new Json2csvParser({ fields:fields, header: false });
    const csv = json2csvParser.parse(content) + newLine; 
    
    fs.appendFile('log.csv', csv, 'utf8', function (err) {
        if (err) {
          console.log('保存できませんでした');
        } else {
          console.log('保存できました');
        }
      });
    }

