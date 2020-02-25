require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const fp = require('./utils/fp');
const debug = require('debug')('App:API:server');
const logger = require('morgan');
const nodeUtil = require('util');

// Get server environment configuration 
const ENV = process.env.NODE_ENV;
const config = require('./api/../../config/config');
const PORT = process.env.PORT || config[ENV]["port"];
const MODE = config[ENV]["name"];

const userSignin = require('./api/controllers/user.signin');
const userSignup = require('./api/controllers/user.signup');
const userVerify = require('./api/controllers/user.verify');
const userRouter = require('./api/routes/user.router');
const transportRecordRouter = require('./api/routes/transportRecord.router');
const transferRequestRouter = require('./api/routes/transferRequest.router');
const supplierRouter = require('./api/routes/supplier.router');
const storeRouter = require('./api/routes/store.router');
const productRouter = require('./api/routes/product.router');
const customerReceiptRouter = require('./api/routes/customerReceipt.router');

app.use(cors());
app.disable('x-powered-by');
app.use(express.json());
// see: https://expressjs.com/en/resources/middleware/body-parser.html
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

process
  .on('uncaughtException', errors => {
    debug(`Uncaught Exception: ${errors.toString()}`);
    debug(`Stack trace: ${errors.stack}`);
  })
  .on('unhandledRejection', (reason, promise) => {
    debug(`Unhandled Rejection at Promise: ${nodeUtil.inspect(promise)}, reason: ${reason}`);
  })

// API routes
// Routes return JWT payload
app.post('/api/signin', userSignin);
app.post('/api/signup', userSignup);
app.post('/api/verify', userVerify);
// Routes consume JWT payload
[userRouter, productRouter, storeRouter,
  supplierRouter, customerReceiptRouter,
  transferRequestRouter, transportRecordRouter].forEach(router => app.use(router));

// Client-side routes  
app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(__dirname + 'views/public'));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/login.html'));
});
app.get('/', (req, res) => {
  res.redirect('/login');
})

app.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/layouts/user.html'));
});
app.get('/register_user', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/layouts/register_user.html'));
});

// HTTP code 404 & 500 response handlers
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views/page404.html'));
});

app.use(((err, req, res) => {
  debug(`Something's wrong happened: ${err.toString()}`);
  debug(`${err.stack}`);
  res.status(500).send('Something broke!')
}));

// @WHY (export `httpServer`?): may needed for later tests
module.exports.httpServer = app.listen(5000, () => {
  debug(`API currently active on port ${PORT} & in ${MODE} mode.`);
});