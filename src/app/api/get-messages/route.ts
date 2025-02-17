import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from "next-auth";
import mongoose from "mongoose";

export async function GET()
{
    await dbConnect()
    const session =await getServerSession(authOptions)
    const _user:User=session?.user as User
    if(!session || !_user){
        return Response.json(
            {
                success:false,
                message:"Not Authenticated"
            },
            {status:401}
        )
    }
    // const userId=user._id;  //we will convert this to mongoose object id form
    const userId=new mongoose.Types.ObjectId(_user._id);
    try{
        //we have to bring all the messages here
        //but we can't do that by bringing the entire message documnt, thats not optimised
        //so w ll be using AGGREGATION PIPELINING
        //aggregation pilining:
        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group:{_id: '$_id',messages:{$push:'$messages'}}}
        ]).exec()
        if(!user || user.length===0)
        {
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {status:404}
            )
        }

        return Response.json(
            {
                messages:user[0].messages
            },
            {status:200}
        )
    }catch(error)
    {
        console.log("An error occured: ", error);
        return Response.json(
            {
                success:false,
                message:"Internal server error"
            },
            {status:500}
        )
    }

}