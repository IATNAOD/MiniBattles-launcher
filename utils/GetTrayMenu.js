module.exports = (mainWindow) => [
  {
    label: 'Open app',
    click: () => {
      if (!mainWindow.isVisible())
        mainWindow.show()
    }
  },
  {
    label: 'Exit',
    click: () => {
      mainWindow.destroy()
    }
  }
]