"use client"

import supabase from '@/util/db';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import {debounce} from "next/dist/server/utils";

export default function Login()
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    
    const router = useRouter();
    
    const loginClick = async () =>
    {
        if(email && password)
        {
            const {data, error} = await supabase.auth.signInWithPassword({email: email, password: password});
            if (!error)
            {
                router.push("/insert");
            }
            else
            {
                setError(error.message)
            }
        }
    };
    
    const registerClick = async () =>
    {
        if(email && password)
        {
            console.log("Signing up")
            const {data, error} = await supabase.auth.signUp({email: email, password: password})
            if (!error)
            {
                router.push("/insert");
            }
            else
            {
                setError(error.message)
            }
        }
    };

    return (
      <div>
        <div className="flex flex-col gap-y-4">
            <h1 className="text-4xl text-center mb-2">Login</h1>
            <div className="flex">
                <label htmlFor="email">Email:</label>
                <input name="email" className='border-2 border-gray-400 ml-2 flex-grow px-1' type='email' value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div className="flex">
                <label htmlFor="password">Password:</label>
                <input name="password" className='border-2 border-gray-400 ml-2 flex-grow px-1' type='password' value={password} onChange={(event) => setPassword(event.target.value)}/>

            </div>
            <div className="flex gap-x-2 justify-center">
                <button className='border-2 border-gray-400 w-20' onClick={loginClick}>Log in</button>
                <button className='border-2 border-gray-400 w-20' onClick={registerClick}>Register</button>
            </div>
        </div>
        {
            error ?
              <div className="text-center mt-4 text-red-500">Error: {error}</div>
              :
              null
        }
      </div>
    )
}
