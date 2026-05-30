import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/tasks'
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN ?? 'secret123'

const filters = [
  { id: 'all', label: 'Tümü' },
  { id: 'active', label: 'Aktif' },
  { id: 'completed', label: 'Biten' },
]

const requestOptions = {
  headers: {
    Authorization: AUTH_TOKEN,
    'Content-Type': 'application/json',
  },
}

function formatDate(value) {
  if (!value) return 'Tarih yok'

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const active = total - completed

    return { total, completed, active }
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((task) => !task.completed)
    if (filter === 'completed') return tasks.filter((task) => task.completed)

    return tasks
  }, [filter, tasks])

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    try {
      setError('')
      setLoading(true)

      const response = await fetch(API_URL, requestOptions)

      if (!response.ok) {
        throw new Error('Görevler alınamadı.')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createTask(event) {
    event.preventDefault()
    const nextTitle = title.trim()

    if (!nextTitle) return

    try {
      setError('')
      setSubmitting(true)

      const response = await fetch(API_URL, {
        method: 'POST',
        ...requestOptions,
        body: JSON.stringify({ title: nextTitle }),
      })

      if (!response.ok) {
        throw new Error('Görev eklenemedi.')
      }

      const data = await response.json()
      setTasks((currentTasks) => [data.task, ...currentTasks])
      setTitle('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function updateTask(id, payload) {
    const previousTasks = tasks

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task._id === id ? { ...task, ...payload } : task)),
    )

    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        ...requestOptions,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Görev güncellenemedi.')
      }

      const data = await response.json()
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === id ? data.task : task)),
      )
    } catch (err) {
      setTasks(previousTasks)
      setError(err.message)
    }
  }

  async function deleteTask(id) {
    const previousTasks = tasks

    setTasks((currentTasks) => currentTasks.filter((task) => task._id !== id))

    try {
      setError('')

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        ...requestOptions,
      })

      if (!response.ok) {
        throw new Error('Görev silinemedi.')
      }
    } catch (err) {
      setTasks(previousTasks)
      setError(err.message)
    }
  }

  function startEditing(task) {
    setEditingId(task._id)
    setEditingTitle(task.title)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingTitle('')
  }

  function saveEditing(event, task) {
    event.preventDefault()
    const nextTitle = editingTitle.trim()

    if (!nextTitle) return

    updateTask(task._id, { title: nextTitle })
    cancelEditing()
  }

  return (
    <main className="app-shell">
      <section className="task-board" aria-labelledby="app-title">
        <header className="topbar">
          <div>
            <p className="eyebrow">Task Manager</p>
            <h1 id="app-title">Bugünün işleri</h1>
          </div>
          <button className="ghost-button" type="button" onClick={fetchTasks} disabled={loading}>
            ↻
            <span>Yenile</span>
          </button>
        </header>

        <form className="task-form" onSubmit={createTask}>
          <label htmlFor="task-title">Yeni görev</label>
          <div className="input-row">
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Örn. API dökümantasyonunu kontrol et"
            />
            <button type="submit" disabled={submitting || !title.trim()}>
              +
              <span>Ekle</span>
            </button>
          </div>
        </form>

        {error && (
          <div className="status-banner" role="alert">
            {error}
          </div>
        )}

        <div className="summary-grid" aria-label="Görev özeti">
          <article>
            <span>Toplam</span>
            <strong>{stats.total}</strong>
          </article>
          <article>
            <span>Aktif</span>
            <strong>{stats.active}</strong>
          </article>
          <article>
            <span>Biten</span>
            <strong>{stats.completed}</strong>
          </article>
        </div>

        <div className="list-header">
          <h2>Görev listesi</h2>
          <div className="filter-tabs" role="tablist" aria-label="Görev filtresi">
            {filters.map((item) => (
              <button
                aria-selected={filter === item.id}
                className={filter === item.id ? 'active' : ''}
                key={item.id}
                onClick={() => setFilter(item.id)}
                role="tab"
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <section className="task-list" aria-live="polite">
          {loading ? (
            <div className="empty-state">Görevler yükleniyor...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">Bu görünümde görev yok.</div>
          ) : (
            filteredTasks.map((task) => {
              const isEditing = editingId === task._id

              return (
                <article className={task.completed ? 'task-item completed' : 'task-item'} key={task._id}>
                  <button
                    aria-label={task.completed ? 'Aktif yap' : 'Tamamlandı yap'}
                    className="check-button"
                    onClick={() => updateTask(task._id, { completed: !task.completed })}
                    type="button"
                  >
                    {task.completed ? '✓' : ''}
                  </button>

                  {isEditing ? (
                    <form className="edit-form" onSubmit={(event) => saveEditing(event, task)}>
                      <input
                        autoFocus
                        value={editingTitle}
                        onChange={(event) => setEditingTitle(event.target.value)}
                      />
                      <button type="submit" disabled={!editingTitle.trim()}>
                        ✓
                      </button>
                      <button type="button" onClick={cancelEditing}>
                        ×
                      </button>
                    </form>
                  ) : (
                    <>
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        <p>{formatDate(task.createdAt)}</p>
                      </div>
                      <div className="task-actions">
                        <button aria-label="Düzenle" onClick={() => startEditing(task)} type="button">
                          ✎
                        </button>
                        <button aria-label="Sil" onClick={() => deleteTask(task._id)} type="button">
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </article>
              )
            })
          )}
        </section>
      </section>
    </main>
  )
}

export default App
