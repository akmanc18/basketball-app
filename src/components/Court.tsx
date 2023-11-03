"use client"

import { Player, Position, ShotResult } from '@/util/entities'
import Image from 'next/image'
import { Input } from 'postcss';
import React, { useState } from 'react'

interface Props
{
    players: Player[];
}

export default function Court(props: Props) {
    const players = props.players;

    const [selectedPlayer, setSelectedPlayer] = useState<number>();
    const [selecterBlocker, setSelectedBlocker] = useState<number>();
    const [shotDot, setShotDot] = useState<Position>();
    const [turnoverDot, setTurnoverDot] = useState<Position>();
    const [shotResult, setShotResult] = useState<ShotResult>();
    const [gameTimer, setGameTimer] = useState<string>("00:00");

    const changeSelectedPlayer = (event: any) => 
    {
        setSelectedPlayer(event.target.value);
    };

    const changeSelectedBlocker = (event: any) =>
    {
        setSelectedBlocker(event.target.value);
    }

    const createShotDot = (event: any) => 
    {
        const {x, y} = event.nativeEvent;
        setShotDot({xPos: x, yPos: y});
        setTurnoverDot(undefined);
    };

    const createTurnoverDot = (event: any) => 
    {
        event.preventDefault();
        const {x, y} = event.nativeEvent;
        setTurnoverDot({xPos: x, yPos: y});
        setShotDot(undefined);
    };

    const changeShotResult = (event: any) =>
    {
        setShotResult(event.target.value);
    };

    const cancelButtonClick = (event:any) =>
    {
        setShotDot(undefined);
        setTurnoverDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
    };

    const saveShotButtonClick = (event:any) =>
    {
        setShotDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
    };

    const saveTurnoverButtonClick = (event:any) =>
    {
        setTurnoverDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
    };

    return (
        <div>
            <Image src="/court.jpg" alt="Court image" width={860} height={462} onClick={createShotDot} onContextMenu={createTurnoverDot}>
            </Image>
            {
                shotDot && 
                (
                    <div>
                        <div className="redDot" style=
                        {{
                            left: shotDot.xPos,
                            top: shotDot.yPos,
                        }} />

                        <div className="p-3 popupDiv" style=
                        {{
                            left: shotDot.xPos + 15,
                            top: shotDot.yPos + 5,
                        }} >
                            <div className='grid grid-cols-1 grid-rows-2'>
                                { shotResult != "blocked" &&
                                    ( <div className='grid grid-cols-3 grid-rows-1 text-center gap-3'>
                                        <label>
                                            Player
                                            <br/>
                                            <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                {players.map(player =>
                                                    (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                )}
                                            </select>
                                        </label>
                                        <label>
                                            Shot Result
                                            <br/>
                                            <select className='border-2 border-gray-400 text-center' onChange={changeShotResult}>
                                                <option value='hit'>Hit</option>
                                                <option value='missed'>Missed</option>
                                                <option value='blocked'>Blocked</option>
                                            </select>
                                        </label>
                                        <label>
                                            Game Timer
                                            <br/>
                                            <input className='text-center w-20 border-2 border-gray-400' type='text' value={gameTimer} onChange={(event) => setGameTimer(event.target.value)}/>
                                        </label>
                                    </div> )
                                }
                                { shotResult == "blocked" &&
                                    ( <div className='grid grid-cols-4 grid-rows-1 text-center gap-3'>
                                        <label>
                                            Player
                                            <br/>
                                            <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                {players.map(player =>
                                                    (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                )}
                                            </select>
                                        </label>
                                        <label>
                                            Shot Result
                                            <br/>
                                            <select className='border-2 border-gray-400 text-center' onChange={changeShotResult}>
                                                <option value='blocked'>Blocked</option>
                                                <option value='hit'>Hit</option>
                                                <option value='missed'>Missed</option>
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
                                        <label>
                                            Game Timer
                                            <br/>
                                            <input className='text-center w-20 border-2 border-gray-400' type='text' value={gameTimer} onChange={(event) => setGameTimer(event.target.value)}/>
                                        </label>
                                    </div> )
                                }
                                <div className='grid grid-cols-4 grid-rows-1 items-end gap-2'>
                                    <div className='w-8'></div>
                                    <button className='border-2 border-red-400 w-20' onClick={cancelButtonClick}>Cancel</button>
                                    <button className='border-2 border-green-400 w-20' onClick={saveShotButtonClick}>Save</button>
                                    <div className='w-8'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                turnoverDot && 
                (
                    <div>
                        <div className="limeDot" style=
                        {{
                            left: turnoverDot.xPos,
                            top: turnoverDot.yPos,
                        }} />

                        <div className="p-3 popupDiv" style=
                        {{
                            left: turnoverDot.xPos + 15,
                            top: turnoverDot.yPos + 5,
                        }} >
                            <div className='grid grid-cols-1 grid-rows-2'>
                                <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                    <label>
                                        Player
                                        <br/>
                                        <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                            {players.map(player =>
                                                (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                            )}
                                        </select>
                                    </label>
                                    <label>
                                        Game Timer
                                        <br/>
                                        <input className='text-center w-20 border-2 border-gray-400' type='text' value={gameTimer} onChange={(event) => setGameTimer(event.target.value)}/>
                                    </label>
                                </div>
                                <div className='grid grid-cols-2 grid-rows-1 items-end gap-2'>
                                    <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                                    <button className='border-2 border-green-400 w-24' onClick={saveTurnoverButtonClick}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
