import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Calendar, GripVertical, ChevronRight } from 'lucide-react'
import { initials, fmtDate, isOverdue, getDaysLeft, PRIORITY_META, avatarColor } from '../utils/helpers'

const STATUS_NEXT = {
  todo: { to: 'inprogress', label: 'Start task' },
  inprogress: { to: 'done', label: 'Mark done' },
  done: { to: 'todo', label: 'Reopen' },
}

export function TaskCard({ task, onMove, onEdit, onDelete, index }) {
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // FIXED: MongoDB uses _id
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.16,1,0.3,1)',
    animationDelay: `${index * 60}ms`,
  }

  const pm = PRIORITY_META[task.priority] || PRIORITY_META.Medium
  const [bgColor, textColor] = avatarColor(task.assignee)
  const overdue = isOverdue(task.due, task.status)
  const daysLeft = getDaysLeft(task.due)
  const next = STATUS_NEXT[task.status]

  const handleDelete = () => {
    setDeleting(true)
    // FIXED: MongoDB uses _id
    setTimeout(() => onDelete(task._id), 280)
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDragging ? 0.35 : 1,
        transform: isDragging
          ? CSS.Transform.toString(transform) + ' scale(0.96)'
          : CSS.Transform.toString(transform),
      }}
      className={`relative group rounded-2xl p-4 mb-3 cursor-default select-none border transition-all duration-300 animate-slideInUp ${
        deleting ? 'opacity-0 scale-95 translate-y-2' : ''
      }`}
      style={{
        ...style,
        opacity: isDragging ? 0.3 : deleting ? 0 : 1,
        background: hovered
          ? 'linear-gradient(135deg, #1C1C1C 0%, #181818 100%)'
          : 'linear-gradient(135deg, #181818 0%, #141414 100%)',
        border: hovered
          ? '1px solid rgba(251,191,36,0.22)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered
          ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,191,36,0.06) inset'
          : '0 2px 12px rgba(0,0,0,0.3)',
        transform: isDragging
          ? CSS.Transform.toString(transform) + ' scale(0.96)'
          : hovered
          ? (CSS.Transform.toString(transform) || '') + ' translateY(-2px)'
          : CSS.Transform.toString(transform),
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {task.priority === 'High' && (
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
          style={{ background: 'linear-gradient(180deg, #F59E0B, #B45309)' }}
        />
      )}

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(135deg, rgba(251,191,36,0.05) 0%, transparent 60%)',
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="flex items-start gap-2.5 mb-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 hover:!opacity-70 transition-opacity flex-shrink-0"
          style={{ color: '#888', touchAction: 'none' }}
        >
          <GripVertical size={14} />
        </div>

        <h3
          className="text-sm font-semibold leading-snug flex-1"
          style={{
            color: task.status === 'done' ? '#555' : '#F0ECE0',
            textDecoration: task.status === 'done' ? 'line-through' : 'none',
          }}
        >
          {task.title}
        </h3>
      </div>

      {task.desc && (
        <p className="text-xs leading-relaxed mb-3 ml-6" style={{ color: '#666' }}>
          {task.desc}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3 ml-6">
        {task.assignee && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
              style={{ background: bgColor, color: textColor }}
            >
              {initials(task.assignee)}
            </div>
            <span className="text-xs" style={{ color: '#666' }}>
              {task.assignee.split(' ')[0]}
            </span>
          </div>
        )}

        <span
          className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full border ${pm.bg} ${pm.color}`}
        >
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${pm.dot}`}
            style={{ verticalAlign: 'middle' }}
          />
          {task.priority}
        </span>
      </div>

      {task.due && (
        <div className="flex items-center gap-1.5 mb-3 ml-6">
          <Calendar size={11} style={{ color: overdue ? '#EF4444' : '#666' }} />
          <span
            className="text-[11px]"
            style={{ color: overdue ? '#EF4444' : '#666' }}
          >
            {fmtDate(task.due)}
            {task.status !== 'done' && daysLeft !== null && (
              <span className="ml-1">
                {overdue
                  ? '· overdue'
                  : daysLeft === 0
                  ? '· today'
                  : daysLeft === 1
                  ? '· tomorrow'
                  : `· ${daysLeft}d left`}
              </span>
            )}
          </span>
        </div>
      )}

      <div
        className={`flex gap-1.5 ml-6 transition-all duration-200 ${
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
        }`}
      >
        <button
          onClick={() => onMove(task._id, next.to)}
          className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 hover:scale-105"
          style={{
            background: 'rgba(251,191,36,0.12)',
            color: '#F59E0B',
            border: '1px solid rgba(251,191,36,0.2)',
          }}
        >
          <ChevronRight size={10} /> {next.label}
        </button>

        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#aaa',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Pencil size={10} /> Edit
        </button>

        <button
          onClick={handleDelete}
          className="ml-auto flex items-center gap-1 text-[10px] px-2 py-1.5 rounded-lg transition-all duration-150 hover:scale-105"
          style={{
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  )
}