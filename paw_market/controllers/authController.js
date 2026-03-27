const User = require('../models/User');

// Mostrar a página de login (GET /login)
exports.getLogin = (req, res) => {
    // Se o utilizador já tiver sessão iniciada, redireciona para a home
    if (req.session.user) {
        return res.redirect('/');
    }
    res.render('login', { error: null });
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
