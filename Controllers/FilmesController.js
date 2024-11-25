import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import Filmes from "../Models/Filme.js";
import Usuariosxfilmes from "../Models/Usuarioxfilme.js";
import flash from "connect-flash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

// Configuração do multer 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();  
        cb(null, `${timestamp}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage: storage });

//ROTA DE FORM DE CADASTRO
const router = express.Router();
router.get("/filme", (req, res) => {
    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para cadastrar um filme.");
            return res.redirect("/login");
        }

        res.render("filme", {
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar o formulário de cadastro. Tente novamente!");
        res.redirect("/inicial");
    }
});

// Rota para cadastrar o novo filme com imagem
router.post("/filme/new", upload.single("imagem"), async (req, res) => {
    const { titulo, ano } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null;  

    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para criar um filme.");
            return res.redirect("/login");
        }

        const novoFilme = await Filmes.create({
            titulo: titulo,
            ano: ano,
            imagem: imagem,  
        });

        await Usuariosxfilmes.create({
            id_usu: req.session.user.id,
            id_filme: novoFilme.id_filme,
        });

        req.flash("success", "Filme criado e adicionado à sua lista com sucesso!");
        res.redirect("/inicial");  
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao criar filme. Tente novamente!");
        res.redirect("/inicial");
    }
});

// Rota para exibir todos os filmes
router.get("/inicial", async (req, res) => {
    try {
        const filmes = await Filmes.findAll();

        res.render("inicial", {
            filmes: filmes,
            user: req.session.user,
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar filmes. Tente novamente!");
        res.redirect("/inicial");
    }
});



// ROTA PARA INDEX
router.get("/", async (req, res) => {
    try {
        //ultimos 4 filmes
        const filmes = await Filmes.findAll({
            limit: 4,                
            order: [['id_filme', 'DESC']] 
        });

        res.render("index", {
            filmes: filmes, 
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar filmes. Tente novamente!");
        res.redirect("/"); 
    }
});

//ROTA PRA TODOS OS FILMES
router.get("/inicial", async (req, res) => {
    try {
        const filmes = await Filmes.findAll();

        res.render("inicial", {
            filmes: filmes,  
            user: req.session.user,
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar filmes. Tente novamente!");
        res.redirect("/inicial");
    }
});


// ROTA PARA EDITAR UM FILME (Somente filmes que o usuário criou)
router.get("/editar-filme/:id_filme", async (req, res) => {
    const { id_filme } = req.params;

    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para editar um filme.");
            return res.redirect("/login");
        }

        const filmeAssociado = await Usuariosxfilmes.findOne({
            where: {
                id_usu: req.session.user.id,
                id_filme: id_filme,
            },
        });

        if (!filmeAssociado) {
            req.flash("error", "Você não tem permissão para editar este filme.");
            return res.redirect("/inicial");
        }

        const filme = await Filmes.findByPk(id_filme);
        res.render("editarFilme", {
            filme: filme,
            successMessage: req.flash("success"),
            errorMessage: req.flash("error"),
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao carregar o filme para edição. Tente novamente!");
        res.redirect("/inicial");
    }
});

// ROTA PARA ATUALIZAR UM FILME (Somente filmes que o usuário criou)
router.post("/atualizar-filme/:id_filme", async (req, res) => {
    const { id_filme } = req.params;
    const { titulo, ano, imagem } = req.body;

    try {
        if (!req.session.user) {
            req.flash("error", "Você precisa estar logado para editar um filme.");
            return res.redirect("/login");
        }

        const filmeAssociado = await Usuariosxfilmes.findOne({
            where: {
                id_usu: req.session.user.id,
                id_filme: id_filme,
            },
        });

        if (!filmeAssociado) {
            req.flash("error", "Você não tem permissão para editar este filme.");
            return res.redirect("/inicial");
        }

        const filme = await Filmes.findByPk(id_filme);
        if (filme) {
            filme.titulo = titulo;
            filme.ano = ano;
            filme.imagem = imagem;

            await filme.save(); // Atualiza o filme no banco de dados

            req.flash("success", "Filme atualizado com sucesso!");
            res.redirect("/inicial");
        } else {
            req.flash("error", "Filme não encontrado!");
            res.redirect("/inicial");
        }
    } catch (error) {
        console.log(error);
        req.flash("error", "Erro ao atualizar o filme. Tente novamente!");
        res.redirect("/inicial");
    }
});

export default router;
