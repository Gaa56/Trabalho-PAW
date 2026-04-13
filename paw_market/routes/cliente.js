var express = require('express');
var router = express.Router();
var clienteController = require('../controllers/clienteController');

//Verificar se é cliente
function isCliente(req, res, next) {
    if (!req.session.user || req.session.user.role !== 'cliente') {
        return res.redirect('/login');
    }
    next();
}

// Aplicar middleware a todas as rotas deste ficheiro
router.use(isCliente);

// Dashboard
router.get('/', clienteController.getDashboard);

// Produtos (pesquisa, filtro, ordenação)
router.get('/products', clienteController.getProducts);

// Comparação de preços
router.get('/compare', clienteController.compareProduct);

// Carrinho
router.get('/cart', clienteController.getCart);
router.post('/cart/add', clienteController.addToCart);
router.post('/cart/update', clienteController.updateCart);
router.get('/cart/remove/:productId', clienteController.removeFromCart);

// Checkout (finalizar encomenda)
router.get('/checkout', clienteController.getCheckout);
router.post('/checkout', clienteController.postCheckout);

// Encomendas (histórico)
router.get('/orders', clienteController.getOrders);
router.get('/orders/:id', clienteController.getOrderDetail);
router.post('/orders/:id/cancel', clienteController.cancelOrder);

// Perfil
router.get('/profile', clienteController.getProfile);
router.post('/profile', clienteController.postProfile);

module.exports = router;
