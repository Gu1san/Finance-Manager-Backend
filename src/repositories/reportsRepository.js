const db = require("../db");

async function getByCategory(userId) {
  return await db("transactions")
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("transactions.type", "saida")
    .andWhere("transactions.user_id", userId)
    .select("categories.name as category")
    .sum("transactions.amount as total")
    .groupBy("categories.name")
    .orderBy("total", "desc");
}

async function getByType(type) {
  console.log("Fetching transactions of type:", type);
  const transactions = await db("transactions")
    .select(
      "transactions.id",
      "transactions.description",
      "transactions.amount",
      "transactions.type",
      "transactions.date",
      "transactions.category_id",
      "categories.name as category",
    )
    .where("transactions.type", type)
    .andWhere("transactions.user_id", userId)
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .orderBy("transactions.date", "desc");

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  return { transactions, total };
}

module.exports = {
  getByCategory,
  getByType,
};
