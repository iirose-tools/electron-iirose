const {
	shell,
	remote,
	Menu,
	Tray,
	app,
	BrowserWindow
} = require('electron');
const os = require("os");
const ipc = require('electron').ipcMain;
const fs = require("fs");
const request = require('request');
const version = app.getVersion();
// const iirose_ws = require('./websocket');

let tray = null;

function downloadFile(uri, filename, callback) {
	let stream = fs.createWriteStream(filename);
	request(uri).pipe(stream).on('close', callback);
}

function fsExistsSync(path) {
	try {
		fs.accessSync(path, fs.F_OK);
	} catch (e) {
		return false;
	}
	return true;
}

let sys = os.platform();
if (sys.indexOf("win") != -1) {
	sys = "Windows";
} else if (sys.indexOf("linux") != -1) {
	sys = "Linux";
}

ipc.on('system-type', function (event, data) {
	event.sender.send('system-type', sys);
});

ipc.on('version', (event, data) => {
	event.returnValue = version;
});

fs.exists("./config.json", (exists) => {
	if (!exists) {
		fs.writeFile("./config.json", `{"window":{"w":800,"h":600}}`, (err) => {});
		console.log(1);
	}
});

var startWindow;
var reloading = false;
var ses;

ipc.on('reload', function (event, data) {
	reload();
});

ipc.on('session', function (event, data) {
	try {
		if (data == 1) ses.getCacheSize(function (size) {
			event.returnValue = size / 1024 / 1024;
		});
		if (data == 2) ses.clearCache(function () {
			event.returnValue = 1;
		});
		if (data == 3)
			event.returnValue = ses.clearStorageData();
	} catch (event) {
		console.log("In main thread:");
		console.log(event);
	}
});

function reload() {
	if (reloading) return;
	reloading = true;
	reloadOne();
}

function reloadOne() {
	if (startWindow) startWindow.close();
	startWindow = null;
	if (tray) tray.destroy();
	tray = null;
	ses = null;
}

function reloadTwo() {
	start();
	reloading = false;
}

function hide() {
	startWindow.setSkipTaskbar(true);
	startWindow.hide();
}

function show() {
	startWindow.setSkipTaskbar(false);
	startWindow.show();
}

function start() {
	console.log("Start window");
	downloadFile('https://haa.tw/static/iirose/icon/256.png', './256.png', () => {
		tray = new Tray('./256.png');
		// 系统托盘
		const contextMenu = Menu.buildFromTemplate([{
				label: '退出',
				type: 'normal',
				click: () => {
					app.quit();
				}
			},
			{
				label: '前台显示',
				type: 'normal',
				click: () => {
					show();
				}
			},
			{
				label: '后台运行',
				type: 'normal',
				click: () => {
					hide();
				}
			},
			{
				label: '重载',
				type: 'normal',
				click: () => {
					reload();
				}
			}
		]);
		tray.setToolTip('我正在看着你...');
		tray.setContextMenu(contextMenu);

		tray.on('click', () => {
			startWindow.isVisible() ? startWindow.hide() : startWindow.show();
		});
	});
	fs.readFile(`./config.json`, (err, data) => {
		if (!err) {
			let obj = JSON.parse(data.toString());
			let w = obj.window.w;
			let h = obj.window.h;
			let mode = obj.mode;

			if (w < 800) {
				w = 800;
			}

			if (h < 600) {
				h = 600;
			}

			startWindow = new BrowserWindow({
				width: w,
				height: h,
				fullscreen: false,
				frame: false,
				title: "IIROSE For " + sys,
				show: false,
				webPreferences: {
					nodeIntegration: true
				}
			});

			ses = startWindow.webContents.session;

			if (mode == 0) startWindow.loadFile("./start.html");
			else if (mode == 1) startWindow.loadFile("./advanced.html");
			else startWindow.loadFile("./start.html");
			// startWindow.openDevTools();
			startWindow.on('closed', function () {
				console.log("Window closed");
				startWindow = null;
			});

			startWindow.once('ready-to-show', () => {
				console.log("Window ready to show");
				startWindow.show();
			});

			startWindow.on('show', () => {
				console.log("Window show");
				// tray.setHighlightMode('always')
			});

			startWindow.on('hide', () => {
				console.log("Window hide");
				// tray.setHighlightMode('never')
			});

			startWindow.on('resize', () => {
				let returnVal = Array();
				let windowSize = startWindow.getSize();
				returnVal.push(windowSize[0]);
				returnVal.push(windowSize[1]);
				returnVal.push(startWindow.isMaximized());
				startWindow.webContents.send('resize', returnVal);
			});

			startWindow.webContents.on('new-window', function (e, url) {
				console.log("Window open external link");
				e.preventDefault();
				shell.openExternal(url);
			});

			setTimeout(() => {
				let returnVal = Array();
				let windowSize = startWindow.getSize();
				returnVal.push(windowSize[0]);
				returnVal.push(windowSize[1]);
				returnVal.push(startWindow.isMaximized());
				startWindow.webContents.send('resize', returnVal);
			}, 1000);
		} else {

		}
	});
}

app.on('ready', start);

app.on('window-all-closed', function () {
	if (reloading) reloadTwo();
	else if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (startWindow === null) {
		start();
	}
});