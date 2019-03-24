const { shell, remote, Menu, Tray, app, BrowserWindow } = require('electron')
const os = require("os");
const ipc = require('electron').ipcMain
const fs = require("fs");

let tray = null;

let sys = os.platform();
if (sys.indexOf("win") != -1) {
	sys = "Windows";
} else if (sys.indexOf("linux") != -1) {
	sys = "Linux";
}

ipc.on('system-type', function (event, data) {
	event.sender.send('system-type', sys);
});

fs.exists("./config.json", (exists) => {
	if (!exists) {
		fs.writeFile("./config.json", `{"window":{"w":800,"h":600}}`, (err) => { })
		console.log(1)
	}
})

let startWindow;

function hide() {
	startWindow.setSkipTaskbar(true);
	startWindow.hide();
}

function show() {
	startWindow.setSkipTaskbar(false);
	startWindow.show();
}

function start() {
	// 系统托盘
	tray = new Tray('./icon/256.png')
	const contextMenu = Menu.buildFromTemplate([
		{
			label: '退出',
			type: 'normal',
			click: () => {
				var window = remote.getCurrentWindow();
				window.close();
			}
		},
		{
			label: '前台显示',
			type: 'normal',
			click: () => {
				show()
			}
		},
		{
			label: '后台运行',
			type: 'normal',
			click: () => {
				hide()
			}
		}
	])
	tray.setToolTip('我正在看着你...')
	tray.setContextMenu(contextMenu);

	tray.on('click', () => {
		startWindow.isVisible() ? win.hide() : win.show()
	})

	fs.readFile(`./config.json`, (err, data) => {
		if (!err) {
			let obj = JSON.parse(data.toString());
			let w = obj.window.w;
			let h = obj.window.h;

			if (w < 800) {
				w = 800;
			}

			if (h < 600) {
				h = 600;
			}

			startWindow = new BrowserWindow({
				width: w,
				height: h,
				resizable: false,
				fullscreen: false,
				frame: false,
				title: "IIROSE For " + sys,
				webPreferences: {
					nodeIntegration: true
				}
			});

			startWindow.loadFile("./start.html");
			startWindow.openDevTools()
			startWindow.on('closed', function () {
				startWindow = null
			})

			startWindow.on('show', () => {
				tray.setHighlightMode('always')
			})

			startWindow.on('hide', () => {
				tray.setHighlightMode('never')
			})

			startWindow.webContents.on('new-window', function (e, url) {
				e.preventDefault();
				shell.openExternal(url);
			});
		} else {

		}
	});
}

app.on('ready', start)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (startWindow === null) {
		start();
	}
})