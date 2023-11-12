"use client"
import React, {useEffect, useState} from "react";
import supabase from "@/util/db";
import {Game,PlayerTableData, Shot} from "@/util/entities";

export default function Stats()
{
    const [teamMap, setTeamMap] = useState<Map<number, string>>(new Map<number,string>());
    const [gameList, setGameList] = useState<Game[]>([]);
    const [game, setGame] = useState<Game>();
    const [team1PlayersData, setTeam1PlayersData] = useState<PlayerTableData[]>([]);
    const [team2PlayersData, setTeam2PlayersData] = useState<PlayerTableData[]>([]);
    const [selectedTeam, setSelectedTeam] = useState<number>(0);

    const getTeams = async () =>
    {
        const { data, error } = await supabase.from("Teams").select();
        if (error)
        {
            console.error(error);
            return;
        }

        if (data)
        {
            const map = new Map<number,string>();
            data.forEach(team => map.set(team.team_id, team.team_name))
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

    const getData = async() => {

        console.log("game: ")
        console.log(game);
        if (game == undefined)
        {
            return;
        }

        const {data, error} = await supabase.from("Players").select("*, Shots(*), Blocks(*), Turnovers(*)")
                                                                    .eq("Shots.game_id", game.game_id)
                                                                    .eq("Blocks.game_id", game.game_id)
                                                                    .eq("Turnovers.game_id", game.game_id);

        if (error)
        {
            console.error(error);
            return;
        }

        if (data)
        {
            console.log(data);

            const team1DataTable : PlayerTableData[] = [];
            const team2DataTable : PlayerTableData[] = [];

            data.forEach(player => {

                const onePointShots : Shot[] = []
                const twoPointShots : Shot[] = []
                const threePointShots : Shot[] = []

                player.Shots.forEach(shot => {
                    switch (shot.point_value) {
                    case 1:
                        onePointShots.push(shot);
                        break;
                    case 2:
                        twoPointShots.push(shot);
                        break;
                    case 3:
                        threePointShots.push(shot);
                        break;
                    default:
                      console.log("Discarded one shot for illegal shot value")
                    }
                })

                const data : PlayerTableData = {
                    playerId: player.player_id,
                    playerName: player.player_name,
                    playerNumber : 0,
                    blocks: player.Blocks.length,
                    turnovers: player.Turnovers.length,
                    onePointShot: {
                        attempted: onePointShots.length,
                        successful: onePointShots.filter(shot => shot.shot_result == "hit").length,
                        percentage: onePointShots.length > 0 ? (onePointShots.filter(shot => shot.shot_result == "hit").length / onePointShots.length * 100) : 0,
                    },
                    twoPointShot: {
                        attempted: twoPointShots.length,
                        successful: twoPointShots.filter(shot => shot.shot_result == "hit").length,
                        percentage: twoPointShots.length > 0 ? (twoPointShots.filter(shot => shot.shot_result == "hit").length / twoPointShots.length * 100) : 0,
                    },
                    threePointShot: {
                        attempted: threePointShots.length,
                        successful: threePointShots.filter(shot => shot.shot_result == "hit").length,
                        percentage: threePointShots.length > 0 ? (threePointShots.filter(shot => shot.shot_result == "hit").length / threePointShots.length * 100) : 0,
                    },

                }

                if (player.team_id == game.team_1)
                {
                    team1DataTable.push(data)
                }
                else
                {
                    team2DataTable.push(data)
                }
            });

            setTeam1PlayersData(team1DataTable);
            setTeam2PlayersData(team2DataTable);
        }
    }

    useEffect(() => {
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [game])

    const onGameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const game = JSON.parse(event.target.value) as Game;
        setGame(game);
        setSelectedTeam(game.team_1);
    }

    const teamTable = (playersData: PlayerTableData[]) =>{
        return (
            <table className="table-auto mt-2 text-center">
                <colgroup/>
                <colgroup/>
                <colgroup span={3}/>
                <colgroup span={3}/>
                <colgroup span={3}/>
                <colgroup/>
                <colgroup/>
                <thead>
                <tr>
                    <th rowSpan={2}>Player</th>
                    <th rowSpan={2}>#</th>
                    <th colSpan={3} scope="colgroup">FT</th>
                    <th colSpan={3} scope="colgroup">2-pt FG</th>
                    <th colSpan={3} scope="colgroup">3-pt FG</th>
                    <th rowSpan={2}>Blocks</th>
                    <th rowSpan={2}>Turnovers</th>
                </tr>
                <tr>
                    <th scope="col">1 Pointers att.</th>
                    <th scope="col">1 Pointer made</th>
                    <th scope="col">%</th>
                    <th scope="col">2 Pointers att.</th>
                    <th scope="col">2 Pointers made</th>
                    <th scope="col">%</th>
                    <th scope="col">3 Pointers att.</th>
                    <th scope="col">3 Pointers made</th>
                    <th scope="col">%</th>
                </tr>
                </thead>
                <tbody>
                {playersData.map(playerData => (
                    <tr key={playerData.playerId}>
                        <td>{playerData.playerName}</td>
                        <td>{playerData.playerNumber}</td>
                        <td>{playerData.onePointShot.attempted}</td>
                        <td>{playerData.onePointShot.successful}</td>
                        <td>{playerData.onePointShot.percentage}</td>
                        <td>{playerData.twoPointShot.attempted}</td>
                        <td>{playerData.twoPointShot.successful}</td>
                        <td>{playerData.twoPointShot.percentage}</td>
                        <td>{playerData.threePointShot.attempted}</td>
                        <td>{playerData.threePointShot.successful}</td>
                        <td>{playerData.threePointShot.percentage}</td>
                        <td>{playerData.blocks}</td>
                        <td>{playerData.turnovers}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        )
    }

    return (
        <div>
            <h1 className='text-6xl text-center pb-6'>Stats</h1>
            <label>
                Game:
                <select className='border-2 border-gray-400 ml-2' name='game' id='game' defaultValue="" onChange={onGameChange}>
                    <option value="" disabled >Select the game</option>
                    {gameList.map(game =>
                        (<option key={game.game_id} value={JSON.stringify(game)}>{teamMap.get(game.team_1)} - {teamMap.get(game.team_2)} @ {game.game_date}</option>)
                    )}
                </select>
            </label>
            {
                !game ?
                    <h3 className="text-3xl text-center mt-4">No game selected</h3>
                :
                    <div className="mt-4">
                        <div className="flex justify-center">
                            <h3 className="text-3xl cursor-pointer" onClick={(_) => {setSelectedTeam(game.team_1)}}>{teamMap.get(game.team_1)}</h3>
                            <h3 className="text-3xl mx-3">-</h3>
                            <h3 className="text-3xl cursor-pointer" onClick={(_) => {setSelectedTeam(game.team_2)}}>{teamMap.get(game.team_2)}</h3>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-2xl text-center">{teamMap.get(selectedTeam)}</h4>
                            {
                                selectedTeam == game.team_1 ? teamTable(team1PlayersData) : teamTable(team2PlayersData)
                            }
                        </div>
                    </div>
            }
        </div>
    )
}