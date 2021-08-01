module.exports = (ipcMain, mainWindow) => {
  require('./sagas/user')(ipcMain, mainWindow)
}