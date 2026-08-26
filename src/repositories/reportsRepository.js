const db = require("../db");

function applyDateFilter(query, from, to) {
  if (from) {
    query.where("transactions.date", ">=", from);
  }

  if (to) {
    query.where("transactions.date", "<=", to);
  }

  return query;
}

async function getSummary(userId, from, to) {
  const query = db("transactions")
    .where("transactions.user_id", userId)
    .select(
      db.raw(`
        COALESCE(
          SUM(
            CASE
              WHEN transactions.type = 'entrada'
              THEN transactions.amount
              ELSE 0
            END
          ),
          0
        ) as entradas
      `),
      db.raw(`
        COALESCE(
          SUM(
            CASE
              WHEN transactions.type = 'saida'
              THEN transactions.amount
              ELSE 0
            END
          ),
          0
        ) as saidas
      `),
    );

  applyDateFilter(query, from, to);

  const [result] = await query;

  const entradas = Number(result.entradas);
  const saidas = Number(result.saidas);

  return {
    entradas,
    saidas,
    resultado: entradas - saidas,
  };
}

async function getExpensesByCategory(userId, from, to) {
  const query = db("transactions")
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("transactions.type", "saida")
    .andWhere("transactions.user_id", userId)
    .select("categories.name as category")
    .sum("transactions.amount as total")
    .groupBy("categories.name")
    .orderBy("total", "desc");

  applyDateFilter(query, from, to);

  return await query;
}

async function getIncomeByCategory(userId, from, to) {
  const query = db("transactions")
    .leftJoin("categories", "transactions.category_id", "categories.id")
    .where("transactions.type", "entrada")
    .andWhere("transactions.user_id", userId)
    .select("categories.name as category")
    .sum("transactions.amount as total")
    .groupBy("categories.name")
    .orderBy("total", "desc");

  applyDateFilter(query, from, to);

  return await query;
}

async function getBalanceEvolution(userId, from, to) {
  const query = db("transactions")
    .where("transactions.user_id", userId)
    .select(
      "transactions.date",
      db.raw(`
        SUM(
          CASE
            WHEN transactions.type = 'entrada'
            THEN transactions.amount
            ELSE -transactions.amount
          END
        ) as result
      `),
    )
    .groupBy("transactions.date")
    .orderBy("transactions.date", "asc");

  applyDateFilter(query, from, to);

  return await query;
}

module.exports = {
  getSummary,
  getExpensesByCategory,
  getIncomeByCategory,
  getBalanceEvolution,
};
