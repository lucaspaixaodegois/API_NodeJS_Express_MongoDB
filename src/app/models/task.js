const mongoose = require('../../database/index');//importando o mongoose

const TaskSchema = new mongoose.Schema({
  name: { //propriedade/campo nome
    title: String,
    required: true, //campo obrigatório 
  },

  //uma tafera pertence a um projeto 
  Project: { //criando "relacionamento" 1 para 1 
    type: mongoose.Schema.Types.ObjectId, //tipo id gerado pelo mongo para o obj
    ref: 'Project',//referenciando a tabela atrelada
    required: true, // obrigatoriedade de vinculo, que um project tem um user
  },
  //e a tarefa esta atribuida a alguem
  assingnedTo: { //criando "relacionamento" 1 para 1 
    type: mongoose.Schema.Types.ObjectId, //tipo id gerado pelo mongo para o obj
    ref: 'User',//referenciando a tabela atrelada
    // required: true, // obrigatoriedade de vinculo, que um project tem um user
  },
  //status da tarefa se foi completada ou nao
  completed: {
    type: Boolean,
    //required: true, //campo obrigatorio
    default: false,//por padrão inicia o boolean false ou seja tarefa nao concluida
  },
  createdAt: {
    type: Date,
    default: Date.now, //Data em que o registro foi criado.
  }
});

//defindo o model Task no banco com mongoose
const Task = mongoose.model('Task', TaskSchema);
module.exports = Task; //exportando o modelo project
