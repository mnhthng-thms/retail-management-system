const router = require('express').Router();
const applyProtection = require('../../utils/auth').applyProtection;

const crudOps = require('../utils/crudControllers')('users');

router
  .route('/api/user')
  .get(applyProtection(false), crudOps['getMany']);

router
  .route('/api/user/:id')
  .get(applyProtection(true), crudOps['getOne'])
  .put(applyProtection(true), crudOps['updateOne'])
  .delete(applyProtection(true), crudOps['removeOne']);

module.exports = router; 