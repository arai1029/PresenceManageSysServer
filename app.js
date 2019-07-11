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

var stocks = {
  "1": 0,
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

var loopcount=0;

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

// post処理
app.post('/', function(req, res) {
    // リクエストボディを出力
    console.log(req.body);
    // パラメータ名、nameを出力
    res.set('Content-Type', 'application/json');
    // console.log("set Attendnace")
    // areaは1~4の値が入る
    // areaによってseat_listのどこに値が入るかを決める
    for(let i=0;i<4;i++){
        seat_list[(req.body.area-1)*4+i].state = parseInt(req.body.seat[i]);
        // stocksはなんか知らんけど1ずれる
        stocks[(req.body.area-1)*4+i+1] = parseInt(req.body.seat[i]);
    }
    
    // postするjson用に成型
    var seat = [];
    for(let i=0;i<seat_list.length;i++){
      seat[i]=seat_list[i].state;
    }
    console.log("seat",seat);
    var data = {
      "area":req.body.area,
      "seat":seat
    }
    // console.log("data",data);
    loopcount=loopcount+1;
    if(loopcount==10){
      // console.log("post!");
      post(data);
      loopcount=0;
    }
    res.send('POST request to the homepage');
})

function post(data){
  // console.log("in func post")
  var url = 'https://script.google.com/macros/s/AKfycbx8_SWscJoYEgZ5DHbNXeQU4ouKZikVql9foaQSqClnhxHQIaHC/exec';
  var webclient = require("request");
  webclient.post({
    url: url,
    headers: {
      "content-type": "application/json"
    },
    body:JSON.stringify(data)
  },function (error, response, body){
    // console.log("body",body);
    // console.log("error",error);
  });
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