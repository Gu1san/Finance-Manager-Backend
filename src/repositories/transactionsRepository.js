const db = require("../db");

async function getAll(userId) {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category",
    )
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("transactions.user_id", userId);
}

async function getById(id, userId) {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category",
    )
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where({ "transactions.id": id, "transactions.user_id": userId })
    .first();
}

async function getByCategory(category, userId) {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category",
    )
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where({ "categories.name": category, "transactions.user_id": userId });
}

async function getByType(type, userId) {
  return await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category",
    )
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where({ "transactions.type": type, "transactions.user_id": userId });
}

async function getCategoryIdByName(name) {
  let category = await db("categories").where({ name }).first();
  if (!category) {
    const [id] = await db("categories").insert({ name });
    return id; // retorna o novo id
  }
  return category.id;
}

async function create(transaction, userId) {
  const [id] = await db("transactions").insert({
    ...transaction,
    user_id: userId,
  });
  return await getById(id, userId);
}

async function update(id, transaction, userId) {
  await db("transactions").where({ id, user_id: userId }).update(transaction);
  return await getById(id, userId);
}

async function patch(id, data, userId) {
  await db("transactions").where({ id, user_id: userId }).update(data);
  return await getById(id, userId);
}

async function remove(id, userId) {
  return await db("transactions").where({ id, user_id: userId }).del();
}

async function getBalance(userId) {
  const transactions = await getAll(userId);

  const balance = transactions.reduce(
    (acc, t) => {
      if (t.type === "entrada") {
        acc.entradas += Number(t.amount);
      } else if (t.type === "saida") {
        acc.saidas += Number(t.amount);
      }
      return acc;
    },
    { entradas: 0, saidas: 0, total: 0 },
  );

  balance.total = balance.entradas - balance.saidas;

  return balance;
}

async function getBalanceByCategory(userId) {
  const transactions = await getAll(userId);

  return transactions.reduce((acc, t) => {
    const category = t.category || "Outros";
    let amount = Number(t.amount);
    if (t.type === "saida") {
      amount *= -1;
    }

    if (!acc[category]) acc[category] = 0;
    acc[category] += amount;

    return acc;
  }, {});
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
  getBalance,
  getBalanceByCategory,
};
