const User = require('../models/User');

// Mostrar a página de login (GET /login)
exports.getLogin = (req, res) => {
    // Se o utilizador já tiver sessão iniciada, redireciona para a home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
};

// Mostrar a página de registo (GET /register)
exports.getRegister = (req, res) => {
    // Se o utilizador já tiver sessão iniciada, redireciona para a home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('register', { error: null });
};

// Processar o registo (POST /register)
exports.postRegister = async (req, res) => {
    try {
        // Extrair também a "address" e a "role" do corpo (formulário)
        const { firstName, lastName, email, phone, nif, address, role, password } = req.body;

        // Verificar se já existe alguém com este email
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.render('register', { error: 'Este email já está em uso.' });
        }

        // Juntar Primeiro e Último nome num só
        const fullName = `${firstName.trim()} ${lastName.trim()}`;

        // Criar o novo utilizador na BD
        const newUser = new User({
            name: fullName,
            email: email.toLowerCase(),
            phone: phone.trim(),
            nif: nif ? nif.trim() : '',
            address: address.trim(), // Adicionar a morada!
            role: role || 'cliente', // Guardar o tipo de conta (fallback para cliente)
            password: password // NOTA: Num projeto real devíamos usar bcrypt aqui!
        });

        await newUser.save(); // Grava no MongoDB

        // Opcional: Fazer login automático ao criar a conta
        req.session.user = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        // Redireciona para a home
        res.redirect('/');
        
    } catch (error) {
        console.error('Erro no registo:', error);
        res.render('register', { error: 'Ocorreu um erro ao criar a conta. Verifica os dados.' });
    }
};

// Processar o login (POST /login)
exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Procurar o utilizador pelo email
        const user = await User.findOne({ email: email.toLowerCase() });

        // Se não encontrar o utilizador
        if (!user) {
            return res.render('login', { error: 'Email ou password incorretos.' });
        }

        // Verificar a password (comparação direta, sem encriptação)
        if (user.password !== password) {
            return res.render('login', { error: 'Email ou password incorretos.' });
        }

        // Verificar se o utilizador está ativo
        if (!user.isActive) {
            return res.render('login', { error: 'A tua conta está desativada.' });
        }

        // Guardar os dados do utilizador na sessão (sem a password)
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // Redirecionar para a página principal
        res.redirect('/');

    } catch (error) {
        console.error('Erro no login:', error);
        res.render('login', { error: 'Ocorreu um erro. Tenta novamente.' });
    }
};

// Fazer logout (GET /logout)
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
        }
        res.redirect('/login');
    });
};
