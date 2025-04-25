import { configDotenv } from "dotenv";
configDotenv();
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'yOURSduveo6pZJ74FFqRlfwi6G4CEphs',
    issuerBaseURL: 'https://dev-wpxjv6wwvt0zqbrp.jp.auth0.com'
  };
  
  