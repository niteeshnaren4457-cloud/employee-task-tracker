import { useEffect, useRef, useState } from 'react'
import { X, Sparkles } from 'lucide-react'

const PRIORITIES = ['Low', 'Medium', 'High']

export function TaskModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({ title: '', desc: '', assignee: '', priority: 'Medium', due: '' })
  const firstRef = useRef()

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { title: initial.title, desc: initial.desc || '', assignee: initial.assignee || '', priority: initial.priority || 'Medium', due: initial.due || '' }
        : { title: '', desc: '', assignee: '', priority: 'Medium', due: '' }
      )
      setTimeout(() => firstRef.current?.focus(), 80)
    }
  }, [open, initial])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl p-7"
        style={{
          background: '#141414',
          border: '1px solid rgba(251,191,36,0.18)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(251,191,36,0.06) inset',
          animation: 'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Gold top border accent */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }} />

        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <Sparkles size={15} style={{ color: '#F59E0B' }} />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: '#F0ECE0', fontFamily: 'Playfair Display, serif' }}>
              {initial ? 'Edit task' : 'New task'}
            </h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#888' }}>
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Task title *">
            <input
              ref={firstRef}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Design homepage wireframe"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all"
              style={inputStyle}
              required
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.desc}
              onChange={e => set('desc', e.target.value)}
              placeholder="Brief context or goal for this task…"
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm resize-none transition-all"
              style={inputStyle}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Assigned to">
              <input
                value={form.assignee}
                onChange={e => set('assignee', e.target.value)}
                placeholder="Employee name"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all"
                style={inputStyle}
              />
            </Field>
            <Field label="Due date">
              <input
                type="date"
                value={form.due}
                onChange={e => set('due', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all"
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </Field>
          </div>

          <Field label="Priority">
            <div className="flex gap-2">
              {PRIORITIES.map(p => {
                const colors = { Low: ['#064E3B','#6EE7B7'], Medium: ['#78350F','#FCD34D'], High: ['#450A0A','#FCA5A5'] }
                const active = form.priority === p
                return (
                  <button key={p} type="button" onClick={() => set('priority', p)}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200"
                    style={{
                      background: active ? colors[p][0] : 'rgba(255,255,255,0.04)',
                      borderColor: active ? colors[p][1] + '60' : 'rgba(255,255,255,0.08)',
                      color: active ? colors[p][1] : '#666',
                      transform: active ? 'scale(1.03)' : 'scale(1)',
                    }}
                  >{p}</button>
                )
              })}
            </div>
          </Field>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/8"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#888' }}>
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #D97706, #F59E0B)',
                color: '#0A0A0A',
                boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
              }}>
              {initial ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#F0ECE0',
  fontFamily: 'Inter, sans-serif',
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: '#888', letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  )
}
