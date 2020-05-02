const express = require('express');//importando o express
const authMiddleware = require('../middlewares/auth');//importando o middlewares
const router = express.Router();//importando os metodos do Router() para router
const Project = require('../models/project');//importando o model project
const Task = require('../models/task');//importando o model task
router.use(authMiddleware);//definindo o uso authMiddleware antes de carregar a rota /projects

//rota listar todos
router.get('/', async (request, response) => {  //rota para lsitar todos os projetos

  try {
    //buscnado todos os projetos 
    const projects = await Project.find().populate(['user', 'tasks']);

    return response.send({ projects });  // retorna os projetos salvos no bd

  } catch (err) {//caso de algo errado emitir mensagem
    console.log(err) //exibir o erro no console
    return response.status(400).send({ error: 'Erro ao carregar os projetos.' });
  }
});

//listar por id 
router.get('/:projectId', async (request, response) => { //metodo get para listar todos projetos
  try {
    const project = await Project.findById(request.params.projectId).populate(['user', 'tasks']);//eager loading é basicamente 2 querry 1 para todos os projects e outra faz uma buscar em todos os usuarios de uma vez para u mproject x

    return response.send({ project });//retornando o projeto que tenha o id passado 

  } catch (err) {//caso de algo errado emitir mensagem
    console.log(err) //exibir o erro no console
    return response.status(400).send({ error: 'Erro ao carregar o projeto do id passado.' });
  }
});

// rota p/ criar um project
router.post('/', async (request, response) => {
  try {
    const { title, description, tasks } = request.body; //pegando separado do corpo da req o title, description, tasks
    const project = await Project.create({ title, description, user: request.userId });//na hora de criar preciso só title, description pq da erro, pois não entente o arry de tasks

    //percorrendo cada uma das tasks
    await Promise.all(tasks.map(async task => { //await promise.all faz com que espere acontecer todas as interacoes antes de seguir
      const projectTask = new Task({ ...task, project: project._id });//outra forma de criar != de "const projectTask = Task.create",porem ele não salva /como é um pra n deve referenciar qual _id do mongo

      await projectTask.save();//esperando e salvando a task

      project.tasks.push(projectTask);
    }));
    //após todas as interacoes sera salvo no mongo
    await project.save();//para salvar no base

    return response.send({ project });


  } catch (err) {//caso de algo errado emitir mensagem
    console.log(err) //exibir o erro no console
    return response.status(400).send({ error: 'Erro ao criar um novo projeto' });
  }
});


//Alterar por id 
router.put('/:projectId', async (request, response) => {
  try {
    const { title, description, tasks } = request.body; //pegando do corpo da requisicao os dados title, description, tasks
    //localiza o primeiro documento que corresponde a um dado filter, aplica um updatee retorna o documento.  
    const project = await Project.findOneAndUpdate(request.params.projectId, {
      title,
      description
    }, { new: true });//definindo a new : true para retornar o documento após a update aplicação.

    project.tasks = [];
    await Task.remove({ project: project._id });

    await Promise.all(tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id });

      await projectTask.save();//salvandoo

      project.tasks.push(projectTask);//enviando alteracao
    }));

    await project.save();//salvando o project

    return response.send({ project });//retornado o project alterado
  } catch (err) {//caso de algo errado emitir mensagem
    console.log(err) //exibir o erro no console
    return response.status(400).send({ error: 'Erro ao atualizar o projeto.' });
  }
});

//Deletar por id 
router.delete('/:projectId', async (request, response) => { //rota para apagar um projeto passando o id
  try {

    await Project.findOneAndDelete(request.params.projectId).populate('user');
    return response.send('Project apagado com sucesso.');
  } catch (err) {//caso de algo errado emitir mensagem
    console.log(err) //exibir o erro no console
    return response.status(400).send({ error: 'Erro ao deletar o projeto.' });
  }
});

module.exports = (app) => app.use('/projects', router);//exportando a rota /project