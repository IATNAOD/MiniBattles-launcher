const { app, ipcMain, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path')
const url = require('url');
const GetTrayMenu = require('./utils/GetTrayMenu');

let mainWindow, tray, updaterWindow, dev = false;

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
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
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

  require('./store')(ipcMain, mainWindow)

  mainWindow.loadURL(indexPath);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {

    if (updaterWindow)
      updaterWindow.destroy()

    mainWindow.show();

    tray = new Tray('tray-icon.ico')

    tray.on('click', () => {
      if (!mainWindow.isVisible())
        mainWindow.show()
    })

    tray.setContextMenu(Menu.buildFromTemplate(GetTrayMenu(mainWindow)))

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

ipcMain.on('hide-app', (e) => {
  if (mainWindow)
    mainWindow.hide()
});

ipcMain.on('relaunch-main-app', (e) => {
  app.relaunch()
  app.exit()
});

ipcMain.on('start-main-app', (e) => {
  createMainWindow()
})