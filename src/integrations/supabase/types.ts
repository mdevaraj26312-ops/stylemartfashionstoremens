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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      affiliate_networks: {
        Row: {
          base_url: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          tracking_param: string | null
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          tracking_param?: string | null
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          tracking_param?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string
          id: string
          is_featured: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      product_clicks: {
        Row: {
          created_at: string
          id: number
          ip_hash: string | null
          product_id: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          ip_hash?: string | null
          product_id: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          ip_hash?: string | null
          product_id?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_images: string[]
          affiliate_network: string | null
          affiliate_url: string
          availability: string
          brand: string
          category: Database["public"]["Enums"]["product_category"]
          click_count: number
          colors: string[]
          created_at: string
          description: string
          discount_pct: number
          enrich_error: string | null
          enrich_status: string
          enriched_at: string | null
          gender: string | null
          id: string
          image_url: string
          is_bestseller: boolean
          is_deal: boolean
          is_featured: boolean
          is_new_arrival: boolean
          is_trending: boolean
          material: string | null
          original_price: number
          price: number
          rating: number
          reviews_count: number
          search_tsv: unknown
          seo_description: string | null
          seo_title: string | null
          sizes: string[]
          sku: string | null
          slug: string
          source: Database["public"]["Enums"]["product_source"]
          status: string
          subcategory: string | null
          tags: string[]
          title: string
          tracking_id: string | null
          updated_at: string
        }
        Insert: {
          additional_images?: string[]
          affiliate_network?: string | null
          affiliate_url: string
          availability?: string
          brand: string
          category: Database["public"]["Enums"]["product_category"]
          click_count?: number
          colors?: string[]
          created_at?: string
          description?: string
          discount_pct?: number
          enrich_error?: string | null
          enrich_status?: string
          enriched_at?: string | null
          gender?: string | null
          id?: string
          image_url: string
          is_bestseller?: boolean
          is_deal?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_trending?: boolean
          material?: string | null
          original_price?: number
          price: number
          rating?: number
          reviews_count?: number
          search_tsv?: unknown
          seo_description?: string | null
          seo_title?: string | null
          sizes?: string[]
          sku?: string | null
          slug: string
          source?: Database["public"]["Enums"]["product_source"]
          status?: string
          subcategory?: string | null
          tags?: string[]
          title: string
          tracking_id?: string | null
          updated_at?: string
        }
        Update: {
          additional_images?: string[]
          affiliate_network?: string | null
          affiliate_url?: string
          availability?: string
          brand?: string
          category?: Database["public"]["Enums"]["product_category"]
          click_count?: number
          colors?: string[]
          created_at?: string
          description?: string
          discount_pct?: number
          enrich_error?: string | null
          enrich_status?: string
          enriched_at?: string | null
          gender?: string | null
          id?: string
          image_url?: string
          is_bestseller?: boolean
          is_deal?: boolean
          is_featured?: boolean
          is_new_arrival?: boolean
          is_trending?: boolean
          material?: string | null
          original_price?: number
          price?: number
          rating?: number
          reviews_count?: number
          search_tsv?: unknown
          seo_description?: string | null
          seo_title?: string | null
          sizes?: string[]
          sku?: string | null
          slug?: string
          source?: Database["public"]["Enums"]["product_source"]
          status?: string
          subcategory?: string | null
          tags?: string[]
          title?: string
          tracking_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_product_click: {
        Args: { _product_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
      product_category:
        | "women"
        | "men"
        | "kids"
        | "footwear"
        | "bags"
        | "watches"
        | "jewellery"
        | "accessories"
      product_source:
        | "Amazon"
        | "Flipkart"
        | "Meesho"
        | "Myntra"
        | "Ajio"
        | "Other"
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
      app_role: ["admin", "user"],
      product_category: [
        "women",
        "men",
        "kids",
        "footwear",
        "bags",
        "watches",
        "jewellery",
        "accessories",
      ],
      product_source: [
        "Amazon",
        "Flipkart",
        "Meesho",
        "Myntra",
        "Ajio",
        "Other",
      ],
    },
  },
} as const
