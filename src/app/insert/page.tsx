"use client"

import Court from '@/components/Court'
import supabase from '@/util/db';
import { Player, Team } from '@/util/entities';
import { useEffect, useState } from 'react'

export default function Home()
{
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [gameDate, setGameDate] = useState<string>("");
    const [teamOne, setTeamOne] = useState<number>(0);
    const [teamTwo, setTeamTwo] = useState<number>(0);
    const [gameCreated, setGameCreated] = useState<boolean>();
    const [gameId, setGameId] = useState<number>();
    
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

    async function getTeams()
    {
        const { data } = await supabase.from("Teams").select();
        const temp: Team[] = [];
        data?.forEach(team => temp.push({
            team_id: team.team_id,
            team_name: team.team_name,
        }))
        setTeams(temp);
    }

    useEffect(() => {
        getTeams();
    })

    const changeTeamOne = (event: any) => 
    {
        setTeamOne(event.target.value);
    }

    const changeTeamTwo = (event: any) => 
    {
        setTeamTwo(event.target.value);
    }

    const createGameButtonClick = async (event: any) => 
    {
        const { data, error } = await supabase.from("Games").insert({
            game_date: gameDate!,
            score_team_1: null,
            score_team_2: null,
            team_1: teamOne,
            team_2: teamTwo,
        }).select();

        if(data)
        {
            setGameCreated(true);
            setGameId(data![0].game_id);
        }
        if(error)
        {
            console.log(error);
        }
    }

    const dateInputLabel = (
        <label>
            Game Date
            <br/>
            <input className='text-center w-36 border-2 border-gray-400' type='date' value={gameDate}
                    onChange={(event) => setGameDate(event.target.value)}/>
        </label>
    )

    const teamOneDropdown = (
        <label>
            Team 1
            <br/>
            <select className='border-2 border-gray-400' name='players' id='players'
                    onChange={changeTeamOne} defaultValue="">
                <option value="" disabled>Select Team 1</option>
                {teams.map(team =>
                    (<option key={team.team_id} value={team.team_id}>{team.team_name}</option>)
                )}
            </select>
        </label>
    )

    const teamTwoDropdown = (
        <label>
            Team 2
            <br/>
            <select className='border-2 border-gray-400' name='players' id='players'
                    onChange={changeTeamTwo} defaultValue="">
                <option value="" disabled>Select Team 2</option>
                {teams.map(team =>
                    (<option key={team.team_id} value={team.team_id}>{team.team_name}</option>)
                )}
            </select>
        </label>
    ) 

    return (
        <div className='flex flex-col'>
            <div>
                <h1 className='text-6xl text-center pb-6'>Insert Plays</h1>
            </div>
            <div className='flex text-center justify-center gap-6'>
                {teamOneDropdown}
                {teamTwoDropdown}
                {dateInputLabel}
                {( gameDate != "" && teamOne != 0 && teamTwo != 0 && teamOne != teamTwo ) ? 
                <button className='border-2 border-blue-400 w-36' onClick={createGameButtonClick}>Create Game</button> : 
                null}
            </div>
            { 
                gameCreated &&
                (
                    <div>
                        <Court players={players} gameId={gameId!}/>
                    </div>
                )
            }
        </div>
    )
}
