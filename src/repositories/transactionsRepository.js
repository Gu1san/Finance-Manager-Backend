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

async function getByType(type) {
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
    .where("transactions.type", type);
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

  const balance = transactions.reduce(
    (acc, t) => {
      if (t.type === "entrada") {
        acc.entradas += Number(t.amount);
      } else if (t.type === "saida") {
        acc.saidas += Number(t.amount);
      }
      return acc;
    },
    { entradas: 0, saidas: 0, total: 0 }
  );

  balance.total = balance.entradas - balance.saidas;

  return balance;
}

async function getBalanceByCategory() {
  const transactions = await getAll();

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
