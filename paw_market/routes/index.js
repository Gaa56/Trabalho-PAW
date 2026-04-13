var express = require('express');
var router = express.Router();

/* GET home page (Dashboard inteligente) */
router.get('/', function (req, res, next) {
  // Se não houver nenhum utilizador com sessão iniciada:
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const role = req.session.user.role;

  // Redireciona consoante a Função (Role)
  if (role === 'cliente') {
    return res.redirect('/cliente');
  } else if (role === 'supermercado') {
    return res.redirect('/supermarket');
  } else if (role === 'admin') {
    return res.redirect('/admin');
  } else if (role === 'estafeta') {
    return res.redirect('/estafeta');
  } else {
    // Para as outras roles, mostra o ecrã basico
    return res.render('index', { title: 'Bem-vindo ao Dashboard - ' + role });
  }
});
module.exports = router;
