const express = require('express')
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); //informando que será usado json nas requisições
app.use(bodyParser.urlencoded({ extended: false }));//para entender que as urls

/*  Na forma tradicional ... repassando o app para todos os controles um a um, é necessario passar pois, só deve ter um app rodando.
    require('./controllers/authController')(app);
    require('./controllers/projectController')(app);
 
    Mas achei outra forma de otimizar isso e importando apenas uma vez aqui no index principal.
    */
require('./app/controllers/index')(app);  //comentario lá

app.listen(3000);//setando porta que vamos usar.

