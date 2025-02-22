'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { messageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useToast } from "@/components/ui/use-toast"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-separator'
import { Textarea } from '@/components/ui/textarea'
import { FaRobot } from "react-icons/fa6";

const specialChar = '||';

// Function to split the message string into an array
const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

// Initial messages displayed before fetching AI-generated ones
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<string[]>(parseStringMessages(initialMessageString));

  // Function to send a message
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });
      toast({
        title: response.data.message,
        description: 'Message sent',
        variant: 'success',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch suggested messages
  const fetchSuggestedMessages = async () => {
    // Show toast while processing
    toast({
      title: "Please wait...",
      description: "AI is processing...",
      variant: "success",
    });
  
    try {
      const response = await axios.post<ApiResponse>('/api/suggest-messages');
      const messageString = (response.data as { generatedText?: string }).generatedText;
  
      if (messageString) {
        const newMessages = parseStringMessages(messageString);
        console.log(newMessages);
        setAiMessages(newMessages);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI suggestions",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField 
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your anonymous message here" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button onClick={fetchSuggestedMessages} className="my-4">
            AI suggestions <FaRobot />
          </Button>
          <p>Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {aiMessages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="mb-4">Get Your Message Board</div>
      {/* <Button href={'/sign-up'}>Create Your Account</Button> */}
    </div>
  );
}
