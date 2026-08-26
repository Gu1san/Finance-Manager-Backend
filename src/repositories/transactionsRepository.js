const db = require("../db");

const transactionSelect = [
  "transactions.id",
  "transactions.description",
  "transactions.amount",
  "transactions.type",
  "transactions.date",
  "transactions.category_id",
  "categories.name as category",
];

async function getAll(userId) {
  return await db("transactions")
    .select(transactionSelect)
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("transactions.user_id", userId)
    .orderBy("transactions.date", "desc");
}

async function getById(id, userId) {
  return await db("transactions")
    .select(transactionSelect)
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where({
      "transactions.id": id,
      "transactions.user_id": userId,
    })
    .first();
}

async function getByCategory(category, userId) {
  return await db("transactions")
    .select(transactionSelect)
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where({
      "categories.name": category,
      "transactions.user_id": userId,
    })
    .orderBy("transactions.date", "desc");
}

async function getByType(type, userId) {
  return await db("transactions")
    .select(transactionSelect)
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where({
      "transactions.type": type,
      "transactions.user_id": userId,
    })
    .orderBy("transactions.date", "desc");
}

async function getCategoryIdByName(name) {
  let category = await db("categories").where({ name }).first();

  if (category) {
    return category.id;
  }

  await db("categories").insert({ name });

  category = await db("categories").where({ name }).first();

  return category.id;
}

async function create(transaction, userId) {
  const [created] = await db("transactions")
    .insert({
      ...transaction,
      user_id: userId,
    })
    .returning("*");

  return created;
}

async function update(id, transaction, userId) {
  await db("transactions")
    .where({
      id,
      user_id: userId,
    })
    .update(transaction);

  return await getById(id, userId);
}

async function patch(id, data, userId) {
  await db("transactions")
    .where({
      id,
      user_id: userId,
    })
    .update(data);

  return await getById(id, userId);
}

async function remove(id, userId) {
  return await db("transactions")
    .where({
      id,
      user_id: userId,
    })
    .del();
}

module.exports = {
  getAll,
  getById,
  getByCategory,
  getByType,
  getCategoryIdByName,
  create,
  update,
  patch,
  remove,
};
