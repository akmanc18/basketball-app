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
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["team_id"]
          },
          {
            foreignKeyName: "Games_team_2_fkey"
            columns: ["team_2"]
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["team_id"]
          }
        ]
      }
      OtherPlays: {
        Row: {
          game_id: number
          game_timer: string
          play_id: number
          play_type: string
          player_id: number
        }
        Insert: {
          game_id: number
          game_timer: string
          play_id?: number
          play_type: string
          player_id: number
        }
        Update: {
          game_id?: number
          game_timer?: string
          play_id?: number
          play_type?: string
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "OtherPlays_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "OtherPlays_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["player_id"]
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
            isOneToOne: false
            referencedRelation: "Teams"
            referencedColumns: ["team_id"]
          }
        ]
      }
      Shots: {
        Row: {
          assister_id: number | null
          blocker_id: number | null
          game_id: number
          game_timer: string
          player_id: number
          point_value: number
          shot_coordinates: number[]
          shot_id: number
          shot_result: string
        }
        Insert: {
          assister_id?: number | null
          blocker_id?: number | null
          game_id: number
          game_timer: string
          player_id: number
          point_value: number
          shot_coordinates: number[]
          shot_id?: number
          shot_result: string
        }
        Update: {
          assister_id?: number | null
          blocker_id?: number | null
          game_id?: number
          game_timer?: string
          player_id?: number
          point_value?: number
          shot_coordinates?: number[]
          shot_id?: number
          shot_result?: string
        }
        Relationships: [
          {
            foreignKeyName: "Shots_assister_id_fkey"
            columns: ["assister_id"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "Shots_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "Players"
            referencedColumns: ["player_id"]
          },
          {
            foreignKeyName: "Shots_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "Games"
            referencedColumns: ["game_id"]
          },
          {
            foreignKeyName: "Shots_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
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
