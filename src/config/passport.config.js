import passport from "passport";
import local from "passport-local";

export const iniciarPassport= ()=>{
    passport.use("registro",
        new local.Strategy(
            {}, // aqui va la estrategia con JWT y tb se debe pasar los parametros al async
            async (done) => {                 
                try {
                       
                } catch (error) {
                    return done (error)
                }
                
            }
        )


    )

}