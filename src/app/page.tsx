'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    alive: 'bg-green-500',
    warning: 'bg-yellow-500',
    dead: 'bg-red-500',
  }
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] || 'bg-gray-500'} ${status === 'alive' ? 'animate-pulse' : ''}`} />
  )
}

const agents = [
  { id: '1', name: 'Hermes Backup', role: 'System Backup', status: 'alive', uptime: '100%', schedule: 'every 1h', lastStatus: 'ok' },
  { id: '2', name: 'Morning Briefing', role: 'Morning Briefing', status: 'alive', uptime: '99.9%', schedule: 'daily 7am', lastStatus: 'ok' },
  { id: '3', name: 'Weekly Review', role: 'Weekly Review', status: 'alive', uptime: '99.9%', schedule: 'Sun 8pm', lastStatus: 'ok' },
  { id: '4', name: 'FELIX Heartbeat', role: 'CEO Heartbeat', status: 'alive', uptime: '99.9%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '5', name: 'FELIX Coordinator', role: 'CEO Coordinator', status: 'alive', uptime: '99.9%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '6', name: 'CEO Check-in', role: 'CEO Check-in', status: 'alive', uptime: '99.5%', schedule: 'every 4h', lastStatus: 'ok' },
  { id: '7', name: 'Memory Janitor', role: 'Memory Janitor', status: 'alive', uptime: '98.0%', schedule: 'every 12h', lastStatus: 'ok' },
  { id: '8', name: 'System Health', role: 'Health Monitor', status: 'alive', uptime: '100%', schedule: 'every 30m', lastStatus: 'ok' },
  { id: '9', name: 'Google Meet', role: 'Meet Keepalive', status: 'alive', uptime: '100%', schedule: 'every 15m', lastStatus: 'ok' },
  { id: '10', name: 'Sentry Agent', role: 'Sentry Monitor', status: 'alive', uptime: '97.5%', schedule: 'every 1h', lastStatus: 'ok' },
  { id: '11', name: 'Telepathy Sync', role: 'Context Sync', status: 'alive', uptime: '99.0%', schedule: 'every 30m', lastStatus: 'ok' },
  { id: '12', name: 'Fontanero', role: 'Auto Fixer', status: 'alive', uptime: '96.0%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '13', name: 'Log Doctor', role: 'Log Monitor', status: 'alive', uptime: '98.5%', schedule: 'every 1h', lastStatus: 'ok' },
  { id: '14', name: 'Resurrection', role: 'Resurrection Agent', status: 'alive', uptime: '95.0%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '15', name: 'Quorum', role: 'Quorum Validator', status: 'alive', uptime: '97.0%', schedule: 'every 3h', lastStatus: 'ok' },
  { id: '16', name: 'Changelog', role: 'Changelog Tracker', status: 'alive', uptime: '99.0%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '17', name: 'DiffGuard', role: 'PR Reviewer', status: 'alive', uptime: '97.0%', schedule: 'every 3h', lastStatus: 'ok' },
  { id: '18', name: 'Causal Chain', role: 'Causal Analyzer', status: 'alive', uptime: '96.0%', schedule: 'every 4h', lastStatus: 'ok' },
  { id: '19', name: 'API Polyglot', role: 'API Polyglot', status: 'alive', uptime: '97.0%', schedule: 'every 3h', lastStatus: 'ok' },
  { id: '20', name: 'Job Hunter Search', role: 'Job Hunter', status: 'alive', uptime: '99.0%', schedule: 'daily 8am', lastStatus: 'ok' },
  { id: '21', name: 'Job Hunter Emails', role: 'Job Hunter', status: 'alive', uptime: '99.0%', schedule: 'daily 9am', lastStatus: 'ok' },
  { id: '22', name: 'Job Hunter Send', role: 'Job Hunter', status: 'alive', uptime: '99.0%', schedule: 'daily 10am', lastStatus: 'ok' },
  { id: '23', name: 'Job Hunter PM', role: 'Job Hunter', status: 'alive', uptime: '99.0%', schedule: 'daily 2pm', lastStatus: 'ok' },
  { id: '24', name: 'Job Hunter Report', role: 'Job Hunter', status: 'alive', uptime: '99.0%', schedule: 'daily 8pm', lastStatus: 'ok' },
]

const summary = {
  total: agents.length,
  alive: agents.filter(a => a.status === 'alive').length,
  warning: agents.filter(a => a.status === 'warning').length,
  dead: agents.filter(a => a.status === 'dead').length,
}

const systemMetrics = {
  ram: { used: 4096, total: 8192, percent: 50 },
  disk: { used: 48, total: 96, percent: 50 },
  load: { oneMin: 0.5, fiveMin: 0.5, fifteenMin: 0.5 },
  gateway: { status: 'running', uptime: 'active' },
  crons: { active: 24, total: 24 },
}

const knowledgeStats = {
  nodes: 683,
  edges: 639,
  communities: 16,
  facts: 524,
  factsByCategory: { general: 335, project: 80, tool: 70, user_pref: 39 },
}

function AgentCard({ agent }: { agent: typeof agents[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#16161a] border border-white/6 rounded-xl p-4 hover:border-[#ff6b35]/30 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <StatusDot status={agent.status} />
          <span className="text-sm font-semibold text-[#f0f0f0]">{agent.name}</span>
        </div>
        <span className="text-xs text-[#888] font-mono">{agent.uptime}</span>
      </div>
      <p className="text-xs text-[#888] mb-1">{agent.role}</p>
      <div className="flex items-center justify-between text-xs text-[#666]">
        <span>{agent.schedule}</span>
        <span className={agent.lastStatus === 'ok' ? 'text-green-500/70' : 'text-yellow-500/70'}>
          {agent.lastStatus}
        </span>
      </div>
    </motion.div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#16161a] border border-white/6 rounded-xl p-5"
    >
      <p className="text-xs text-[#888] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color || 'text-[#f0f0f0]'}`}>{value}</p>
      {sub && <p className="text-xs text-[#666] mt-1">{sub}</p>}
    </motion.div>
  )
}

function GaugeBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#888]">{label}</span>
        <span className="text-[#f0f0f0] font-mono">{percent}%</span>
      </div>
      <div className="h-2 bg-white/6 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const dateStr = mounted
    ? new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const timeStr = mounted
    ? new Date().toLocaleTimeString('es-ES')
    : ''

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0]">
      <header className="border-b border-white/6 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ff6b35] flex items-center justify-center text-black font-bold text-sm">Z</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">ZOO Command Center</h1>
            <p className="text-xs text-[#666]">Ecosystem Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#888]">
          <span>{dateStr}</span>
          <span className="font-mono">{timeStr}</span>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Agents" value={summary.total} sub={`${summary.alive} alive`} color="text-[#ff6b35]" />
          <StatCard label="Nodes" value={knowledgeStats.nodes} sub="Knowledge Graph" color="text-blue-400" />
          <StatCard label="Facts" value={knowledgeStats.facts} sub="Stored" color="text-purple-400" />
          <StatCard label="Communities" value={knowledgeStats.communities} sub="Detected" color="text-cyan-400" />
          <StatCard label="RAM" value={`${systemMetrics.ram.percent}%`} sub={`${systemMetrics.ram.used}/${systemMetrics.ram.total} MB`} color={systemMetrics.ram.percent > 80 ? 'text-red-400' : 'text-green-400'} />
          <StatCard label="Disk" value={`${systemMetrics.disk.percent}%`} sub={`${systemMetrics.disk.used}/${systemMetrics.disk.total} GB`} color={systemMetrics.disk.percent > 80 ? 'text-red-400' : 'text-green-400'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">Agent Fleet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {agents.map((agent, i: number) => (
                <motion.div key={agent.id} transition={{ delay: i * 0.03 }}>
                  <AgentCard agent={agent} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#16161a] border border-white/6 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">System Health</h2>
              <GaugeBar label="RAM" percent={systemMetrics.ram.percent} color={systemMetrics.ram.percent > 80 ? 'bg-red-500' : systemMetrics.ram.percent > 60 ? 'bg-yellow-500' : 'bg-green-500'} />
              <GaugeBar label="Disk" percent={systemMetrics.disk.percent} color={systemMetrics.disk.percent > 80 ? 'bg-red-500' : systemMetrics.disk.percent > 60 ? 'bg-yellow-500' : 'bg-green-500'} />
              <GaugeBar label="Load" percent={Math.min(Math.round(systemMetrics.load.oneMin * 25), 100)} color={systemMetrics.load.oneMin > 3 ? 'bg-red-500' : systemMetrics.load.oneMin > 1.5 ? 'bg-yellow-500' : 'bg-green-500'} />
              <div className="mt-4 pt-4 border-t border-white/6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888]">Gateway</span>
                  <span className={systemMetrics.gateway.status === 'running' ? 'text-green-400' : 'text-red-400'}>{systemMetrics.gateway.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Active Crons</span>
                  <span className="text-[#f0f0f0]">{systemMetrics.crons.active}/{systemMetrics.crons.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Load (1/5/15)</span>
                  <span className="text-[#f0f0f0] font-mono">{systemMetrics.load.oneMin.toFixed(2)} / {systemMetrics.load.fiveMin.toFixed(2)} / {systemMetrics.load.fifteenMin.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#16161a] border border-white/6 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">Knowledge Graph</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0a0a0b] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#ff6b35]">{knowledgeStats.nodes}</p>
                    <p className="text-xs text-[#666]">Nodes</p>
                  </div>
                  <div className="bg-[#0a0a0b] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{knowledgeStats.edges}</p>
                    <p className="text-xs text-[#666]">Edges</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(knowledgeStats.factsByCategory).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between text-xs">
                      <span className="text-[#888] capitalize">{cat}</span>
                      <span className="text-[#f0f0f0] font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#16161a] border border-white/6 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">Alerts</h2>
              {summary.dead > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
                  <p className="text-xs text-red-400">⚠ {summary.dead} agent(s) down</p>
                </div>
              )}
              {summary.warning > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-2">
                  <p className="text-xs text-yellow-400">⚡ {summary.warning} agent(s) with warnings</p>
                </div>
              )}
              {systemMetrics.ram.percent > 80 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
                  <p className="text-xs text-red-400">🔴 RAM critical: {systemMetrics.ram.percent}%</p>
                </div>
              )}
              {summary.dead === 0 && summary.warning === 0 && systemMetrics.ram.percent <= 80 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-xs text-green-400">✓ All systems operational</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
