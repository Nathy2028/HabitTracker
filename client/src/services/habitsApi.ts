import { createClient } from '@supabase/supabase-js'
import type { Habit, HabitInput } from '../types/Habit'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('Faltan las variables de entorno de Supabase')
}

const supabase = createClient(url, key)

function throwIfError(error: { message: string } | null, fallbackMessage: string) {
  if (error) throw new Error(error.message || fallbackMessage)
}

function requireData(data: Habit | null, message: string): Habit {
  if (!data) throw new Error(message)
  return data
}

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('id, name, description, completed')
    .order('created_at', { ascending: false })

  throwIfError(error, 'No se pudieron cargar los hábitos')
  return data ?? []
}

export async function createHabit(input: HabitInput): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert({ name: input.name.trim(), description: input.description.trim() })
    .select('id, name, description, completed')
    .single()

  throwIfError(error, 'No se pudo crear el hábito')
  return requireData(data, 'Supabase no devolvió el hábito creado')
}

export async function updateHabit(id: string, input: HabitInput, completed: boolean): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update({ name: input.name.trim(), description: input.description.trim(), completed })
    .eq('id', id)
    .select('id, name, description, completed')
    .single()

  throwIfError(error, 'No se pudo actualizar el hábito')
  return requireData(data, 'Supabase no devolvió el hábito actualizado')
}

export async function toggleHabit(id: string, completed: boolean): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update({ completed })
    .eq('id', id)
    .select('id, name, description, completed')
    .single()

  throwIfError(error, 'No se pudo actualizar el hábito')
  return requireData(data, 'Supabase no devolvió el hábito actualizado')
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  throwIfError(error, 'No se pudo eliminar el hábito')
}
