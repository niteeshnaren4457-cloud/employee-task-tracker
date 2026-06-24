import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, Trash2, ArrowRight } from 'lucide-react'

const icons = { success: CheckCircle, error: AlertCircle, delete: Trash2, move: ArrowRight }

export function Toast({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, dismiss }) {
  const [visible, setVisible] = useState(true)
  const Icon = icons[toast.type] || CheckCircle

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(() => dismiss(toast.id), 300) }, 3200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium"
      style={{
        background: '#181818',
        borderColor: 'rgba(251,191,36,0.25)',
        color: '#F0ECE0',
        minWidth: 240,
        animation: visible ? 'toastIn 0.4s cubic-bezier(0.16,1,0.3,1) both' : 'fadeIn 0.3s ease reverse both',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <Icon size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
      <span>{toast.message}</span>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])
  const push = (message, type = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }
  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))
  return { toasts, push, dismiss }
}
