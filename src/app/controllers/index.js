const fs = require('fs');//imporntado o modulo fs que nós permite trabalhar com file systen do node
const path = require('path');//importando o modulo path nós permite trabalhar com caminhos de pastas

module.exports = app => { //receber o app
  fs
    .readdirSync(__dirname) //ler um diretorio (no caso esse mesmo que estamos operando no index.js)
    .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js"))) //filtar arquivos que não comecem com ponto"." que geralmente são arquivos de config, e que tbm  que não seja o arquivo index.js no  caso esse arquivo.
    //resumindo vai procurar um arquivo que nao comece com . e que nao seja esse index.js, ou seja, todos os outros controles.
    .forEach(file => require(path.resolve(__dirname, file))(app));//pecorrendo esses arquivos setando require app em cada um deles, pq em cada um é esperado um app
}