import express from "express";
import Users from "../Models/Usuario.js";
import bcrypt from "bcrypt";
import Usuariosxfilmes from "../Models/Usuarioxfilme.js"; // Importa a tabela de associação
import Filmes from "../Models/Filme.js"; // Importa o modelo Filmes
import flash from "connect-flash";
import { verificarLogin } from '../Middleware/Auth.js';  

const router = express.Router();

// ROTA DE LOGIN
router.get("/login", async (req, res) => {
    try {
        res.render("login", {
            errorMessage: req.flash("error"),
            successMessage: req.flash("success"),
            loggedOut: true,
            username: req.session.username
        });
    } catch (error) {
        console.log(error);
    }
});

// ROTA DE REGISTRO
router.get("/cadastro", async (req, res) => {
    try {
        res.render("cadastro", {
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
            loggedOut: true,
        });
    } catch (error) {
        console.log(error);
    }
});

// ROTA DE CRIAÇÃO DE USUÁRIO
router.post("/usuario/new", async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verifica se já existe um usuário com esse e-mail
        const userExists = await Users.findOne({
            where: { email: email }
        });

        if (userExists === null) {
            // Criação do usuário
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(senha, salt);

            try {
                const novo = await Users.create({
                    email: email,
                    senha: hash,
                });

                // Após criar o usuário, redireciona para a página inicial
                req.flash("success", "Usuário registrado com sucesso!");
                res.redirect(`/inicial?id=${novo.id_usu}`); // Corrigido para 'id_usu'
            } catch (error) {
                console.log(error);
                req.flash("error", "Erro ao criar usuário. Tente novamente!");
                res.redirect("/cadastro");
            }
        } else {
            req.flash("error", "O usuário informado já existe. Faça o login!");
            res.redirect("/cadastro");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao verificar dados do usuário. Tente novamente!");
        res.redirect("/cadastro");
    }
});

// ROTA DE AUTENTICAÇÃO (Login)
router.post("/authenticate", async (req, res) => {
    const { email, senha } = req.body;

    try {
        const user = await Users.findOne({
            where: { email: email }
        });

        if (user != null) {
            // Verifica se a senha informada está correta
            const correct = bcrypt.compareSync(senha, user.senha);

            if (correct) {
                req.session.user = {
                    id: user.id_usu, 
                    email: user.email,
                };

                req.flash("success", `Bem-vindo, ${user.email}!`);
                res.redirect("/inicial"); // Redireciona para a página de filmes ou outra página inicial
            } else {
                req.flash("error", "A senha informada está incorreta. Tente novamente!");
                res.redirect("/login");
            }
        } else {
            req.flash("error", "O usuário informado não existe. Tente novamente!");
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao autenticar. Tente novamente!");
        res.redirect("/login");
    }
});

// ROTA DE LOGOUT
router.get("/logout", (req, res) => {
    req.session.user = undefined; // Limpa a sessão do usuário
    req.flash("success", "Logout efetuado com sucesso!");
    res.redirect("/"); // Redireciona para a página inicial
});

// Rota de perfil com o middleware verificarLogin
router.get("/perfil", verificarLogin, async (req, res) => {
    try {
        // Consulta os filmes que o usuário tem usando Eager Loading
        const filmes = await Filmes.findAll({
            include: {
                model: Usuariosxfilmes,
                where: { id_usu: req.session.user.id },
                through: { attributes: [] }  // Evita carregar os dados da tabela intermediária
            }
        });

        // Renderiza a view de perfil e passa os dados necessários
        res.render("perfil", {
            filmes: filmes,  // Passa a lista de filmes
            user: req.session.user,  // Passa as informações do usuário
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
            infoMessage: req.flash("info")
        });
    } catch (error) {
        console.log("Erro ao carregar perfil:", error);
        req.flash("error", "Erro ao carregar seu perfil. Tente novamente mais tarde.");
        return res.redirect("/inicial");
    }
});

export default router;
