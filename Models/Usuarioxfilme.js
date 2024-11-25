import { DataTypes } from 'sequelize';
import connection from '../Config/sequelize-config.js';

const UsuarioXFilme = connection.define('Usuariosxfilmes', {
    id_usu: {
        type: DataTypes.INTEGER,
        references: {
            model: 'usuarios', // Nome da tabela de usuários
            key: 'id_usu'
        },
        onDelete: 'CASCADE',
    },
    id_filme: {
        type: DataTypes.INTEGER,
        references: {
            model: 'filmes', // Nome da tabela de filmes
            key: 'id_filme'
        },
        onDelete: 'CASCADE',
    }
}, {
    tableName: 'Usuariosxfilmes',  // Nome da tabela intermediária
    timestamps: false,  // Não precisa de campos de timestamps aqui
});

export default UsuarioXFilme;
