const {
  GETGAMETREE,
  GETGAMEVERSION
} = require("../actions/game");

module.exports = {
  [GETGAMETREE]: (data, CurrentMainWindow) => {
    CurrentMainWindow.webContents.send(GETGAMETREE, data)
  },
  [GETGAMEVERSION]: (data, CurrentMainWindow) => {
    CurrentMainWindow.webContents.send(GETGAMEVERSION, data)
  }
}