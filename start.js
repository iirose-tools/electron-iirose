const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;

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