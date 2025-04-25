import express from "express";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js";

export const  samlRoutes = express.Router();


samlRoutes.route('/callback').get(passport.authenticate("saml",{failureRedirect:"/login-failure"}),asyncHandler(async (req,res)=>{
    const samlUser = req.user;
    
    console.log(chalk.bgGreenBright("We Are Comming on to the saml callback"));
    console.log("user",req.user);
    
        // Extract attributes from SAML profile
        const email = samlUser.email || samlUser.nameID;
        const firstName = samlUser.firstName || samlUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        const lastName = samlUser.lastName || samlUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
    
        let user = await prisma.findUnique({ where:{email} });
        if (!user) {
          user = await prisma.user.create({
             data:{ email, firstName, lastName, isSaml: true }
          });
        }
    
        // 🎟️ Generate JWT token just like regular login
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '25d' });

        res.cookie('accessToken',accessToken,cookieConfig);
        res.cookie('refreshToken',refreshToken,cookieConfig);
        res.json({ status:"success",message:"User Logged In Using SAML !!"});
      
    
    }) );
    samlRoutes.route('/login').get((req, res, next) => {
        console.log("🔥 /saml/login hit");
        next();
      }, passport.authenticate("auth0", {
        scope: "openid email profile"
      }));


samlRoutes.get("/logout", (req, res) => {
        req.logOut();
      
        let returnTo = req.protocol + "://" + req.hostname;
        const port = req.connection.localPort;
      
        if (port !== undefined && port !== 80 && port !== 443) {
          returnTo =
            process.env.NODE_ENV === "production"
              ? `${returnTo}/`
              : `${returnTo}:${port}/`;
        }
      
        const logoutURL = new URL(
          `https://${process.env.AUTH0_DOMAIN}/v2/logout`
        );
      
        const searchString = querystring.stringify({
          client_id: process.env.AUTH0_CLIENT_ID,
          returnTo: returnTo
        });
        logoutURL.search = searchString;
      
        res.redirect(logoutURL);
      });

