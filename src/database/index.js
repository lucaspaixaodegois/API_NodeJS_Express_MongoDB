const express = require('express');//importando o express
const mongoose = require('mongoose');//importando o mongoose para conexão com banco 

//passsando o  endereço/login/senha para acessar o banco na nuvem.
mongoose.connect('mongodb+srv://root:root@cluster-tcc-whzqw.mongodb.net/apiDB?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true

});
mongoose.Promise = global.Promise;
module.exports = mongoose;