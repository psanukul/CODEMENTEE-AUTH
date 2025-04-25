export const cookieConfig  = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 25 * 24 * 60 * 60 * 1000, // 7 days
  }