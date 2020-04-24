const mongoose = require('../../database/index');//importando o mongoose
const bcrypt = require('bcryptjs')
//defindo  o esquema/tabela/entidade e seus campos e tipos.
const UserSchema = new mongoose.Schema({
  name: { //propriedade/campo nome
    type: String,
    required: true, //campo obrigatório 
  },

  email: {//propriedade/campo email
    type: String,
    unique: true, //unico/exclusivo
    required: true, //campo obrigatório 
    lowercase: true,//força  salvar o email ser salvo em Minúsculo
  },

  password: {//propriedade/campo
    type: String,
    required: true, //campo obrigatório 
    select: false, //para que a senha não seja passada quando for buscado  um usuario ou uma lista deusuarios no banco
  },

  passwordResetToken: { //criando propriedade/campo tokenRest que será usada para resetar a senha.
    type: String,
    select: false,//para que a senha não seja passada quando for buscado  um usuario ou uma lista deusuarios no banco
  },

  passwordResetExpires: {//propriedade/campo que vai aguarda o prazo de validade do token
    type: Date,
    select: false,//para que a senha não seja passada quando for buscado  um usuario ou uma lista deusuarios no banco
  },

  createdAt: {
    type: Date,
    default: Date.now, //Data em que o registro foi criado.
  },

});


UserSchema.pre('save', async function (next) {//.pre é  uma função do mongoose que executa algo antes de "no caso salvar"

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;//o this aqui refere-se ao obj que está sendo salvado, sendo assim vou usar para pegar o password , n rounds

  next();

});

//defindo o model User no banco com mongoose
const User = mongoose.model('User', UserSchema);

module.exports = User; //exportando o modelo user