"use client"
import React, {useEffect, useState} from "react";
import supabase from "@/util/db";
import { Team } from "@/util/entities";

export default function TeamInsert()
{
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeamName, setNewTeamName] = useState<string>("");
    const [selectedTeam, setSelectedTeam] = useState<number>(0);
    const [newPlayerName, setNewPlayerName] = useState<string>("");
    const [newPlayerNumber, setNewPlayerNumber] = useState<number>(0);

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

    const changeSelectedTeam = (event: any) =>
    {
        setSelectedTeam(event.target.value);
    }

    const saveTeamButtonClick = async (event: any) =>
    {
        const { error } = await supabase.from("Teams").insert({
            team_name: newTeamName,
        });
        console.log(error);
    };

    const savePlayerButtonClick = async (event: any) =>
    {
        const { error } = await supabase.from("Players").insert({
            player_name: newPlayerName,
            team_id: selectedTeam,
            player_number: newPlayerNumber,
        });
        console.log(error);
    };

    return (
        <div>
        <div className="flex flex-col gap-y-4">
            <h1 className="text-6xl text-center mb-2">Add Team or Player</h1>
            <h1 className="text-2xl text-center mb-2">Refresh the page for new teams to load</h1>
            <h1 className="text-3xl text-center mb-2">New Team</h1>
            <div className="flex">
                <label htmlFor="newTeamName">Team Name:</label>
                <input name="newTeamName" className='border-2 border-gray-400 ml-2 flex-grow px-1' type='text' value={newTeamName} onChange={(event) => setNewTeamName(event.target.value)}/>
            </div>
            <div className="flex justify-center">
                <button className='border-2 border-gray-400 w-40' onClick={saveTeamButtonClick}>Register Team</button>
            </div>
            <h1 className="text-3xl text-center mb-2">New Player</h1>
            <div className="flex">
                <label htmlFor="team">Team:</label>
                <select className='border-2 border-gray-400 ml-2 flex-grow px-1' name='team' id='team'
                        onChange={changeSelectedTeam} defaultValue="">
                    <option value="" disabled>Select Team</option>
                    {teams.map(team =>
                        (<option key={team.team_id} value={team.team_id}>{team.team_name}</option>)
                    )}
                </select>
            </div>
            <div className="flex">
                <label htmlFor="newPlayerName">Player Name:</label>
                <input name="newPlayerName" className='border-2 border-gray-400 ml-2 flex-grow px-1' type='text' value={newPlayerName} onChange={(event) => setNewPlayerName(event.target.value)}/>
            </div>
            <div className="flex">
                <label htmlFor="newPlayerNumber">Player Number:</label>
                <input name="newPlayerNumber" className='border-2 border-gray-400 ml-2 flex-grow px-1' type='text' value={newPlayerNumber} onChange={(event) => setNewPlayerNumber(Number(event.target.value))}/>
            </div>
            <div className="flex justify-center">
                <button className='border-2 border-gray-400 w-40' onClick={savePlayerButtonClick}>Register Player</button>
            </div>
        </div>
        </div>
    );
}