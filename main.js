const { app, BrowserWindow } = require('electron')
const os = require("os");
const ipc = require('electron').ipcMain

ipc.on('system-type', function(event, data){
    event.sender.send('system-type', os.platform());
});

let startWindow;

function start(){
	startWindow = new BrowserWindow({
		width: 800,
		height: 650,
		minWidth: 800,
		minHeight: 650,
		maxWidth: 800,
		maxHeight: 650,
		resizable: false,
		fullscreen: false,
		frame: false,
		title: "IIROSE For PC",
		webPreferences: {
			nodeIntegration: true
		}
	})
	startWindow.loadFile("./start.html");
	//startWindow.openDevTools()
	startWindow.on('closed', function () {
		startWindow = null
	})
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
