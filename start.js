const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const fs = require("fs");

setInterval(() => {
    let songName = document.getElementById("iframe").contentWindow.document.getElementById("mainFrame").contentWindow.document.getElementById("shareMediaSongName").innerHTML;
    document.getElementById("fun-songName").value = songName;
    mdui.mutation()
}, 1000)

fs.readFile(`./config.json`, (err, data) => {
    if (!err) {
        let obj = JSON.parse(data.toString());
        console.log(obj);
        let w = obj.window.w;
        let h = obj.window.h;
        let r = obj.window.r;

        document.getElementById("iframe").height = 590 + (h - 700);

        document.getElementById("config-w").value = w;
        document.getElementById("config-h").value = h;
    }
});

function saveConfig() {
    let w = document.getElementById("config-w").value;
    let h = document.getElementById("config-h").value;
    w = Number(w);
    h = Number(h);

    let data = JSON.stringify({
        window: {
            w: w,
            h: h
        }
    })

    fs.writeFile("./config.json", data, (err) => {
        if (err) {
            mdui.snackbar({
                message: '保存失败',
                position: 'right-bottom',
                timeout: 5000
            });
        } else {
            mdui.snackbar({
                message: '保存成功，重启生效',
                position: 'right-bottom',
                timeout: 5000
            });
        }
    })
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
})

ipc.send('system-type', 'type');
mdui.mutation();

function about() {
    mdui.alert(`<div class="mdui-typo">GitHub: <p>irose-tools/electron-iirose</p></div>`, "关于")
}