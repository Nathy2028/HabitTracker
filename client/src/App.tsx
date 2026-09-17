import { useState } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import './App.css'
import type { Habit, HabitInput } from './types/Habit'

const initialHabits: Habit[] = [
  { id: 'habit-reading', name: 'Leer 20 minutos', description: 'Desconectar y avanzar un poco cada día.', completed: false },
  { id: 'habit-water', name: 'Tomar suficiente agua', description: 'Mantenerme hidratado durante toda la jornada.', completed: true },
  { id: 'habit-exercise', name: 'Hacer ejercicio', description: 'Mover el cuerpo y cuidar mi energía.', completed: false },
]

function App() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null)

  function handleSaveHabit(habitInput: HabitInput) {
    if (habitToEdit) {
      setHabits((currentHabits) => currentHabits.map((habit) => (
        habit.id === habitToEdit.id ? { ...habit, ...habitInput } : habit
      )))
      setHabitToEdit(null)
      return
    }
    setHabits((currentHabits) => [...currentHabits, { id: crypto.randomUUID(), ...habitInput, completed: false }])
  }

  function handleToggleComplete(id: string) {
    setHabits((currentHabits) => currentHabits.map((habit) => (
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    )))
  }

  function handleDelete(id: string) {
    setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== id))
    if (habitToEdit?.id === id) setHabitToEdit(null)
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">HT</div>
        <div><p className="brand-name">Habit tracker</p><p className="brand-subtitle">Pequeños pasos, grandes cambios.</p></div>
      </header>
      <section className="intro">
        <div>
          <p className="eyebrow">Panel personal</p>
          <h1>Construye un día que se sienta bien.</h1>
          <p className="intro-copy">Organiza tus rutinas y celebra cada avance, por pequeño que sea.</p>
        </div>
        <div className="progress-note"><strong>{habits.filter((habit) => habit.completed).length}/{habits.length}</strong><span>completados hoy</span></div>
      </section>
      <div className="dashboard-grid">
        <HabitForm habitToEdit={habitToEdit} onSubmit={handleSaveHabit} onCancelEdit={() => setHabitToEdit(null)} />
        <HabitList habits={habits} onToggleComplete={handleToggleComplete} onEdit={setHabitToEdit} onDelete={handleDelete} />
      </div>
    </main>
  )
}

export default App
