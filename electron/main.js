const {ipcMain} = require('electron');
var monitor_plan = require('./monitor_plan.js');

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    autoHideMenuBar : true,
    width : 1200, //Для меню разработчика
    // width : 850, //840*580
    height : 580
  });
  mainWindow.loadURL('file://' + __dirname + '/home.html');
  monitor_plan.reload_plan();
  //Open devTools
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });


  // ipcMain.on('on', (event, arg) => {
  //   console.log(arg)  // prints "ping"
  //   // event.sender.send('asynchronous-reply', 'pong')
  //
  //   var add_window = new BrowserWindow({
  //     width : 200,
  //     height : 200,
  //     // frame : false,
  //     resizable : false,
  //     autoHideMenuBar : true
  //   });
  //   add_window.on('closed', function () {
  //     add_window = null;
  //   });
  // });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
