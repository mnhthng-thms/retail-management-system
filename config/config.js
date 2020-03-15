const development = {
  name: "Server Developement",
  port: 5000,
  dbURI: "mongodb://localhost:27017",
  dbName: "development",
  token: {
    secret: "infinitygaunlet"
  }
}

const production = {
  name: "Server Production",
  dbURI: "mongodb+srv://user0:admingate@cluster0-nzzqi.mongodb.net/test?retryWrites=true&w=majority",
  dbName: "inventory",
  token: {
    secret: process.env.JWT_SECRET,
    jwtExp: '1h'
  }
}

module.exports = {
  development,
  production
}

