const Supermarket = require('../models/Supermarket');

const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getDashboard = async (req, res) => {
    res.render('supermarket/dashboard', {
        user:
            req.session.user
    });

};

exports.postProfile = async (req, res) => {
    try {
        const { description, openingHours, deliveryCost } = req.body;
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