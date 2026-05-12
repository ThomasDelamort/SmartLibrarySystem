import devann from "./database.js"
import dotenv from "dotenv"

dotenv.config()
const port = process.env.PORT || 3000;

devann();