const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url');

let mainWindow, updaterWindow, dev = false;

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

function createUpdaterWindow() {

  updaterWindow = new BrowserWindow({
    height: 200,
    width: 600,
    frame: false,
    maximizable: false,
    minimizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });

  let indexPath = url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'updater', 'index.html'),
    slashes: true
  });

  updaterWindow.once('ready-to-show', () => {
    updaterWindow.show();
  });

  updaterWindow.loadURL(indexPath);

  updaterWindow.on('closed', function () {
    updaterWindow = null;
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    show: false
  });

  let indexPath = url.format(dev && process.argv.indexOf('--noDevServer') === -1
    ? {
      protocol: 'http:',
      host: 'localhost:4000',
      pathname: 'index.html',
      slashes: true
    }
    : {
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });

  mainWindow.loadURL(indexPath);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {

    if (updaterWindow)
      updaterWindow.destroy()

    mainWindow.show();

    require('./store')(ipcMain, mainWindow)

    if (dev)
      mainWindow.webContents.openDevTools();

  });
}

app.on('ready', () => {
  if (dev)
    createMainWindow()
  else
    createUpdaterWindow()
});

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin')
    app.quit();

});

app.on('activate', () => {

  if (mainWindow === null)
    if (dev)
      createMainWindow()
    else
      createUpdaterWindow

});

ipcMain.on('relaunch-main-app', (e) => {
  app.relaunch()
  app.exit()
});

ipcMain.on('start-main-app', (e) => {

  createMainWindow()

})