import { useEffect, useState } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import { createHabit, deleteHabit, getHabits, updateHabit } from './lib/habitsApi'
import './App.css'
import type { Habit, HabitInput } from './types/Habit'

type LoadStatus = 'loading' | 'error' | 'ready'
type Feedback = { type: 'success' | 'error'; message: string }

function App() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const habitToEdit = habits.find((habit) => habit.id === editingId) ?? null

  async function loadHabits() {
    setStatus('loading')
    setError('')
    try {
      setHabits(await getHabits())
      setStatus('ready')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los hábitos')
      setStatus('error')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadHabits())
  }, [])

  async function handleSaveHabit(habitInput: HabitInput) {
    setSaving(true)
    setFeedback(null)
    try {
      if (habitToEdit) {
        const updatedHabit = await updateHabit(habitToEdit.id, { ...habitInput, completed: habitToEdit.completed })
        setHabits((currentHabits) => currentHabits.map((habit) => habit.id === updatedHabit.id ? updatedHabit : habit))
        setEditingId(null)
        setFeedback({ type: 'success', message: 'Hábito actualizado correctamente.' })
      } else {
        const createdHabit = await createHabit(habitInput)
        setHabits((currentHabits) => [createdHabit, ...currentHabits])
        setFeedback({ type: 'success', message: 'Hábito creado correctamente.' })
      }
    } catch (saveError) {
      setFeedback({ type: 'error', message: saveError instanceof Error ? saveError.message : 'No se pudo guardar el hábito.' })
      throw saveError
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleComplete(id: string) {
    const habit = habits.find((currentHabit) => currentHabit.id === id)
    if (!habit) return
    setFeedback(null)
    try {
      const updatedHabit = await updateHabit(id, { name: habit.name, description: habit.description, completed: !habit.completed })
      setHabits((currentHabits) => currentHabits.map((currentHabit) => currentHabit.id === id ? updatedHabit : currentHabit))
    } catch (toggleError) {
      setFeedback({ type: 'error', message: toggleError instanceof Error ? toggleError.message : 'No se pudo actualizar el hábito.' })
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('¿Quieres eliminar este hábito?')) return
    setDeletingId(id)
    setFeedback(null)
    try {
      await deleteHabit(id)
      setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id))
      if (editingId === id) setEditingId(null)
      setFeedback({ type: 'success', message: 'Hábito eliminado correctamente.' })
    } catch (deleteError) {
      setFeedback({ type: 'error', message: deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el hábito.' })
    } finally {
      setDeletingId(null)
    }
  }

  if (status === 'loading') return <main className="app-shell"><p className="page-state">Cargando hábitos...</p></main>
  if (status === 'error') return <main className="app-shell"><section className="page-state error-state"><p>{error}</p><button className="button button-primary" type="button" onClick={() => void loadHabits()}>Reintentar</button></section></main>

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">HT</div>
        <div><p className="brand-name">Habit tracker</p><p className="brand-subtitle">Pequeños pasos, grandes cambios.</p></div>
      </header>
      <section className="intro">
        <div><p className="eyebrow">Panel personal</p><h1>Construye un día que se sienta bien.</h1><p className="intro-copy">Organiza tus rutinas y celebra cada avance, por pequeño que sea.</p></div>
        <div className="progress-note"><strong>{habits.filter((habit) => habit.completed).length}/{habits.length}</strong><span>completados hoy</span></div>
      </section>
      {feedback && <p className={`feedback ${feedback.type}`} role="status">{feedback.message}</p>}
      <div className="dashboard-grid">
        <HabitForm habitToEdit={habitToEdit} saving={saving} onSubmit={handleSaveHabit} onCancelEdit={() => setEditingId(null)} />
        <HabitList habits={habits} onToggleComplete={(id) => void handleToggleComplete(id)} onEdit={(habit) => setEditingId(habit.id)} onDelete={(id) => void handleDelete(id)} deletingId={deletingId} />
      </div>
    </main>
  )
}

export default App