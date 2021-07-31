module.exports = (ipcMain) => {
  require('./sagas/user')(ipcMain)
}