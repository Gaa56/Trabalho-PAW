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
        // Frutas e Legumes (cats[0])
        { name: 'Maçã', description: 'Maçã nacional Kg', category: cats[0]._id, price: 1.99, stock: 100, supermarket: super1._id },
        { name: 'Banana', description: 'Banana nacional Kg', category: cats[0]._id, price: 1.49, stock: 80, supermarket: super1._id },
        { name: 'Maçã', description: 'Maçã nacional Kg', category: cats[0]._id, price: 2.29, stock: 60, supermarket: super2._id, image: '/images/products/Pingo Doce/maça.png' },
        { name: 'Banana', description: 'Banana nacional Kg', category: cats[0]._id, price: 1.29, stock: 90, supermarket: super2._id, image: '/images/products/Pingo Doce/banana.png' },

        // Carne (cats[1])
        { name: 'Frango Inteiro', description: 'Frango inteiro Kg', category: cats[1]._id, price: 3.99, stock: 50, supermarket: super1._id },
        { name: 'Carne Picada', description: 'Carne picada bovino Kg', category: cats[1]._id, price: 5.49, stock: 40, supermarket: super1._id },
        { name: 'Frango Inteiro', description: 'Frango inteiro Kg', category: cats[1]._id, price: 4.29, stock: 45, supermarket: super2._id, image: '/images/products/Pingo Doce/frango.png' },
        { name: 'Carne Picada', description: 'Carne picada bovino Kg', category: cats[1]._id, price: 4.99, stock: 35, supermarket: super2._id, image: '/images/products/Pingo Doce/carnePicada.png' },

        // Peixe (cats[2])
        { name: 'Salmão', description: 'Salmão fresco Kg', category: cats[2]._id, price: 9.99, stock: 30, supermarket: super1._id },
        { name: 'Bacalhau', description: 'Bacalhau seco Kg', category: cats[2]._id, price: 12.99, stock: 25, supermarket: super1._id },
        { name: 'Salmão', description: 'Salmão fresco Kg', category: cats[2]._id, price: 10.49, stock: 20, supermarket: super2._id, image: '/images/products/Pingo Doce/salmao.png' },
        { name: 'Bacalhau', description: 'Bacalhau seco Kg', category: cats[2]._id, price: 11.99, stock: 30, supermarket: super2._id, image: '/images/products/Pingo Doce/bacalhau.png' },

        // Laticínios (cats[3])
        { name: 'Leite', description: 'Leite meio-gordo 1L', category: cats[3]._id, price: 0.89, stock: 200, supermarket: super1._id },
        { name: 'Iogurte Natural', description: 'Iogurte natural 4x125g', category: cats[3]._id, price: 1.29, stock: 80, supermarket: super1._id },
        { name: 'Leite', description: 'Leite meio-gordo 1L', category: cats[3]._id, price: 0.95, stock: 150, supermarket: super2._id, image: '/images/products/Pingo Doce/leite.png' },
        { name: 'Iogurte Natural', description: 'Iogurte natural 4x125g', category: cats[3]._id, price: 1.19, stock: 90, supermarket: super2._id, image: '/images/products/Pingo Doce/iogurteNatural.png' },

        // Padaria (cats[4])
        { name: 'Pão de Forma', description: 'Pão de forma integral', category: cats[4]._id, price: 1.59, stock: 60, supermarket: super1._id },
        { name: 'Croissant', description: 'Croissant manteiga', category: cats[4]._id, price: 0.69, stock: 80, supermarket: super1._id },
        { name: 'Pão de Forma', description: 'Pão de forma integral', category: cats[4]._id, price: 1.39, stock: 70, supermarket: super2._id, image: '/images/products/Pingo Doce/paoForma.png' },
        { name: 'Croissant', description: 'Croissant manteiga', category: cats[4]._id, price: 0.79, stock: 60, supermarket: super2._id, image: '/images/products/Pingo Doce/croissant.png' },

        // Bebidas (cats[5])
        { name: 'Coca Cola', description: 'Coca Cola 1.5L', category: cats[5]._id, price: 1.79, stock: 100, supermarket: super1._id },
        { name: 'Água', description: 'Água mineral 1.5L', category: cats[5]._id, price: 0.39, stock: 200, supermarket: super1._id },
        { name: 'Coca Cola', description: 'Coca Cola 1.5L', category: cats[5]._id, price: 1.89, stock: 90, supermarket: super2._id, image: '/images/products/Pingo Doce/cocacola.png' },
        { name: 'Água', description: 'Água mineral 1.5L', category: cats[5]._id, price: 0.29, stock: 180, supermarket: super2._id, image: '/images/products/Pingo Doce/agua.png' },

        // Congelados (cats[6])
        { name: 'Pizza Congelada', description: 'Pizza margherita', category: cats[6]._id, price: 2.99, stock: 40, supermarket: super1._id },
        { name: 'Gelado Baunilha', description: 'Gelado baunilha 1L', category: cats[6]._id, price: 3.49, stock: 35, supermarket: super1._id },
        { name: 'Pizza Congelada', description: 'Pizza margherita', category: cats[6]._id, price: 3.29, stock: 30, supermarket: super2._id, image: '/images/products/Pingo Doce/pizza.png' },
        { name: 'Gelado Baunilha', description: 'Gelado baunilha 1L', category: cats[6]._id, price: 3.19, stock: 40, supermarket: super2._id, image: '/images/products/Pingo Doce/geladoBaunilha.png' },

        // Mercearia (cats[7])
        { name: 'Arroz', description: 'Arroz agulha 1Kg', category: cats[7]._id, price: 1.29, stock: 100, supermarket: super1._id },
        { name: 'Massa Esparguete', description: 'Esparguete 500g', category: cats[7]._id, price: 0.89, stock: 120, supermarket: super1._id },
        { name: 'Arroz', description: 'Arroz agulha 1Kg', category: cats[7]._id, price: 1.49, stock: 80, supermarket: super2._id, image: '/images/products/Pingo Doce/arroz.png' },
        { name: 'Massa Esparguete', description: 'Esparguete 500g', category: cats[7]._id, price: 0.79, stock: 100, supermarket: super2._id, image: '/images/products/Pingo Doce/massaEsparguete.png' },

        // Higiene (cats[8])
        { name: 'Champô', description: 'Champô cabelo normal', category: cats[8]._id, price: 2.49, stock: 60, supermarket: super1._id },
        { name: 'Pasta de Dentes', description: 'Pasta dentífrica 75ml', category: cats[8]._id, price: 1.99, stock: 80, supermarket: super1._id },
        { name: 'Champô', description: 'Champô cabelo normal', category: cats[8]._id, price: 2.29, stock: 50, supermarket: super2._id, image: '/images/products/Pingo Doce/shampoo.png' },
        { name: 'Pasta de Dentes', description: 'Pasta dentífrica 75ml', category: cats[8]._id, price: 2.19, stock: 70, supermarket: super2._id, image: '/images/products/Pingo Doce/pastaDentes.png' },

        // Limpeza (cats[9])
        { name: 'Detergente', description: 'Detergente da loiça 1L', category: cats[9]._id, price: 1.49, stock: 70, supermarket: super1._id },
        { name: 'Lixívia', description: 'Lixívia 2L', category: cats[9]._id, price: 1.99, stock: 50, supermarket: super1._id },
        { name: 'Detergente', description: 'Detergente da loiça 1L', category: cats[9]._id, price: 1.69, stock: 60, supermarket: super2._id, image: '/images/products/Pingo Doce/detergente.png' },
        { name: 'Lixívia', description: 'Lixívia 2L', category: cats[9]._id, price: 1.79, stock: 55, supermarket: super2._id, image: '/images/products/Pingo Doce/lixiviaPingo.png' },
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