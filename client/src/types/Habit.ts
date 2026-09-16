export interface Habit {
  id: string
  name: string
  description: string
  completed: boolean
  created_at?: string
  updated_at?: string
}

export interface HabitInput {
  name: string
  description: string
}