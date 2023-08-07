import mongoose from 'mongoose';

let isConnected = false;//variable to check the DB Connection status

export const connectToDB = async()=>{
    mongoose.set('strictQuery',true);//prevent unknow field querys
    if(!process.env.MONGODB_URL )return console.log("Mongodb URL not found");
    if(isConnected) return console.log("Already connected to MongoDB");

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error while connecting to MongoDB",error);
        
    }
}