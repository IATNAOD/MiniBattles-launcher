const request = require('request');
const fs = require('fs');

module.exports = {
  getLatestRelease,
  downloadLatestRelease,
}

function getLatestRelease(params, callback) {
  const url = createLatestUrl(params.user, params.repo);
  const options = createOptionsFromUrl(url, params.token);
  request(options, function (error, response, body) {
    if (callback) callback(error, response);
  });
}

function downloadLatestRelease(params, callback) {
  const url = createLatestUrl(params.user, params.repo);
  const options = createOptionsFromUrl(url, params.token);
  sendDownloadRequest(options, params, callback);
}

function sendDownloadRequest(options, params, callback) {
  request(options, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      let asset = json.assets.find(v => v.name == params.assetName);

      if (asset) {

        params.label.innerText = 'Downloading an update';
        progress.max = asset.size;

        if (!fs.existsSync(params.saveDirectory))
          fs.mkdirSync(params.saveDirectory);

        options.url = asset.browser_download_url;
        let savePath = params.saveDirectory + params.assetName;

        const stream = request(options).pipe(fs.createWriteStream(savePath));

        let streamInterval = setInterval(() => {
          progress.value = stream.bytesWritten;
        }, 1000)
        stream.on('finish', function () {
          callback(null, savePath);
          clearInterval(streamInterval)
        });
        stream.on('error', function (e) {
          callback(e, null);
          clearInterval(streamInterval)
        });

      } else {
        callback('bad asset', null);
      }

    } else {
      callback(error, response);
    }

  });
}

function createOptionsFromUrl(url) {
  return {
    url: url,
    headers: {
      'User-Agent': 'git-release'
    }
  }
}

function createBaseUrl(user, repo) {
  return 'https://api.github.com/repos/' + user + '/' + repo + '/releases';
}

function createLatestUrl(user, repo) {
  return createBaseUrl(user, repo) + '/latest';
}
