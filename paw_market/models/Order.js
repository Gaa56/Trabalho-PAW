const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    supermarket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceAtTime: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryMethod: {
        type: String,
        enum: ['pickup', 'courier'],
        required: true
    },
    deliveryCost: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['pendente', 'confirmada', 'em preparação', 'em entrega', 'entregue', 'cancelada'],
        default: 'pendente'
    },
    type: {
        type: String,
        enum: ['online', 'pos'],
        default: 'online'
    },
    courier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    confirmedAt: {
        type: Date,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ''
    },
    clientNif: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);