import express from "express";
import passport from "passport";
import { asyncHandler } from "../utils/asyncHandler.js";
import chalk from "chalk";
import prisma from "../prisma/prismaClient.js"
import jwt from "jsonwebtoken"
export const samlRoutes = express.Router();


samlRoutes.route('/callback').get(passport.authenticate("saml",{failureRedirect:"/login-failure"}),asyncHandler(async (req,res)=>{
    const samlUser = req.user;
    
    console.log(chalk.bgGreenBright("We Are Comming on to the saml callback"));
    console.log("user",req.user);
    const data = req.user._json;
console.log("the main and usefull data recieved is", data)
        // Extract attributes from SAML profile
        const email = data?.email || samlUser.user_id;
        console.log("the email is", email)
        const firstName = samlUser?.displayName || samlUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        const lastName = "Hello"
        //  samlUser.name?.familyName || samlUser['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
    
        let user = await prisma.user.findUnique({ where:{email} });
        console.log("the returned user from the prisma is", user)
        if (!user) {
          user = await prisma.user.create({
             data:{ email, firstName, lastName }
          });
        }
    console.log("the user after creation is", user)

        // 🎟️ Generate JWT token just like regular login
        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '25d' });

        res.cookie('accessToken',accessToken,cookieConfig);
        res.cookie('refreshToken',refreshToken,cookieConfig);
        res.json({ status:"success",message:"User Logged In Using SAML !!"});
      
    
    }) );

samlRoutes.route('/login').get((req, res, next) => {
        console.log("🔥 /saml/login hit");
        console.log("new data",req);
        next();
      }, passport.authenticate("saml", {
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

