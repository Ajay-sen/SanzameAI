'use client'
import React from 'react'
import Link from 'next/link'
import {useSession,signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from './ui/button'

const Navbar = () => {
    const {data:session}=useSession()

    const user:User =session?.user as User
  return (
    <nav className='p-5 md:p-7 shadow-lg md:shadow-xl bg-white relative z-10'>
  <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
    <a className='text-2xl font-bold mb-4 md:mb-0 text-gray-900' href="#">Sanzame AI</a>
    {
      session ? (
        <>
          <span className='mr-4 text-gray-700'>Welcome, {user?.username || user?.email}</span>
          <Button className='w-full md:w-auto bg-black hover:bg-gray-700 text-white' onClick={() => signOut()}>Logout</Button>
        </>
      ) : (
        <Link href='/sign-in'>
          <Button className='w-full md:w-auto bg-black hover:bg-gray-700 text-white'>
            Login
          </Button>
        </Link>
      )
    }
  </div>
</nav>

  )
}

export default Navbar