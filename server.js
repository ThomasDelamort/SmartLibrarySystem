import { app } from "./index.js"
import devann from "./database.js"
import dotenv from "dotenv"

dotenv.config()

const port = process.env.PORT || 3000;

devann();

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});