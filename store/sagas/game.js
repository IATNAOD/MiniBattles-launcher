const bindreducer = require("../utils/bindreducer")

const {
  GETGAMEVERSION,
  GETGAMETREE
} = require("../actions/game")

const {
  getGameVersion,
  getGameTree
} = require("../api/game")

const game = require("../reducers/game")

module.exports = (ipcMain, mainWindow) => {

  ipcMain.on(GETGAMEVERSION, (e, data) => {
    bindreducer(getGameVersion(data), game[GETGAMEVERSION], mainWindow)
  })

  ipcMain.on(GETGAMETREE, (e, data) => {
    bindreducer(getGameTree(data), game[GETGAMETREE], mainWindow)
  })

}