//Responsavel por permitir a comunicação da app com o mongoDb
const mongoose = require('mongoose');
//Molde para o mongoDb
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome do produto é obrigatório'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'A categoria é obrigatória']
    },
    price: {
        type: Number,
        required: [true, 'O preço é obrigatório'],
        min: [0, 'O preço não pode ser negativo']
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: [true, 'O stock é obrigatório'],
        min: [0, 'O stock não pode ser negativo'],
        default: 0
    },
    supermarket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supermarket',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//Index para pesquisa
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);