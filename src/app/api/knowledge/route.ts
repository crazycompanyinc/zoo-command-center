import { NextResponse } from 'next/server'

interface KnowledgeStats {
  nodes: number
  edges: number
  communities: number
  facts: number
  factsByCategory: Record<string, number>
  lastUpdated: string
}

export async function GET() {
  return NextResponse.json({
    nodes: 683,
    edges: 639,
    communities: 16,
    facts: 524,
    factsByCategory: { general: 335, project: 80, tool: 70, user_pref: 39 },
    lastUpdated: new Date().toISOString(),
  })
}
