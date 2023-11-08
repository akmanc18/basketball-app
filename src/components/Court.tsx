"use client"

import { OtherPlaysType, Player, Position, ShotResult } from '@/util/entities'
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
    const [selectedBlocker, setSelectedBlocker] = useState<number>();
    const [selectedAssister, setSelectedAssister] = useState<number>();
    const [shotDot, setShotDot] = useState<Position>();
    const [foulDot, setFoulDot] = useState<Position>();
    const [otherPlaysState, setOtherPlaysState] = useState<boolean>();
    const [otherPlaysType, setOtherPlaysType] = useState<OtherPlaysType>();
    const [shotResult, setShotResult] = useState<ShotResult>();
    const [gameTimer, setGameTimer] = useState<string>("00:00");

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

    const createShotDot = (event: any) => 
    {
        const {x, y} = event.nativeEvent;
        setShotDot({xPos: x, yPos: y});
        setFoulDot(undefined);
        setOtherPlaysState(false);
    };

    const createTurnoverDot = (event: any) => 
    {
        event.preventDefault();
        const {x, y} = event.nativeEvent;
        setFoulDot({xPos: x, yPos: y});
        setShotDot(undefined);
        setOtherPlaysState(false);
    };

    const changeShotResult = (event: any) =>
    {
        setShotResult(event.target.value);
    };

    const cancelButtonClick = (event:any) =>
    {
        setShotDot(undefined);
        setFoulDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
        setOtherPlaysState(false);
        setOtherPlaysType(undefined);
    };

    const saveShotButtonClick = (event:any) =>
    {
        setShotDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
        setOtherPlaysState(false);
    };

    const saveFoulButtonClick = (event:any) =>
    {
        setFoulDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
        setOtherPlaysState(false);
    };

    const saveOtherPlaysButtonClick = (event: any) =>
    {
        setShotDot(undefined);
        setFoulDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
        setOtherPlaysState(false);
        setOtherPlaysType(undefined);
    };

    const otherPlaysButtonClick = (event:any) =>
    {
        setOtherPlaysState(true);
    };

    const changeOtherPlaysType = (event:any) =>
    {
        setOtherPlaysType(event.target.value);
    };

    return (
        <div>
            <Image src="/court.jpg" alt="Court image" width={860} height={462} onClick={createShotDot} onContextMenu={createTurnoverDot}>
            </Image>
            {
                shotDot && !otherPlaysState &&
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
                                { shotResult == "hit" &&
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
                                                <option value='hit'>Hit</option>
                                                <option value='missed'>Missed</option>
                                                <option value='blocked'>Blocked</option>
                                            </select>
                                        </label>
                                        <label>
                                            Assisting Player
                                            <br/>
                                            <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedAssister}>
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
                                { shotResult != "hit" && shotResult != "blocked" &&
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
                                                <option value='missed'>Missed</option>
                                                <option value='hit'>Hit</option>
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
                                <div className='grid grid-cols-5 grid-rows-1 items-end gap-2'>
                                    <div className='w-8'></div>
                                    <button className='border-2 border-red-400 w-20' onClick={cancelButtonClick}>Cancel</button>
                                    <button className='border-2 border-green-400 w-20' onClick={saveShotButtonClick}>Save</button>
                                    <button className='border-2 border-blue-400 w-20' onClick={otherPlaysButtonClick}>Others</button>
                                    <div className='w-8'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                shotDot && otherPlaysState &&
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
                                { ( otherPlaysType == "ball loss" || otherPlaysType == undefined ) &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='steal'>Steal</option>
                                                    <option value='turnover'>Turnover</option>
                                                    <option value='rebound'>Rebound</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-end gap-2'>
                                            <button className='border-2 border-red-400 w-20' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-20' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                                { otherPlaysType == "steal" &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='steal'>Steal</option>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='turnover'>Turnover</option>
                                                    <option value='rebound'>Rebound</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-end gap-2'>
                                            <button className='border-2 border-red-400 w-20' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-20' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                                { otherPlaysType == "turnover" &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='turnover'>Turnover</option>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='steal'>Steal</option>
                                                    <option value='rebound'>Rebound</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-end gap-2'>
                                            <button className='border-2 border-red-400 w-20' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-20' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                                { otherPlaysType == "rebound" &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='rebound'>Rebound</option>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='steal'>Steal</option>
                                                    <option value='turnover'>Turnover</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-end gap-2'>
                                            <button className='border-2 border-red-400 w-20' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-20' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            {
                foulDot && !otherPlaysState &&
                (
                    <div>
                        <div className="limeDot" style=
                        {{
                            left: foulDot.xPos,
                            top: foulDot.yPos,
                        }} />

                        <div className="p-3 popupDiv" style=
                        {{
                            left: foulDot.xPos + 15,
                            top: foulDot.yPos + 5,
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
                                <div className='grid grid-cols-3 grid-rows-1 items-end gap-2'>
                                    <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                                    <button className='border-2 border-green-400 w-24' onClick={saveFoulButtonClick}>Save</button>
                                    <button className='border-2 border-blue-400 w-24' onClick={otherPlaysButtonClick}>Others</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                foulDot && otherPlaysState &&
                (
                    <div>
                        <div className="limeDot" style=
                        {{
                            left: foulDot.xPos,
                            top: foulDot.yPos,
                        }} />

                        <div className="p-3 popupDiv" style=
                        {{
                            left: foulDot.xPos + 15,
                            top: foulDot.yPos + 5,
                        }} >
                            <div className='grid grid-cols-1 grid-rows-2'>
                                { ( otherPlaysType == "ball loss" || otherPlaysType == undefined ) &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='steal'>Steal</option>
                                                    <option value='turnover'>Turnover</option>
                                                    <option value='rebound'>Rebound</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-center gap-2'>
                                            <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-24' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                                { otherPlaysType == "steal" &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='steal'>Steal</option>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='turnover'>Turnover</option>
                                                    <option value='rebound'>Rebound</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-center gap-2'>
                                            <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-24' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                                { otherPlaysType == "turnover" &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='turnover'>Turnover</option>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='steal'>Steal</option>
                                                    <option value='rebound'>Rebound</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-center gap-2'>
                                            <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-24' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                                { otherPlaysType == "rebound" &&
                                    ( <div>
                                        <div className='grid grid-cols-2 grid-rows-1 text-center gap-3'>
                                            <label>
                                                Play Type
                                                <br/>
                                                <select className='border-2 border-gray-400 text-center' onChange={changeOtherPlaysType}>
                                                    <option value='rebound'>Rebound</option>
                                                    <option value='ball loss'>Ball Loss</option>
                                                    <option value='steal'>Steal</option>
                                                    <option value='turnover'>Turnover</option>
                                                </select>
                                            </label>
                                            <label>
                                                Player
                                                <br/>
                                                <select className='border-2 border-gray-400' name='players' id='players' onChange={changeSelectedPlayer}>
                                                    {players.map(player =>
                                                        (<option key={player.player_id} value={player.player_id}>{player.player_name}</option>)
                                                    )}
                                                </select>
                                            </label>
                                        </div>
                                        <div className='grid grid-cols-2 grid-rows-1 items-center gap-2'>
                                            <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                                            <button className='border-2 border-green-400 w-24' onClick={saveOtherPlaysButtonClick}>Save</button>
                                        </div>
                                    </div> )
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
