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
            <label>
                Email
                <input className='text-center w-20 border-2 border-gray-400' type='text' value={email} onChange={(event) => setEmail(event.target.value)}/>
            </label>
            <br/>
            <label>
                Password
                <input className='text-center w-20 border-2 border-gray-400' type='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
            </label>
            <button className='border-2 border-red-400 w-20' onClick={loginClick}>Log in</button>
            <button className='border-2 border-green-400 w-20' onClick={registerClick}>Register</button>
            <div>{error}</div>
        </div>
    )
}
