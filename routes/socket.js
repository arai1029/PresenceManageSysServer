var http = require('http');
//サーバインスタンス作成
var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end('server connected');
});
var io = require('socket.io').listen(server);

  server.listen(8888);//8888番ポートで起動
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
  //接続確立時の処理
  io.sockets.on('connection', function (socket) {
    // この中でデータのやり取りを行う
    console.log('connected');
    var clientStockUpdater;
 	var sendStockUpdates = function(socket) {
 		if (socket.readyState == 1) {
 			var stocksObj = {};
 			//サーバ側で更新した在席情報の値をクライアント側に送信する
 			for (var i=0; i<clientStocks.length; i++) {
 				symbol = clientStocks[i];
 				stocksObj[symbol] = stocks[symbol];
 			}

 			socket.send(JSON.stringify(stocksObj));
 		}
     }
     clientStockUpdater = setInterval(function() {
        sendStockUpdates(socket)
        console.log("send");
    }, 1000);
    var clientStocks = [];
    //クライアントからメッセージを受け取る
 	socket.on('message', function(message) {
		var stock_request = JSON.parse(message);

// 		//クライアントで定義したstocksオブジェクトを取り出す
         clientStocks = stock_request['stocks'];
          		sendStockUpdates(socket);
 	});

 	socket.on('close', function() {
 		if (typeof clientStockUpdater !== 'undefined') {
 			clearInterval(clientStockUpdater);
 		}
     });

  });