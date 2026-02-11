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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          thumbnail_url: string | null
          instructor_id: string | null
          price_cents: number
          stripe_product_id: string | null
          stripe_price_id: string | null
          is_published: boolean
          difficulty: string | null
          category: string | null
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          instructor_id?: string | null
          price_cents?: number
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          is_published?: boolean
          difficulty?: string | null
          category?: string | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          instructor_id?: string | null
          price_cents?: number
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          is_published?: boolean
          difficulty?: string | null
          category?: string | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          content: string | null
          author_id: string | null
          cover_image_url: string | null
          is_published: boolean
          published_at: string | null
          category: string | null
          tags: string[] | null
          seo_title: string | null
          seo_description: string | null
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string | null
          content?: string | null
          author_id?: string | null
          cover_image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          category?: string | null
          tags?: string[] | null
          seo_title?: string | null
          seo_description?: string | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string | null
          content?: string | null
          author_id?: string | null
          cover_image_url?: string | null
          is_published?: boolean
          published_at?: string | null
          category?: string | null
          tags?: string[] | null
          seo_title?: string | null
          seo_description?: string | null
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          email: string
          full_name: string | null
          status: string
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          status?: string
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          status?: string
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
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
  }
}
