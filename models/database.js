import mongoose from 'mongoose';
import {app} from '../index.js'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

async function devann(){
    try{
        await mongoose.connect(mongoURI);
        console.log("Connected to DB");
        app.listen(port, () => console.log('Listening on port ${port}'));
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default devann;