import { DataTypes } from 'sequelize';
import connection from '../Config/sequelize-config.js';  // Importando a instância do Sequelize
import Filme from './Filme.js';  // Importando o modelo Filme

const Usuarios = connection.define('Usuarios', {
    id_usu: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuarios', // Nome da tabela no banco de dados
    timestamps: true,  // Garante que as colunas createdAt e updatedAt sejam criadas
});

// Relacionamento muitos-para-muitos com o modelo Filme através da tabela intermediária Usuariosxfilmes
Usuarios.belongsToMany(Filme, {
    through: 'Usuariosxfilmes', // Tabela intermediária
    foreignKey: 'id_usu', // Chave estrangeira no modelo Usuario
    otherKey: 'id_filme', // Chave estrangeira no modelo Filme
});

export default Usuarios;
