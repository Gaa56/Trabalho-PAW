
//Responsavel por permitir a comunicação da app com o mongoDb
const mongoose = require('mongoose');

//O molde que vai definir como o documento vai ser guardado
const supermarketSchema = new mongoose.Schema({
    owner: {
        //ID do dono do supermercado
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        //Obrigatório
        required: true
    },
    name: {
        //Nome do supermercado
        type: String,
        //Obrigatório
        required: [true, 'O nome do supermercado é obrigatório'],
        //Retira os espaços em branco
        trim: true
    },
    description: {
        //Descrição do supermercado
        type: String,
        //Retira os espaços em branco
        trim: true,
        //Valor padrão
        default: ''
    },
    location: {

        address: {
            type: String,
            //Obrigatório
            required: [true, 'A morada é obrigatória']
        },

        city: {
            type: String,
            default: ''
        },
        postalCode: {
            type: String,
            default: ''
        }
    },
    //Telefone
    phone: {
        type: String,
        default: ''
    },
    //Horarios
    openingHours: {
        monday: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' }, closed: { type: Boolean, default: false } },
        tuesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' }, closed: { type: Boolean, default: false } },
        wednesday: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' }, closed: { type: Boolean, default: false } },
        thursday: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' }, closed: { type: Boolean, default: false } },
        friday: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' }, closed: { type: Boolean, default: false } },
        saturday: { open: { type: String, default: '09:00' }, close: { type: String, default: '18:00' }, closed: { type: Boolean, default: false } },
        sunday: { open: { type: String, default: '09:00' }, close: { type: String, default: '13:00' }, closed: { type: Boolean, default: true } }
    },
    //Metodos de entrega
    deliveryMethods: {
        pickup: { type: Boolean, default: true },
        courier: { type: Boolean, default: false }
    },
    //Custo de entrega
    deliveryCost: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        type: String,
        default: ''
    },
    isApproved: {
        type: Boolean,
        default: false
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

//Transforma o molde num modelo
//Neste caso o mongoDn vai criar uma coleção chamada supermarkets
module.exports = mongoose.model('Supermarket', supermarketSchema);

