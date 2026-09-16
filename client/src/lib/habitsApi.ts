import { supabase } from './supabaseClient'
import type { Habit, HabitInput } from '../types/Habit'

function checkError(error: { message?: string } | null, message: string) {
  if (error) throw new Error(error.message || message)
}

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: false })
  checkError(error, 'No se pudieron cargar los hábitos')
  return (data || []) as Habit[]
}

export async function createHabit(habit: HabitInput): Promise<Habit> {
  const { data, error } = await supabase.from('habits').insert({ name: habit.name.trim(), description: habit.description?.trim() || '', completed: false }).select().single()
  checkError(error, 'No se pudo crear el hábito')
  return data as Habit
}

export async function updateHabit(id: string, habit: HabitInput & Pick<Habit, 'completed'>): Promise<Habit> {
  const { data, error } = await supabase.from('habits').update({ name: habit.name.trim(), description: habit.description?.trim() || '', completed: habit.completed, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  checkError(error, 'No se pudo actualizar el hábito')
  return data as Habit
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  checkError(error, 'No se pudo eliminar el hábito')
}