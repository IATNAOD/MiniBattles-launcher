const {
  REGISTER,
  AUTHTORIZE,
  CURRENT
} = require("../actions/user");

module.exports = {
  [REGISTER]: (data, CurrentMainWindow) => {
    CurrentMainWindow.webContents.send(REGISTER, data)
  },
  [AUTHTORIZE]: (data, CurrentMainWindow) => {
    CurrentMainWindow.webContents.send(AUTHTORIZE, data)
  },
  [CURRENT]: (data, CurrentMainWindow) => {
    CurrentMainWindow.webContents.send(CURRENT, data)
  }
}