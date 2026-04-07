const User = require('../models/User');
const Supermarket = require('../models/Supermarket');
const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSupermarkets = await Supermarket.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingApprovals = await Supermarket.countDocuments({ isApproved: false });

     res.render('admin/dashboard', {
            user: req.session.user,
            totalUsers,
            totalSupermarkets,
            totalOrders,
            pendingApprovals
        });
    } catch (err) {
        res.status(500).send('Erro no dashboard do admin');
    }
};

exports.getSupermarkets = async (req, res) => {
    try {
        const supermarkets = await Supermarket.find().populate('owner', 'name email');
        res.render('admin/supermarkets', {
            user: req.session.user,
            supermarkets
        });
    } catch (err) {
        res.status(500).send('Erro ao listar supermercados');
    }
};

exports.approveSupermarket = async (req, res) => {
    await Supermarket.findByIdAndUpdate(req.params.id, { isApproved: true, isActive: true });
    res.redirect('/admin/supermarkets');
};
exports.rejectSupermarket = async (req, res) => {
    await Supermarket.findByIdAndUpdate(req.params.id, { isApproved: false, isActive: false });
    res.redirect('/admin/supermarkets');
};
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin/users', { user: req.session.user, users });
    } catch (err) {
        res.status(500).send('Erro ao listar utilizadores');
    }
};
exports.toggleUser = async (req, res) => {
    const u = await User.findById(req.params.id);
    u.isActive = !u.isActive;
    await u.save();
    res.redirect('/admin/users');
};