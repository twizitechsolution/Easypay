const requestHandler = require('../server/server.js');

module.exports = (req, res) => {
  return requestHandler(req, res);
};
