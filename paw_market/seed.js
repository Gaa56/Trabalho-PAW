require('dotenv').config();

const mongoose = require('mongoose');

const User = require('./models/User');
const Category = require('./models/Category');
const Supermarket = require('./models/Supermarket');
const Product = require('./models/Product');
const Order = require('./models/Order');

async function seed(){
    await mongoose.connect(process.env.Mongo_URI);
    console.log('MongoDB ligado para seed...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Supermarket.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Base de dados limpa.');

    const admin = await User.create({
        name:'Admin',
        email:'admin@supermarjethub.pt',
        password:'admin123',
        phone:'912345678',
        address:'Sede SuperMarket Hub, Lisboa',
        role:'admin'
    });
    console.log('Admin criado:', admin.email);
    
    const superUser1 = await User.create({
        name:'Sara Silva',
        email:'sara@mercado.pt',
        password:'123456',
        phone:'912345678',
        address:'Rua da Padaria, 123, Lisboa',
        role:'supermarket'
    });

    const superUser2 = await User.create({
        name:'Pedro Silva',
        email:'pedro@mercado.pt',
        password:'123456',
        phone:'912345678',
        address:'Rua da Padaria, 123, Lisboa',
        role:'supermarket'
    });

    const cliente = await User.create({
        name:'Maria Silva',
        email:'maria@email.pt',
        password:'123456',
        phone:'912345678',
        address:'Rua da Padaria, 123, Lisboa',
        role:'client'
    });

    const estafeta = await User.create({
        name:'Carlos Santos',
        email:'carlos@email.pt',
        password:'123456',
        phone:'912345678',
        address:'Rua da Padaria, 123, Lisboa',
        role:'estafeta'
    });
    console.log('Utilizadores criados.');

    const cats = await Category.create([
        {name:'Frutas e Legumes', description:'Frutas e Legumes frescos'},
        {name:'Carne', description:'Variadade de carnes'},
        {name:'Peixe', description:'Peixe fresco e congelado'},
        {name:'Laticínios', description:'Leite, queijo, iogurtes'},
        {name:'Padaria', description:'Pão, bolos, pastelaria'},
        {name:'Bebidas', description:'Refrigerantes, sumos, água'},
        {name:'Congelados', description:'Produtos congelados'},
        {name:'Mercearia', description:'Enlatados, massas, arroz'},
        {name:'Higiene', description:'Produtos de higiene pessoal'},
        {name:'Limpeza', description:'Produtos de limpeza'}
    ]);
    console.log('Categorias criadas.', cats.length);

    const super1 = await Supermarket.create({
        owner: superUser1._id,
        name:'Frutaaria da Sara',
        description:'Frutas e Legumes frescos',
        location:{
            address:'Rua da Padaria, 123, Lisboa',
            city:'Lisboa',
            postalCode:'1234-567',
        },
        phone:'912345678',
        isApproved:true,
        deliveryMethods:{pickup: true, delivery: true},
        deliveryCost:3.50
    });

    const super2 = await Supermarket.create({
        owner: superUser2._id,
        name:'Loja do Pedro',
        description:'A qui tens tudo só não tens um pero',
        location:{
            address:'Rua da Padaria, 123, Lisboa',
            city:'Lisboa',
            postalCode:'1234-567',
        },
        phone:'912345678',
        isApproved:true,
        deliveryMethods:{pickup: true, delivery: true},
        deliveryCost:4.50
    });
    console.log('Supermercados criados');

    await Product.create([
    {name:'Maçã Royal', decription: 'Maçã nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Banana', decription: 'Banana nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Laranja', decription: 'Laranja nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Pera', decription: 'Pera nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Uva', decription: 'Uva nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Manga', decription: 'Manga nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Abacaxi', decription: 'Abacaxi nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Melancia', decription: 'Melancia nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Melão', decription: 'Melão nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},
    {name:'Morango', decription: 'Morango nacional Kg',category:cats[0]._id,
        price:1.99, stock:100,supermarket:super1._id},


    {name:'Detergente', decription: 'Detergente da loiça',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Amaciador', decription: 'Amaciador da roupa',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Lixivia', decription: 'Lixivia da roupa',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Limpador', decription: 'Limpador de vidros',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Desinfetante', decription: 'Desinfetante de superfícies',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Esfregão', decription: 'Esfregão da loiça',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Luvas', decription: 'Luvas de borracha',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Panos', decription: 'Panos de limpeza',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Esfregona', decription: 'Esfregona de limpeza',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Balde', decription: 'Balde de limpeza',category:cats[9]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Maria', decription: 'Bolachas Maria',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Chocolate', decription: 'Bolachas Chocolate',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Manteiga', decription: 'Bolachas Manteiga',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Integrais', decription: 'Bolachas Integrais',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Cereais', decription: 'Bolachas Cereais',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Coco', decription: 'Bolachas Coco',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Limão', decription: 'Bolachas Limão',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Laranja', decription: 'Bolachas Laranja',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Baunilha', decription: 'Bolachas Baunilha',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Bolachas Canela', decription: 'Bolachas Canela',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Coca Cola', decription: 'Coca Cola',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Pepsi', decription: 'Pepsi',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Fanta', decription: 'Fanta',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sprite', decription: 'Sprite',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumol', decription: 'Sumol',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Compal', decription: 'Compal',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Água', decription: 'Água',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Laranja', decription: 'Sumo de Laranja',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Maçã', decription: 'Sumo de Maçã',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Uva', decription: 'Sumo de Uva',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Pêssego', decription: 'Sumo de Pêssego',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Manga', decription: 'Sumo de Manga',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Abacaxi', decription: 'Sumo de Abacaxi',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Melancia', decription: 'Sumo de Melancia',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Melão', decription: 'Sumo de Melão',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    {name:'Sumo de Morango', decription: 'Sumo de Morango',category:cats[5]._id,
        price:1.99, stock:100,supermarket:super2._id},
    ]);

    console.log('Produtos criados');

    console.log('\n==== SEED CONCLUÍDO ===');
    console.log('Contas de teste:');
    console.log('Admin: admin@supermarjethub.pt | 123456');
    console.log('Cliente:maria@email.pt | 123456');
    console.log('Estafeta: carlos@email.pt | 123456');
    console.log('Supermercado: sara@mercado.pt | 123456');
    console.log('Supermercado: pedro@mercado.pt | 123456');

    process.exit(0);

}

seed().catch(err => {
    console.error('Erro ao executar seed:', err);
    process.exit(1);
});