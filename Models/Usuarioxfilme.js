import Sequelize from 'sequelize';
import connection from '../Config/sequelize-config.js';
import Usuarios from './Usuario.js';
import Filmes from './Filme.js';

const Usuariosxfilmes = connection.define('usuariosxfilmes', {
    id_usuario_filme: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usu: {
        type: Sequelize.INTEGER,
        references: {
            model: 'usuarios',  // Nome da tabela de 'usuarios'
            key: 'id_usu',      // Chave primária na tabela 'usuarios'
        },
        allowNull: false,
    },
    id_filme: {
        type: Sequelize.INTEGER,
        references: {
            model: 'filmes',    // Nome da tabela de 'filmes'
            key: 'id_filme',    // Chave primária na tabela 'filmes'
        },
        allowNull: false,
    },
});

// Definindo o relacionamento muitos-para-muitos com a tabela intermediária
Usuarios.belongsToMany(Filmes, {
    through: Usuariosxfilmes,  // Tabela intermediária
    foreignKey: 'id_usu',      // A chave estrangeira na tabela 'usuariosxfilmes'
    otherKey: 'id_filme',      // A chave estrangeira na tabela 'usuariosxfilmes' para 'filmes'
});
Filmes.belongsToMany(Usuarios, {
    through: Usuariosxfilmes,  // Tabela intermediária
    foreignKey: 'id_filme',    // A chave estrangeira na tabela 'usuariosxfilmes'
    otherKey: 'id_usu',        // A chave estrangeira na tabela 'usuariosxfilmes' para 'usuarios'
});

// Sincronizando a tabela intermediária
Usuariosxfilmes.sync({ force: false });

export default Usuariosxfilmes;
