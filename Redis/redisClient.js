import chalk from "chalk";
import Redis from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL||'redis://localhost:6379');


redisClient.on('connect',()=>{
    console.log(chalk.bgGreenBright("Redis Is Connected"));
})
redisClient.on('err',(err)=>{
    console.log(chalk.bgGreenBright("Error Occured On To The Redis "),err);
})


