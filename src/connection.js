const pgp = require("pg-promise");

module.exports = pgp()("postgres://postgres:123456@db/postgres");
