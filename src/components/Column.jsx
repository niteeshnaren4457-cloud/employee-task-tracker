import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from './TaskCard'
import { Plus, LayoutGrid } from 'lucide-react'

const COL_CONFIG = {
  todo: {
    label: 'To Do',
    accent: '#818CF8',
    glow: 'rgba(129,140,248,0.12)',
    counter: 'rgba(129,140,248,0.15)',
    counterText: '#818CF8',
    headerLine: 'linear-gradient(90deg, #818CF8, transparent)',
  },
  inprogress: {
    label: 'In Progress',
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.1)',
    counter: 'rgba(245,158,11,0.15)',
    counterText: '#F59E0B',
    headerLine: 'linear-gradient(90deg, #F59E0B, transparent)',
  },
  done: {
    label: 'Completed',
    accent: '#10B981',
    glow: 'rgba(16,185,129,0.1)',
    counter: 'rgba(16,185,129,0.15)',
    counterText: '#10B981',
    headerLine: 'linear-gradient(90deg, #10B981, transparent)',
  },
}

export function Column({ id, tasks, onMove, onEdit, onDelete, onAdd, isOver }) {
  const { setNodeRef } = useDroppable({ id })
  const cfg = COL_CONFIG[id]

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col rounded-2xl transition-all duration-300"
      style={{
        background: isOver
          ? `linear-gradient(180deg, ${cfg.glow}, #141414 60%)`
          : 'linear-gradient(180deg, #131313 0%, #0F0F0F 100%)',
        border: isOver
          ? `1px solid ${cfg.accent}55`
          : '1px solid rgba(255,255,255,0.06)',
        minHeight: 480,
        boxShadow: isOver ? `0 0 40px ${cfg.glow}` : '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Column header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full" style={{ background: cfg.accent, boxShadow: `0 0 8px ${cfg.accent}` }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#D4C9A8', fontFamily: 'Inter, sans-serif' }}>
              {cfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: cfg.counter, color: cfg.counterText }}>
              {tasks.length}
            </span>
            <button onClick={() => onAdd(id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#888' }}
              title="Add task">
              <Plus size={13} />
            </button>
          </div>
        </div>
        {/* Accent line */}
        <div className="h-px w-full rounded-full" style={{ background: cfg.headerLine, opacity: 0.5 }} />
      </div>

      {/* Cards */}
      <div className="flex-1 px-3 pb-3 overflow-y-auto" style={{ maxHeight: '70vh' }}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <EmptyState cfg={cfg} onAdd={() => onAdd(id)} />
          ) : (
            tasks.map((t, i) => (
              <TaskCard
                key={t.id}
                task={t}
                index={i}
                onMove={onMove}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

function EmptyState({ cfg, onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 animate-fadeIn">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: `${cfg.accent}12`, border: `1px dashed ${cfg.accent}40` }}>
        <LayoutGrid size={20} style={{ color: cfg.accent, opacity: 0.6 }} />
      </div>
      <p className="text-xs text-center" style={{ color: '#444' }}>No tasks here yet</p>
      <button onClick={onAdd}
        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105"
        style={{ background: `${cfg.accent}12`, color: cfg.accent, border: `1px solid ${cfg.accent}25` }}>
        + Add first task
      </button>
    </div>
  )
}
