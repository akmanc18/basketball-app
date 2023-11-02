export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Blocks: {
        Row: {
          block_id: number
          blocked_shot_id: number
          game_id: number
          game_timer: string
          player_id: number
        }
        Insert: {
          block_id?: number
          blocked_shot_id: number
          game_id: number
          game_timer: string
          player_id: number
        }
        Update: {
          block_id?: number
          blocked_shot_id?: number
          game_id?: number
          game_timer?: string
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Blocks_blocked_shot_id_fkey"
            columns: ["blocked_shot_id"]
            referencedRelation: "Shots"
            referencedColumns: ["shot_id"]
          },
          {
            foreignKeyName: "Blocks_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "Games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "Blocks_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "Players"
            referencedColumns: ["player_id"]
          }
        ]
      }
      Games: {
        Row: {
          game_date: string
          game_id: number
          score_team_1: number | null
          score_team_2: number | null
          team_1: number
          team_2: number
        }
        Insert: {
          game_date: string
          game_id?: number
          score_team_1?: number | null
          score_team_2?: number | null
          team_1: number
          team_2: number
        }
        Update: {
          game_date?: string
          game_id?: number
          score_team_1?: number | null
          score_team_2?: number | null
          team_1?: number
          team_2?: number
        }
        Relationships: [
          {
            foreignKeyName: "Games_team_1_fkey"
            columns: ["team_1"]
            referencedRelation: "Teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "Games_team_2_fkey"
            columns: ["team_2"]
            referencedRelation: "Teams"
            referencedColumns: ["team_id"]
          }
        ]
      }
      Players: {
        Row: {
          player_id: number
          player_name: string
          team_id: number | null
        }
        Insert: {
          player_id?: number
          player_name: string
          team_id?: number | null
        }
        Update: {
          player_id?: number
          player_name?: string
          team_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Players_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "Teams"
            referencedColumns: ["team_id"]
          }
        ]
      }
      Shots: {
        Row: {
          game_id: number
          game_timer: string
          player_id: number
          point_value: number
          shot_id: number
          successful: boolean
        }
        Insert: {
          game_id: number
          game_timer: string
          player_id: number
          point_value: number
          shot_id?: number
          successful: boolean
        }
        Update: {
          game_id?: number
          game_timer?: string
          player_id?: number
          point_value?: number
          shot_id?: number
          successful?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "shots_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "Games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "shots_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "Players"
            referencedColumns: ["player_id"]
          }
        ]
      }
      Teams: {
        Row: {
          team_id: number
          team_name: string
        }
        Insert: {
          team_id?: number
          team_name: string
        }
        Update: {
          team_id?: number
          team_name?: string
        }
        Relationships: []
      }
      Turnovers: {
        Row: {
          game_id: number
          game_timer: string
          player_id: number
          turnover_id: number
        }
        Insert: {
          game_id: number
          game_timer: string
          player_id: number
          turnover_id?: number
        }
        Update: {
          game_id?: number
          game_timer?: string
          player_id?: number
          turnover_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Turnovers_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "Games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "Turnovers_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "Players"
            referencedColumns: ["player_id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
