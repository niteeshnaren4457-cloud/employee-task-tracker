import { useState } from 'react'
import { Search, Plus, LayoutDashboard, SlidersHorizontal, X } from 'lucide-react'

export function Header({ total, inProgress, done, search, setSearch, priorityFilter, setPriorityFilter, onAdd }) {
  const [filterOpen, setFilterOpen] = useState(false)

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <header className="mb-8 animate-slideInDown">
      {/* Top bar */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
              <LayoutDashboard size={15} style={{ color: '#0A0A0A' }} />
            </div>
            <h1 className="text-2xl font-semibold gold-text" style={{ fontFamily: 'Playfair Display, serif' }}>
              Task Board
            </h1>
          </div>
          <p className="text-xs ml-10" style={{ color: '#555' }}>{today}</p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #D97706, #F59E0B)',
            color: '#0A0A0A',
            boxShadow: '0 4px 20px rgba(245,158,11,0.4)',
          }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Total tasks" value={total} color="#818CF8" />
        <StatCard label="In progress" value={inProgress} color="#F59E0B" />
        <StatCard label="Completed" value={done} color="#10B981" />
      </div>

      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks or assignees…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all"
            style={{
              background: '#141414',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F0ECE0',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#555' }}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(f => !f)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:scale-105"
            style={{
              background: priorityFilter ? 'rgba(245,158,11,0.12)' : '#141414',
              border: priorityFilter ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: priorityFilter ? '#F59E0B' : '#666',
            }}
          >
            <SlidersHorizontal size={14} />
            {priorityFilter || 'Filter'}
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50 animate-scaleIn"
              style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', minWidth: 140 }}>
              {['', 'High', 'Medium', 'Low'].map(p => (
                <button key={p} onClick={() => { setPriorityFilter(p); setFilterOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                  style={{ color: p === priorityFilter ? '#F59E0B' : '#aaa' }}>
                  {p || 'All priorities'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] animate-slideInUp"
      style={{
        background: 'linear-gradient(135deg, #161616, #121212)',
        border: `1px solid ${color}20`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
      }}>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs mb-1" style={{ color: '#555' }}>{label}</p>
          <p className="text-3xl font-semibold" style={{ color, fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>
            {value}
          </p>
        </div>
        <div className="w-1 h-8 rounded-full mb-0.5" style={{ background: `linear-gradient(180deg, ${color}, transparent)` }} />
      </div>
    </div>
  )
}
