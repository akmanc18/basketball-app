export interface Position
{
    xPos: number;
    yPos: number;
}

export interface Team
{
    team_id: number,
    team_name: string
}

export interface Player
{
    player_id: number;
    player_name: string;
    team_id: number | null;
}

export interface Game
{
    game_date: string,
    game_id: number,
    score_team_1: number | null,
    score_team_2: number | null,
    team_1: number,
    team_2: number
}

export interface Shot
{
    game_id: number,
    game_timer: string,
    player_id: number,
    point_value: number,
    shot_id: number,
    successful: boolean
}

export interface PlayerTableData
{
    playerId: number,
    playerName: string;
    playerNumber: number;
    threePointShot: ShotData;
    twoPointShot: ShotData;
    onePointShot: ShotData;
    blocks: number;
    turnovers: number
}

export interface ShotData
{
    attempted: number;
    successful: number
    percentage: number;
}


export type ShotResult = "hit" | "missed" | "blocked";
export type PlaysType = "Shot" | "Foul" | "Ball loss" | "Steal" | "Turnover" | "Rebound";