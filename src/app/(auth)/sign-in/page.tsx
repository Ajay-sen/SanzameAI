'use client'
import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import * as z from "zod";
import Link from "next/link"
import {useToast} from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';


export default function SignInForm(){
 const {toast}=useToast()
 const router=useRouter()

 //zod implementation
 const form=useForm<z.infer<typeof signInSchema>>({
  resolver:zodResolver(signInSchema),
  defaultValues:{
    identifier:'',
    password:''
  }
 })


//here the sign in is doen using next auth, unlike the sign up
 const onSubmit=async(data: z.infer<typeof signInSchema>)=>{
  const result=await signIn('credentials',{
    redirect:false,
    identifier:data.identifier,
    password:data.password
  })
  if(result?.error){
    toast({
      title:"Login Failed",
      description:"Incorrect username or password",
      variant:"destructive"
    })
  }

  if(result?.url){
    router.replace('/dashboard')
  }
 }
  return(
    <div className="flex  justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Join Sanzame AI
          </h1>
          <p className="mb-4">
              Sign in to start your anonymous adventures
          </p>

        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                <FormLabel>Username/Email</FormLabel>
               
                <Input placeholder="username/email"
                 {...field}
                 />
                
                
                <FormMessage />
              </FormItem>
              )}
            />


            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
               
                <Input type="password" placeholder="password"
                 {...field}
                
                 />
                
                <FormMessage />
              </FormItem>
              )}
            />
            <Button type="submit" className='w-full'>Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
