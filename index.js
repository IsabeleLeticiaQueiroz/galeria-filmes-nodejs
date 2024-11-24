import express from 'express';
import connection from './Config/sequelize-config.js'
const app = express()

//importar modelos
import Usuarios from './Models/Usuario.js';
import Filmes from './Models/Filme.js';
import Usuariosxfilmes from './Models/Usuarioxfilme.js';

//importar controllers


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define o EJS como Renderizador de páginas
app.set('view engine', 'ejs')

// Define o uso da pasta "public" para uso de arquivos estáticos
app.use(express.static('public'))

import flash from "express-flash";
import session from "express-session";

app.use(
	session({
		secret: "galeriasecret",
		cookie: { maxAge: 3600000 },
		saveUninitialized: false,
		resave: false,
	})
);


app.use(flash());

// Permite capturar dados vindos de formulários
app.use('/Imgs', express.static('/Imgs'));

//rotas dos controllers


// Realizando a conexão com o banco de dados
connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso");

    return connection.query('CREATE DATABASE IF NOT EXISTS galeria_filmes;');
}).then(() => {
    console.log("Banco criado");
    // Sincronizar tabelas
    return Promise.all([
     //Usuarios.sync({ force: false }), 
     //Filmes.sync({ force: false })
     //Usuariosxfilmes.sync({ force: false })

    ]);
}).then(() => {
    console.log("Tabelas sincronizadas com sucesso");
}).catch((error) => {
    console.log("Erro na conexão ou criação do banco:", error);
});

//iniciando servidor
app.listen(3000, function(erro) {
    if (erro) {
        console.log("Ocorreu um erro!");
    } else {
        console.log("Servidor iniciado com sucesso!");
    }
});