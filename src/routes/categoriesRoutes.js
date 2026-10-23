const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categoriesController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.use(ensureAuthenticated);

router.get('/', categoriesController.getCategories);
router.post('/', categoriesController.createCategory);
router.put('/:id', categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;
