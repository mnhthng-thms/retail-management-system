const router = require('express').Router();
const applyProtection = require('../../utils/auth').applyProtection;
const { getDbName, clientObj } = require('../utils/db');

const crudOps = require('../utils/crudControllers')('stores');

router
  .route('/api/store')
  .get(applyProtection(true), crudOps['getMany'])
  .post(applyProtection(true), crudOps['createOne']);

router
  .route('/api/store/:id')
  .get(applyProtection(true), crudOps['getOne'])
  .put(applyProtection(true), crudOps['updateOne'])
  .delete(applyProtection(true), crudOps['removeOne']);

module.exports = router; 