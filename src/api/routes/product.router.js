const router = require('express').Router();
const applyProtection = require('../../utils/auth').applyProtection;
const { getDbName, clientObj } = require('../utils/db');

const crudOps = require('../utils/crudControllers')('products');

router
  .route('/api/product')
  .get(applyProtection(false), crudOps['getMany'])
  .post(applyProtection(true), crudOps['createOne']);

router
  .route('/api/product/:id')
  .get(applyProtection(false), crudOps['getOne'])
  .put(applyProtection(true), crudOps['updateOne'])
  .delete(applyProtection(true), crudOps['removeOne']);

module.exports = router; 