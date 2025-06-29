import { sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
const userDashboardHandler = async (req, res) => {
    if (!req.oidc.isAuthenticated() || !req.oidc.user) {
        res.redirect("/");
        return;
    }
    res.locals.title = "Thông tin cá nhân";
    res.locals.cssPath = "/css/UserDashboard.css";
    const userData = sessionManager.users[req.oidc.user.sid] || await getUserFromDB(req.oidc.user.sub, req.oidc.user.email);
    res.render("userDashboard", {
        user: req.oidc.user,
        data: { ...userData }
    });
};
export default userDashboardHandler;
