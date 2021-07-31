const { REGISTER } = require("../actions/user");

module.exports = {
  [REGISTER]: (data, ipcMain) => {
    console.log(data)
  }
}