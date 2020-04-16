const mongoose = require('../../database/index');//importando o mongoose
const bcrypt = require('bcryptjs')
//defindo  o esquema/tabela/entidade e seus campos e tipos.
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, //campo obrigatório 
  },
  email: {
    type: String,
    unique: true, //unico/exclusivo
    required: true, //campo obrigatório 
    lowercase: true,//força  salvar o email ser salvo em Minúsculo
  },
  password: {
    type: String,
    required: true, //campo obrigatório 
    select: false, //para que a senha não seja passada quando for buscado  um usuario ou uma lista deusuarios no banco
  },
  createdAt: {
    type: Date,
    default: Date.now, //Data em que o registro foi criado.
  },
});

//.pre é  uma função do mongoose que executa algo antes de "no caso salvar"
UserSchema.pre('save', async function (next) {
  //o this aqui refere-se ao obj que está sendo salvado, sendo assim vou usar para pegar o password , n rounds
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();

});

//defindo o model User no banco com mongoose
const User = mongoose.model('User', UserSchema);

module.exports = User; //exportando o modelo user