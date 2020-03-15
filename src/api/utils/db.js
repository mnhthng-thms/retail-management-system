const MongoClient = require('mongodb').MongoClient;
const config = require('../../../config/config');
const debug = require('debug')('App:API:database_connection');

const ENV = process.env.NODE_ENV;
const SERVER_URI = config[ENV]["dbURI"];
const DB_NAME = config[ENV]["dbName"];

const connectPromise = MongoClient.connect(`${SERVER_URI}/${DB_NAME}`, {
  forceServerObjectId: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 15000,
  keepAliveInitialDelay: 15000
});

const getDbName = () => DB_NAME;

module.exports = {
  getDbName,
  connectPromise
}; 