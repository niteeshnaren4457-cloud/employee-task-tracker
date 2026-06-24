import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_URL = "http://localhost:5000/api/tasks"

export function useTaskStore() {
  const [tasks, setTasks] = useState([])

  // Load tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL)
      setTasks(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Add task
  const addTask = useCallback(async (data) => {
    try {
      await axios.post(API_URL, {
        ...data,
        status: 'todo',
        createdAt: Date.now()
      })
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Update task
  const updateTask = useCallback(async (id, data) => {
    try {
      await axios.put(`${API_URL}/${id}`, data)
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Move task
  const moveTask = useCallback(async (id, status) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status })
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Delete task
  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }, [])

  // Reorder task
  const reorderTask = useCallback(async (activeId, overId, newStatus) => {
    try {
      await axios.put(`${API_URL}/${activeId}`, { status: newStatus })
      fetchTasks()
    } catch (error) {
      console.error(error)
    }
  }, [])

  return {
    tasks,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    reorderTask
  }
}