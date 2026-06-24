import { useState, useEffect, useCallback } from 'react'

const SEED = [
  { id: '1', title: 'Brand identity redesign', desc: 'Refresh logo, color palette and typography for Q3 relaunch.', assignee: 'Priya Menon', priority: 'High', due: '2025-07-18', status: 'todo', createdAt: Date.now() - 86400000 * 3 },
  { id: '2', title: 'API documentation', desc: 'Document all REST endpoints for the payments module.', assignee: 'Rajan Kumar', priority: 'Medium', due: '2025-07-22', status: 'inprogress', createdAt: Date.now() - 86400000 * 2 },
  { id: '3', title: 'Onboarding email flow', desc: 'Draft 3-part welcome sequence for new user signups.', assignee: 'Sneha Ramesh', priority: 'Low', due: '2025-07-10', status: 'done', createdAt: Date.now() - 86400000 },
  { id: '4', title: 'Performance audit', desc: 'Lighthouse audit all key pages, fix Core Web Vitals issues.', assignee: 'Arun Sivam', priority: 'High', due: '2025-07-15', status: 'inprogress', createdAt: Date.now() - 3600000 },
  { id: '5', title: 'Quarterly report', desc: 'Compile KPIs and growth metrics for leadership review.', assignee: 'Meena Iyer', priority: 'Medium', due: '2025-07-30', status: 'todo', createdAt: Date.now() },
]

function load() {
  try {
    const raw = localStorage.getItem('taskboard_v2')
    if (raw) return JSON.parse(raw)
  } catch {}
  return SEED
}

function save(tasks) {
  try { localStorage.setItem('taskboard_v2', JSON.stringify(tasks)) } catch {}
}

export function useTaskStore() {
  const [tasks, setTasks] = useState(load)

  useEffect(() => { save(tasks) }, [tasks])

  const addTask = useCallback((data) => {
    setTasks(prev => [{ id: Date.now().toString(), status: 'todo', createdAt: Date.now(), ...data }, ...prev])
  }, [])

  const updateTask = useCallback((id, data) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }, [])

  const moveTask = useCallback((id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const reorderTask = useCallback((activeId, overId, newStatus) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === activeId ? { ...t, status: newStatus } : t)
      const idx = updated.findIndex(t => t.id === overId)
      const activeIdx = updated.findIndex(t => t.id === activeId)
      if (idx === -1 || activeIdx === -1) return updated
      const reordered = [...updated]
      const [moved] = reordered.splice(activeIdx, 1)
      reordered.splice(idx, 0, moved)
      return reordered
    })
  }, [])

  return { tasks, addTask, updateTask, moveTask, deleteTask, reorderTask }
}
