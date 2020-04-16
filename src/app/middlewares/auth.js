const jwt = require('jsonwebtoken');//importando o jsonwebtoken
const authConfig = require('../../config/auth');//importando o secrety

module.exports = (request, response, next) => {

  const authHeader = request.headers.authorization;//pegando valor passado no header

  //verificando se tem um token no cabeçalho da requisição
  if (!authHeader)
    return response.status(401).send({
      error: 'Token não foi informado!'
    });

  //verificando se o token está no formato certo, no caso ele começã com uma palavra "Bearer" e seguido de algum hash.
  const parts = authHeader.split(' ');//separar o token em partes


  if (parts.length !== 2) { //verificando se foi dividido em apenas 2 partes se foi mais ou menos 
    return response.status(401).send({ error: 'Erro no Token ' }); //informa que há um erro no token
  }


  const [scheme, token] = parts;// recebe as partes do token para fazer comparação


  if (!/^Bearer$/i.test(scheme)) {//verificando se a primeria parte contem a palavra bearer, usando expressao regular;
    return response.status(401).send({ error: 'Token mal formado' }) //caso não encotre da mensagem detoken mal formado.
  }
  //OBS: feito esse tando de verificação para evitar processamento desnecessario, após esses "filtros" vamos comparar de fato o token  carregado.

  //usando o metodo verify do jwt , passamos o token recebido + nosso secret
  jwt.verify(token, authConfig.secret, (err, decoded) => {// recebe um callback ou seja  se o token for direfente do authConfig.secret entra no if err
    if (err) return response.status(401).send({ erro: 'Token invalido' }); // se tiver erro mensagem de erro
    //caso contrario a variavel decoded  tem a informcao do user id
    request.userId = decoded.id;//passando o userId para serusado em outroslugares
    return next();  //proxima a ação que importar esse middleware no caso o projectController

  });

};
