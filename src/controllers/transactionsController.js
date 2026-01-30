// controllers/transactionsController.js
const repo = require("../repositories/transactionsRepository");
const {
  isValidDate,
  invalidPayloadResponse,
  isValidType,
} = require("../utils/errorHandler");
const fs = require("fs");
const csv = require("csv-parser");

// Buscar todas
async function getTransactions(req, res) {
  try {
    const transactions = await repo.getAll(req.userId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: `Erro ao buscar transações: ${err}` });
  }
}

// Buscar por ID
async function getTransactionById(req, res) {
  try {
    const transaction = await repo.getById(req.params.id, req.userId);
    if (!transaction)
      return res.status(404).json({ error: "Transação não encontrada" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: `Erro ao buscar transação: ${err}` });
  }
}

// Buscar por categoria
async function getTransactionsByCategory(req, res) {
  try {
    const category = req.query.category;
    const filtered = await repo.getByCategory(category, req.userId);
    if (filtered.length === 0)
      return res
        .status(404)
        .json({ error: "Nenhuma transação encontrada nesta categoria" });
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: `Erro ao buscar transações: ${err}` });
  }
}

async function getTransactionsByType(req, res) {
  try {
    const type = req.query.type;
    if (!isValidType(type)) {
      return res
        .status(400)
        .json({ error: "Tipo inválido. Use 'entrada' ou 'saida'" });
    }
    const filtered = await repo.getByType(type, req.userId);
    if (filtered.length === 0) {
      return res
        .status(404)
        .json({ error: "Nenhuma transação encontrada deste tipo" });
    }
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: `Erro ao buscar transações: ${err}` });
  }
}

// Saldo
async function getBalance(req, res) {
  try {
    const balance = await repo.getBalance(req.userId);
    res.json({ balance });
  } catch (err) {
    res.status(500).json({ error: `Erro ao calcular saldo: ${err}` });
  }
}

// Saldo por categoria
async function getBalanceByCategory(req, res) {
  try {
    const balance = await repo.getBalanceByCategory(req.userId);
    res.json({ balance });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Erro ao calcular saldo por categoria: ${err}` });
  }
}

// Criar
async function createTransaction(req, res) {
  try {
    const { amount, description, date, category, type } = req.body;
    const errors = [];

    if (!amount || !description || !date || !category || !type) {
      errors.push({ fields: "Campos obrigatórios ausentes" });
    }
    if (!isValidDate(date)) errors.push({ date: "Data inválida" });
    if (!isValidType(type)) errors.push({ type: "Entrada ou saida inválida" });
    if (errors.length > 0) return invalidPayloadResponse(res, errors);

    const category_id = await repo.getCategoryIdByName(category);

    const created = await repo.create(
      {
        amount,
        description,
        date,
        category,
        type,
        category_id,
      },
      req.userId,
    );

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: `Erro ao criar transação: ${err}` });
  }
}

// Atualizar (PUT)
async function updateTransaction(req, res) {
  try {
    const { description, amount, category, date, type } = req.body;
    const errors = [];

    if (!description || !amount || !category || !date || !type) {
      errors.push({ fields: "Campos obrigatórios ausentes" });
    }
    if (!isValidDate(date)) errors.push({ date: "Data inválida" });
    if (!isValidType(type)) errors.push({ type: "Entrada ou saída inválida" });
    if (errors.length > 0) return invalidPayloadResponse(res, errors);

    const exists = await repo.getById(req.params.id, req.userId);
    if (!exists)
      return res.status(404).json({ error: "Transação não encontrada" });

    const category_id = await repo.getCategoryIdByName(category);

    const updated = await repo.update(
      req.params.id,
      {
        description,
        amount,
        category,
        date,
        type,
        category_id,
      },
      req.userId,
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: `Erro ao atualizar transação: ${err}` });
  }
}

// Atualizar parcialmente (PATCH)
async function patchTransaction(req, res) {
  try {
    const data = req.body;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({ error: "Payload inválido" });
    }

    if (data.date && !isValidDate(data.date)) {
      return res.status(400).json({ error: "Data inválida" });
    }
    if (data.type && !isValidType(data.type)) {
      return res.status(400).json({ error: "Entrada ou saída inválida" });
    }

    const exists = await repo.getById(req.params.id, req.userId);
    if (!exists)
      return res.status(404).json({ error: "Transação não encontrada" });

    let updateData = { ...data };
    if (data.category) {
      updateData.category_id = await repo.getCategoryIdByName(data.category);
    }

    const updated = await repo.patch(req.params.id, updateData, req.userId);
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Erro ao atualizar parcialmente transação: ${err}` });
  }
}

// Deletar
async function deleteTransaction(req, res) {
  try {
    const deleted = await repo.remove(req.params.id, req.userId);
    if (!deleted)
      return res.status(404).json({ error: "Transação não encontrada" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: `Erro ao deletar transação: ${err}` });
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionsByCategory,
  getTransactionsByType,
  getBalance,
  getBalanceByCategory,
  createTransaction,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
};
