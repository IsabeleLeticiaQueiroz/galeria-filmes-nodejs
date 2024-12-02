import { DataTypes } from 'sequelize';
import connection from '../Config/sequelize-config.js';

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
  tableName: 'usuarios',
  timestamps: true,
});

export default Usuarios;
