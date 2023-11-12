import {Game, Player, Team} from "@/util/entities";
import React, {useState} from "react";
import Image from "next/image";

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

    const [plays, setPlays] = useState();

    return (
      <div className="flex flex-col">
          <h2 className="text-3xl mb-2"> Filters</h2>
          <div className="flex gap-x-4">
              <label>
                  Play type:
                  <select className="ml-2 border-2 border-gray-400">
                      <option value="" disabled>Select a team</option>
                      <option value="both">Both</option>
                      <option value="team1">{team1.team_name}</option>
                      <option value="team2">{team2.team_name}</option>
                  </select>
              </label>
              <label>
                  Play type:
                  <select className="ml-2 border-2 border-gray-400">
                      <option value="" disabled>Select a play type</option>
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
          <div className="self-center mt-4">
              <Image src="/court.jpg" alt="Court image" width={860} height={462}/>
          </div>
      </div>
    );
}