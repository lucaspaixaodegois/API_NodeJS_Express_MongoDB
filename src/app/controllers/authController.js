const express = require('express'); //importando o express
const User = require('../models/user'); // importando  model User
const bcrypt = require('bcryptjs') //importando bcrypt para descriptar melhor para comparar a senha passada e a salva no banco
const jwt = require('jsonwebtoken');//importando o jsonwebtoken gerador de token
const router = require("express").Router();//atribuindo a  variabel router  com os metodos da função/classe Router().
const authConfig = require('../../config/auth');//importando o secrety
const crypto = require('crypto');
const mailer = require('../../modules/mailer')


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


//add rota /forgot_password  responsavel por solicitar o reset de senha
router.post('/forgot_password', async (request, response) => {

  const { email } = request.body;//receber o email do usuario que deseja receber a senha
  console.log(email)
  try {
    //verificando se o email existe no banco
    const user = await User.findOne({ email });


    if (!user) { //caso o usuario não exista mensagem de not found
      return response.status(400).send({ error: 'Usuário não encontrado.' }); //se nao existir emitir mensagem de nao  user existente
    }
    //gerar um token de 20 caracteres para a requisição de nova senha usando o crypto
    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();//pegando data atual
    now.setHours(now.getHours() + 1);//pegando hora atual e somando mais 1h que será o tempo de  validade do token gerado.

    //alterar o usuario, passando id como parametro
    await User.findByIdAndUpdate(user.id, {
      //'$set' quer dizer sentando {os campos x,y, etc}
      '$set': {
        passwordResetToken: token,//token gerado sendo passado para otributo do model user
        passwordResetExpires: now,// sendo passado para otributo do model user a data e hora atual
      }
    });

    console.log(token, now);//testando, saber se está pegando valores.
    //nodemailer em ação "dados do email"
    mailer.sendMail({
      to: email, //email do usuario cadastrado que esta solicitando
      subject: 'Token para recuperação de senha.',//assunto do email
      from: 'helpti.app@gmail.com',// email de origem
      template: '/forgot_password', //caminho do template do email
      context: { token }, //token gerado
    },
      (err) => { //caso de erro
        if (err) { //mensagem de erro de envio
          return response.status(400).send({ error: 'erro ao tentar enviar token para o email' });
        }//caso de sucesso mensgem de envio de emal
        return response.send('Token de recuperação de senha enviado com sucesso');

      });

  } catch (err) { //caso qualqeur outro erro mensagem de carregamento
    response.status(400).send({ error: 'Erro na recuperação de senha, tente novamente.' });
  }
});

//add rota de /reset_password
router.post('/reset_password', async (request, response) => {
  const { email, token, password } = request.body; // pegando os dados de email,token e password da requisicao

  try {
    const user = await User.findOne({ email })//verificando se existe o email informado
      .select('+passwordResetToken passwordResetExpires'); //pegando a mais os valores do passwordResetToken passwordResetExpires

    if (!user) // se o usuario nao existir
      return response.status(400).send({ error: 'Usuário não encontrado.' }); //se nao existir emitir mensagem de nao  user existente

    if (token !== user.passwordResetToken)//verificando se os tokens são iguais o do req e da base
      return response.status(400).send({ error: 'Token inválido.' }); //se nao batem emitir mensagem de nao  user existente

    const now = new Date();//pegando data atual para verificação

    if (now > user.passwordResetExpires) //se data autal for maior que o passwordResetExpires prazo de validade do token
      return response.status(400).send({ error: 'O token expirou, gere um novo.' });

    user.password = password;//se correr tudo bem atulaizar o password da base com o novo password

    await user.save(); //salvando o usuario

    response.send("Senha atualizada com sucesso!");
  } catch (err) { // qualquer outro erro 
    response.status(400).send({ error: 'Não é possível redefinir a senha, tente novamente.' });
  }
});

//repassando o router com prefixo /auth
module.exports = (app) => app.use('/auth', router);

