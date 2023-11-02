"use client"

import supabase from "@/util/db"
import Link from "next/link"
import { use, useEffect, useState } from 'react'

export default function NavBar()
{
    const [sessionValid, setSessionValid] = useState<boolean>(false)

    const checkSession = async () =>
    {
        const {data: {session}} = await supabase.auth.getSession()
        setSessionValid(session != null && session.user != null)
    }

    useEffect(() => {
        checkSession();
    }, []);

    
    return (
        <div className="flex flex-col gap-2 bg-zinc-400 padding-container relative z-30 py-5 px-2 lg:px-2">
            <Link href={"/"}>Home</Link>
            <Link href={sessionValid ? "/insert/" : "/"}>Insert</Link>
            <Link href={"/review/"}>Review</Link>
            <Link href={"/stats/"}>Stats</Link>
        </div>
    )
}