import { DataTypes } from 'sequelize';
import connection from '../Config/sequelize-config.js';
// Remova a importação do 'Usuario' de cima
import Usuariosxfilmes from './Usuarioxfilme.js'; // Importando o modelo de associação

// Definindo o modelo Filme
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

// Importando o modelo 'Usuario' após a definição do modelo 'Filme'
import Usuarios from './Usuario.js';

// Associações
Filme.belongsToMany(Usuarios, {
  through: 'Usuariosxfilmes',
  foreignKey: 'id_filme',
  otherKey: 'id_usu'
});

export default Filme;
