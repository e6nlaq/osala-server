const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 5008; // ここを変える
let start_req = true;

const scloudjs = require("scloudjs"); //scloudjsをモジュールとして使えるようにする
const { start } = require('repl');
let clouddatas = new Object();//このオブジェクトにクラウド変数のデータが入る

const process = async (data) => {//メッセージを受け取ったときにどんな処理をするかを設定する
    const temp = scloudjs.parsedata(data, clouddatas);//受け取ったメッセージを整理する
    clouddatas = temp.clouddatas;//クラウド変数のデータ
    // const changedlists = temp.changedlists;//変更された変数一覧
    // let sessionid = logi.headers.get("set-cookie").match(/\"(.*)\"/g)[0];

    // console.log(clouddatas);

    if (start_req) {
        start_req = false;
    }
    else {

        let senddata = clouddatas["_Server"].value
        let ango = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '_'];
        let username = "";
        let action = senddata.substr(40);
        let systemdata = JSON.parse(fs.readFileSync("./data/userdata.json"));

        for (let i = 0; i < 40; i += 2) {
            let an_char = senddata.substr(i, 2);
            username += ango[Number(an_char)];
        }

        console.log(`リクエスト: ${username} アクション: ${action}`);

        if (username in systemdata) {

        }
        else {
            systemdata[username] = { "kill": 0, "flag": 0, "rating": 100, "playtime": 0 };
            console.log(`データ作成: ${username}`);
        }


        switch (action) {
            case "001":
                systemdata[username].kill++;
                systemdata[username].rating += 50;
                break;

            case "002":
                systemdata[username].flag++;
                break;

            case "003":
                systemdata[username].playtime++;
                systemdata[username].rating += 3;
                break;

            case "004":
                systemdata[username].rating -= 10;
                break;

            case "005":
                systemdata[username].rating++;
                break;

            default:
                console.log(`不正なリクエストです: ${action}`);
        }

        fs.writeFileSync("./data/userdata.json", JSON.stringify(systemdata));

        console.log("リクエスト処理: OK");

    }
};

scloudjs.setdatas(process.env.username, process.env.password, "788791473", process); // ScloudJSの設定

/*
  
  ScloudJS 備忘録

  変数Aを0にする
  scloudjs.sendtocloud("A", 0);

  変数Aの値を出力する
  console.log(clouddatas["A"].value);
  注: string型で返されます。
  
 */

// --------------------------------
//      以下は基本的に変えなくてよい
// --------------------------------

const func = async () => {//実行

    await scloudjs.login();//scratchにログイン
    await scloudjs.connect();//scratchのクラウド変数サーバーに接続
    await scloudjs.handshake();//プロジェクトに接続
};
func();


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Port 5008: Codename Osala Main Server'); // ご自由に
});

server.listen(port, hostname, () => {
    console.log("----------------------------------------------------------------")
    console.log(`Port number ${port}.`);
    console.log(`Server running at http://${hostname}:${port}/`);
    console.log("----------------------------------------------------------------\n")
});