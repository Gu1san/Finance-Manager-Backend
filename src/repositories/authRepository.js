const db = require("../db");

async function findByEmail(email) {
  return await db("users").where({ email }).first();
}

async function findById(id) {
  return await db("users").where({ id }).first();
}

async function create(user) {
  const [createdUser] = await db("users").insert(user).returning("*");
  return createdUser;
}

module.exports = {
  findByEmail,
  findById,
  create,
};
