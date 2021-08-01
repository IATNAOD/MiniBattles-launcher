const bindreducer = require("../utils/bindreducer")

const {
  REGISTER,
  AUTHTORIZE,
  CURRENT
} = require("../actions/user")

const {
  register,
  authtorize,
  getCurrent
} = require("../api/user")

const user = require("../reducers/user")

module.exports = (ipcMain, mainWindow) => {

  ipcMain.on(REGISTER, (e, data) => {
    bindreducer(register(data), user[REGISTER], mainWindow)
  })

  ipcMain.on(AUTHTORIZE, (e, data) => {
    bindreducer(authtorize(data), user[AUTHTORIZE], mainWindow)
  })

  ipcMain.on(CURRENT, (e, data) => {
    bindreducer(getCurrent(data), user[CURRENT], mainWindow)
  })

}