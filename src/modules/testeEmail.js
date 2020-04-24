const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'helpti.app@gmail.com',
    pass: 'helpti@2020'
  }
});

const mailOptions = {
  from: 'Stark , <helpti.app@gmail.com>',
  //Lista de emails que você quer enviar (pode cadastrar vários, basta separar por " , ")
  to: 'helpti.app@gmail.com',
  //Assunto do email
  subject: 'Teste de email com Nodejs ',
  //Aqui você pode enviar toda a mensagem
  text: 'Enviando email com nodejs + nodemailer ',
  // podemos também utilizar um HTML
  html: '<h4>Podemos enviar um html =)</h4>'
};

// Enviando email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Mensagem enviada: ' + info.response);
});