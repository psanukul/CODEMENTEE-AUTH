import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Prisma from "../prisma/prismaClient.js"
import { cookieConfig } from "../kitchensink/cookieConfig.js";
import { sendMail } from "../utils/nodemailer.js";
import { generateOTP } from "../kitchensink/generateRandomOtp.js";

export const signup = asyncHandler(async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await Prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);



  const otp = generateOTP();

  const [otpStored,mailSent] = await Promise.all([Prisma.otp.create({data:{email,otpVal:otp}}),sendMail(email,"Verify Your Mail","otpMail",{userName:email,OTP:otp})])

if(!otpStored||!mailSent)
{
    res.status(500).json({
        message: "Otp/Mail Sending Failed !!",
        status: "success",
      });
}

const newUser = await Prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    message: "User created successfully",
    status: "success",
  });
});
export const login = asyncHandler(async (req, res, next) => {
  const { email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await Prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    return res.status(400).json({ message: "User Not Found !!" });
  }

  const isPasswordValid =  bcrypt.compare(password,existingUser.password);
if(!isPasswordValid)
{
  return res.status(400).json({status:"fail",message:"Password Does Not Match !!"});
}

const refreshToken = jwt.sign(
    { userId: existingUser.id, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "25d" }
  );

  const accessToken = jwt.sign(
    { userId: existingUser.id, role: existingUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Update user with tokens
  await Prisma.user.update({
    where: { id: existingUser.id },
    data: {
      refreshToken,
    },
  });

  // Set cookies
  res.cookie("accessToken", accessToken, cookieConfig);

  res.cookie("refreshToken", refreshToken,cookieConfig);

  res.status(201).json({
    message: "User created successfully",
    status: "success",
  });
});

export const verifyMail = asyncHandler(async (req,res,next)=>{
    const {email,otp} = req.body;

    if(!email || !otp)
    {
        return res.status(400).json({status:"false",message:"Email/Otp Not Provided !!"});
    }

    const [existingUser,otpUnverifiedUser] = await Promise.all([Prisma.user.findUnique({ where: { email } }),Prisma.otp.findUnique({ where: { email } })])
    if(!existingUser || !otpUnverifiedUser)
    {
        return res.status(400).json({status:"false",message:"User/Otp Does Not Exists !!"});
 
    }
    
    if(otpUnverifiedUser.otp === otp.otpVal)
    {
        await Prisma.user.update({
            where:{id:existingUser.id},
            data:{isUserVerified:true}
        });
    }

    res.status(200).json({status:"success",message:"Email Verified Successfully !!"})

})




