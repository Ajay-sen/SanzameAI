import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import {Message} from "@/model/User"

export async function POST(request:Request){
    await dbConnect()

    //for sending messages no authentication is required
    const {username,content}=await request.json()
    try{
        const user=await UserModel.findOne({username}).exec();

        //check if user present
        if(!user)
        {
            return Response.json(
                {
                    success:false,
                    message:"user not found"
                },
                {status:404}
            )
        }

        //is user accepting the messages
        if(!user.isAcceptingMessages){
            return Response.json(
                {
                    success:false,
                    message:"user not accepting messages"
                },
                {status:403} //forbidden status
            )
        }

        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success:true,
                message:"message sent successfully"
            },
            {status:201}
        )

    }catch(error)
    {
        console.log("error sending message",error)
        return Response.json(
            {
                success:false,
                message:"Error sendng message"
            },
            {status:500}
        )
    }
}