const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const { HANDLE_FETCH_DATA, FETCH_DATA_FROM_STORAGE, HANDLE_SAVE_DATA, SAVE_DATA_IN_STORAGE, REMOVE_DATA_FROM_STORAGE, HANDLE_REMOVE_DATA } = require("./utils/constants")
const storage = require("electron-json-storage")

let mainWindow, itemsToTrack, dev = false;

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

const defaultDataPath = storage.getDefaultDataPath();

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    show: false,

  });

  // and load the index.html of the app.
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

  mainWindow.once('ready-to-show', () => {

    mainWindow.show();

    require('./store')(ipcMain, mainWindow)

    if (dev)
      mainWindow.webContents.openDevTools();

  });

  mainWindow.webContents.send("info", { msg: "hello from main process" })

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow()
});

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin')
    app.quit();

});

app.on('activate', () => {

  if (mainWindow === null)
    createWindow();

});

// --------------------------------------------------------------

// ipcMain methods are how we interact between the window and (this) main program

// Receives a FETCH_DATA_FROM_STORAGE from renderer
ipcMain.on(FETCH_DATA_FROM_STORAGE, (event, message) => {
  console.log("Main received: FETCH_DATA_FROM_STORAGE with message:", message)
  // Get the user's itemsToTrack from storage
  // For our purposes, message = itemsToTrack array
  storage.get(message, (error, data) => {
    // if the itemsToTrack key does not yet exist in storage, data returns an empty object, so we will declare itemsToTrack to be an empty array
    itemsToTrack = JSON.stringify(data) === '{}' ? [] : data;
    if (error) {
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: false,
        message: "itemsToTrack not returned",
      })
    } else {
      // Send message back to window
      mainWindow.send(HANDLE_FETCH_DATA, {
        success: true,
        message: itemsToTrack, // do something with the data
      })
    }
  })
})

// Receive a SAVE_DATA_IN_STORAGE call from renderer
ipcMain.on(SAVE_DATA_IN_STORAGE, (event, message) => {
  console.log("Main received: SAVE_DATA_IN_STORAGE")
  // update the itemsToTrack array.
  itemsToTrack.push(message)
  // Save itemsToTrack to storage
  storage.set("itemsToTrack", itemsToTrack, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: false,
        message: "itemsToTrack not saved",
      })
    } else {
      // Send message back to window as 2nd arg "data"
      mainWindow.send(HANDLE_SAVE_DATA, {
        success: true,
        message: message,
      })
    }
  })
});

// Receive a REMOVE_DATA_FROM_STORAGE call from renderer
ipcMain.on(REMOVE_DATA_FROM_STORAGE, (event, message) => {
  console.log('Main Received: REMOVE_DATA_FROM_STORAGE')
  // Update the items to Track array.
  itemsToTrack = itemsToTrack.filter(item => item !== message)
  // Save itemsToTrack to storage
  storage.set("itemsToTrack", itemsToTrack, (error) => {
    if (error) {
      console.log("We errored! What was data?")
      mainWindow.send(HANDLE_REMOVE_DATA, {
        success: false,
        message: "itemsToTrack not saved",
      })
    } else {
      // Send new updated array to window as 2nd arg "data"
      mainWindow.send(HANDLE_REMOVE_DATA, {
        success: true,
        message: itemsToTrack,
      })
    }
  })
})
