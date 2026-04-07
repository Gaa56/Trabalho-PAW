const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
    try {
        const totalDeliveries = await Order.countDocuments({
            courier: req.session.user.id,
            status: 'entregue'
        });
        res.render('estafeta/dashboard', {
            user: req.session.user,
            totalDeliveries
        });
    } catch (err) {
        res.status(500).send('Erro no dashboard');
    }
};

exports.getDeliveries = async (req, res) => {
    try {
        const available = await Order.find({
            deliveryMethod: 'courier',
            courier: null,
            status: 'confirmada'
        }).populate('supermarket', 'name').populate('customer', 'name');

        const myActive = await Order.findOne({
            courier: req.session.user.id,
            status: { $in: ['em preparação', 'em entrega'] }
        }).populate('supermarket', 'name').populate('customer', 'name');

        res.render('estafeta/deliveries', {
            user: req.session.user,
            available,
            myActive
        });
    } catch (err) {
        res.status(500).send('Erro ao listar entregas');
    }
};

exports.acceptDelivery = async (req, res) => {
    try {
        // Regra: só 1 entrega de cada vez
        const activeDelivery = await Order.findOne({
            courier: req.session.user.id,
            status: { $in: ['em preparação', 'em entrega'] }
        });
        if (activeDelivery) {
            return res.redirect('/estafeta/deliveries?erro=ja_tens_entrega_ativa');
        }
        await Order.findByIdAndUpdate(req.params.id, {
            courier: req.session.user.id,
            status: 'em preparação'
        });
        res.redirect('/estafeta/deliveries');
    } catch (err) {
        res.status(500).send('Erro ao aceitar entrega');
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'entregue') update.deliveredAt = new Date();
        await Order.findOneAndUpdate(
            { _id: req.params.id, courier: req.session.user.id },
            update
        );
        res.redirect('/estafeta/deliveries');
    } catch (err) {
        res.status(500).send('Erro ao atualizar estado');
    }
};
