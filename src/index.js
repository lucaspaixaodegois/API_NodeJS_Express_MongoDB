const express = require('express')
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); //informando que será usado json nas requisições
app.use(bodyParser.urlencoded({ extended: false }));//para entender que as urls

//repassando o app para o controler authController, é necessario passar pois só deve ter um app rodando
require('./controllers/authController')(app);
require('./controllers/projectController')(app);

app.listen(3000);//setando porta que vamos usar.

