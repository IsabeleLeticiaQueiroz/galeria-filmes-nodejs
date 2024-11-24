import Sequelize from "sequelize"
import connection from "../Config/sequelize-config.js";
import DataTypes from 'sequelize';

const Filmes = connection.define('filmes' ,{
    id_filme: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ano: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    imagem: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    },
});
Filmes.sync({force: false});
export default Filmes