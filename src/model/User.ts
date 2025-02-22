import mongoose , {Schema,Document} from "mongoose";

//message schema
//message schema not necessary needs to be in separate file than user one
export interface Message extends Document{
    content:string,
    createdAt:Date; 
}

const MessageSchema:Schema<Message>=new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now 
    }
})

//user schema
export interface User extends Document{
     username:string;
     email:string;
     password:string;
     verifyCode:string;
     verifyCodeExpiry:Date;
     isVerified:boolean;
     isAcceptingMessages:boolean;
     messages:Message[];
}

const UserSchema:Schema<User>=new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/.+\@.+\..+/, 'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"passweord is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"verifycode is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"verify code expiry is required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User",UserSchema)

export default UserModel;