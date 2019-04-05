const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const sd = require('silly-datetime');
const {
    iiroseBot
} = require('./iirose-bot-ts/build/main');
const EventEmitter = require('events').EventEmitter;
const botchannel = new EventEmitter();

var logindata = JSON.parse(fs.readFileSync("./login.json"));

function switchRoom(roomid) {
    logindata.roomid = roomid;
    fs.writeFileSync("./login.json", JSON.stringify(logindata));
    botchannel.emit('switchRoom', roomid);
}

function sendMsg(msg) {
    botchannel.emit('chat', msg);
}

function sendDanmu(msg) {
    alert('正在开发...');
}

const start = async () => {
    console.log("starting bot...");
    const connection = await iiroseBot({
        username: logindata.login,
        password: logindata.password,
        roomId: logindata.roomid
    }); /* 使用bot */
    connection.on('PUBLIC_MESSAGE', (event) => {
        console.log(event);
        let user = event.message.user.username;
        let content = event.message.content;
        let id = event.message.id;
        let userrank = event.message.user.rank;
        printMessage(`[${userrank}] (${id}) ${user} said: ${content}`);
    });
    connection.on('USER_JOIN', (event) => {
        console.log(event);
    });
    connection.on('USER_LEAVE', (event) => {
        console.log(event);
    });
    connection.on('USER_SWITCH_ROOM', (event) => {
        console.log(event);
    });
    connection.on('UPDATE_ROOM_STORE', (event) => {
        document.getElementById("rooms").innerHTML = "";
        connection.getRooms().forEach((room, i, rooms) => {
            console.log(room);
            document.getElementById("rooms").innerHTML = document.getElementById("rooms").innerHTML + `<button onclick="switchRoom('${room.id}')">点击切换</button>房间：${room.name}<br/>`;
        });
    });

    botchannel.on('switchRoom', (roomid) => {
        connection.switchRoom(roomid);
        setTimeout(() => {
            location.reload();
        }, 1000);
    });
    botchannel.on('chat', (msg) => connection.createMessage({
        content: msg,
        color: connection.color
    }));
    connection.

    function printMessage(msg) {
        var time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        console.log(`[${time}] [${process.uptime()}] ${msg}`);
        document.getElementById("messages").value = document.getElementById("messages").value + `[${time}] ${msg}` + "\n";
        document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
    }
};
start().then(() => console.log('bot started'));