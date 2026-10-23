const db = require('../db');

async function getAvailableCategories(userId) {
  return await db('categories')
    .select('id', 'name', 'user_id')
    .where((query) => {
      query.whereNull('user_id').orWhere('user_id', userId);
    })
    .orderBy('name', 'asc');
}

async function getAvailableCategoryById(categoryId, userId) {
  return await db('categories')
    .select('id', 'name', 'user_id')
    .where('id', categoryId)
    .andWhere((query) => {
      query.whereNull('user_id').orWhere('user_id', userId);
    })
    .first();
}

async function getAvailableCategoryByName(name, userId) {
  return await db('categories')
    .whereRaw('LOWER(TRIM(name)) = LOWER(TRIM(?))', [name])
    .andWhere((query) => {
      query.whereNull('user_id').orWhere('user_id', userId);
    })
    .first();
}

async function createCategory(name, userId) {
  const [category] = await db('categories')
    .insert({
      name: name.trim(),
      user_id: userId,
    })
    .returning(['id', 'name', 'user_id']);

  return category;
}

async function updateCategory(categoryId, userId, name) {
  const [updated] = await db('categories')
    .where({
      id: categoryId,
      user_id: userId,
    })
    .update({
      name: name.trim(),
    })
    .returning(['id', 'name', 'user_id']);

  return updated;
}

async function deleteCategory(categoryId, userId) {
  return await db.transaction(async (trx) => {
    // Busca somente uma categoria particular do usuário.
    const category = await trx('categories')
      .where({
        id: categoryId,
        user_id: userId,
      })
      .first();

    if (!category) {
      return { notFound: true };
    }

    // Impede a exclusão da categoria de destino.
    if (category.name.trim().toLowerCase() === 'outros') {
      return { isDefault: true };
    }

    // Localiza a categoria global de destino.
    const otherCategory = await trx('categories')
      .whereNull('user_id')
      .whereRaw('LOWER(TRIM(name)) = ?', ['outros'])
      .first();

    if (!otherCategory) {
      throw new Error('A categoria global "Outros" não foi encontrada');
    }

    // Reclassifica as transações antes de excluir a categoria.
    await trx('transactions').where('category_id', category.id).update({
      category_id: otherCategory.id,
      category: otherCategory.name,
    });

    // Exclui a categoria particular.
    await trx('categories')
      .where({
        id: category.id,
        user_id: userId,
      })
      .del();

    return { deleted: true };
  });
}

module.exports = {
  getAvailableCategories,
  getAvailableCategoryById,
  getAvailableCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
