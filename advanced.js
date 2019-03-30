const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const fs = require("fs");

setTimeout(() => {
    setInterval(() => {
        let cacheSize = ipc.sendSync('session', 1);
        document.getElementById("cacheSize").value = cacheSize;
        mdui.mutation();
    }, 500);
}, 1000);

setInterval(() => {
    saveConfig();
}, 10000);

var hei;
var mode;

ipc.on('resize', function (event, data) {
    if (!data[2]) {
        document.getElementById("config-w").value = data[0];
        document.getElementById("config-h").value = data[1];
    }
    hei = data[1];
});

fs.readFile(`./config.json`, (err, data) => {
    if (!err) {
        let obj = JSON.parse(data.toString());
        console.log(obj);
        let w = obj.window.w;
        let h = obj.window.h;
        let r = obj.window.r;

        hei = h;

        document.getElementById("config-w").value = w;
        document.getElementById("config-h").value = h;
    }
});

fs.readFile('login.json', (err, data) => {
    if (!err) {
        let j = JSON.parse(data);
        let login = j.login;
        let roomid = j.roomid;
        document.getElementById("login").value = login;
        document.getElementById("roomid").value = roomid;
    }
});

setTimeout(() => {
    document.getElementById("sendmessage").addEventListener('keypress', function (event) {
        console.log(event);
        if (event.keyCode == 13) {
            sendMsg(document.getElementById("sendmessage").value);
            document.getElementById("sendmessage").value = "";
        }
    });
    document.getElementById("senddanmu").addEventListener('keypress', function (event) {
        console.log(event);
        if (event.keyCode == 13) {
            sendDanmu(document.getElementById("senddanmu").value);
            document.getElementById("senddanmu").value = "";
        }
    });
}, 1000);


function reload() {
    ipc.send('reload', 1);
}

function switchWindow(name) {
    mode = name;
    saveConfig(true);
    reload();
}

function login() {
    let login = document.getElementById("login").value;
    let password = hex_md5(document.getElementById("password").value);
    let roomid = document.getElementById("roomid").value;
    fs.writeFileSync("login.json", JSON.stringify({
        login: login,
        password: password,
        roomid: roomid
    }));
}

function saveConfig(isSync) {
    let w = document.getElementById("config-w").value;
    let h = document.getElementById("config-h").value;
    w = Number(w);
    h = Number(h);

    let data = JSON.stringify({
        window: {
            w: w,
            h: h
        },
        mode: mode
    });

    if (!isSync)
        fs.writeFile("./config.json", data, (err) => {
            if (err) {
                mdui.snackbar({
                    message: '保存失败',
                    position: 'right-bottom',
                    timeout: 5000
                });
            } else {}
        });
    else fs.writeFileSync("./config.json", data);
}

function close() {
    var window = remote.getCurrentWindow();
    window.close();
}

function min() {
    var window = remote.getCurrentWindow();
    window.minimize();
}

mdui.mutation();

function about() {
    mdui.alert(`<div class="mdui-typo">GitHub: <p>irose-tools/electron-iirose</p></div>`, "关于");
}