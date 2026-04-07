const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.redirect('/');
    }
};
router.use(checkAdmin);

router.get('/',adminController.getDashboard);
router.get('/supermarkets',adminController.getSupermarkets);
router.post('/supermarkets/:id/approve',adminController.approveSupermarket);
router.post('/supermarkets/:id/reject',adminController.rejectSupermarket);
router.get('/users',adminController.getUsers);
router.post('/users/:id/toggle',adminController.toggleUser);
module.exports = router;