export interface Position
{
    xPos: number;
    yPos: number;
}

export interface Player
{
    player_id: number;
    player_name: string;
    team_id: number | null;
}

export type ShotResult = "hit" | "missed" | "blocked";