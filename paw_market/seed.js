require('dotenv').config();

const mongoose = require('mongoose');

const User = require('./models/User');
const Category = require('./models/Category');
const Supermarket = require('./models/Supermarket');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function seed() {
    await mongoose.connect(process.env.Mongo_URI);


    console.log('MongoDB ligado para seed...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Supermarket.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Base de dados limpa.');

    const admin = await User.create({
        name: 'Admin',
        email: 'admin@supermarjethub.pt',
        password: 'admin123',
        phone: '900100100',
        address: 'Sede SuperMarket Hub, Porto',
        role: 'admin',
        nif: ''
    });
    console.log('Admin criado:', admin.email);

    const superUser1 = await User.create({
        name: 'Josef Schwarz',
        email: 'lidl@mercado.pt',
        password: 'lidl123',
        phone: '210207000',
        address: 'Rua Professor Joaquim Barros Leite, 4610-211, Felgueiras',
        role: 'supermercado',
        nif: ''
    });

    const superUser2 = await User.create({
        name: 'Jeronimo Martins',
        email: 'pingodoce@mercado.pt',
        password: 'pingo123',
        phone: '938875725',
        address: 'Rua D.Manuel Faria De Sousa, 4610-178, Felgueiras',
        role: 'supermercado',
        nif: ''
    });

    const cliente = await User.create({
        name: 'Maria Silva',
        email: 'maria@email.pt',
        password: '123456',
        phone: '912345678',
        address: 'Rua das Flores, 4050-262, Porto',
        role: 'cliente',
        nif: ''
    });

    const estafeta = await User.create({
        name: 'Carlos Santos',
        email: 'carlos@email.pt',
        password: '123456',
        phone: '911222333',
        address: 'Rua do Comercio, 8000-269, Faro',
        role: 'estafeta',
        nif: ''
    });
    console.log('Utilizadores criados.');

    const cats = await Category.create([
        { name: 'Frutas e Legumes', description: 'Frutas e Legumes frescos' },
        { name: 'Carne', description: 'Variadade de carnes' },
        { name: 'Peixe', description: 'Peixe fresco e congelado' },
        { name: 'Laticínios', description: 'Leite, queijo, iogurtes' },
        { name: 'Padaria', description: 'Pão, bolos, pastelaria' },
        { name: 'Bebidas', description: 'Refrigerantes, sumos, água' },
        { name: 'Congelados', description: 'Produtos congelados' },
        { name: 'Mercearia', description: 'Enlatados, massas, arroz' },
        { name: 'Higiene', description: 'Produtos de higiene pessoal' },
        { name: 'Limpeza', description: 'Produtos de limpeza' }
    ]);
    console.log('Categorias criadas.', cats.length);

    const super1 = await Supermarket.create({
        owner: superUser1._id,
        name: 'Lidl',
        description: 'Mais para si!',
        location: {
            address: 'Rua Professor Joaquim Barros Leite, 4610-211, Felgueiras',
            city: 'Felgueiras',
            postalCode: '4610-211',
        },
        phone: '210207000',
        isApproved: true,
        deliveryMethods: { pickup: true, courier: true },
        deliveryCost: 3.50
    });

    const super2 = await Supermarket.create({
        owner: superUser2._id,
        name: 'Pingo Doce',
        description: 'Sabe bem pagar tão pouco!',
        location: {
            address: 'Rua D.Manuel Faria De Sousa, 4610-178, Felgueiras',
            city: 'Felgueiras',
            postalCode: '4610-178',
        },
        phone: '938875725',
        isApproved: true,
        deliveryMethods: { pickup: true, courier: true },
        deliveryCost: 4.50
    });
    console.log('Supermercados criados');

    await Product.create([
        {
            name: 'Maçã Royal', description: 'Maçã nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Banana', description: 'Banana nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Laranja', description: 'Laranja nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Pera', description: 'Pera nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Uva', description: 'Uva nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Manga', description: 'Manga nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Abacaxi', description: 'Abacaxi nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Melancia', description: 'Melancia nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Melão', description: 'Melão nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },
        {
            name: 'Morango', description: 'Morango nacional Kg', category: cats[0]._id,
            price: 1.99, stock: 100, supermarket: super1._id
        },


        {
            name: 'Detergente', description: 'Detergente da loiça', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Amaciador', description: 'Amaciador da roupa', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Lixivia', description: 'Lixivia da roupa', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Limpador', description: 'Limpador de vidros', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Desinfetante', description: 'Desinfetante de superfícies', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Esfregão', description: 'Esfregão da loiça', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Luvas', description: 'Luvas de borracha', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Panos', description: 'Panos de limpeza', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Esfregona', description: 'Esfregona de limpeza', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Balde', description: 'Balde de limpeza', category: cats[9]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Maria', description: 'Bolachas Maria', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Chocolate', description: 'Bolachas Chocolate', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Manteiga', description: 'Bolachas Manteiga', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Integrais', description: 'Bolachas Integrais', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Cereais', description: 'Bolachas Cereais', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Coco', description: 'Bolachas Coco', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Limão', description: 'Bolachas Limão', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Laranja', description: 'Bolachas Laranja', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Baunilha', description: 'Bolachas Baunilha', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Bolachas Canela', description: 'Bolachas Canela', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Coca Cola', description: 'Coca Cola', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Pepsi', description: 'Pepsi', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Fanta', description: 'Fanta', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sprite', description: 'Sprite', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumol', description: 'Sumol', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Compal', description: 'Compal', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Água', description: 'Água', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Laranja', description: 'Sumo de Laranja', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Maçã', description: 'Sumo de Maçã', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Uva', description: 'Sumo de Uva', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Pêssego', description: 'Sumo de Pêssego', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Manga', description: 'Sumo de Manga', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Abacaxi', description: 'Sumo de Abacaxi', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Melancia', description: 'Sumo de Melancia', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Melão', description: 'Sumo de Melão', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
        {
            name: 'Sumo de Morango', description: 'Sumo de Morango', category: cats[5]._id,
            price: 1.99, stock: 100, supermarket: super2._id
        },
    ]);

    console.log('Produtos criados');

    console.log('\n==== SEED CONCLUÍDO ===');
    console.log('Contas de teste:');
    console.log('Admin: admin@supermarjethub.pt | admin123');
    console.log('Cliente: maria@email.pt | 123456');
    console.log('Estafeta: carlos@email.pt | 123456');
    console.log('Supermercado Lidl: lidl@mercado.pt | lidl123');
    console.log('Supermercado Pingo Doce: pingodoce@mercado.pt | pingo123');

    await mongoose.disconnect();
    process.exit(0);

}

seed().catch(err => {
    console.error('Erro ao executar seed:', err);
    process.exit(1);
});