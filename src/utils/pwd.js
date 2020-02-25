const bcrypt = require('bcrypt');
const debug = require('debug')('App:InputHandling:Password')

/* Password Encryption Utilities
*/

const DEFAULT_HASH_COST = 7;

/* Encrypt input password
   @param  (inputPwd)  : String
   @param  (hashCost)  : Number  (optional)
   @return  String     : hashed password             
 */
const encrypt = async (...params) => {
  const [inputPwd, hashCost] = params;
  try {
    const hashed = (!hashCost) ?
      await bcrypt.hash(inputPwd, DEFAULT_HASH_COST) :
      await bcrypt.hash(inputPwd, parseInt(hashCost, 10));
    return hashed;
  }
  catch (errors) {
    debug(`Something's wrong: ${errors.toString()}`);
  }
}

/* Compare input password with stored password
   @param  (inputPwd) : String 
   @param  (storedPwd): String 
   @return  Boolean   : are input and stored ones matched? 
   @error   TypedError: lack of parameters passed in
 */
const isMatch = async (...params) => {
  const [inputPwd, storedPwd] = params;
  try {
    if (!storedPwd) {
      throw new TypeError('Insufficient number of arguments');
    }
    const res = await bcrypt.compare(inputPwd, storedPwd);
    return res;
  }
  catch (errors) {
    debug(`Something's wrong: ${errors.toString()}`);
  }
}

module.exports = {
  encrypt,
  isMatch
}