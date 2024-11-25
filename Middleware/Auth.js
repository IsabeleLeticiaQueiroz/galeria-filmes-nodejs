// auth.js
export function verificarLogin(req, res, next) {
    if (!req.session.user) {
        req.flash("error", "Você precisa estar logado.");
        return res.redirect("/login");
    }
    next();
}
