const express = require('express');
const router = express.Router();
const estafetaController = require('../controllers/estafetaController');

const checkEstafeta = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'estafeta') return next();
    res.redirect('/');
};

router.use(checkEstafeta);

router.get('/', estafetaController.getDashboard);
router.get('/deliveries', estafetaController.getDeliveries);
router.post('/deliveries/:id/accept', estafetaController.acceptDelivery);
router.post('/deliveries/:id/status', estafetaController.updateStatus);

module.exports = router;
