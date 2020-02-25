const token = require('../../utils/auth');
const debug = require('debug')('App:API:User:verifyJWT');
const { getDbName, clientObj } = require('../utils/db');
const nodeUtil = require('util');
const pwd = require('../../utils/pwd');

/* Controller for request of decoding JWT string
    @res.body : contains JWT payload
 */
const verifyJWT = (req, res) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: 'Empty request!' });
    }
    const payload = token.verify(req.body.token);
    res.status(200).json(payload);
  }
  catch (error) {
    debug(`Something's wrong: ${error.toString()}`);
    debug(`Stack trace: ${error.stack}`);
    res.status(500).json({ message: 'Unexpected server error!' });
  }
}

module.exports = verifyJWT;