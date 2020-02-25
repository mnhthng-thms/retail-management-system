const router = require('express').Router();
const applyProtection = require('../../utils/auth').applyProtection;
const { getDbName, clientObj } = require('../utils/db');

const crudOps = require('../utils/crudControllers')('transferRequests');

router
  .route('/api/transferRequest')
  .get(applyProtection(false), crudOps['getMany'])
  .post(applyProtection(false), crudOps['createOne']);

router
  .route('/api/transferRequest/:id')
  .get(applyProtection(false), crudOps['getOne'])
  .put(applyProtection(false), crudOps['updateOne'])
  .delete(applyProtection(true), crudOps['removeOne']);

module.exports = router; 