import './styles.css'
import React, { useEffect } from 'react';

import storage from 'electron-json-storage'

const dirTree = require("directory-tree");
const hashFiles = require('hash-files');
const hashFile = require('hash-file');

export default () => {

  useEffect(() => {

    let gameTree = dirTree('./MiniBattles-game')

    console.log("tree: ", gameTree)

    if (!gameTree) {
      console.log('download game')
    }

    // storage.remove('user')

  }, [])

  return (
    <div>
      home
    </div>
  );

};