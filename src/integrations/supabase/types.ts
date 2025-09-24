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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          book_id: string | null
          chapter_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          file_name: string | null
          file_url: string | null
          id: string
          pdf_url: string | null
          status: Database["public"]["Enums"]["activity_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id?: string | null
          chapter_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string | null
          chapter_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["activity_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      books: {
        Row: {
          age_group: Database["public"]["Enums"]["age_group"]
          amazon_link: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          price_amount: number | null
          price_currency: string | null
          title: string
          updated_at: string
        }
        Insert: {
          age_group: Database["public"]["Enums"]["age_group"]
          amazon_link?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          price_amount?: number | null
          price_currency?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          age_group?: Database["public"]["Enums"]["age_group"]
          amazon_link?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          price_amount?: number | null
          price_currency?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          book_id: string
          chapter_number: number
          cover_url: string | null
          created_at: string
          id: string
          order_index: number
          pdf_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          book_id: string
          chapter_number: number
          cover_url?: string | null
          created_at?: string
          id?: string
          order_index?: number
          pdf_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          cover_url?: string | null
          created_at?: string
          id?: string
          order_index?: number
          pdf_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          event_time: string | null
          hero_image_url: string | null
          id: string
          learn_more_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_time?: string | null
          hero_image_url?: string | null
          id?: string
          learn_more_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          event_time?: string | null
          hero_image_url?: string | null
          id?: string
          learn_more_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      feedback: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          responded_at: string | null
          responded_by: string | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          responded_at?: string | null
          responded_by?: string | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          responded_at?: string | null
          responded_by?: string | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number
          age_group: Database["public"]["Enums"]["age_group"]
          city: string | null
          consent_given: boolean
          consent_timestamp: string | null
          country: string | null
          created_at: string
          full_name: string
          gender: string | null
          guardian_contact: string | null
          guardian_name: string | null
          id: string
          pincode: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          age_group: Database["public"]["Enums"]["age_group"]
          city?: string | null
          consent_given?: boolean
          consent_timestamp?: string | null
          country?: string | null
          created_at?: string
          full_name: string
          gender?: string | null
          guardian_contact?: string | null
          guardian_name?: string | null
          id?: string
          pincode?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          age_group?: Database["public"]["Enums"]["age_group"]
          city?: string | null
          consent_given?: boolean
          consent_timestamp?: string | null
          country?: string | null
          created_at?: string
          full_name?: string
          gender?: string | null
          guardian_contact?: string | null
          guardian_name?: string | null
          id?: string
          pincode?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          responded_at: string | null
          responded_by: string | null
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          responded_at?: string | null
          responded_by?: string | null
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          responded_at?: string | null
          responded_by?: string | null
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_status: "submitted" | "reviewed" | "approved" | "rejected"
      age_group: "preteens" | "teens" | "young_adults"
      user_role: "user" | "admin"
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
      activity_status: ["submitted", "reviewed", "approved", "rejected"],
      age_group: ["preteens", "teens", "young_adults"],
      user_role: ["user", "admin"],
    },
  },
} as const
