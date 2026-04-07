export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          is_closed: boolean
          task_id: string
          tasker_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          is_closed?: boolean
          task_id: string
          tasker_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          is_closed?: boolean
          task_id?: string
          tasker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      counter_offers: {
        Row: {
          amount: number
          created_at: string
          created_by: string
          currency: Database["public"]["Enums"]["currency_type"]
          id: string
          message: string
          offer_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          message?: string
          offer_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          message?: string
          offer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "counter_offers_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_type"]
          estimated_days: number | null
          id: string
          message: string
          price: number
          status: Database["public"]["Enums"]["offer_status"]
          task_id: string
          tasker_id: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          estimated_days?: number | null
          id?: string
          message?: string
          price: number
          status?: Database["public"]["Enums"]["offer_status"]
          task_id: string
          tasker_id: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          estimated_days?: number | null
          id?: string
          message?: string
          price?: number
          status?: Database["public"]["Enums"]["offer_status"]
          task_id?: string
          tasker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          commission: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_type"]
          id: string
          method: string
          mp_payment_id: string | null
          mp_preference_id: string | null
          status: string
          task_id: string
          tasker_id: string
        }
        Insert: {
          amount: number
          client_id: string
          commission?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          method?: string
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          status?: string
          task_id: string
          tasker_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          commission?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          id?: string
          method?: string
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          status?: string
          task_id?: string
          tasker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string
          full_name: string
          id: string
          portfolio_urls: string[] | null
          rating: number | null
          ratings_count: number | null
          response_rate: number | null
          role: Database["public"]["Enums"]["user_role"]
          skills: string[] | null
          suspended: boolean
          tasks_completed: number | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string
          full_name?: string
          id?: string
          portfolio_urls?: string[] | null
          rating?: number | null
          ratings_count?: number | null
          response_rate?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          suspended?: boolean
          tasks_completed?: number | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string
          full_name?: string
          id?: string
          portfolio_urls?: string[] | null
          rating?: number | null
          ratings_count?: number | null
          response_rate?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          skills?: string[] | null
          suspended?: boolean
          tasks_completed?: number | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reported_id: string | null
          reporter_id: string
          status: string
          task_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reported_id?: string | null
          reporter_id: string
          status?: string
          task_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reported_id?: string | null
          reporter_id?: string
          status?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          task_id: string
          type: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          task_id: string
          type?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          task_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          budget: number
          category: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_type"]
          deadline: string | null
          department: string
          description: string
          id: string
          neighborhood: string | null
          status: Database["public"]["Enums"]["task_status"]
          suspended: boolean
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at: string
          urgency: Database["public"]["Enums"]["task_urgency"]
          user_id: string
        }
        Insert: {
          budget: number
          category: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          deadline?: string | null
          department: string
          description: string
          id?: string
          neighborhood?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          suspended?: boolean
          task_type?: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["task_urgency"]
          user_id: string
        }
        Update: {
          budget?: number
          category?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_type"]
          deadline?: string | null
          department?: string
          description?: string
          id?: string
          neighborhood?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          suspended?: boolean
          task_type?: Database["public"]["Enums"]["task_type"]
          title?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["task_urgency"]
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          id: string
          user_id: string
          cedula_url: string
          selfie_url: string
          ai_result: string
          ai_confidence: number | null
          ai_reasoning: string | null
          admin_decision: string | null
          admin_id: string | null
          admin_notes: string | null
          created_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          cedula_url: string
          selfie_url: string
          ai_result: string
          ai_confidence?: number | null
          ai_reasoning?: string | null
          admin_decision?: string | null
          admin_id?: string | null
          admin_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          cedula_url?: string
          selfie_url?: string
          ai_result?: string
          ai_confidence?: number | null
          ai_reasoning?: string | null
          admin_decision?: string | null
          admin_id?: string | null
          admin_notes?: string | null
          created_at?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      is_admin: { Args: { p_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      currency_type: "UYU" | "USD"
      offer_status:
        | "pending"
        | "accepted"
        | "rejected"
        | "withdrawn"
        | "counter_offered"
      task_status:
        | "open"
        | "assigned"
        | "completed"
        | "cancelled"
        | "in_progress"
        | "reviewed"
      task_type: "presencial" | "remota"
      task_urgency: "normal" | "urgente"
      user_role: "client" | "tasker"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      currency_type: ["UYU", "USD"],
      offer_status: [
        "pending",
        "accepted",
        "rejected",
        "withdrawn",
        "counter_offered",
      ],
      task_status: [
        "open",
        "assigned",
        "completed",
        "cancelled",
        "in_progress",
        "reviewed",
      ],
      task_type: ["presencial", "remota"],
      task_urgency: ["normal", "urgente"],
      user_role: ["client", "tasker"],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
