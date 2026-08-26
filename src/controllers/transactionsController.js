const repo = require("../repositories/transactionsRepository");
const {
  isValidDate,
  invalidPayloadResponse,
  isValidType,
} = require("../utils/errorHandler");

// Buscar todas
async function getTransactions(req, res) {
  try {
    const transactions = await repo.getAll(req.user.id);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao buscar transações: ${err.message}`,
    });
  }
}

// Buscar por ID
async function getTransactionById(req, res) {
  try {
    const transaction = await repo.getById(req.params.id, req.user.id);

    if (!transaction) {
      return res.status(404).json({
        error: "Transação não encontrada",
      });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao buscar transação: ${err.message}`,
    });
  }
}

// Buscar por categoria
async function getTransactionsByCategory(req, res) {
  try {
    const category = req.query.category;

    if (!category) {
      return res.status(400).json({
        error: "Categoria não informada",
      });
    }

    const filtered = await repo.getByCategory(category, req.user.id);

    if (filtered.length === 0) {
      return res.status(404).json({
        error: "Nenhuma transação encontrada nesta categoria",
      });
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao buscar transações: ${err.message}`,
    });
  }
}

// Buscar por tipo
async function getTransactionsByType(req, res) {
  try {
    const type = req.query.type;

    if (!isValidType(type)) {
      return res.status(400).json({
        error: "Tipo inválido. Use 'entrada' ou 'saida'",
      });
    }

    const filtered = await repo.getByType(type, req.user.id);

    if (filtered.length === 0) {
      return res.status(404).json({
        error: "Nenhuma transação encontrada deste tipo",
      });
    }

    res.json(filtered);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao buscar transações: ${err.message}`,
    });
  }
}

// Criar
async function createTransaction(req, res) {
  try {
    const { amount, description, date, category, type } = req.body;
    const errors = [];

    if (!amount || !description || !date || !category || !type) {
      errors.push({
        fields: "Campos obrigatórios ausentes",
      });
    }

    if (!isValidDate(date)) {
      errors.push({
        date: "Data inválida",
      });
    }

    if (!isValidType(type)) {
      errors.push({
        type: "Entrada ou saída inválida",
      });
    }

    if (errors.length > 0) {
      return invalidPayloadResponse(res, errors);
    }

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
      req.user.id,
    );

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao criar transação: ${err.message}`,
    });
  }
}

// Atualizar
async function updateTransaction(req, res) {
  try {
    const { description, amount, category, date, type } = req.body;
    const errors = [];

    if (!description || !amount || !category || !date || !type) {
      errors.push({
        fields: "Campos obrigatórios ausentes",
      });
    }

    if (!isValidDate(date)) {
      errors.push({
        date: "Data inválida",
      });
    }

    if (!isValidType(type)) {
      errors.push({
        type: "Entrada ou saída inválida",
      });
    }

    if (errors.length > 0) {
      return invalidPayloadResponse(res, errors);
    }

    const exists = await repo.getById(req.params.id, req.user.id);

    if (!exists) {
      return res.status(404).json({
        error: "Transação não encontrada",
      });
    }

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
      req.user.id,
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao atualizar transação: ${err.message}`,
    });
  }
}

// Atualizar parcialmente
async function patchTransaction(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).json({
        error: "Payload inválido",
      });
    }

    if (data.date && !isValidDate(data.date)) {
      return res.status(400).json({
        error: "Data inválida",
      });
    }

    if (data.type && !isValidType(data.type)) {
      return res.status(400).json({
        error: "Entrada ou saída inválida",
      });
    }

    const exists = await repo.getById(req.params.id, req.user.id);

    if (!exists) {
      return res.status(404).json({
        error: "Transação não encontrada",
      });
    }

    const updateData = { ...data };

    if (data.category) {
      updateData.category_id = await repo.getCategoryIdByName(data.category);
    }

    const updated = await repo.patch(req.params.id, updateData, req.user.id);

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: `Erro ao atualizar parcialmente a transação: ${err.message}`,
    });
  }
}

// Deletar
async function deleteTransaction(req, res) {
  try {
    const deleted = await repo.remove(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Transação não encontrada",
      });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      error: `Erro ao deletar transação: ${err.message}`,
    });
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionsByCategory,
  getTransactionsByType,
  createTransaction,
  updateTransaction,
  patchTransaction,
  deleteTransaction,
};
