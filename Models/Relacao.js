import Filme from './Filme.js';
import Usuarios from './Usuario.js';
import UsuarioXFilme from './Usuarioxfilme.js';

const setAssociations = () => {
  Filme.belongsToMany(Usuarios, {
    through: UsuarioXFilme,
    foreignKey: 'id_filme',
    otherKey: 'id_usu',
  });

  Usuarios.belongsToMany(Filme, {
    through: UsuarioXFilme,
    foreignKey: 'id_usu',
    otherKey: 'id_filme',
  });
};

export default setAssociations;
