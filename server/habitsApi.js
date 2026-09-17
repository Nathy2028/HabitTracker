import { supabase } from './supabaseClient'

function checkError(error, message) {
  if (error) throw new Error(error.message || message)
}

export async function getHabits() {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: false })

  checkError(error, 'No se pudieron cargar los habitos')
  return data || []
}

export async function createHabit(habit) {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      name: habit.name.trim(),
      description: habit.description.trim(),
      frequency: habit.frequency,
      completed: false
    })
    .select()
    .single()

  checkError(error, 'No se pudo crear el habito')
  return data
}

export async function updateHabit(id, habit) {
  const { data, error } = await supabase
    .from('habits')
    .update({
      name: habit.name.trim(),
      description: habit.description.trim(),
      frequency: habit.frequency,
      completed: habit.completed,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  checkError(error, 'No se pudo editar el habito')
  return data
}

export async function deleteHabit(id) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)

  checkError(error, 'No se pudo borrar el habito')
  return true
}