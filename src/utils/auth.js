const config = require('../../config/config');
const jwt = require('jsonwebtoken');
const { getDbName, clientObj } = require('../api/utils/db');
const ObjectId = require('mongodb').ObjectID;
const debug = require('debug')('App:API:Tokening');
const nodeUtil = require('util');

const ENV = process.env.NODE_ENV;
const secret = config[ENV]['token']['secret'];
const jwtExp = config[ENV]['token']['jwtExp'] || '10d';

const sign = (userJson) => {
  const tokenString = jwt.sign(
    { is_admin: userJson.is_admin },
    secret,
    { expiresIn: jwtExp }
  );
  return tokenString;
}

const verify = (tokenString) => {
  try {
    const payload = jwt.verify(tokenString, secret);
    return payload;
  }
  catch (error) {
    debug(`Something's wrong: ${error.toString()}`);
    debug(error.stack);
  }
}

/* Authentication middleware for API routes
 * @param (isForAdminOnly): Boolean 
 */
const applyProtection = (isForAdminOnly) => (req, res, next) => {
  const bearerString = req.headers['x-access-token'] || req.headers['authorization'];

  if (!bearerString || !bearerString.match(/^bearer /i)) {
    debug(`Unauthorised access attempt caught!`);
    res.status(401).json({ message: 'Unauthorised!' });
  }
  else {
    const tokenString = bearerString.split(' ')[1].trim();
    const payload = verify(tokenString);

    // @ts-ignore
    const doesProceed = (!isForAdminOnly) || payload.is_admin;
    if (doesProceed) {
      // Pass the result user to the next event handler in-line
      req.user = payload;
      next();
    }
    else {
      res.status(401).json({ message: 'Unauthorised!' });
    }
  }
}

module.exports = {
  sign,
  verify,
  applyProtection,
}