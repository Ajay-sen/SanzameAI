import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number;
};

const connection:ConnectionObject={};

//database connection
//in platforms other than NextJS the backend keeps running all the time
//Next.js is a React framework that supports both static generation (SSG) and server-side rendering (SSR). Pages are generated or rendered only when needed:
// SSG: Pre-rendered at build time.
// SSR: Rendered on the server for each request.
//Next.js does not keep a continuous backend process running. API routes and server-side logic are executed on-demand, aligned with the requested resource.

async function dbConnect():Promise<void>{
    if(connection.isConnected){                         //checking if connection already exist
        console.log("Already connected to database");
        return;
    }
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
    }

    try{
        const db=await mongoose.connect(process.env.MONGODB_URI);

        connection.isConnected=db.connections[0].readyState

        console.log("db connected successfully");
    }catch(error){
        console.log("database conection failed",error);
        process.exit(1);
    }
}

export default dbConnect;