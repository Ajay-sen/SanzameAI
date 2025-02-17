import {z} from 'zod'

export const usernameValidation=z
    .string()
    .min(2,"username must be atleasrt of 2 characters")
    .max(20,"No more than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special characters")

    //in this way you can use  zod to put any condition 

    export const signUpSchema=z.object({
        username:usernameValidation,
        email:z.string().email({message:'invalid email address'}),
        password:z.string().min(6,{message:"password must be atleast 6 characters"})
    })