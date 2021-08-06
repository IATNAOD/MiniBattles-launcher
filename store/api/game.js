const axios = require('axios');
const { baseUrl } = require('../../config');

module.exports = {
  getGameVersion: (token) => axios.get(`${baseUrl}game/version`, { headers: { "Authorization": `Bearer ${token}` } }),
  getGameTree: (token) => axios.get(`${baseUrl}game/tree`, { headers: { "Authorization": `Bearer ${token}` } }),
}