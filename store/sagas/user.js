const bindreducer = require("../utils/bindreducer")

const {
  REGISTER,
  AUTHTORIZE
} = require("../actions/user")

const { register } = require("../api/user")

const user = require("../reducers/user")

module.exports = (ipcMain) => {

  ipcMain.on(REGISTER, (e, data) => {
    bindreducer(register(data), user[REGISTER], ipcMain)
  })

  ipcMain.on(AUTHTORIZE, (e, data) => {

  })

}