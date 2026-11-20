const requestHandler = require('../server/server.js');

module.exports = (req, res) => {
  if (req.headers && req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  } else if (req.url === '/api' || req.url === '/api/') {
    // If incoming was /api, leave as is
  }
  return requestHandler(req, res);
};
