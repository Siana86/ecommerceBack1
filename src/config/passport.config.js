import passport from "passport";
import local from "passport-local";
import passportJWT from "passport-jwt";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import connectMongoDB from "./db.js";
import User from "../models/user.model.js";

//Inicializar variables de entorno
dotenv.config();

const buscarToken = req => {
    let token = null

    if (req.cookies.cookieToken) token = req.cookies.cookieToken

    return token
};


export const iniciarPassport = () => {
    passport.use("current",
        new passportJWT.Strategy(
            {
                secretOrKey: process.env.SECRET,
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscarToken])

            }, // aqui va la estrategia con JWT y tb se debe pasar los parametros al async
            async (contenidoToken, done) => {
                try {
                    const usuario = await User.findById(contenidoToken._id).populate("cart");
                    if (!usuario) return done(null, false);
                    return done(null, usuario);
                } catch (error) {
                    return done(error)
                }

            }
        )


    );



    passport.use("login",
        new local.Strategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            async (email, password, done) => {
                try {
                    //TO DO: colocar mensajes genericos para la entrega final
                    const usuario = await User.findOne({ email}).populate("cart");
                    // if (!usuario) return res.status(400).send({ error: `Error credenciales` })
                    if (!usuario) return done(null, false, { message: "Usuario no encontrado" })  // fallo en la validacion, se deja el msn tan especifico solo por ser desarrollo

                    const passwordValida = bcrypt.compareSync(password, usuario.password);
                    if (!passwordValida) {
                        // return res.status(400).send({ error: `Error credenciales` })
                        return done(null, false, { message: "Contraseña incorrecta" }) //se deja el msn tan especifico solo por ser desarrollo
                    }

                    return done(null, usuario)

                } catch (error) {
                    return done(error)
                }
            }
        )
    );
};
