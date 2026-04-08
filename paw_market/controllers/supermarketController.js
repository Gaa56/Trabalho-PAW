const Supermarket = require('../models/Supermarket');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

exports.getDashboard = async (req, res) => {
    try {
        const superm = await Supermarket.findOne({ owner: req.session.user.id });
        
        // Contar total de encomendas do supermercado
        const totalOrders = await Order.countDocuments({ supermarket: superm._id });

        // Produtos mais vendidos (agregação)
        const topProducts = await Order.aggregate([
            { $match: { supermarket: superm._id } },
            { $unwind: '$items' },
            { $group: { _id: '$items.name', totalQty: { $sum: '$items.quantity' } } },
            { $sort: { totalQty: -1 } },
            { $limit: 5 }
        ]);

        // Últimas encomendas
        const recentOrders = await Order.find({ supermarket: superm._id })
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        // Contar total de produtos
        const totalProducts = await Product.countDocuments({ supermarket: superm._id });

        res.render('supermarket/dashboard', {
            user: req.session.user,
            superm,
            totalOrders,
            totalProducts,
            topProducts,
            recentOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao carregar dashboard.");
    }
};

exports.getProfile = async (req, res) => {
    try {
        const superm = await Supermarket.findOne({ owner: req.session.user.id });
        res.render('supermarket/profile', { user: req.session.user, superm });
    } catch (error) {
        res.status(500).send("Erro ao carregar perfil.");
    }
};

exports.postProfile = async (req, res) => {
    try {
        const { description, deliveryCost } = req.body;
        await Supermarket.findOneAndUpdate(
            { owner: req.session.user.id },
            { description, deliveryCost }
        );
        res.redirect('/supermarket/profile');
    } catch (error) {
        res.status(500).send("Erro ao atualizar perfil.");
    }
};

exports.getProducts = async (req, res) => {
    try {
        const superm = await Supermarket.findOne({ owner: req.session.user.id });
        const products = await Product.find({ supermarket: superm._id }).populate('category');
        res.render('supermarket/products', { user: req.session.user, products });
    } catch (error) {
        res.status(500).send("Erro ao listar produtos.");
    }
};

exports.getNewProduct = async (req, res) => {
    const categories = await Category.find();
    res.render('supermarket/product_form', { user: req.session.user, categories });
};

exports.postNewProduct = async (req, res) => {
    try {
        const superm = await Supermarket.findOne({ owner: req.session.user.id });
        const { name, description, price, stock, category } = req.body;

        const newProduct = new Product({
            name, description, price, stock, category, supermarket: superm._id
        });
        await newProduct.save();
        res.redirect('/supermarket/products');
    } catch (error) {
        res.status(500).send("Erro ao criar produto.");
    }
};
// Renderizar ecrã de Ponto de Venda com listagem de produtos
exports.getPOS = async (req, res) => {
    try {
        const superm = await Supermarket.findOne({ owner: req.session.user.id });
        const products = await Product.find({ supermarket: superm._id });
        res.render('supermarket/pos', { user: req.session.user, products });
    } catch (error) {
        res.status(500).send("Erro ao carregar o POS.");
    }
};

// Processar a venda em caixa
exports.postPOS = async (req, res) => {
    try {
        const superm = await Supermarket.findOne({ owner: req.session.user.id });
        const { clientNif, clientName, productId, quantity } = req.body;
        
        // 1. Procurar ou Criar o Cliente
        const User = require('../models/User');
        let client = await User.findOne({ nif: clientNif, role: 'cliente' });
        
        if (!client) {
            // Se não existe, cria um cliente temporário ou novo baseado nos dados
            client = new User({
                name: clientName || "Cliente Loja",
                email: `cliente_${Date.now()}@loja.pt`, // Email placeholder porque o modelo exige
                password: 'pos_password',
                phone: '000000000',
                nif: clientNif,
                address: 'Compra em Loja',
                role: 'cliente'
            });
            await client.save();
        }

        // 2. Recuperar o produto e validar preço
        const product = await Product.findById(productId);
        if(!product || product.stock < quantity) {
            return res.status(400).send("Produto não encontrado ou stock insuficiente.");
        }

        // 3. Atualizar stock
        product.stock -= quantity;
        await product.save();

        // 4. Registar a encomenda (Venda em Caixa)
        const Order = require('../models/Order');
        const total = product.price * quantity;

        const newOrder = new Order({
            customer: client._id,
            supermarket: superm._id,
            items: [{
                product: product._id,
                name: product.name,
                quantity: quantity,
                priceAtTime: product.price
            }],
            totalAmount: total,
            deliveryMethod: 'pickup',
            status: 'entregue', // Entregue na hora
            type: 'pos',
            confirmedAt: Date.now(),
            deliveredAt: Date.now()
        });

        await newOrder.save();
        res.redirect('/supermarket/pos'); // Volta para o POS limpar

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao processar venda em caixa.");
    }
};
