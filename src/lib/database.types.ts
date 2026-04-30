export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          order: number
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          order?: number
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          order?: number
        }
        Relationships: []
      }
      works: {
        Row: {
          id: string
          category_id: string
          slug: string
          number: string
          title: string
          description: string
          detail: string
          tags: string[]
          color: string
          order: number
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          slug: string
          number: string
          title: string
          description?: string
          detail?: string
          tags?: string[]
          color?: string
          order?: number
          published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          slug?: string
          number?: string
          title?: string
          description?: string
          detail?: string
          tags?: string[]
          color?: string
          order?: number
          published?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'works_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
