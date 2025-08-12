import jwt from "jsonwebtoken"

export const auth= (req, res, next)=>{
    // if(!req.headers.authorization){
    if(!req.cookies.cookieToken){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`No hay token`})
    }

    let token=req.cookies.cookieToken

    try {
        let usuario=jwt.verify(token, process.env.SECRET)
        req.user=usuario
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Error: ${error.message}`})
    }

    next()
}