"use client"

import Court from '@/components/Court'
import supabase from '@/util/db';
import { Game, Player, Team } from '@/util/entities';
import { useEffect, useState } from 'react'

export default function Home()
{
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [gameDate, setGameDate] = useState<string>("");
    const [teamOne, setTeamOne] = useState<number>(0);
    const [teamTwo, setTeamTwo] = useState<number>(0);
    const [existingGameId, setExistingGameId] = useState<number>();
    const [gameSet, setGameSet] = useState<boolean>();
    const [gameId, setGameId] = useState<number>();
    const [gameTitle, setGameTitle] =useState<string>();
    
    async function getPlayers()
    {
        const { data, error } = await supabase.from("Players").select().eq('team_id', 1).returns<Player[]>();
        if (error)
        {
            console.error(error);
            return;
        }
        if(data)
        {
            setPlayers(data);
        }
    }

    useEffect(() => {
        getPlayers();
    }, []);

    async function getTeams()
    {
        const { data, error } = await supabase.from("Teams").select().returns<Team[]>();
        if (error)
        {
            console.error(error);
            return;
        }
        if(data)
        {
            setTeams(data);
        }
    }

    useEffect(() => {
        getTeams();
    }, [])

    async function getGames()
    {
        const { data, error } = await supabase.from("Games").select().returns<Game[]>();
        if (error)
        {
            console.error(error);
            return;
        }
        if(data)
        {
            setGames(data);
        }
    }

    useEffect(() => {
        getGames();
    }, [])

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
            setGameId(data[0].game_id);
            const teamOneName = teams.find(team => team.team_id == data[0].team_1)?.team_name;
            const teamTwoName = teams.find(team => team.team_id == data[0].team_2)?.team_name;
            setGameTitle(teamOneName + "vs" + teamTwoName + " - " + data[0].game_date);
            setGameSet(true);
        }
        if(error)
        {
            console.log(error);
        }
    }

    const changeExistingGame = (event: any) =>
    {
        setExistingGameId(event.target.value);
    }

    const setGameButtonClick = (event: any) =>
    {
        setGameId(existingGameId);
        const game = games.find(game => game.game_id == existingGameId);
        const teamOneName = teams.find(team => team.team_id == game?.team_1)?.team_name;
        const teamTwoName = teams.find(team => team.team_id == game?.team_2)?.team_name;
        setGameTitle(teamOneName + " vs " + teamTwoName + " - " + game?.game_date);
        setGameSet(true);
    }

    const resetGameButtonClick = (event: any) =>
    {
        setGameId(undefined);
        setGameTitle("");
        setGameSet(false);
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

    const existingGameDropdown = (
        <select className='border-2 border-gray-400' name='players' id='players'
                onChange={changeExistingGame} defaultValue="">
            <option value="" disabled>Select Game</option>
            {games.map(game =>
                (<option key={game.game_id} value={game.game_id}>{game.team_1} vs {game.team_2} - {game.game_date}</option>)
            )}
        </select>
    )

    return (
        <div className='flex flex-col'>
            <div>
                <h1 className='text-6xl text-center pb-6'>Insert Plays</h1>
            </div>
            {
                !gameSet &&
                (
                    <div>
                        <div className='flex text-center justify-center items-center gap-6'>
                            <div>New Game:</div>
                            {teamOneDropdown}
                            {teamTwoDropdown}
                            {dateInputLabel}
                            {( gameDate != "" && teamOne != 0 && teamTwo != 0 && teamOne != teamTwo ) ? 
                            <button className='border-2 border-blue-400 w-36' onClick={createGameButtonClick}>Create Game</button> : 
                            null}
                        </div>
                        <div className='my-3 border border-slate-400'/>
                        <div className='flex justify-center gap-6'>
                            <div>Existing Game:</div>
                            {existingGameDropdown}
                            <button className='border-2 border-blue-400 w-36' onClick={setGameButtonClick}>Set Game</button>
                        </div>
                    </div>
                )
            }
            { 
                gameSet &&
                (
                    <div>
                        <div className='flex text-center justify-center gap-6'>
                            <div>{gameTitle}</div>
                            <button className='border-2 border-red-400 w-36' onClick={resetGameButtonClick}>Change Game</button>
                        </div>
                        <div className='my-3'>
                            <Court players={players} gameId={gameId!}/>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
