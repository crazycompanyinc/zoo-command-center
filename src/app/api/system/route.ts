import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

interface SystemMetrics {
  ram: { used: number; total: number; percent: number }
  disk: { used: number; total: number; percent: number }
  load: { oneMin: number; fiveMin: number; fifteenMin: number }
  gateway: { status: string; uptime: string }
  crons: { active: number; total: number }
  timestamp: string
}

export async function GET(): Promise<NextResponse<SystemMetrics>> {
  try {
    const ramOutput = execSync('free -m | grep Mem', { encoding: 'utf-8' }).trim()
    const ramParts = ramOutput.split(/\s+/)
    const ramTotal = parseInt(ramParts[1]) || 8192
    const ramUsed = parseInt(ramParts[2]) || 4096
    const ramPercent = Math.round((ramUsed / ramTotal) * 100)

    const diskOutput = execSync('df -h / | tail -1', { encoding: 'utf-8' }).trim()
    const diskParts = diskOutput.split(/\s+/)
    const diskTotal = diskParts[1] || '96G'
    const diskUsed = diskParts[2] || '48G'
    const diskPercent = parseInt(diskParts[4]?.replace('%', '') || '50')

    const loadOutput = execSync('cat /proc/loadavg', { encoding: 'utf-8' }).trim()
    const loadParts = loadOutput.split(' ')
    const loadOne = parseFloat(loadParts[0]) || 0.5
    const loadFive = parseFloat(loadParts[1]) || 0.5
    const loadFifteen = parseFloat(loadParts[2]) || 0.5

    let gatewayStatus = 'unknown'
    let gatewayUptime = 'N/A'
    try {
      const gwOutput = execSync('systemctl is-active hermes-gateway 2>/dev/null || echo "inactive"', { encoding: 'utf-8' }).trim()
      gatewayStatus = gwOutput === 'active' ? 'running' : 'stopped'
      if (gatewayStatus === 'running') {
        const uptimeOutput = execSync('ps -eo etime= -p $(pgrep -f "hermes-gateway" | head -1) 2>/dev/null || echo "N/A"', { encoding: 'utf-8' }).trim()
        gatewayUptime = uptimeOutput || 'running'
      }
    } catch {
      gatewayStatus = 'unknown'
    }

    let activeCrons = 24
    let totalCrons = 24
    try {
      const cronOutput = execSync('hermes cron list --json 2>/dev/null || echo "[]"', { encoding: 'utf-8', timeout: 10000 })
      const jobs = JSON.parse(cronOutput) as Record<string, unknown>[]
      totalCrons = jobs.length
      activeCrons = jobs.filter(j => j.enabled !== false).length
    } catch { /* use defaults */ }

    return NextResponse.json({
      ram: { used: ramUsed, total: ramTotal, percent: ramPercent },
      disk: { used: parseSize(diskUsed), total: parseSize(diskTotal), percent: diskPercent },
      load: { oneMin: loadOne, fiveMin: loadFive, fifteenMin: loadFifteen },
      gateway: { status: gatewayStatus, uptime: gatewayUptime },
      crons: { active: activeCrons, total: totalCrons },
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({
      ram: { used: 4096, total: 8192, percent: 50 },
      disk: { used: 48, total: 96, percent: 50 },
      load: { oneMin: 0.5, fiveMin: 0.5, fifteenMin: 0.5 },
      gateway: { status: 'unknown', uptime: 'N/A' },
      crons: { active: 24, total: 24 },
      timestamp: new Date().toISOString(),
    })
  }
}

function parseSize(sizeStr: string): number {
  const match = sizeStr.match(/^([\d.]+)([GMKT]?)/)
  if (!match) return 0
  const num = parseFloat(match[1])
  const unit = match[2]
  switch (unit) {
    case 'T': return num * 1024 * 1024
    case 'G': return num * 1024
    case 'M': return num
    case 'K': return num / 1024
    default: return num
  }
}
