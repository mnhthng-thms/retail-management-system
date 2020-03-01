const ObjectId = require('mongodb').ObjectID;
const debug = require('debug')('App:API:CRUD_Controllers');
const { getDbName, connectPromise } = require('../utils/db');
const nodeUtil = require('util');

/* Functional interfaces implmenting Stategy pattern: 
   CRUD database operations involving singular data request
   Can be re-used among multiple database collections. 
     @param (colName) : instanceof `mongodb.collection`
     @param (req,res) : instanceof Node `Request` object, `Response` object 
*/

const createOne = (colName) => (req, res) => {
  connectPromise
    .then(function (client) {
      const db = client.db(getDbName());
      return db.collection(colName).insertOne(req.body);
    })
    .then(function (doc) {
      if (!doc) {
        res.status(500).json({ message: "Server received the requests but sent back no response! " });
      } else {
        // HTTP code 201: response fulfilled, new resource created
        res.status(201).json(doc)
      }
    })
    .catch(function (error) {
      debug(`Errors happened at ${colName}.createOne: ${error.toString()}`);
      debug(error.stack);
      res.status(500).json({ message: error.toString() });
    })
};

const getOne = (colName) => (req, res) => {
  connectPromise
    .then(function (client) {
      const db = client.db(getDbName());
      return db.collection(colName).findOne({ _id: ObjectId(req.params.id) });
    })
    .then(function (doc) {
      if (!doc) {
        res.status(404).json({ message: "Server received the requests but sent back no response! " });
      } else {
        // HTTP code 201: OK
        res.status(200).json(doc)
      }
    })
    .catch(function (error) {
      debug(`Errors happened at ${colName}.getOne: ${error.toString()}`);
      debug(error.stack);
      res.status(500).json({ message: error.toString() });
    })
};

const getMany = (colName) => (req, res) => {
  connectPromise
    .then(function (client) {
      const db = client.db(getDbName());
      return db.collection(colName).find(req.body).toArray();
    })
    .then(function (doc) {
      if (!doc) {
        res.status(404).json({ message: "Server received the requests but sent back no response! " });
      } else {
        res.status(200).json(doc)
      }
    })
    .catch(function (error) {
      debug(`Errors happened at ${colName}.getMany: ${error.toString()}`);
      debug(error.stack);
      res.status(500).json({ message: error.toString() });
    })
};

const updateOne = (colName) => (req, res) => {
  connectPromise
    .then(function (client) {
      const db = client.db(getDbName());
      return db.collection(colName).findOneAndUpdate(
        { _id: ObjectId(req.params.id) },
        { $set: req.body },
        {
          returnOriginal: false,
          upsert: false
        }
      );
    })
    .then(function (doc) {
      if (!doc) {
        res.status(404).json({ message: "Server received the requests but sent back no response! " });
      } else {
        res.status(200).json(doc)
      }
    })
    .catch(function (error) {
      debug(`Errors happened at ${colName}.updateOne: ${error.toString()}`);
      debug(error.stack);
      // HTTP code 409: request in conflict with API resource
      res.status(409).json({ message: error.toString() });
    })
};

const removeOne = (colName) => (req, res) => {
  connectPromise
    .then(function (client) {
      const db = client.db(getDbName());
      return db.collection(colName).findOneAndDelete({ _id: ObjectId(req.params.id) });
    })
    .then(function (doc) {
      if (!doc) {
        res.status(404).json({ message: "Server received the requests but sent back no response! " });
      } else {
        res.status(200).json(doc)
      }
    })
    .catch(function (error) {
      debug(`Errors happened at ${colName}.removeOne: ${error.toString()}`);
      debug(error.stack);
      // HTTP code 409: request in conflict with API resource
      res.status(409).json({ message: error.toString() });
    })
};

module.exports = (colName) => ({
  createOne: createOne(colName),
  getOne: getOne(colName),
  getMany: getMany(colName),
  updateOne: updateOne(colName),
  removeOne: removeOne(colName)
});  