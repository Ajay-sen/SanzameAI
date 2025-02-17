import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";      
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema=z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    //below we added the code to check that the  method must only be GET, else we will show error
    // but the current version of next js handles such cases by itself
    
    // if(request.method!=='GET')
    // {
    //     return Response.json({
    //         success:false,
    //         message:'Method not allowed',
    //     },{status:405})
    // }

    await dbConnect()

    try{
        //extracting the username from to url to validate it
        const {searchParams}=new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }

        //validating with zod
        const result=UsernameQuerySchema.safeParse(queryParam)
        console.log(result) // remove this 

        if(!result.success){
            const usernameErrors=result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors?.length>0?usernameErrors.join(', '):'Invalid query patrameters'
            },{status:400})
        }

        const {username}=result.data

        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'Username is already taken',
            },{status:400})
        }

        return Response.json({
            success:true,
            message:'Username is available',
        },{status:200})

    }catch(error){
        console.error("Error checking username",error)
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },
            {status:500}
        )
    }
}