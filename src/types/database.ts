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
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_slug: string
          enrolled_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_slug: string
          enrolled_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_slug?: string
          enrolled_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lesson_progress: {
        Row: {
          id: string
          user_id: string
          course_slug: string
          lesson_slug: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_slug: string
          lesson_slug: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_slug?: string
          lesson_slug?: string
          completed?: boolean
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          id: string
          user_id: string | null
          course_id: string | null
          enrolled_at: string
          completed_at: string | null
          progress_percent: number
        }
        Insert: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          enrolled_at?: string
          completed_at?: string | null
          progress_percent?: number
        }
        Update: {
          id?: string
          user_id?: string | null
          course_id?: string | null
          enrolled_at?: string
          completed_at?: string | null
          progress_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string | null
          lesson_id: string | null
          completed: boolean
          completed_at: string | null
          last_position_seconds: number
        }
        Insert: {
          id?: string
          user_id?: string | null
          lesson_id?: string | null
          completed?: boolean
          completed_at?: string | null
          last_position_seconds?: number
        }
        Update: {
          id?: string
          user_id?: string | null
          lesson_id?: string | null
          completed?: boolean
          completed_at?: string | null
          last_position_seconds?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          id: string
          module_id: string | null
          title: string
          type: string
          content_url: string | null
          duration_minutes: number | null
          order_index: number
          is_preview: boolean
          created_at: string
        }
        Insert: {
          id?: string
          module_id?: string | null
          title: string
          type: string
          content_url?: string | null
          duration_minutes?: number | null
          order_index: number
          is_preview?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string | null
          title?: string
          type?: string
          content_url?: string | null
          duration_minutes?: number | null
          order_index?: number
          is_preview?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          id: string
          course_id: string | null
          title: string
          description: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          title: string
          description?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          stripe_payment_intent_id: string | null
          stripe_customer_id: string | null
          amount_cents: number
          currency: string
          status: string
          course_id: string | null
          course_slug: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          amount_cents: number
          currency?: string
          status: string
          course_id?: string | null
          course_slug?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          amount_cents?: number
          currency?: string
          status?: string
          course_id?: string | null
          course_slug?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
        Relationships: []
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
        Relationships: []
      }
      tool_usage: {
        Row: {
          id: string
          tool_name: string
          user_id: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tool_name: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tool_name?: string
          user_id?: string | null
          session_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
