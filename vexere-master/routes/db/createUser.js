import { prisma, sessionManager } from '../../server';
async function createUser(req, res, next) {
    // console.log("Userd login callback middleware");
    if (!req.oidc.isAuthenticated()) {
        next();
        return;
    }
    if (req.oidc.user && req.oidc.user.sid && sessionManager.isLogged(req.oidc.user.sid)) {
        // console.log("Already logged");
        next();
        return;
    }
    await prisma.$connect();
    if (req.oidc.user && req.oidc.user.sub) {
        // console.log(req.oidc.user.sub);
        const userSaved = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: req.oidc.user.email },
                    { uuid: { contains: req.oidc.user.sub } }
                ]
            }
        });
        // console.log(userSaved);
        if (userSaved) {
            if (userSaved.uuid && userSaved.uuid.includes(req.oidc.user.sub)) {
                sessionManager.addUser(req.oidc.user.sid, {
                    id: userSaved.id,
                    Name: userSaved.Name,
                    email: userSaved.email,
                    phone: userSaved.phone
                });
                next();
                return;
            }
            userSaved.uuid = userSaved.uuid.concat(`, ${req.oidc.user.sub}`);
            const update = await prisma.user.update({
                where: {
                    id: userSaved.id
                },
                data: userSaved
            });
            sessionManager.addUser(req.oidc.user.sid, {
                id: update.id,
                Name: update.Name,
                email: update.email,
                phone: update.phone
            });
            next();
            return;
        }
        const newUser = {
            Name: req.oidc.user.name ? req.oidc.user.name : "",
            email: req.oidc.user.email ? req.oidc.user.email : null,
            uuid: req.oidc.user.sub
        };
        const newlyCreatedUser = await prisma.user.create({
            data: newUser
        });
        // console.log("NewUser",newlyCreatedUser);
        sessionManager.addUser(req.oidc.user.sid, {
            id: newlyCreatedUser.id,
            Name: newlyCreatedUser.Name,
            email: newlyCreatedUser.email,
            phone: newlyCreatedUser.phone
        });
    }
    next();
}
export default createUser;
