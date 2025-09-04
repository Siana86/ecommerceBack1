import jwt from "jsonwebtoken"

// Middleware para validar token o asignar "public"
export const auth = (req, res, next) => {
    const token = req.cookies.cookieToken;

    if (!token) {
        // Usuario sin login → rol público
        req.user = { role: "public" };
        return next();
    }

    try {
        let usuario = jwt.verify(token, process.env.SECRET);
        req.user = usuario;
        // Si el usuario no tiene role en el token, le ponemos uno por defecto
        if (!req.user.role) req.user.role = "users";
    } catch (error) {
        // En caso de token inválido, tratamos como "public"
        req.user = { role: "public" };
    }

    next();
};

// Middleware para validar roles
export const authorization = (roles = []) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ error: "Usuario no autenticado" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Acceso denegado: rol no autorizado" });
        }

        next();
    };
};

// // Middleware para validar token
// export const auth = (req, res, next) => {
//     const token = req.cookies.cookieToken;

//     if (!token) {
//         // Usuario sin login → rol público
//         req.user = { role: "public" };
//         return next();
//     }

//     try {
//         let usuario = jwt.verify(token, process.env.SECRET);
//         req.user = usuario;
//     } catch (error) {
//         res.setHeader("Content-Type", "application/json");
//         return res.status(401).json({ error: `Error: ${error.message}` });
//     }

//     next();
// };

// // Middleware para validar roles
// export const authorization = (roles = []) => {
//     return (req, res, next) => {
//         if (!req.user) {
//             return res.status(401).json({ error: "Usuario no autenticado" });
//         }

//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ error: "Acceso denegado: rol no autorizado" });
//         }

//         next();
//     };
// };




// export const auth= (req, res, next)=>{
//     // if(!req.headers.authorization){
//     if(!req.cookies.cookieToken){
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`No hay token`})
//     }

//     let token=req.cookies.cookieToken

//     try {
//         let usuario=jwt.verify(token, process.env.SECRET)
//         req.user=usuario
        
//     } catch (error) {
//         res.setHeader('Content-Type','application/json');
//         return res.status(401).json({error:`Error: ${error.message}`})
//     }

//     next()
// }