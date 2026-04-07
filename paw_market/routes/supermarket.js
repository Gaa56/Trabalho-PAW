const express = require('express');
const router = express.Router();
const supermarketController = require('../controllers/supermarketController');

// Middleware para proteger a rota a apenas "supermarket"
const checkSupermarket = (req, res, next) => {
   if (req.session.user && req.session.user.role === 'supermercado') return next();
    res.redirect('/');
};

router.use(checkSupermarket);

// Dashboard e Perfil
router.get('/', supermarketController.getDashboard);
router.get('/profile', supermarketController.getProfile);
router.post('/profile', supermarketController.postProfile);

// Produtos
router.get('/products', supermarketController.getProducts);
router.get('/products/new', supermarketController.getNewProduct);
router.post('/products/new', supermarketController.postNewProduct);

// Ponto de Venda (POS)
router.get('/pos', supermarketController.getPOS);
router.post('/pos', supermarketController.postPOS);


module.exports = router;
