import morgan from "morgan";
import express from "express";
import {configDotenv} from "dotenv";
import chalk from "chalk";
import { errorHandler, notFound } from "../utils/ErrorHandle.js";
import  authRoutes  from "../routes/authRoutes.js";
import expressSession from "express-session";
import passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import fs from "fs"
import { samlRoutes } from "../routes/samlRoutes.js";
import Auth0Strategy from "passport-auth0";
const cert = fs.readFileSync("./authOSecret.pem", "utf-8");
configDotenv();

const app = express();
const PORT =  process.env.PORT;
const session = {
    secret :process.env.SESSION_SECRET,
    cookie:{},
    resave:false,
    saveUninitialized:false
}

if(process.env.NODE_ENV == "development")
    session.cookie.secure = true;

const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
      /**
       * Access tokens are used to authorize users to an API
       * (resource server)
       * accessToken is the token to call the Auth0 API
       * or a secured third-party API
       * extraParams.id_token has the JSON Web Token
       * profile has all the information from the user
       */
      return done(null, profile);
    }
  );
app.use(express.json())
app.use(morgan(`${process.env.NODE_ENV == 'development' ? 'dev': 'tiny'}`));
app.use(expressSession(session));

passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
  });
  
passport.deserializeUser((user, done) => {
    done(null, user);
  });



// app.use('/auth',authRoutes);
app.use('/saml',samlRoutes);
app.use('/health',async (req,res)=>{

    return res.status(200).json({status:"success",message:"Auth Service Is Live !!"})


})

app.use(notFound);
app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(chalk.bgBlue(`Auth Server is live @ ${PORT}`))
})

