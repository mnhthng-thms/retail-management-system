const router = require('express').Router();
const applyProtection = require('../../utils/auth').applyProtection;
const { getDbName, clientObj } = require('../utils/db');

const crudOps = require('../utils/crudControllers')('customerReceipts');

router
  .route('/api/customerReceipt')
  .get(applyProtection(false), crudOps['getMany'])
  .post(applyProtection(false), crudOps['createOne']);

router
  .route('/api/customerReceipt/:id')
  .get(applyProtection(false), crudOps['getOne'])
  .put(applyProtection(true), crudOps['updateOne']);

module.exports = router; 