"use client"

import supabase from '@/util/db';
import {Player, PlaysType, Position, ShotResult, Team} from '@/util/entities'
import Image from 'next/image'
import { Input } from 'postcss';
import React, {useCallback, useState} from 'react'

interface Props
{
    players: Player[];
}

const playTypes: PlaysType[] = ["Shot", "Foul", "Ball loss", "Steal", "Turnover", "Rebound"]

export default function Court(props: Props) {
    const players = props.players;

    const [selectedPlayer, setSelectedPlayer] = useState<number>();
    const [selectedBlocker, setSelectedBlocker] = useState<number>();
    const [selectedAssister, setSelectedAssister] = useState<number>();
    const [teamOneDot, setTeamOneDot] = useState<Position>();
    const [teamTwoDot, setTeamTwoDot] = useState<Position>();
    const [shotResult, setShotResult] = useState<ShotResult>();
    const [gameTimer, setGameTimer] = useState<string>("00:00");
    const [currentActionCounter, setCurrentActionCounter] = useState<number>(0)

    const changeSelectedPlayer = (event: any) => 
    {
        setSelectedPlayer(event.target.value);
    };

    const changeSelectedBlocker = (event: any) =>
    {
        setSelectedBlocker(event.target.value);
    };

    const changeSelectedAssister = (event: any) =>
    {
        setSelectedAssister(event.target.value);
    };

    const createTeamOneDot = (event: any) => 
    {
        const {x, y} = event.nativeEvent;
        setTeamOneDot({xPos: x, yPos: y});
        setTeamTwoDot(undefined);
    };

    const createTeamTwoDot = (event: any) => 
    {
        event.preventDefault();
        const {x, y} = event.nativeEvent;
        setTeamTwoDot({xPos: x, yPos: y});
        setTeamOneDot(undefined);
    };

    const changeShotResult = (event: any) =>
    {
        setShotResult(event.target.value);
    };

    const cancelButtonClick = (event:any) =>
    {
        setTeamOneDot(undefined);
        setTeamTwoDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
    };

    const saveButtonClick = async (event:any) =>
    {
        const playType = playTypes[Math.abs(currentActionCounter % playTypes.length)];
        await savePlayToDatabase();
        setTeamOneDot(undefined);
        setTeamTwoDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
    };

    async function savePlayToDatabase()
    {
        const teamDot = teamOneDot ? teamOneDot : teamTwoDot

        const { error } = await supabase.from("Shots").insert({
            game_id: 1,
            game_timer: gameTimer,
            player_id: selectedPlayer!,
            point_value: 2,
            assister_id: selectedAssister,
            shot_result: shotResult!,
            blocker_id: selectedBlocker,
            shot_coordinates: [teamDot!.xPos, teamDot!.yPos]
        });
    }

    const getPopup = (actionCounter: number, shotPosition: Position) => {
        const playType = playTypes[Math.abs(actionCounter % playTypes.length)];
        
        const playerLabel = (
            <label>
                Player
                <br/>
                <select className='border-2 border-gray-400' name='players' id='players'
                        onChange={changeSelectedPlayer}>
                    {players.map(player =>
                    (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                    )}
                </select>
            </label>
        )

        const timerLabel = (
            <label>
                Game Timer
                <br/>
                <input className='text-center w-20 border-2 border-gray-400' type='text' value={gameTimer}
                        onChange={(event) => setGameTimer(event.target.value)}/>
            </label>
        )

        let element: React.JSX.Element
        if(playType == "Shot")
        {
            if(shotResult == "hit")
            {
                element = (
                <div className='flex flex-col gap-y-3'>
                    <div className='flex text-center gap-5 justify-center place-content-between'>
                        {playerLabel}
                        <label>
                            Shot Result
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeShotResult}>
                                <option value='hit'>Hit</option>
                                <option value='missed'>Missed</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </label>
                        <label>
                            Assist
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeSelectedAssister}>
                                {players.map(player =>
                                    (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                )}
                            </select>
                        </label>
                        {timerLabel}
                    </div>
                    <div className='flex justify-center items-end gap-2'>
                        <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                        <button className='border-2 border-green-400 w-24' onClick={saveButtonClick}>Save</button>
                    </div>
                </div>
                );
            }
            else if(shotResult == "missed")
            {
                element = (
                <div className='flex flex-col gap-y-3'>
                    <div className='flex text-center gap-5 justify-center place-content-between'>
                        {playerLabel}
                        <label>
                            Shot Result
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeShotResult}>
                                <option value='hit'>Hit</option>
                                <option value='missed'>Missed</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </label>
                        {timerLabel}
                    </div>
                    <div className='flex justify-center items-end gap-2'>
                        <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                        <button className='border-2 border-green-400 w-24' onClick={saveButtonClick}>Save</button>
                    </div>
                </div>
                );
            }
            else // shotResult == "blocked"
            {
                element = (
                <div className='flex flex-col gap-y-3'>
                    <div className='flex text-center gap-5 justify-center place-content-between'>
                        {playerLabel}
                        <label>
                            Shot Result
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeShotResult}>
                                <option value='hit'>Hit</option>
                                <option value='missed'>Missed</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </label>
                        <label>
                            Blocker
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedBlocker}>
                                {players.map(player =>
                                    (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                )}
                            </select>
                        </label>
                        {timerLabel}
                    </div>
                    <div className='flex justify-center items-end gap-2'>
                        <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                        <button className='border-2 border-green-400 w-24' onClick={saveButtonClick}>Save</button>
                    </div>
                </div>
                );
            }
        }
        else
        {
            element = (
            <div className='flex flex-col gap-y-3'>
                <div className='flex text-center gap-5 justify-center place-content-between'>
                    {playerLabel}
                    {timerLabel}
                </div>
                <div className='flex justify-center items-end gap-2'>
                    <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                    <button className='border-2 border-green-400 w-24' onClick={saveButtonClick}>Save</button>
                </div>
            </div>
        );
        }

        // uncomment this and delete the above const element to have different layouts based on playType.
        // the above const element is currently a copy of  the "Shot" case.

        // let element : React.JSX.Element;
        // switch (playType)
        // {
        //     case "Shot":
        //         element = (
        //           <div className='flex flex-col gap-y-3'>
        //               <div className='flex text-center gap-5 justify-center place-content-between'>
        //                   <label>
        //                       Player
        //                       <br/>
        //                       <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
        //                           {players.map(player =>
        //                             (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
        //                           )}
        //                       </select>
        //                   </label>
        //                   <label>
        //                       Game Timer
        //                       <br/>
        //                       <input className='text-center w-20 border-2 border-gray-400' type='text' value={gameTimer} onChange={(event) => setGameTimer(event.target.value)}/>
        //                   </label>
        //               </div>
        //               <div className='flex items-end gap-2'>
        //                   <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
        //                   <button className='border-2 border-green-400 w-24' onClick={saveFoulButtonClick}>Save</button>
        //               </div>
        //           </div>
        //         );
        //         break;
        //     case "Ball loss":
        //         element = (
        //           <div className='flex flex-col gap-y-3'>
        //
        //           </div>
        //         );
        //         break;
        //     case "Steal":
        //         element = (
        //           <div className='flex flex-col gap-y-3'>
        //
        //           </div>
        //         );
        //         break;
        //     case "Turnover":
        //         element = (
        //           <div className='flex flex-col gap-y-3'>
        //
        //           </div>
        //         );
        //         break;
        //     case "Rebound":
        //         element = (
        //           <div className='flex flex-col gap-y-3'>
        //
        //           </div>
        //         );
        //         break;
        //     default:
        //         element = (<div> Error </div>);
        //         break;
        // }

        return (
            <div className="p-3 popupDiv" style=
            {{
                left: shotPosition.xPos + 15,
                top: shotPosition.yPos + 5,
            }} >
                <div className="flex flex-col">
                    <div className="flex gap-x-5 items-center justify-between">
                        <svg viewBox="0 0 25 25" className="w-10 cursor-pointer" onClick={(_) => setCurrentActionCounter( actionCounter - 1)}>
                            <path d="M24 9v7H9v4l-8-7.5L9 5v4z" style={{fill: "#232326"}}/>
                        </svg>
                        <div>
                            {playType}
                        </div>
                        <svg viewBox="0 0 25 25" className="w-10 cursor-pointer" onClick={(_) => setCurrentActionCounter( actionCounter + 1)}>
                            <path d="M16 20v-4H1V9h15V5l8 7.5z" style={{fill: "#232326"}}/>
                        </svg>
                    </div>
                    {element}
                </div>
            </div>
        )
    }

    return (
        <div>
            <Image src="/court.jpg" alt="Court image" width={860} height={462} onClick={createTeamOneDot} onContextMenu={createTeamTwoDot}>
            </Image>
            {
                teamOneDot &&
                (
                    <div>
                        <div className="redDot" style=
                        {{
                            left: teamOneDot.xPos,
                            top: teamOneDot.yPos,
                        }} />
                        {getPopup(currentActionCounter, teamOneDot)}
                    </div>
                )
            }
            {
                teamTwoDot &&
                (
                    <div>
                        <div className="limeDot" style=
                        {{
                            left: teamTwoDot.xPos,
                            top: teamTwoDot.yPos,
                        }} />
                        {getPopup(currentActionCounter, teamTwoDot)}
                    </div>
                )
            }
        </div>
    )
}
