const mongoose = require('../../database/index');//importando o mongoose

const ProjectSchema = new mongoose.Schema({

  name: { //propriedade/campo nome
    type: String,
    // required: true, //campo obrigatório 
  },


  description: { //propriedade/campo nome
    type: String,
    required: true,//campo obrigatório 
  },

  user: { //criando "relacionamento" 1 para 1 
    type: mongoose.Schema.Types.ObjectId, //tipo id gerado pelo mongo para o obj
    ref: 'User',//referenciando a tabela atrelada
    required: true, // obrigatoriedade de vinculo, que um project tem um user
  },
  //como um project pode ter n taferancas deve ser colocado entro do array []
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',

  }],

  createdAt: { //capo data de criação
    type: Date,
    default: Date.now, //Data em que o registro foi criado.
  },

});

//defindo o model Project no banco com mongoose
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project; //exportando o modelo project