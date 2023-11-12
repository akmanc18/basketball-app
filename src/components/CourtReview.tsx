import {Game, OtherPlays, OtherPlaysReview, Shot, ShotReview, Team} from "@/util/entities";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import supabase from "@/util/db";

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


    const getOtherPlays = async () => {
        const { data , error} = await supabase.from("OtherPlays").select("*, player:Players(team_id, player_name)").eq("game_id", game.game_id).returns<OtherPlaysReview[]>();

        if (data)
        {
            console.log(data)
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
        const { data , error} = await supabase.from("Shots").select("*, player:Players!Shots_player_id_fkey(team_id, player_name)").eq("game_id", game.game_id).returns<ShotReview[]>();

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

        const getDotStyle = (teamId: number) =>
        {
            return teamId == team1.team_id ? "redDot reviewDot" :  "limeDot reviewDot"
        }

        switch (selectedPlayType) {
            case "All":
                const shotDots = selectedShots.map(shot =>
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
                                    <div className="flex flex-col p-2">
                                        <div className="text-xl text-center"> Shot</div>
                                        <div className="flex gap-x-4">
                                            <div>Player: {shot.player.player_name}</div>
                                            <div>Point(s): {shot.point_value}</div>
                                            <div>Game timer: {shot.game_timer}</div>
                                        </div>
                                    </div>
                                </div>
                                :
                                null
                          }
                      </div>
                    ));
                const otherPlaysDots =  selectedOtherPlays.map(play =>
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
                                    Test
                                </div>
                                :
                                null
                          }
                      </div>
                    ));
                return [...shotDots, ...otherPlaysDots]
            case "Shot":
                return selectedShots.map(shot =>
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
                                  Test
                              </div>
                              :
                              null
                        }
                    </div>
                ));
            case "Ball loss":
                return selectedOtherPlays.filter(play => play.play_type == "Ball loss").map(play =>
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
                                      top: play.play_coordinates[1] + 5,
                                  }}>
                                    Test
                                </div>
                                :
                                null
                          }
                      </div>
                    ));
            case "Steal":
                return selectedOtherPlays.filter(play => play.play_type == "Steal").map(play =>
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
                                      top: play.play_coordinates[1] + 5,
                                  }}>
                                    Test
                                </div>
                                :
                                null
                          }
                      </div>
                    ));
            case "Turnover":
                return selectedOtherPlays.filter(play => play.play_type == "Turnover").map(play =>
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
                                      top: play.play_coordinates[1] + 5,
                                  }}>
                                    Test
                                </div>
                                :
                                null
                          }
                      </div>
                    ));
            case "Rebound":
                return selectedOtherPlays.filter(play => play.play_type == "Rebound").map(play =>
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
                                      top: play.play_coordinates[1] + 5,
                                  }}>
                                    Test
                                </div>
                                :
                                null
                          }
                      </div>
                    ));
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
                  <select className="ml-2 border-2 border-gray-400" onChange={(event) => setSelectedPlayType(event.target.value)}>
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
                  <input className="ml-2 border-2 border-gray-400 w-20" type="text"/>
              </label>
              <label>
                  Game time to:
                  <input className="ml-2 border-2 border-gray-400 w-20" type="text"/>
              </label>
          </div>
          <div className="border border-gray-400 mt-2"/>
          <div className="self-center mt-4 relative">
              <Image src="/court.jpg" alt="Court image" width={860} height={462}/>
              {
                  getDots()
              }
          </div>
      </div>
    );
}