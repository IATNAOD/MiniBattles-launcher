const axios = require('axios');
const { baseUrl } = require('../../config');

module.exports = {
  register: (data) => axios.post(`${baseUrl}users/registration`, data),
  authtorize: (data) => axios.post(`${baseUrl}users/loginWithPassword`, data),
  getCurrent: (token) => axios.get(`${baseUrl}users/current`, { headers: { "Authorization": `Bearer ${token}` } }),
}