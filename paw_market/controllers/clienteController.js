const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Supermarket = require('../models/Supermarket');
const User = require('../models/User');


//--- DASHBOARD - Página inicial do cliente
exports.getDashboard = async (req, res) => {
    try {
        // Contar encomendas do cliente
        const totalOrders = await Order.countDocuments({ customer: req.session.user.id });

        // Buscar as últimas 5 encomendas
        const recentOrders = await Order.find({ customer: req.session.user.id })
            .populate('supermarket', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Produtos mais comprados (agregação)
        const topProducts = await Order.aggregate([
            { $match: { customer: req.session.user.id } },
            { $unwind: '$items' },
            { $group: { _id: '$items.name', totalQty: { $sum: '$items.quantity' } } },
            { $sort: { totalQty: -1 } },
            { $limit: 5 }
        ]);

        res.render('cliente/dashboard', {
            user: req.session.user,
            title: 'MercadoPAW - Dashboard',
            totalOrders,
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar o dashboard.');
    }
};

//--- PESQUISA E LISTAGEM DE PRODUTOS
exports.getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let filter = { isActive: true, stock: { $gt: 0 } };

        // Filtro por nome (pesquisa)
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Filtro por categoria
        if (category) {
            filter.category = category;
        }

        // Ordenação (por preço)
        let sortOption = {};
        if (sort === 'preco_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'preco_desc') {
            sortOption = { price: -1 };
        } else {
            sortOption = { createdAt: -1 }; // Mais recentes por defeito
        }

        const products = await Product.find(filter)
            .populate('category', 'name')
            .populate('supermarket', 'name')
            .sort(sortOption);

        const categories = await Category.find({ isActive: true });

        res.render('cliente/products', {
            user: req.session.user,
            title: 'MercadoPAW - Produtos',
            products,
            categories,
            search: search || '',
            selectedCategory: category || '',
            selectedSort: sort || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar produtos.');
    }
};

//--- COMPARAÇÃO DE PREÇOS
exports.compareProduct = async (req, res) => {
    try {
        const { productName } = req.query;

        if (!productName) {
            return res.redirect('/cliente/products');
        }

        // Buscar todos os produtos com o mesmo nome em supermercados diferentes
        const products = await Product.find({
            name: { $regex: new RegExp('^' + productName + '$', 'i') },
            isActive: true,
            stock: { $gt: 0 }
        })
            .populate('supermarket', 'name location')
            .sort({ price: 1 }); // Do mais barato ao mais caro

        res.render('cliente/compare', {
            user: req.session.user,
            title: 'MercadoPAW - Comparar Preços',
            productName,
            products
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao comparar produtos.');
    }
};


//--- CARRINHO DE COMPRAS
// Ver carrinho
exports.getCart = async (req, res) => {
    try {
        // O carrinho é guardado na sessão
        const cart = req.session.cart || [];
        let cartItems = [];
        let total = 0;

        for (const item of cart) {
            const product = await Product.findById(item.productId)
                .populate('supermarket', 'name');
            if (product) {
                const subtotal = product.price * item.quantity;
                total += subtotal;
                cartItems.push({
                    product,
                    quantity: item.quantity,
                    subtotal
                });
            }
        }

        res.render('cliente/cart', {
            user: req.session.user,
            title: 'MercadoPAW - Carrinho',
            cartItems,
            total
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar o carrinho.');
    }
};

// Adicionar produto ao carrinho
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity) || 1;

        // Verificar se o produto existe e tem stock
        const product = await Product.findById(productId);
        if (!product || product.stock < qty) {
            return res.redirect('/cliente/products?erro=sem_stock');
        }

        // Inicializar carrinho se não existir
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Regra: um cliente apenas pode encomendar produtos de um supermercado por encomenda
        if (req.session.cart.length > 0) {
            const firstItem = await Product.findById(req.session.cart[0].productId);
            if (firstItem && firstItem.supermarket.toString() !== product.supermarket.toString()) {
                return res.redirect('/cliente/products?erro=supermercado_diferente');
            }
        }

        // Verificar se o produto já está no carrinho
        const existingItem = req.session.cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            req.session.cart.push({ productId, quantity: qty });
        }

        res.redirect('/cliente/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao adicionar ao carrinho.');
    }
};

// Atualizar quantidade no carrinho
exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = parseInt(quantity);

        if (!req.session.cart) {
            return res.redirect('/cliente/cart');
        }

        if (qty <= 0) {
            // Remover do carrinho se quantidade for 0 ou negativa
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        } else {
            const item = req.session.cart.find(item => item.productId === productId);
            if (item) {
                item.quantity = qty;
            }
        }

        res.redirect('/cliente/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar carrinho.');
    }
};

// Remover produto do carrinho
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (req.session.cart) {
            req.session.cart = req.session.cart.filter(item => item.productId !== productId);
        }

        res.redirect('/cliente/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao remover do carrinho.');
    }
};


