const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const fs = require("fs");

setInterval(() => {
    let songName = document.getElementById("iframe").contentWindow.document.getElementById("mainFrame").contentWindow.document.getElementById("shareMediaSongName").innerHTML;
    document.getElementById("fun-songName").value = songName;
    mdui.mutation();
}, 1000);

setTimeout(() => {
    setInterval(() => {
        let cacheSize = ipc.sendSync('session', 1);
        document.getElementById("cacheSize").value = cacheSize;
        document.getElementById("iframe").height = 590 + (hei - 700);
        mdui.mutation();
    }, 500);
}, 1000);

setInterval(() => {
    saveConfig();
}, 10000);

var hei;

ipc.on('resize', function (event, data) {
    if (!data[2]) {
        document.getElementById("config-w").value = data[0];
        document.getElementById("config-h").value = data[1];
    }
    document.getElementById("iframe").height = 590 + (data[1] - 700);
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

function reload() {
    ipc.send('reload', 1);
}

function saveConfig() {
    let w = document.getElementById("config-w").value;
    let h = document.getElementById("config-h").value;
    w = Number(w);
    h = Number(h);

    document.getElementById("iframe").height = 590 + (h - 700);

    let data = JSON.stringify({
        window: {
            w: w,
            h: h
        }
    });

    fs.writeFile("./config.json", data, (err) => {
        if (err) {
            mdui.snackbar({
                message: '保存失败',
                position: 'right-bottom',
                timeout: 5000
            });
        } else {}
    });
}

function close() {
    var window = remote.getCurrentWindow();
    window.close();
}

function min() {
    var window = remote.getCurrentWindow();
    window.minimize();
}

ipc.once('system-type', function (event, e) {
    let systemType = document.getElementById("system-type");
    systemType.innerHTML = "for " + e;
});

ipc.send('system-type', 'type');
mdui.mutation();

function about() {
    mdui.alert(`<div class="mdui-typo">GitHub: <p>irose-tools/electron-iirose</p></div>`, "关于");
}