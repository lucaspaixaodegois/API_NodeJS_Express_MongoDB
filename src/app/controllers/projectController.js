const express = require('express');//importando o express
const authMiddleware = require('../middlewares/auth');//importando o middlewares

const router = express.Router();//importando os metodos do Router() para router

router.use(authMiddleware);//definindo o uso authMiddleware antes de carregar a rota /projects

router.get('/', (request, response) => { //metodo get para teste
  response.send({ ok: true, user:request.userId });//mostrar na tela ok:true se deu tudo certo no authMiddleware
});

module.exports = (app) => app.use('/projects', router);//exportando a rota /project