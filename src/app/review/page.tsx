"use client"
import React, {useEffect, useState} from "react";
import {Game, PlaysType, Team} from "@/util/entities";
import supabase from "@/util/db";
import CourtReview from "@/components/CourtReview";

export default function Review()
{
    const [teamMap, setTeamMap] = useState<Map<number, Team>>(new Map<number,Team>());
    const [gameList, setGameList] = useState<Game[]>([]);
    const [game, setGame] = useState<Game>();

    const getTeams = async () =>
    {
        const { data, error } = await supabase.from("Teams").select().returns<Team[]>();
        if (error)
        {
            console.error(error);
            return;
        }

        if (data)
        {
            const map = new Map<number,Team>();
            data.forEach(team => map.set(team.team_id, team))
            setTeamMap(map);
        }
    }

    useEffect(() => {
        getTeams();
    }, [])

    const getGames = async () =>
    {
        const { data , error} = await supabase.from("Games").select().returns<Game[]>();
        if (error)
        {
            console.error(error);
            return;
        }

        if (data)
        {
            setGameList(data);
        }
    }

    useEffect(() => {
        getGames();
    }, [])

    const onGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const game = JSON.parse(event.target.value) as Game;
        setGame(game);
    }

    return (
        <div className="w-full flex flex-col">
            <h1 className="text-6xl text-center pb-6">Review</h1>
            <div className="flex justify-center">
                <label>
                    Game:
                    <select className='border-2 border-gray-400 ml-2' name='game' id='game' defaultValue="" onChange={onGameChange}>
                        <option value="" disabled >Select the game</option>
                        {gameList.map(game =>
                          (<option key={game.game_id} value={JSON.stringify(game)}>{teamMap.get(game.team_1)!.team_name} - {teamMap.get(game.team_2)!.team_name} @ {game.game_date}</option>)
                        )}
                    </select>
                </label>
            </div>
            {
                game ?
                    <CourtReview game={game} team1={teamMap.get(game.team_1)!} team2={teamMap.get(game.team_2)!}/>
                  :
                  null
            }
        </div>
    )
}