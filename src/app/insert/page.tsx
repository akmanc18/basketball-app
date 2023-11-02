"use client"

import Court from '@/components/Court'
import supabase from '@/util/db';
import { Player } from '@/util/entities';
import { useEffect, useState } from 'react'

export default function Home()
{
    const [players, setPlayers] = useState<Player[]>([]);
    
    async function getPlayers()
    {
        const { data } = await supabase.from("Players").select().eq('team_id', 1);
        const temp: Player[] = [];
        data?.forEach(player => temp.push({
            player_id : player.player_id,
            player_name : player.player_name,
            team_id : player.team_id,
        }))
        setPlayers(temp);
    }

    useEffect(() => {
        getPlayers();
    }, []);

    return (
        <div>
            <h1 className='text-6xl text-center pb-6'>Home</h1>
            <Court players={players}/>
        </div>
    )
}
