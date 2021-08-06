const rel = require('../utils/get-git-release');
var fs = require("fs");
var AdmZip = require("adm-zip");
const { remote, ipcRenderer } = require('electron')

let label = document.getElementById('download-label')
let progress = document.getElementById('download')

rel.getLatestRelease({
  user: 'IATNAOD',
  repo: 'MiniBattles-launcher',
}, function (error, response) {

  if (!error && response.statusCode == 200) {
    let tag = JSON.parse(response.body).tag_name

    if (tag != remote.app.getVersion()) {
      label.innerText = 'Update found';
      rel.downloadLatestRelease({
        user: 'IATNAOD',
        repo: 'MiniBattles-launcher',
        saveDirectory: './',
        assetName: 'MiniBattles-launcher.zip',
        label,
        progress
      }, function (error, response) {

        if (error) {
          label.innerText = 'Something went wrong';
        } else {
          label.innerText = 'Update downloaded';
        }

        let zip = new AdmZip(response);

        zip.extractEntryToA("resources/", './', true, true);

        fs.unlinkSync(response)

        ipcRenderer.send('relaunch-main-app')

      });
    } else {
      label.innerText = 'Update not found';
      setTimeout(() => {
        ipcRenderer.send('start-main-app')
      }, 1000)
    }

  } else {
    label.innerText = 'No release was found'
    console.log('No release was found')
  }

});