import {Game, OtherPlays, OtherPlaysReview, Shot, ShotReview, Team} from "@/util/entities";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import supabase from "@/util/db";
import {convertFromGameTime, convertToGameTime} from "@/util/utils";

interface Props
{
    game: Game;
    team1: Team;
    team2: Team;
}


export default function CourtReview(props: Props) {
    const game = props.game;
    const team1 = props.team1;
    const team2 = props.team2;

    const [shots, setShots] = useState<ShotReview[]>([]);
    const [otherPlays, setOtherPlays] = useState<OtherPlaysReview[]>([])
    const [selectedTeam, setSelectedTeam] = useState<string>("both");
    const [selectedPlayType, setSelectedPlayType] = useState<string>("All");
    const [selectedShotDot, setSelectedDot] = useState<number>(0);
    const [selectedPlayDot, setSelectedPlayDot] = useState<number>(0);
    const [timeFrom, setTimeFrom] = useState<string>("");
    const [timeTo, setTimeTo] = useState<string>("");


    const getOtherPlays = async () => {
        const { data , error} = await supabase.from("OtherPlays").select("*, player:Players(team_id, player_name)").eq("game_id", game.game_id).returns<OtherPlaysReview[]>();

        if (data)
        {
            setOtherPlays(data);
        }
        if (error)
        {
            console.log(error)
        }
    }

    useEffect(() => {
        getOtherPlays();
    }, [game])

    const getShots = async () => {
        const { data , error} = await supabase.from("Shots").select("*, player:Players!Shots_player_id_fkey(team_id, player_name), assist_player:Players!Shots_assister_id_fkey(team_id, player_name), blocker_player:Players!Shots_blocker_id_fkey(team_id, player_name)").eq("game_id", game.game_id).returns<ShotReview[]>();

        if (data)
        {
            setShots(data);
        }
        if (error)
        {
            console.log(error)
        }
    }

    useEffect(() => {
        getShots();
    }, [game])

    const selectShotDot = (shotId: number) => {
        setSelectedDot(shotId);
        setSelectedPlayDot(0);
    }

    const selectPlayDot = (playId: number) => {
        setSelectedDot(0);
        setSelectedPlayDot(playId);
    }

    const getDots = () => {

        let selectedShots : ShotReview[] = [];
        let selectedOtherPlays : OtherPlaysReview[] = [];
        if (selectedTeam == "both")
        {
            selectedShots = shots;
            selectedOtherPlays = otherPlays;
        }
        else if (selectedTeam == "team1")
        {
            selectedShots = shots.filter(shot => shot.player.team_id == team1.team_id);
            selectedOtherPlays = otherPlays.filter(otherPlay => otherPlay.player.team_id == team1.team_id);
        }
        else if (selectedTeam == "team2")
        {
            selectedShots = shots.filter(shot => shot.player.team_id == team2.team_id);
            selectedOtherPlays = otherPlays.filter(otherPlay => otherPlay.player.team_id == team2.team_id);
        }

        if (timeFrom)
        {
            const secondsFrom = convertFromGameTime(timeFrom);
            selectedShots = selectedShots.filter(shot => shot.game_timer >= secondsFrom);
            selectedOtherPlays = selectedOtherPlays.filter(play => play.game_timer > secondsFrom);
        }

        if (timeTo)
        {
            const secondsTo = convertFromGameTime(timeTo)
            selectedShots = selectedShots.filter(shot => shot.game_timer <= secondsTo);
            selectedOtherPlays = selectedOtherPlays.filter(play => play.game_timer < secondsTo);
        }

        const getDotStyle = (teamId: number) =>
        {
            return teamId == team1.team_id ? "redDot reviewDot" :  "limeDot reviewDot"
        }

        const createShotDivs = (inputShots: ShotReview[]) => {
            return inputShots.map(shot =>
              (
                <div key={shot.shot_id}>
                    <div className={getDotStyle(shot.player.team_id)} style=
                      {{
                          left: shot.shot_coordinates[0],
                          top: shot.shot_coordinates[1],
                      }} onClick={(_) => selectShotDot(shot.shot_id)}/>
                    {
                    shot.shot_id == selectedShotDot ?
                      <div className="popupDiv" style=
                        {{
                            left: shot.shot_coordinates[0] + 15,
                            top:  shot.shot_coordinates[1] + 5,
                        }}>
                          <div className="flex flex-col p-2 w-max">
                              <div className="text-xl text-center"> Shot</div>
                              <div className="flex gap-x-4">
                                  <div>Player: {shot.player.player_name}</div>
                                  <div>Team: {shot.player.team_id == team1.team_id ? team1.team_name : team2.team_name}</div>
                                  <div>Game timer: {convertToGameTime(shot.game_timer)}</div>
                              </div>
                              <div className="flex gap-x-4">
                                  <div>Shot Result: {shot.shot_result}</div>
                                  <div>Point(s): {shot.point_value}</div>
                                  {
                                      shot.assister_id ?
                                        <div>Assist: {shot.assist_player.player_name}</div>
                                        : null
                                  }
                                  {
                                      shot.blocker_id ?
                                        <div>Blocker: {shot.blocker_player.player_name}</div>
                                        : null
                                  }
                              </div>
                          </div>
                      </div>
                      :
                      null
                    }
                </div>
              ));
        }

        const createOtherPlaysDivs = (inputPlays: OtherPlaysReview[]) => {
            return inputPlays.map(play =>
          (
            <div key={play.play_id}>
                <div className={getDotStyle(play.player.team_id)} style=
                  {{
                      left: play.play_coordinates[0],
                      top: play.play_coordinates[1],
                  }} onClick={(_) => selectPlayDot(play.play_id)}/>
                {
                    play.play_id == selectedPlayDot ?
                      <div className="popupDiv" style=
                        {{
                            left: play.play_coordinates[0] + 15,
                            top:  play.play_coordinates[1] + 5,
                        }}>
                          <div className="flex flex-col p-2 w-max">
                              <div className="text-xl text-center"> {play.play_type}</div>
                              <div className="flex gap-x-4">
                                  <div>Player: {play.player.player_name}</div>
                                  <div>Game timer: {convertToGameTime(play.game_timer)}</div>
                              </div>
                          </div>
                      </div>
                      :
                      null
                }
            </div>
          ))
        };

        switch (selectedPlayType) {
            case "All":
                const shotsDots = createShotDivs(selectedShots);
                const otherPlaysDots = createOtherPlaysDivs(selectedOtherPlays)
                return [...shotsDots, ...otherPlaysDots];
            case "Shot":
                return createShotDivs(selectedShots);
            case "Ball loss":
                return createOtherPlaysDivs(selectedOtherPlays.filter(play => play.play_type == "Ball loss"))
            case "Foul":
                return createOtherPlaysDivs(selectedOtherPlays.filter(play => play.play_type == "Foul"))
            case "Steal":
                return createOtherPlaysDivs(selectedOtherPlays.filter(play => play.play_type == "Steal"))
            case "Turnover":
                return createOtherPlaysDivs(selectedOtherPlays.filter(play => play.play_type == "Turnover"))
            case "Rebound":
                return createOtherPlaysDivs(selectedOtherPlays.filter(play => play.play_type == "Rebound"))
            default:
                return (<div className="text-red-500"> Error </div>)
        }
    }


    return (
      <div className="flex flex-col">
          <h2 className="text-3xl mb-2"> Filters</h2>
          <div className="flex gap-x-4">
              <label>
                  Selected Team:
                  <select className="ml-2 border-2 border-gray-400" onChange={(event) => setSelectedTeam(event.target.value)}>
                      <option value="both">Both</option>
                      <option value="team1">{team1.team_name}</option>
                      <option value="team2">{team2.team_name}</option>
                  </select>
              </label>
              <label>
                  Play type:
                  <select className="ml-2 border-2 border-gray-400" onChange={(event) => {setSelectedPlayType(event.target.value); setSelectedDot(0); setSelectedPlayDot(0)}}>
                      <option value="All">All</option>
                      <option value="Shot">Shot</option>
                      <option value="Foul">Foul</option>
                      <option value="Ball loss">Ball loss</option>
                      <option value="Steal">Steal</option>
                      <option value="Turnover">Turnover</option>
                      <option value="Rebound">Rebound</option>
                  </select>
              </label>
              <label>
                  Game time from:
                  <input className="ml-2 border-2 border-gray-400 w-20" type="text" onChange={(event) => {setTimeFrom(event.target.value);setSelectedDot(0); setSelectedPlayDot(0)}}/>
              </label>
              <label>
                  Game time to:
                  <input className="ml-2 border-2 border-gray-400 w-20" type="text" onChange={(event) => {setTimeTo(event.target.value);setSelectedDot(0); setSelectedPlayDot(0)}}/>
              </label>
          </div>
          <div className="border border-gray-400 mt-2"/>
          <div className="self-center mt-4 relative">
              <Image src="/court.jpg" alt="Court image" width={860} height={462} onClick={(_) => {selectPlayDot(0); selectShotDot(0)}}/>
              {
                  getDots()
              }
          </div>
      </div>
    );
}