const path = require('path');//importando path para referenciar o caminho.

var nodemailer = require('nodemailer');//importando o  nodemailer, utilizando para envio de email
const hbs = require('nodemailer-express-handlebars');//impotando o nodemailer-express-handlebars, que permite configurar um template de email usando texto e variaveis mesmo sendo em html dentro do node.
const { host, port, user, pass, tls, service } = require('../config/mail.json');
// importando de forma desestruturada do arquivo mail.json só as informações necessarias para o envio do email.


//criando o transportador  passando dados de autenticação do email
const transport = nodemailer.createTransport({
  service,
  tls,
  auth: {
    user,
    pass
  },

});

//configurando o hbs
transport.use('compile', hbs({
  viewEngine: {//por padrão definir a viewEngine como handlebars 
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),//onde vão ficar as views de template dos emails,OBS: indicar o caminho partindo da raiz do projeto
  extName: '.html'//nome da extensão que será usada
}));

module.exports = transport;