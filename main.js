const { app, BrowserWindow } = require('electron')
const os = require("os");
const ipc = require('electron').ipcMain
const fs = require("fs");

let sys = os.platform();
if(sys.indexOf("win") != -1){
	sys = "Windows";
}else if(sys.indexOf("linux") != -1){
	sys = "Linux";
}

ipc.on('system-type', function(event, data){
    event.sender.send('system-type', sys);
});

fs.exists("./config.json",(exists)=>{
	if(!exists){
		fs.writeFile("./config.json",`{"window":{"w":800,"h":600}}`,(err)=>{})
		console.log(1)
	}
})

let startWindow;

function start(){
	fs.readFile(`./config.json`,(err,data) => {
		if(!err){
			let obj = JSON.parse(data.toString());
			let w = obj.window.w;
			let h = obj.window.h;
			
			startWindow = new BrowserWindow({
				width: w,
				height: h,
				minWidth: w,
				minHeight: h,
				maxWidth: w,
				maxHeight: h,
				resizable: false,
				fullscreen: false,
				transparent: true,
				hasShadow:false,
				frame: false,
				maximizable: false,
				minimizable: false,
				title: "IIROSE For "+sys,
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