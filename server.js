import { app } from "./index.js"
import devann from "./models/database.js"

const port = 3000;

devann();

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});