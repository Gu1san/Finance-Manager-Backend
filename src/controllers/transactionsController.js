let db = require("../data/transactions");
const {
  isValidDate,
  invalidPayloadResponse,
} = require("../utils/errorHandler");

function getTransactions(req, res) {
  res.json(db);
}

// Buscar transação por ID
function getTransactionById(req, res) {
  const transaction = db.find((t) => t.id == req.params.id);
  if (!transaction)
    return res.status(404).json({ error: "Transação não encontrada" });
  res.json(transaction);
}

// Buscar transações por categoria
function getTransactionsByCategory(req, res) {
  const filtered = db.filter((t) => t.category === req.query.category);
  if (!filtered.length)
    return res
      .status(404)
      .json({ error: "Nenhuma transação encontrada nesta categoria" });
  res.json(filtered);
}

function createTransaction(req, res) {
  const { amount, description, date, category } = req.body;
  const errors = [];

  if (!amount || !description || !date || !category) {
    errors.push({ fields: "Campos obrigatórios ausentes" });
  }
  if (!isValidDate(date)) {
    errors.push({ date: "Data da transação inválida" });
  }
  if (errors.length > 0) return invalidPayloadResponse(res, errors);

  try {
    const newTransaction = {
      id: db.length + 1,
      amount,
      description,
      date,
      category,
    };
    db.push(newTransaction);
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar transação" });
  }
}

// Atualizar transação (PUT)
function updateTransaction(req, res) {
  const errors = [];
  const { id, description, amount, category, date } = req.body;

  if (id && id != req.params.id) {
    errors.push({ id: "Não é permitido alterar o ID da transação" });
  }
  if (!description || !amount || !category || !date) {
    errors.push({ fields: "Campos obrigatórios ausentes" });
  }
  if (!isValidDate(date)) {
    errors.push({ date: "Data inválida" });
  }
  if (errors.length > 0) return invalidPayloadResponse(res, errors);

  try {
    let transaction = db.find((t) => t.id == req.params.id);
    if (!transaction)
      return res.status(404).json({ error: "Transação não encontrada" });

    transaction.description = description;
    transaction.amount = amount;
    transaction.category = category;
    transaction.date = date;

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar transação" });
  }
}

// Atualização parcial (PATCH)
function patchTransaction(req, res) {
  const errors = [];
  const data = req.body;

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.keys(data).length === 0
  ) {
    return res.status(400).json({ error: "Payload inválido ou vazio" });
  }
  if ("id" in data) {
    errors.push({ id: "Não é permitido alterar o ID da transação" });
  }
  if (data.date && !isValidDate(data.date)) {
    errors.push({ date: "Data inválida" });
  }
  if (errors.length > 0) return res.status(400).json({ errors });

  let transaction = db.find((t) => t.id == req.params.id);
  if (!transaction)
    return res.status(404).json({ error: "Transação não encontrada" });

  Object.assign(transaction, data);

  res.json(transaction);
}

// Deletar transação
function deleteTransaction(req, res) {
  const exists = db.some((t) => t.id == req.params.id);
  if (!exists)
    return res.status(404).json({ error: "Transação não encontrada" });

  db = db.filter((t) => t.id != req.params.id);
  res.status(204).send();
}

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionsByCategory,
  createTransaction,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
};
