const token = require('../../utils/auth');
const debug = require('debug')('App:API:User:sign-in');
const { getDbName, connectPromise } = require('../utils/db');
const nodeUtil = require('util');
const pwd = require('../../utils/pwd');

/* Signin controller implementing BasicAuth header
 */
const signinUser = (req, res) => {
  if (!req.headers['authorization'] || req.headers.authorization.indexOf('Basic ') === -1) {
    res.status(401).json({ message: 'Please re-check your input!' });
    debug(`Alert: Missing Authorisation header!`);
  }
  const base64Credentials = req.headers['authorization'].split(' ')[1];
  const credentialsString = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [usernameInput, passwordInput] = credentialsString.split(':');

  connectPromise
    .then(client => {
      const db = client.db(getDbName());
      return db.collection('users').findOne({
        $or: [{ email: usernameInput }, { phone: usernameInput }]
      });
    })
    .then(userReturned => {
      if (!userReturned) {
        debug(`Alert: Wrong user credentials input caught!`);
        // HTTP code 401: Unauthorised
        res.status(401).json({ message: 'Please re-check your input!' });
      } else {
        if (pwd.isMatch(passwordInput, userReturned.password)) {
          debug('User authenticated, ready to process!');
          const tokenString = token.sign(userReturned);
          res.status(200).json({ isAuth: true, token: tokenString });
        }
        else {
          debug(`Alert: Wrong user credentials input caught!`);
          res.status(401).json({ message: "Please re-check your input!" });
        }
      }
    })
    .catch(errors => {
      debug(`Something's wrong: ${errors.toString()}`);
      debug(`Stack trace: ${errors.stack}`);
      res.status(500).json({ message: 'Unexpected server error!' });
    });
}

module.exports = signinUser;