const repo = require('../repositories/transactionsRepository');
const categoriesRepo = require('../repositories/categoriesRepository');
const {
  isValidDate,
  invalidPayloadResponse,
  isValidType,
} = require('../utils/errorHandler');

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
        error: 'Transação não encontrada',
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
        error: 'Categoria não informada',
      });
    }

    const filtered = await repo.getByCategory(category, req.user.id);

    if (filtered.length === 0) {
      return res.status(404).json({
        error: 'Nenhuma transação encontrada nesta categoria',
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
        error: 'Nenhuma transação encontrada deste tipo',
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
    const { amount, description, date, category_id, type } = req.body;

    const errors = [];

    if (
      amount === undefined ||
      amount === null ||
      amount === '' ||
      !description?.trim() ||
      !date ||
      category_id === undefined ||
      category_id === null ||
      category_id === '' ||
      !type
    ) {
      errors.push({
        fields: 'Campos obrigatórios ausentes',
      });
    }

    if (!isValidDate(date)) {
      errors.push({
        date: 'Data inválida',
      });
    }

    if (!isValidType(type)) {
      errors.push({
        type: 'Entrada ou saída inválida',
      });
    }

    const parsedCategoryId = Number(category_id);

    if (
      category_id !== undefined &&
      category_id !== null &&
      category_id !== '' &&
      (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0)
    ) {
      errors.push({
        category_id: 'ID de categoria inválido',
      });
    }

    if (errors.length > 0) {
      return invalidPayloadResponse(res, errors);
    }

    const category = await categoriesRepo.getAvailableCategoryById(
      parsedCategoryId,
      req.user.id,
    );

    if (!category) {
      return res.status(400).json({
        error: 'Categoria inválida ou indisponível para este usuário',
      });
    }

    const created = await repo.create(
      {
        amount,
        description: description.trim(),
        date,
        category: category.name,
        category_id: category.id,
        type,
      },
      req.user.id,
    );

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({
      error: `Erro ao criar transação: ${err.message}`,
    });
  }
}

// Atualizar parcialmente

async function patchTransaction(req, res) {
  try {
    const data = req.body;

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return res.status(400).json({
        error: 'Payload inválido',
      });
    }

    const allowedFields = [
      'description',
      'amount',
      'category_id',
      'date',
      'type',
    ];

    const receivedFields = Object.keys(data);
    const invalidFields = receivedFields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: 'Campos não permitidos',
        fields: invalidFields,
      });
    }

    if (receivedFields.length === 0) {
      return res.status(400).json({
        error: 'Informe ao menos um campo para atualizar',
      });
    }

    const exists = await repo.getById(req.params.id, req.user.id);

    if (!exists) {
      return res.status(404).json({
        error: 'Transação não encontrada',
      });
    }

    const updateData = {};

    if (Object.hasOwn(data, 'description')) {
      if (typeof data.description !== 'string' || !data.description.trim()) {
        return res.status(400).json({
          error: 'A descrição é obrigatória',
        });
      }

      updateData.description = data.description.trim();
    }

    if (Object.hasOwn(data, 'amount')) {
      const amount = Number(data.amount);

      if (
        data.amount === '' ||
        data.amount === null ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {
        return res.status(400).json({
          error: 'O valor deve ser um número maior que zero',
        });
      }

      updateData.amount = amount;
    }

    if (Object.hasOwn(data, 'date')) {
      if (!isValidDate(data.date)) {
        return res.status(400).json({
          error: 'Data inválida',
        });
      }

      updateData.date = data.date;
    }

    if (Object.hasOwn(data, 'type')) {
      if (!isValidType(data.type)) {
        return res.status(400).json({
          error: 'Entrada ou saída inválida',
        });
      }

      updateData.type = data.type;
    }

    if (Object.hasOwn(data, 'category_id')) {
      const categoryId = Number(data.category_id);

      if (
        data.category_id === '' ||
        data.category_id === null ||
        !Number.isInteger(categoryId) ||
        categoryId <= 0
      ) {
        return res.status(400).json({
          error: 'ID de categoria inválido',
        });
      }

      const category = await categoriesRepo.getAvailableCategoryById(
        categoryId,
        req.user.id,
      );

      if (!category) {
        return res.status(400).json({
          error: 'Categoria inválida ou indisponível para este usuário',
        });
      }

      updateData.category_id = category.id;
      updateData.category = category.name;
    }

    const updated = await repo.patch(req.params.id, updateData, req.user.id);

    if (!updated) {
      return res.status(404).json({
        error: 'Transação não encontrada',
      });
    }

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({
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
        error: 'Transação não encontrada',
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
  patchTransaction,
  deleteTransaction,
};
