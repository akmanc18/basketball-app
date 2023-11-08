"use client"

import {Player, PlaysType, Position, ShotResult} from '@/util/entities'
import Image from 'next/image'
import { Input } from 'postcss';
import React, {useCallback, useState} from 'react'

interface Props
{
    players: Player[];
}

const playTypes: PlaysType[] = ["Shot", "Ball loss", "Steal", "Turnover", "Rebound"]

export default function Court(props: Props) {
    const players = props.players;

    const [selectedPlayer, setSelectedPlayer] = useState<number>();
    const [selectedBlocker, setSelectedBlocker] = useState<number>();
    const [selectedAssister, setSelectedAssister] = useState<number>();
    const [shotDot, setShotDot] = useState<Position>();
    const [foulDot, setFoulDot] = useState<Position>();
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

    const createShotDot = (event: any) => 
    {
        const {x, y} = event.nativeEvent;
        setShotDot({xPos: x, yPos: y});
        setFoulDot(undefined);
    };

    const createTurnoverDot = (event: any) => 
    {
        event.preventDefault();
        const {x, y} = event.nativeEvent;
        setFoulDot({xPos: x, yPos: y});
        setShotDot(undefined);
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
    };

    const saveButtonClick = (event:any) =>
    {
        const playType = playTypes[Math.abs(currentActionCounter % 5)];
        setShotDot(undefined);
        setSelectedPlayer(undefined);
        setShotResult(undefined);
    };

    const getPopup = (actionCounter: number, shotPosition: Position) => {
        const playType = playTypes[Math.abs(actionCounter % 5)];

        const element = (
          <div className='flex flex-col gap-y-3'>
              <div className='flex text-center gap-5 justify-center place-content-between'>
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
                  <label>
                      Game Timer
                      <br/>
                      <input className='text-center w-20 border-2 border-gray-400' type='text' value={gameTimer}
                             onChange={(event) => setGameTimer(event.target.value)}/>
                  </label>
              </div>
              <div className='flex items-end gap-2'>
                  <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                  <button className='border-2 border-green-400 w-24' onClick={saveButtonClick}>Save</button>
              </div>
          </div>
        );

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
                        {getPopup(currentActionCounter, shotDot)}
                    </div>
                )
            }
            {
                foulDot &&
                (
                    <div>
                        <div className="limeDot" style=
                        {{
                            left: foulDot.xPos,
                            top: foulDot.yPos,
                        }} />
                        {getPopup(currentActionCounter, foulDot)}
                    </div>
                )
            }
        </div>
    )
}
