const repo = require('../repositories/categoriesRepository');

async function getCategories(req, res) {
  console.log('get');
  try {
    const categories = await repo.getAvailableCategories(req.user.id);

    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({
      error: `Erro ao buscar categorias: ${err.message}`,
    });
  }
}

async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'O nome da categoria é obrigatório',
      });
    }

    const normalizedName = name.trim();

    const existingCategory = await repo.getAvailableCategoryByName(
      normalizedName,
      req.user.id,
    );

    if (existingCategory) {
      return res.status(409).json({
        error: 'Já existe uma categoria com esse nome',
      });
    }

    const category = await repo.createCategory(normalizedName, req.user.id);

    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({
      error: `Erro ao criar categoria: ${err.message}`,
    });
  }
}

async function updateCategory(req, res) {
  try {
    const categoryId = Number(req.params.id);
    const { name } = req.body;

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        error: 'ID de categoria inválido',
      });
    }

    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        error: 'O nome da categoria é obrigatório',
      });
    }

    const normalizedName = name.trim();

    const currentCategory = await repo.getAvailableCategoryById(
      categoryId,
      req.user.id,
    );

    if (!currentCategory || currentCategory.user_id !== req.user.id) {
      return res.status(404).json({
        error: 'Categoria não encontrada ou não pertence ao usuário',
      });
    }

    const existingCategory = await repo.getAvailableCategoryByName(
      normalizedName,
      req.user.id,
    );

    if (existingCategory && existingCategory.id !== categoryId) {
      return res.status(409).json({
        error: 'Já existe uma categoria com esse nome',
      });
    }

    const updated = await repo.updateCategory(
      categoryId,
      req.user.id,
      normalizedName,
    );

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({
      error: `Erro ao atualizar categoria: ${err.message}`,
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        error: 'ID de categoria inválido',
      });
    }

    const result = await repo.deleteCategory(categoryId, req.user.id);

    if (result.notFound) {
      return res.status(404).json({
        error: 'Categoria não encontrada ou não pode ser excluída',
      });
    }

    if (result.isDefault) {
      return res.status(400).json({
        error: 'A categoria Outros não pode ser excluída',
      });
    }

    return res.status(200).json({
      message: 'Categoria excluída com sucesso',
    });
  } catch (err) {
    return res.status(500).json({
      error: `Erro ao excluir categoria: ${err.message}`,
    });
  }
}

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
