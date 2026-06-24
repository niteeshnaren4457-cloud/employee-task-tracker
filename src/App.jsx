import { useState, useMemo, useCallback } from 'react'
import {
  DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useTaskStore } from './hooks/useTaskStore'
import { Header } from './components/Header'
import { Column } from './components/Column'
import { TaskCard } from './components/TaskCard'
import { TaskModal } from './components/TaskModal'
import { Toast, useToast } from './components/Toast'

const COLUMNS = ['todo', 'inprogress', 'done']

export default function App() {
  const { tasks, addTask, updateTask, moveTask, deleteTask, reorderTask } = useTaskStore()
  const { toasts, push, dismiss } = useToast()

  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [modal, setModal] = useState({ open: false, task: null, defaultStatus: 'todo' })
  const [activeId, setActiveId] = useState(null)
  const [overColumn, setOverColumn] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return tasks.filter(t => {
      const matchQ = !q || t.title.toLowerCase().includes(q) || (t.assignee || '').toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q)
      const matchP = !priorityFilter || t.priority === priorityFilter
      return matchQ && matchP
    })
  }, [tasks, search, priorityFilter])

  const byColumn = (col) => filtered.filter(t => t.status === col)
  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

  // Modal handlers
  const openAdd = (status = 'todo') => setModal({ open: true, task: null, defaultStatus: status })
  const openEdit = (task) => setModal({ open: true, task, defaultStatus: task.status })
  const closeModal = () => setModal(m => ({ ...m, open: false }))

  const handleSave = (form) => {
    if (modal.task) {
      updateTask(modal.task.id, form)
      push('Task updated', 'success')
    } else {
      addTask({ ...form, status: modal.defaultStatus })
      push('Task added', 'success')
    }
  }

  const handleMove = (id, status) => {
    moveTask(id, status)
    const labels = { todo: 'To Do', inprogress: 'In Progress', done: 'Completed' }
    push(`Moved to ${labels[status]}`, 'move')
  }

  const handleDelete = (id) => {
    const t = tasks.find(x => x.id === id)
    deleteTask(id)
    push(`"${t?.title}" deleted`, 'delete')
  }

  // DnD
  const onDragStart = ({ active }) => {
    setActiveId(active.id)
  }

  const onDragOver = ({ active, over }) => {
    if (!over) return
    const overCol = COLUMNS.includes(over.id) ? over.id : tasks.find(t => t.id === over.id)?.status
    setOverColumn(overCol || null)
  }

  const onDragEnd = ({ active, over }) => {
    setActiveId(null)
    setOverColumn(null)
    if (!over) return
    const activeTask = tasks.find(t => t.id === active.id)
    if (!activeTask) return
    const isOverColumn = COLUMNS.includes(over.id)
    const overTask = !isOverColumn ? tasks.find(t => t.id === over.id) : null
    const targetStatus = isOverColumn ? over.id : overTask?.status
    if (!targetStatus) return
    if (targetStatus !== activeTask.status) {
      handleMove(active.id, targetStatus)
    } else if (!isOverColumn && active.id !== over.id) {
      reorderTask(active.id, over.id, targetStatus)
    }
  }

  const allTotal = tasks.length
  const inProgressCount = tasks.filter(t => t.status === 'inprogress').length
  const doneCount = tasks.filter(t => t.status === 'done').length

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
      {/* Ambient gold glow top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-48 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 70%)', zIndex: 0 }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-7">
        <Header
          total={allTotal}
          inProgress={inProgressCount}
          done={doneCount}
          search={search}
          setSearch={setSearch}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          onAdd={() => openAdd()}
        />

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="grid grid-cols-3 gap-4">
            {COLUMNS.map(col => (
              <Column
                key={col}
                id={col}
                tasks={byColumn(col)}
                onMove={handleMove}
                onEdit={openEdit}
                onDelete={handleDelete}
                onAdd={() => openAdd(col)}
                isOver={overColumn === col}
              />
            ))}
          </div>

          <DragOverlay adjustScale={false}>
            {activeTask ? (
              <div style={{ transform: 'rotate(2deg)', opacity: 0.95 }}>
                <TaskCard
                  task={activeTask}
                  index={0}
                  onMove={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        open={modal.open}
        onClose={closeModal}
        onSave={handleSave}
        initial={modal.task}
      />

      <Toast toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
