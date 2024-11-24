import Sequelize from "sequelize"
import connection from "../Config/sequelize-config.js";

const Usuarios = connection.define('usuario' ,{
    id_usu: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Garante que o e-mail será único
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});
Usuarios.sync({force: false});
export default Usuarios