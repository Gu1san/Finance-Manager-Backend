const db = require("../db");

async function findByEmail(email) {
  const user = await db("users").where({ email }).first();

  return user;
}

async function findById(id) {
  if (!id) return null;

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
