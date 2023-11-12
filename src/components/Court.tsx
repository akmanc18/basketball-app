"use client"

import supabase from '@/util/db';
import {Game, Player, PlaysType, Position, ShotResult} from '@/util/entities'
import { convertFromGameTime } from '@/util/utils';
import Image from 'next/image'
import React, { useState} from 'react'

interface Props
{
    players: Player[];
    game: Game;
}

const playTypes: PlaysType[] = ["Shot", "Foul", "Ball loss", "Steal", "Turnover", "Rebound"]

export default function Court(props: Props) {
    const players = props.players;
    const game = props.game;

    const [selectedPlayer, setSelectedPlayer] = useState<number>();
    const [selectedBlocker, setSelectedBlocker] = useState<number>();
    const [selectedAssister, setSelectedAssister] = useState<number>();
    const [teamOneDot, setTeamOneDot] = useState<Position>();
    const [teamOneDotRelative, setTeamOneDotRelative] = useState<Position>();
    const [teamTwoDot, setTeamTwoDot] = useState<Position>();
    const [teamTwoDotRelative, setTeamTwoDotRelative] = useState<Position>();
    const [currentTeamId, setCurrentTeamId] = useState<number>();
    const [oppositeTeamId, setOppositeTeamId] = useState<number>();
    const [shotResult, setShotResult] = useState<ShotResult>();
    const [gameTimer, setGameTimer] = useState<string>("");
    const [currentActionCounter, setCurrentActionCounter] = useState<number>(0);

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

    const createTeamOneDot = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
    {
        const bounds = event.currentTarget.getBoundingClientRect();
        const xRelative = Math.round(event.clientX - bounds.left);
        const yRelative = Math.round(event.clientY - bounds.top);
        const {x, y} = event.nativeEvent;
        setTeamOneDot({xPos: x, yPos: y});
        setTeamOneDotRelative({xPos: xRelative, yPos: yRelative});
        setTeamTwoDot(undefined);
        setTeamTwoDotRelative(undefined);
        setCurrentTeamId(game.team_1);
        setOppositeTeamId(game.team_2);
    };

    const createTeamTwoDot = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) =>
    {
        event.preventDefault();
        const bounds = event.currentTarget.getBoundingClientRect();
        const xRelative = Math.round(event.clientX - bounds.left);
        const yRelative = Math.round(event.clientY - bounds.top);
        const {x, y} = event.nativeEvent;
        setTeamTwoDot({xPos: x, yPos: y});
        setTeamTwoDotRelative({xPos:xRelative, yPos: yRelative});
        setTeamOneDot(undefined);
        setTeamOneDotRelative(undefined);
        setCurrentTeamId(game.team_2);
        setOppositeTeamId(game.team_1);
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
        setSelectedBlocker(undefined);
        setSelectedAssister(undefined);
        setShotResult(undefined);
    };

    const saveButtonClick = async (event:any) =>
    {
        const playType = playTypes[Math.abs(currentActionCounter % playTypes.length)];
        await savePlayToDatabase(playType);
        setTeamOneDot(undefined);
        setTeamTwoDot(undefined);
        setSelectedPlayer(undefined);
        setSelectedBlocker(undefined);
        setSelectedAssister(undefined);
        setShotResult(undefined);
    };

    async function savePlayToDatabase(playType: PlaysType)
    {
        const teamDot = teamOneDotRelative ? teamOneDotRelative : teamTwoDotRelative

        if(playType == "Shot")
        {
            const { error } = await supabase.from("Shots").insert({
                game_id: game.game_id,
                game_timer: convertFromGameTime(gameTimer!),
                player_id: selectedPlayer!,
                point_value: 2,
                assister_id: selectedAssister == -1 ? null : selectedAssister,
                shot_result: shotResult!,
                blocker_id: selectedBlocker,
                shot_coordinates: [teamDot!.xPos, teamDot!.yPos]
            });
            console.log(error);
        }
        else
        {
            const { error } = await supabase.from("OtherPlays").insert({
                game_id: game.game_id,
                game_timer: convertFromGameTime(gameTimer!),
                play_type: playType,
                player_id: selectedPlayer!,
                play_coordinates: [teamDot!.xPos, teamDot!.yPos]
            })
            console.log(error);
        }
    }

    const getPopup = (actionCounter: number, shotPosition: Position) => {
        const playType = playTypes[Math.abs(actionCounter % playTypes.length)];
        
        const playerLabel = (
            <label>
                Player
                <br/>
                <select className='border-2 border-gray-400' name='players' id='players'
                        onChange={changeSelectedPlayer} defaultValue="">
                    <option value="" disabled>Select</option>
                    {players.filter(player => player.team_id == currentTeamId).map(player =>
                    (<option key={player.player_id} value={player.player_id}>{"(" + player.player_number + ") " + player.player_name}</option>)
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

        const buttonRender = (
            <div className='flex justify-center items-end gap-2'>
                <button className='border-2 border-red-400 w-24' onClick={cancelButtonClick}>Cancel</button>
                {( selectedPlayer && ( 
                    ( shotResult == "hit" && selectedAssister ) || 
                    ( shotResult == "missed" ) ||
                    ( shotResult == "blocked" && selectedBlocker ) ) ?
                <button className='border-2 border-green-400 w-24' onClick={saveButtonClick}>Save</button> :
                null
                )}
            </div>
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
                                    onChange={changeShotResult} defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value='hit'>Hit</option>
                                <option value='missed'>Missed</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </label>
                        <label>
                            Assist
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeSelectedAssister} defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value={-1}>No assist</option>
                                {players.filter(player => player.team_id == currentTeamId).map(player =>
                                    (<option key={player.player_id} value={player.player_id}>{"(" + player.player_number + ") " + player.player_name}</option>)
                                )}
                            </select>
                        </label>
                        {timerLabel}
                    </div>
                    {buttonRender}
                </div>
                );
            }
            else if(shotResult == "blocked")
            {
                element = (
                <div className='flex flex-col gap-y-3'>
                    <div className='flex text-center gap-5 justify-center place-content-between'>
                        {playerLabel}
                        <label>
                            Shot Result
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeShotResult} defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value='hit'>Hit</option>
                                <option value='missed'>Missed</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </label>
                        <label>
                            Blocker
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeSelectedBlocker} defaultValue="">
                                <option value="" disabled>Select</option>
                                {players.filter(player => player.team_id == oppositeTeamId).map(player =>
                                    (<option key={player.player_id} value={player.player_id}>{"(" + player.player_number + ") " + player.player_name}</option>)
                                )}
                            </select>
                        </label>
                        {timerLabel}
                    </div>
                    {buttonRender}
                </div>
                );
            }
            else // shotResult == "missed" || !shotResult
            {
                element = (
                <div className='flex flex-col gap-y-3'>
                    <div className='flex text-center gap-5 justify-center place-content-between'>
                        {playerLabel}
                        <label>
                            Shot Result
                            <br/>
                            <select className='border-2 border-gray-400' name='players' id='players'
                                    onChange={changeShotResult} defaultValue="">
                                <option value="" disabled>Select</option>
                                <option value='hit'>Hit</option>
                                <option value='missed'>Missed</option>
                                <option value='blocked'>Blocked</option>
                            </select>
                        </label>
                        {timerLabel}
                    </div>
                    {buttonRender}
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
                {buttonRender}
            </div>
        );
        }

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
