const db = require("../db");

async function getAll() {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category"
    )
    .leftJoin("categories", "transactions.category_id", "categories.id");
}

async function getById(id) {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category"
    )
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("transactions.id", id)
    .first();
}

async function getByCategory(category) {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category"
    )
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("categories.name", category);
}

async function getCategoryIdByName(name) {
  let category = await db("categories").where({ name }).first();
  if (!category) {
    const [id] = await db("categories").insert({ name });
    return id; // retorna o novo id
  }
  return category.id;
}

async function create(transaction) {
  const [id] = await db("transactions").insert(transaction);
  return await getById(id);
}

async function update(id, transaction) {
  await db("transactions").where({ id }).update(transaction);
  return await getById(id);
}

async function patch(id, data) {
  await db("transactions").where({ id }).update(data);
  return await getById(id);
}

async function remove(id) {
  return await db("transactions").where({ id }).del();
}

async function getBalance() {
  const transactions = await getAll();
  return transactions.reduce((acc, t) => {
    return t.type === "entrada"
      ? acc + Number(t.amount)
      : acc - Number(t.amount);
  }, 0);
}

module.exports = {
  getAll,
  getById,
  getByCategory,
  getCategoryIdByName,
  create,
  update,
  patch,
  remove,
  getBalance,
};
