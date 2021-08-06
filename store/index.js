module.exports = (ipcMain, mainWindow) => {
  require('./sagas/user')(ipcMain, mainWindow)
  require('./sagas/game')(ipcMain, mainWindow)
}