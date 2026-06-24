export function initials(name = '') {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'
}

export function fmtDate(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${+day} ${months[+m - 1]}`
}

export function isOverdue(due, status) {
  if (!due || status === 'done') return false
  return new Date(due) < new Date(new Date().toDateString())
}

export function getDaysLeft(due) {
  if (!due) return null
  const diff = new Date(due) - new Date(new Date().toDateString())
  return Math.ceil(diff / 86400000)
}

export const PRIORITY_META = {
  High:   { color: 'text-red-400',    bg: 'bg-red-950/60 border-red-800/40',   dot: 'bg-red-500'    },
  Medium: { color: 'text-amber-400',  bg: 'bg-amber-950/60 border-amber-800/40', dot: 'bg-amber-400' },
  Low:    { color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-800/40', dot: 'bg-emerald-500' },
}

export const COL_META = {
  todo:       { label: 'To Do',       accent: '#6366f1', ring: 'ring-indigo-500/20'  },
  inprogress: { label: 'In Progress', accent: '#F59E0B', ring: 'ring-gold-500/20'    },
  done:       { label: 'Completed',   accent: '#10b981', ring: 'ring-emerald-500/20' },
}

export const AVATAR_COLORS = [
  ['#78350F','#FCD34D'],['#064E3B','#6EE7B7'],['#1E1B4B','#A5B4FC'],
  ['#4A1942','#F9A8D4'],['#1C1917','#D4A574'],['#0C4A6E','#7DD3FC'],
]

export function avatarColor(name='') {
  const code = name.split('').reduce((a,c) => a + c.charCodeAt(0), 0)
  return AVATAR_COLORS[code % AVATAR_COLORS.length]
}
