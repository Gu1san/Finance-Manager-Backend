const fs = require("fs");
const csv = require("csv-parser");
const { Parser } = require("json2csv");
const repo = require("../repositories/transactionsRepository");
const { isValidDate, isValidType } = require("../utils/errorHandler");

async function importTransactions(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const userId = req.user.id;

    const promises = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const { description, amount, category, date, type } = row;

        if (!description || !amount || !category || !date || !type) {
          errors.push({ row, error: "Campos obrigatórios ausentes" });
          return;
        }
        if (!isValidDate(date)) {
          errors.push({ row, error: "Data inválida" });
          return;
        }
        if (!isValidType(type)) {
          errors.push({ row, error: "Tipo inválido" });
          return;
        }

        promises.push(
          (async () => {
            const category_id = await repo.getCategoryIdByName(category);
            return {
              description,
              amount,
              category,
              date,
              type,
              category_id,
            };
          })(),
        );
      })
      .on("end", async () => {
        try {
          const results = await Promise.all(promises);

          for (const transaction of results) {
            await repo.create(transaction, userId);
          }

          res.json({
            imported: results.length,
            errors,
          });
        } catch (err) {
          res.status(500).json({ error: "Erro ao processar CSV" });
        }
      });
  } catch (err) {
    res.status(500).json({ error: "Erro ao importar CSV" });
  }
}

async function exportTransactions(req, res) {
  try {
    const userId = req.user.id;
    const transactions = await repo.getAll(userId);
    const fields = ["description", "amount", "type", "category", "date"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Erro ao exportar CSV" });
  }
}

module.exports = {
  importTransactions,
  exportTransactions,
};
