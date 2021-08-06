import './styles.css'
import React, { useEffect, useState } from 'react';

import storage from 'electron-json-storage'

import { ipcRenderer } from 'electron'
import { GETGAMETREE, GETGAMEVERSION } from '../../../store/actions/game';
import { baseUrl } from '../../../config';

const dirTree = require("directory-tree");
const hashFile = require('hash-file');
const path = require('path');
const request = require('request');
const fs = require('fs');
const exec = require('child_process').execFile;

export default ({
  User
}) => {
  const [FilesForDownload, FilesForDownloadChange] = useState(null)
  const [ForFullDownload, ForFullDownloadChange] = useState(null)
  const [Downloaded, DownloadedChange] = useState(null)
  const [Status, StatusChange] = useState('check')

  useEffect(() => {

    let gameTree = dirTree('./MiniBattles-game')

    ipcRenderer.send(GETGAMEVERSION, User.token)

    ipcRenderer.once(GETGAMEVERSION, (e, gameVersionRes) => {

      if (gameVersionRes.data && gameVersionRes.data.success) {

        ipcRenderer.once(GETGAMETREE, (e, gameTreeRes) => {

          if (gameTreeRes.data && gameTreeRes.data.success) {

            let oldGameState = storage.getSync('game');

            storage.set('game', { ...storage.getSync('game'), version: gameVersionRes.data.version, tree: gameTreeRes.data.tree, size: gameTreeRes.data.size }, (err) => {

              if (err)
                console.log(err)
              else {

                let newGameState = storage.getSync('game');

                if (!gameTree) {
                  StatusChange('download')
                } else if (oldGameState.version != newGameState.version) {
                  StatusChange('update')
                } else {
                  startCheckGame()
                }

              }

            })

          } else {
            console.log('err')
          }

        })

        ipcRenderer.send(GETGAMETREE, User.token)

      } else {
        console.log('err')
      }

    })

    return () => {
      ipcRenderer.removeAllListeners()
    }

  }, [])

  useEffect(() => {

    if (FilesForDownload != null) {

      if (FilesForDownload.length == 0) {
        StatusChange('ready')
        FilesForDownloadChange(null)
      } else {

        const stream = request({
          url: `${baseUrl}static/game/${FilesForDownload[0].path}`
        }).pipe(fs.createWriteStream(`./MiniBattles-game/${FilesForDownload[0].path}`));

        stream.on('finish', function () {
          DownloadedChange(Downloaded + FilesForDownload[0].size)

          let newFilesForDownload = JSON.parse(JSON.stringify(FilesForDownload))

          newFilesForDownload.shift()

          FilesForDownloadChange(newFilesForDownload)
        });

        stream.on('error', function (e) {
          let newFilesForDownload = JSON.parse(JSON.stringify(FilesForDownload))

          newFilesForDownload.push(newFilesForDownload.shift())

          FilesForDownloadChange(newFilesForDownload)
        });

      }

    }

  }, [FilesForDownload])

  const startDownloadGame = () => {

    let gameState = storage.getSync('game');

    ForFullDownloadChange(gameState.size)

    if (!fs.existsSync('MiniBattles-game'))
      fs.mkdirSync('MiniBattles-game')

    createGameFileStructure(gameState.tree.dirs)

    FilesForDownloadChange(gameState.tree.full)

  }

  const startUpdateGame = () => {

    let gameState = storage.getSync('game');

    let localGameTree = getLocalGameTree()

    getFilesForDownloaded(localGameTree, gameState)

  }

  const startCheckGame = () => {

    StatusChange('check')

    let gameState = storage.getSync('game');

    let localGameTree = getLocalGameTree()

    let isReady = true;

    if (localGameTree.length == gameState.tree.full.length) {

      for (let i = 0; i < gameState.tree.full.length; i++) {

        if (
          localGameTree.find(v => v.path == gameState.tree.full[i].path)
          &&
          localGameTree.find(v => v.path == gameState.tree.full[i].path).hash != gameState.tree.full[i].hash
        ) {
          isReady = false;
          break;
        }

      }

      if (isReady) {
        StatusChange('ready')
      } else
        getFilesForDownloaded(localGameTree, gameState)

    } else
      getFilesForDownloaded(localGameTree, gameState)

  }

  const launchGame = () => {
    ipcRenderer.send('hide-app')
    exec('MiniBattles-game/MiniBattles.exe', [User.token]);
  }

  const getFilesForDownloaded = (localGameTree, gameState) => {

    let localForDownload = [];
    let downloadSize = 0;

    for (let i = 0; i < gameState.tree.full.length; i++) {

      if (
        !localGameTree.find(v => v.path == gameState.tree.full[i].path)
        ||
        (
          localGameTree.find(v => v.path == gameState.tree.full[i].path)
          &&
          localGameTree.find(v => v.path == gameState.tree.full[i].path).hash != gameState.tree.full[i].hash
        )
      ) {
        localForDownload.push(gameState.tree.full[i])
        downloadSize += gameState.tree.full[i].size;
      }

    }

    ForFullDownloadChange(downloadSize)

    createGameFileStructure(gameState.tree.dirs)

    FilesForDownloadChange(localForDownload)

  }

  const createGameFileStructure = (dirs) => {
    for (let i = 0; i < dirs.length; i++)
      if (!fs.existsSync(`./MiniBattles-game/${dirs[i]}`))
        fs.mkdirSync(`./MiniBattles-game/${dirs[i]}`)
  }

  const getLocalGameTree = () => {

    let gameTree = dirTree('./MiniBattles-game')

    let trueTree = [];

    processTree(gameTree, trueTree)

    return trueTree

  }

  const processTree = (tree, trueTree) => {

    for (let i = 0; i < tree.children.length; i++) {

      if (tree.children[i].type == 'file' && tree.children[i].path.indexOf('MiniBattles\\Saved') == -1)
        trueTree.push({
          path: tree.children[i].path.replace('MiniBattles-game\\', ''),
          size: tree.children[i].size,
          hash: hashFile.sync(tree.children[i].path)
        })
      else if (tree.children[i].type == 'directory')
        processTree(tree.children[i], trueTree)

    }

  }

  return (
    <div className={'home-wrapper'}>
      <div className="home-banner">
        <h1 className={'game-title'}>
          Mini Battles
        </h1>
        <h1 className={'game-img-news'}></h1>
        <h1 className={'game-events'}></h1>
        <h1 className={'game-info'}></h1>
      </div>
      <div className="home-control">
        {
          Status == 'download'
            ? <div className={'download-control'}>
              {
                ForFullDownload
                  ? <progress className={'download-progress'} max={ForFullDownload} value={Downloaded}></progress>
                  : <div className="download-progress"></div>
              }
              <button className={'btn download-action'} onClick={startDownloadGame}>Download</button>
            </div>
            : Status == 'update'
              ? <div className={'update-control'}>
                {
                  ForFullDownload
                    ? <progress className={'update-progress'} max={ForFullDownload} value={Downloaded}></progress>
                    : <div className="download-progress"></div>
                }
                <button className={'btn update-action'} onClick={startUpdateGame}>Update</button>
              </div>
              : Status == 'check'
                ? <div className={'check-control'}>
                  {
                    ForFullDownload
                      ? <progress className={'check-progress'} max={ForFullDownload} value={Downloaded}></progress>
                      : <div className="check-progress"></div>
                  }
                  <button className={'btn check-action'} disabled>Checking</button>
                </div>
                : Status == 'ready'
                  ? <div className={'play-control'}>
                    <button className={'btn play-action'} onClick={launchGame}>Play</button>
                  </div>
                  : null
        }

      </div>
    </div>
  );

};