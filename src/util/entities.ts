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
    shot_id: number,
    game_id: number,
    player_id: number,
    game_timer: string,
    point_value: number,
    shot_result: string,
    blocker_id: number | null,
    assister_id: number | null,
    shot_coordinates: number[],
}

export interface ShotReview extends Shot
{
    player: {team_id: number, player_name: string}
}

export interface OtherPlays
{
    play_id: number,
    game_id: number,
    play_type: string,
    player_id: number,
    game_timer: string
    play_coordinates: number[],
}

export interface OtherPlaysReview extends OtherPlays
{
    player: {team_id: number, player_name: string}
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


// @ts-ignore
export type ShotResult = "hit" | "missed" | "blocked";
// @ts-ignore
export type PlaysType = "Shot" | "Foul" | "Ball loss" | "Steal" | "Turnover" | "Rebound";