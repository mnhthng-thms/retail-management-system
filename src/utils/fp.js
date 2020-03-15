/* Functional Programming Techniques
*/
const unary = (func) => (...args) => func(args[0]);

/* Perform backward function composition
   @param  (...funcs) array of function definitions
   @return  fusioned function
*/
const pipe = (...funcs) => (args) => {
  return funcs.reduce((accArgs, currFunc) => currFunc(accArgs), args);
}
/* Perform forward function composition
   @param  (...funcs) array of function definitions
   @return  fusioned function 
*/
const compose = (...funcs) => (args) => {
  return funcs.reduceRight((accArgs, currFunc) => currFunc(accArgs), args);
}

module.exports = {
  unary,
  pipe,
  compose,
};

