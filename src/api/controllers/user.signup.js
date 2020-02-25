const auth = require('../../utils/auth');
const debug = require('debug')('App:API:User:sign-up');
const pwd = require('../../utils/pwd');
const { getDbName, connectPromise } = require('../utils/db');
const nodeUtil = require('util');

// https://www.freecodecamp.org/news/securing-node-js-restful-apis-with-json-web-auths-9f811a92bb52/

const signupUser = (req, res) => {
  const EMAIL = req.body.email;
  const PHONE = req.body.phone;

  connectPromise
    .then(client => {
      const db = client.db(getDbName());
      return db.collection('users').findOne({
        $or: [{ email: EMAIL }, { phone: PHONE }]
      });
    })
    .then(possibleDuplicated => {
      if (!!possibleDuplicated) {
        debug('Alert: Attempt to create duplicated user caught!');
        // HTTP code 409: Resource conflict 
        res.status(409).json({ message: "User with this email/phone number already existed!" });
      }
      else {
        return pwd.encrypt(req.body.password);
      }
    })
    .then(encryptedPassword => {
      const newUser = {
        ...req.body,
        password: encryptedPassword
      };

      const tokenString = auth.sign(newUser);
      connectPromise.then(function (client) {
        client.db(getDbName()).collection('users').insertOne(newUser);
      });

      debug(`New user <is_admin?: ${newUser.is_admin}> registered`);

      // HTTP code 201: Request fulfilled, new resource created
      res.status(201).json({ isAuth: true, token: tokenString });
    })
    .catch(error => {
      debug(`Something's wrong: ${errors.toString()}`);
      debug(`Stack trace: ${errors.stack}`);
      res.status(500).json({ message: 'Unexpected server error!' })
    })
}

module.exports = signupUser; 