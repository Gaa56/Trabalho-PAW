//Responsavel por permitir a comunicação da app com o mongoDb
const mongoose = require('mongoose');

//Molde para o mongoDb
const userSchema = new mongoose.Schema({
    //Nome do utilizador
    name: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true
    },
    //Email
    email: {
        type: String,
        required: [true, 'O email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true
    },
    //Password
    password: {
        type: String,
        required: [true, 'A password é obrigatória'],
        //Mínimo 6 caracteres
        minlength: 6
    },
    //Telemovel
    phone: {
        type: String,
        required: [true, 'O telefone é obrigatório'],
        trim: true
    },
    //Morada
    address: {
        type: String,
        required: [true, 'A morada é obrigatória'],
        trim: true
    },
    //Função do utilizador
    role: {
        type: String,
        enum: ['cliente', 'supermercado', 'estafeta', 'admin'],
        default: 'cliente'
    },
    //Se o utilizador está ativo
    isActive: {
        type: Boolean,
        default: true
    },
    //Quando criou conta
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
