import { DataTypes } from 'sequelize';
import connection from '../Config/sequelize-config.js';

const Filme = connection.define('Filme', {
  id_filme: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ano: {
    type: DataTypes.INTEGER
  },
  imagem: {
    type: DataTypes.BLOB('long'),
    allowNull: true,
  }
}, {
  tableName: 'filmes',
  timestamps: true
});

export default Filme;