// ENCOMENDAS (CHECKOUT)


// Página de checkout
exports.getCheckout = async (req, res) => {
    try {
        const cart = req.session.cart || [];
        if (cart.length === 0) {
            return res.redirect('/cliente/cart');
        }

        let cartItems = [];
        let total = 0;
        let supermarketId = null;

        for (const item of cart) {
            const product = await Product.findById(item.productId)
                .populate('supermarket');
            if (product) {
                supermarketId = product.supermarket._id;
                const subtotal = product.price * item.quantity;
                total += subtotal;
                cartItems.push({ product, quantity: item.quantity, subtotal });
            }
        }

        // Buscar dados do supermercado para os métodos de entrega
        const supermarket = await Supermarket.findById(supermarketId);

        res.render('cliente/checkout', {
            user: req.session.user,
            title: 'MercadoPAW - Checkout',
            cartItems,
            total,
            supermarket
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar checkout.');
    }
};

// Finalizar encomenda
exports.postCheckout = async (req, res) => {
    try {
        const cart = req.session.cart || [];
        if (cart.length === 0) {
            return res.redirect('/cliente/cart');
        }

        const { deliveryMethod, notes } = req.body;
        let items = [];
        let total = 0;
        let supermarketId = null;

        for (const item of cart) {
            const product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.redirect('/cliente/cart?erro=stock_insuficiente');
            }

            supermarketId = product.supermarket;
            const subtotal = product.price * item.quantity;
            total += subtotal;

            items.push({
                product: product._id,
                name: product.name,
                quantity: item.quantity,
                priceAtTime: product.price
            });

            // Reduzir stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Calcular custo de entrega
        let deliveryCost = 0;
        if (deliveryMethod === 'courier') {
            const supermarket = await Supermarket.findById(supermarketId);
            deliveryCost = supermarket ? supermarket.deliveryCost : 0;
        }

        // Criar a encomenda
        const newOrder = new Order({
            customer: req.session.user.id,
            supermarket: supermarketId,
            items,
            totalAmount: total + deliveryCost,
            deliveryMethod,
            deliveryCost,
            status: 'pendente',
            type: 'online',
            notes: notes || ''
        });

        await newOrder.save();

        // Limpar o carrinho
        req.session.cart = [];

        res.redirect('/cliente/orders');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao finalizar encomenda.');
    }
};


// HISTÓRICO DE ENCOMENDAS

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.session.user.id })
            .populate('supermarket', 'name')
            .sort({ createdAt: -1 });

        res.render('cliente/orders', {
            user: req.session.user,
            title: 'MercadoPAW - Minhas Encomendas',
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar encomendas.');
    }
};

// Ver detalhes de uma encomenda
exports.getOrderDetail = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            customer: req.session.user.id
        })
            .populate('supermarket', 'name location phone')
            .populate('items.product', 'name image')
            .populate('courier', 'name phone');

        if (!order) {
            return res.status(404).send('Encomenda não encontrada.');
        }

        res.render('cliente/order_detail', {
            user: req.session.user,
            title: 'MercadoPAW - Encomenda #' + order._id.toString().slice(-6),
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao ver encomenda.');
    }
};

// Cancelar encomenda (até 5 minutos após confirmação)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            customer: req.session.user.id
        });

        if (!order) {
            return res.status(404).send('Encomenda não encontrada.');
        }

        // Só pode cancelar se estiver pendente ou confirmada
        if (!['pendente', 'confirmada'].includes(order.status)) {
            return res.redirect('/cliente/orders?erro=nao_cancelavel');
        }

        // Se já foi confirmada, verificar a regra dos 5 minutos
        if (order.status === 'confirmada' && order.confirmedAt) {
            const now = new Date();
            const diffMs = now - order.confirmedAt;
            const diffMinutes = diffMs / (1000 * 60);

            if (diffMinutes > 5) {
                return res.redirect('/cliente/orders?erro=tempo_expirado');
            }
        }

        // Repor o stock dos produtos
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        order.status = 'cancelada';
        await order.save();

        res.redirect('/cliente/orders');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cancelar encomenda.');
    }
};

// ==========================================
// PERFIL DO CLIENTE
// ==========================================
exports.getProfile = async (req, res) => {
    try {
        const userData = await User.findById(req.session.user.id);

        res.render('cliente/profile', {
            user: req.session.user,
            title: 'MercadoPAW - Meu Perfil',
            userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar perfil.');
    }
};

// Atualizar perfil
exports.postProfile = async (req, res) => {
    try {
        const { name, phone, address, nif } = req.body;

        await User.findByIdAndUpdate(req.session.user.id, {
            name, phone, address, nif
        });

        // Atualizar dados na sessão
        req.session.user.name = name;

        res.redirect('/cliente/profile');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar perfil.');
    }
};
