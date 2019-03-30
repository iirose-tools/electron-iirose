const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const request = require('request');
const sd = require('silly-datetime');
const readline = require('readline');
const moment = require('moment');

function Logger(msg) {
    var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    console.log(`[${time}] [${process.uptime()}] ${msg}`);
    document.getElementById("messages").value = document.getElementById("messages").value + `[${time}] [${process.uptime()}] ${msg}` + "\n";
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

let loginraw = fs.readFileSync("./login.json");
let logindata = JSON.parse(loginraw);
config = {
    r: logindata.roomid,
    n: logindata.login,
    p: logindata.password,
    st: 'n',
    mo: '',
    mb: '',
    mu: '01'
};

const ws = require("./websocket");

ws.onopen = () => {
    Logger('WebSocket 已连接');
    ws.send('*' + JSON.stringify(config));
};

ws.onmessage = message => {
    // Logger(`[debug] ws.onmessage emitted`);
    if (/^-\*/.test(message)) {
        changeRoom(message.substr(2));
    } else if (/\d/.test(message[0])) {
        chatMessage(message);
    } else if (/^%\*/.test(message)) {
        freshInfo(message.substr(2));
    } else if (message.substr(0, 1) == '"') {
        privateMessage(message);
    } else if (message.substr(0, 2) == "%1") {
        Logger("收到：图床+音乐+名字");
    } else if (message.substr(0, 2) == "@*") {
        mailBox(message);
    } else if (message.substr(0, 1) == "=") {
        onDanmu(message);
    } else Logger(message);
};

function changeRoom(roomID) {
    Logger(`切换至房间 ${roomId}`);
    logindata.roomid = roomID;
    ws.close();
}

function freshInfo(data) {
    // Logger(`[debug] freshInfo emitted`);
    let infoArray = data.split("'");

    let roomInfoData = infoArray[1];
    freshRoomInfo(roomInfoData);

    let userInfoData = infoArray[0];
    freshUserInfo(userInfoData);
}

function freshUserInfo(data) {
    // Logger(`[debug] freshUserInfo emitted`);
    // users.update(data);
    //if(users.getUser(config.n).hasOwnProperty('room'))
    //let roomID = users.getUser(config.n).room;
    //if (roomID !== config.r) {
    //    changeRoom(roomID);
    //}
}

function freshRoomInfo(data) {
    // Logger(`[debug] freshRoomInfo emitted`);
}

// 处理消息
function chatMessage(message) {
    // Logger(`[debug] chatMessage emitted`);
    let messageArray = message.split('"');
    if (messageArray[0]) {
        publicMessage(messageArray[0]);
    } else
    if (message.substr(0, 1) == '"') {
        privateMessage(message);
    }
}

function privateMessage(message) {
    //Logger(`[debug] privateMessage emitted`);
    message = message.split('"')[1].split(">");
    let uid = message[0];
    let name = message[1];
    let msg = message[3];

    Logger(`[私聊][${uid}]${name}: ${msg}`);
}

function mailBox(message) {
    let messageArray = message.split('>');
    let user = messageArray[0].substr(2);
    let type = messageArray[3].substr(0, 2);
    let body = messageArray[3].substr(2);
    if (type == "'$") {
        Logger(`收到  [*${user}*]  转账： ${body}`);
    } else if (type == "'*") {
        Logger(`收到  [*${user}*]  点赞  已尝试回赞`);
        ws.send(`+*${user.toLowerCase()}`);
    } else Logger(message);
}

function onDanmu(message) {
    let messageArray = message.split('>');
    Logger(`[弹幕] ${messageArray[0].substr(1)}说：${messageArray[1]}`);
}

function publicMessage(message) {
    // Logger(`[debug] publicMessage emitted`);
    message.split('<').forEach(element => {
        let messageArray = element.split('>');
        let user = entities.decode(messageArray[2]);
        let text = messageArray[3];
        let msg = entities.decode(text);
        var senderUid = messageArray[8];

        if (text[0] === "'") {
            systemMessage(user, text, senderUid);
        } else {
            Logger(` ${user} 说： ${entities.decode(text)}`);
        }
    });
}

function systemMessage(user, code, uid) {
    //Logger(`[debug] systemMessage emitted`);
    let message;

    switch (code[1]) {
        case '1':
            message = '进入了房间';
            break;
        case '2':
            message = `移动到了另一个房间`;
            break;
        case '3':
            message = '离开了';
            break;
        default:
            message = code.toString();
    }

    Logger(` ${user} ${message}`);
}

function sendMsg(message, color) {
    //Logger(`[debug] sendMsg emitted`);
    if (!color) {
        color = "9d9d9d";
    }
    Logger(` 发送消息：${message}`);

    id = String((new Date).getTime()).substr(-5) + String(Math.random()).substr(-7);
    //Logger(decodeURI(`{"m": "${l_msg} (_hr) ${name}_${time} (hr_) ${message}","mc": "47bbff","i": "${id}"}`));
    //Logger(`{"m": ${JSON.stringify(message)},"mc": "${color}","i": "${id}"}`);
    ws.send(`{"m": ${JSON.stringify(message)},"mc": "${color}","i": "${id}"}`);
}

function sendMsg_private(msg, uid, name) {
    //Logger(`[debug] sendMsg_private emitted`);
    Logger(` [私聊]向${name}发送消息：${msg}`);
    id = String((new Date).getTime()).substr(-5) + String(Math.random()).substr(-7);
    ws.send(`{"g":"${uid}","m":${JSON.stringify(msg)},"mc":"47bbff","i":"${id}"}`);
}

function sendDanmu(message, color) {
    if (!color) {
        color = "9d9d9d";
    }
    Logger(`发送弹幕：${message}`);

    ws.send(`~{"t": ${JSON.stringify(message)},"c":"${color}"}`);
}

function payment(name, money) {
    if (money < 1) return;
    Logger(`给 ${name} 发 ${money} 蔷薇币`);
    ws.send(`+\${"g":${JSON.stringify(name.toLowerCase())},"c":${money}}`);
}