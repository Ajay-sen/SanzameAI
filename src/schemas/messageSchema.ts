  import {z} from "zod";

  export const messageSchema=z.object({
    content:z
    .string()
    .min(5,{message:'content must be atleast 5 characters'})
    .max(300,{message:'message must be atmost 300 characters'})
  })