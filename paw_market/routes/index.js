var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // Se não houver nenhum utilizador com sessão iniciada:
  if (!req.session.user) {
    return res.redirect('/login');
  }

  // Se tiver sessão, deixa-o ver a página inicial (Dashboard)
  res.render('index', { title: 'MercadoPAW - A tua loja' });
});

module.exports = router;
