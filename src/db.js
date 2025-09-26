const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite",
  },
  useNullAsDefault: true,
});

module.exports = db;
