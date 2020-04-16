const express = require('express'); //importando o express
const User = require('../models/user'); // importando  model User
const bcrypt = require('bcryptjs') //importando bcrypt para descriptar melhor para comparar a senha passada e a salva no banco
const jwt = require('jsonwebtoken');//importando o jsonwebtoken gerador de token
const router = require("express").Router();//atribuindo a  variabel router  com os metodos da função/classe Router().
const authConfig = require('../config/auth');//importando o secrety

//funcao  gerador de token e já retorna o token
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, { expiresIn: 86400 });

  // const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });// gerando token com dois parametros sendo um  o id_user que nunca se repete e o outro é uma hash que precisa ser algo unico que nem mesmo outra app tenha igual para isso usei um gerador de hash md5 online e o ultimo paramento é o tempo de validade do token queno caso 86400 vale 24h.
}



//definindo rota para add novo User
router.post('/register', async (request, response) => {

  const { email } = request.body; //pegando o email

  try {
    //verificar se o email já está cadastrado
    if (await User.findOne({ email })) {
      return response.status(400).send({ error: 'Usuário já cadastrado' });
    }
    //criar um novo usuario
    const user = await User.create(request.body);

    //setando/apagando o password 
    user.password = undefined;

    return response.send({
      user,
      token: generateToken({ id: user.id })//passando user + token gerando assim que cadastrar já loga no app

    }); //printa o user criado
  } catch (err) {
    //caso de algo errado
    return response.status(400).send({ error: 'Erro ao criar registro' });
  }
});

//add rota /authenticate  que fará a verificação  de acesso do usúario
router.post('/authenticate', async (request, response) => {

  const { email, password } = request.body;//pegando email e senha da requisição

  const user = await User.findOne({ email }).select('+password');//verificando se existe o usuario cadastrado pegando o email e o password

  //se usuario nao existe mdua status para 400 e emite mensagem de nao encontrado
  if (!user)
    return response.status(400).send({ error: 'Usuário não encontrado!' });

  //verificando se a senha/password que ele passou é realmente a mesma que está salva no banco
  if (!await bcrypt.compare(password, user.password))
    return response.status(400).send({ error: 'Senha incorreta!' });

  //removendo o password
  user.password = undefined;

  response.send({
    user,
    token: generateToken({ id: user.id })//passando o token gerado + user para autenticar
  });
});


//repassando o router com prefixo /auth
module.exports = (app) => app.use('/auth', router);

