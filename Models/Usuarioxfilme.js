import { DataTypes } from 'sequelize';
import connection from '../Config/sequelize-config.js';

const UsuarioXFilme = connection.define('usuariosxfilmes', {
  id_usu: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuarios',
      key: 'id_usu',
    },
    onDelete: 'CASCADE',
  },
  id_filme: {
    type: DataTypes.INTEGER,
    references: {
      model: 'filmes',
      key: 'id_filme',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'usuariosxfilmes',
  timestamps: false,
});

export default UsuarioXFilme;
