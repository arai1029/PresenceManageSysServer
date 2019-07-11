# システム全体の構成
## RPLider
- 役割
    - 人が座っているかを検知
    - 複数台から在離席情報をpostでserverへ送信
- 言語・環境
    - C++
    - VisualStudio
    - windows10

## API Server（このproject）
- 役割
    - 複数台のLiderの在離席情報を管理する
    - htmlをブラウザに表示する
- 言語・環境
    - javascript(node.js)
    - Chromeで動作確認

# 起動法
terminalでapp.jsのあるディレクトリを開いて
>npm start

requestなどのmoduleは適宜追加すること

# POST
## データの流れ
- Liderから在離席情報が送られてくる
- serverで複数台の情報を統合する
- SpreadSheetへ全体の情報を送信する 

## SpreadSheetへの送信頻度
app.jsの"loopmax"という変数を用いて更新している．\
これでLider側からのpostの回数に応じてSpreadSheetへPOSTしている．

## データの形式
Lider側からの受取もSpreadSheetへの送信も同じformatで

``` json:example
{
    "area":1,
    "seat":[0,1,1,1]
}
```
areaには1~4の整数値を入れる
seatは離席時に0,在籍時に1