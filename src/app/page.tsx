'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

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

interface AgentCardProps {
  agent: {
    id: string
    name: string
    role: string
    status: string
    lastHeartbeat: string
    uptime: string
    schedule: string
    lastStatus: string
  }
}

function AgentCard({ agent }: AgentCardProps) {
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

const fallbackAgents = [
  { id: '1', name: 'FELIX Coordinator', role: 'CEO Coordinator', status: 'alive', lastHeartbeat: '', uptime: '99.9%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '2', name: 'CEO Check-in', role: 'CEO Agent', status: 'alive', lastHeartbeat: '', uptime: '99.5%', schedule: 'every 4h', lastStatus: 'ok' },
  { id: '3', name: 'System Health', role: 'Health Monitor', status: 'alive', lastHeartbeat: '', uptime: '100%', schedule: 'every 30m', lastStatus: 'ok' },
  { id: '4', name: 'Memory Janitor', role: 'Memory Manager', status: 'alive', lastHeartbeat: '', uptime: '98.0%', schedule: 'every 12h', lastStatus: 'ok' },
  { id: '5', name: 'Hermes Backup', role: 'System Backup', status: 'alive', lastHeartbeat: '', uptime: '100%', schedule: 'every 1h', lastStatus: 'ok' },
  { id: '6', name: 'Sentry Agent', role: 'Sentry Monitor', status: 'alive', lastHeartbeat: '', uptime: '97.5%', schedule: 'every 1h', lastStatus: 'ok' },
  { id: '7', name: 'Telepathy Sync', role: 'Context Sync', status: 'alive', lastHeartbeat: '', uptime: '99.0%', schedule: 'every 30m', lastStatus: 'ok' },
  { id: '8', name: 'Fontanero', role: 'Auto Fixer', status: 'alive', lastHeartbeat: '', uptime: '96.0%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '9', name: 'Log Doctor', role: 'Log Monitor', status: 'alive', lastHeartbeat: '', uptime: '98.5%', schedule: 'every 1h', lastStatus: 'ok' },
  { id: '10', name: 'Resurrection', role: 'Recovery Agent', status: 'alive', lastHeartbeat: '', uptime: '95.0%', schedule: 'every 2h', lastStatus: 'ok' },
  { id: '11', name: 'Quorum', role: 'Validator', status: 'alive', lastHeartbeat: '', uptime: '97.0%', schedule: 'every 3h', lastStatus: 'ok' },
  { id: '12', name: 'Changelog', role: 'Tracker', status: 'alive', lastHeartbeat: '', uptime: '99.0%', schedule: 'every 2h', lastStatus: 'ok' },
]

const fallbackSystem = {
  ram: { used: 4096, total: 8192, percent: 50 },
  disk: { used: 48, total: 96, percent: 50 },
  load: { oneMin: 0.5, fiveMin: 0.5, fifteenMin: 0.5 },
  gateway: { status: 'running', uptime: 'N/A' },
  crons: { active: 24, total: 24 },
}

const fallbackKnowledge = {
  nodes: 683,
  edges: 639,
  communities: 16,
  facts: 524,
  factsByCategory: { general: 335, project: 80, tool: 70, user_pref: 39 },
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)

  const { data: agentsData } = useSWR('/api/agents', fetcher, {
    refreshInterval: 30000,
    fallbackData: { agents: fallbackAgents, summary: { total: 12, alive: 12, warning: 0, dead: 0 } },
  })
  const { data: systemData } = useSWR('/api/system', fetcher, {
    refreshInterval: 15000,
    fallbackData: fallbackSystem,
  })
  const { data: knowledgeData } = useSWR('/api/knowledge', fetcher, {
    refreshInterval: 60000,
    fallbackData: fallbackKnowledge,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const agents = agentsData?.agents || fallbackAgents
  const summary = agentsData?.summary || { total: 12, alive: 12, warning: 0, dead: 0 }
  const system = systemData || fallbackSystem
  const knowledge = knowledgeData || fallbackKnowledge

  const dateStr = mounted
    ? new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const timeStr = mounted
    ? new Date().toLocaleTimeString('es-ES')
    : ''

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-[#f0f0f0]">
      {/* Top Bar */}
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
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Agents" value={summary.total} sub={`${summary.alive} alive`} color="text-[#ff6b35]" />
          <StatCard label="Nodes" value={knowledge.nodes} sub="Knowledge Graph" color="text-blue-400" />
          <StatCard label="Facts" value={knowledge.facts} sub="Stored" color="text-purple-400" />
          <StatCard label="Communities" value={knowledge.communities} sub="Detected" color="text-cyan-400" />
          <StatCard label="RAM" value={`${system.ram.percent}%`} sub={`${system.ram.used}/${system.ram.total} MB`} color={system.ram.percent > 80 ? 'text-red-400' : 'text-green-400'} />
          <StatCard label="Disk" value={`${system.disk.percent}%`} sub={`${system.disk.used}/${system.disk.total} GB`} color={system.disk.percent > 80 ? 'text-red-400' : 'text-green-400'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents Grid */}
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

          {/* Right Panel */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-[#16161a] border border-white/6 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">System Health</h2>
              <GaugeBar label="RAM" percent={system.ram.percent} color={system.ram.percent > 80 ? 'bg-red-500' : system.ram.percent > 60 ? 'bg-yellow-500' : 'bg-green-500'} />
              <GaugeBar label="Disk" percent={system.disk.percent} color={system.disk.percent > 80 ? 'bg-red-500' : system.disk.percent > 60 ? 'bg-yellow-500' : 'bg-green-500'} />
              <GaugeBar label="Load" percent={Math.min(Math.round(system.load.oneMin * 25), 100)} color={system.load.oneMin > 3 ? 'bg-red-500' : system.load.oneMin > 1.5 ? 'bg-yellow-500' : 'bg-green-500'} />
              <div className="mt-4 pt-4 border-t border-white/6 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888]">Gateway</span>
                  <span className={system.gateway.status === 'running' ? 'text-green-400' : 'text-red-400'}>
                    {system.gateway.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Active Crons</span>
                  <span className="text-[#f0f0f0]">{system.crons.active}/{system.crons.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Load (1/5/15)</span>
                  <span className="text-[#f0f0f0] font-mono">{system.load.oneMin.toFixed(2)} / {system.load.fiveMin.toFixed(2)} / {system.load.fifteenMin.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Knowledge Graph */}
            <div className="bg-[#16161a] border border-white/6 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#888] uppercase tracking-wider mb-4">Knowledge Graph</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0a0a0b] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#ff6b35]">{knowledge.nodes}</p>
                    <p className="text-xs text-[#666]">Nodes</p>
                  </div>
                  <div className="bg-[#0a0a0b] rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{knowledge.edges}</p>
                    <p className="text-xs text-[#666]">Edges</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {Object.entries(knowledge.factsByCategory).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between text-xs">
                      <span className="text-[#888] capitalize">{cat}</span>
                      <span className="text-[#f0f0f0] font-mono">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alerts */}
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
              {system.ram.percent > 80 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-2">
                  <p className="text-xs text-red-400">🔴 RAM critical: {system.ram.percent}%</p>
                </div>
              )}
              {summary.dead === 0 && summary.warning === 0 && system.ram.percent <= 80 && (
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
