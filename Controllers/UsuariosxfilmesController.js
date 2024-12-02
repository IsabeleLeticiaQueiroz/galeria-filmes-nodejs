import express from "express";
import Usuariosxfilmes from "../Models/Usuarioxfilme.js"; 
import Filmes from "../Models/Filme.js"; 
import flash from "connect-flash";

const router = express.Router();

// ROTA PARA EXIBIR O PERFIL DO USUÁRIO COM SEUS FILMES
router.get("/perfil", async (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para ver o perfil.");
            return res.redirect("/login");
        }

        const filmesAssociados = await Usuariosxfilmes.findAll({
            where: { id_usu: req.session.user.id },
            include: [{
                model: Filmes,
                attributes: ['id_filme', 'titulo', 'ano', 'imagem'],
            }]
        });

        res.render("perfil", {
            filmes: filmesAssociados.map(f => f.Filme),
            user: req.session.user,
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
            loggedIn: req.session.user ? true : false,
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar seu perfil. Tente novamente!");
        res.redirect("/inicial");
    }
});

// ROTA PARA ASSOCIAR UM FILME AO USUÁRIO
router.post("/associar/:id_filme", async (req, res) => {
    const { id_filme } = req.params;

    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para associar um filme.");
            return res.redirect("/login");
        }

        const filme = await Filmes.findByPk(id_filme);
        if (!filme) {
            req.flash("error", "Filme não encontrado.");
            return res.redirect("/inicial");
        }

        const associacaoExistente = await Usuariosxfilmes.findOne({
            where: { id_usu: req.session.user.id, id_filme: id_filme },
        });

        if (associacaoExistente) {
            req.flash("error", "Este filme já está associado à sua conta.");
            return res.redirect("/inicial");
        }

        await Usuariosxfilmes.create({
            id_usu: req.session.user.id,
            id_filme: id_filme,
        });

        req.flash("success", "Filme associado com sucesso!");
        res.redirect("/perfil"); 
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao associar o filme. Tente novamente!");
        res.redirect("/inicial");
    }
});

// DELETAR O FILME
router.post("/remover-filme/:id_filme", async (req, res) => {
    const { id_filme } = req.params;

    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para remover um filme.");
            return res.redirect("/login");
        }

        const associacao = await Usuariosxfilmes.findOne({
            where: { id_usu: req.session.user.id, id_filme: id_filme },
        });

        if (!associacao) {
            req.flash("error", "Este filme não está associado à sua conta.");
            return res.redirect("/perfil");
        }

        await associacao.destroy();

        await Filmes.destroy({
            where: { id_filme: id_filme }
        });

        req.flash("success", "Filme removido com sucesso!");
        res.redirect("/perfil"); 
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao remover o filme. Tente novamente!");
        res.redirect("/perfil");
    }
});

export default router;
