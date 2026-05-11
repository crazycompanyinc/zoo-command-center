# ZOO Command Center — Design Document

## 1. Visión

Dashboard ejecutivo en tiempo real para el ecosistema ZOO. Una sola pantalla que muestra:
- Estado de vida de cada agente (heartbeat, última actividad, salud)
- Revenue en tiempo real (Stripe, conversiones, MRR)
- Health del sistema (RAM, disco, load, errores)
- Knowledge graph metrics
- Alertas proactivas

**Objetivo:** Que en 30 segundos cualquier persona (enigma, prospecto, inversor) entienda el estado completo de ZOO.

## 2. Arquitectura

```
┌─────────────────────────────────────────────────┐
│              ZOO Command Center                  │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  AGENTS  │ │ REVENUE  │ │  SYSTEM  │        │
│  │  Grid    │ │  Panel   │ │  Health  │        │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘        │
│       │             │            │               │
│  ┌────▼─────────────▼────────────▼─────┐        │
│  │         API Routes (Next.js)         │        │
│  └────┬─────────────┬────────────┬─────┘        │
│       │             │            │               │
│  ┌────▼─────┐ ┌─────▼────┐ ┌────▼──────┐       │
│  │ Cron DB  │ │ Stripe   │ │ System    │       │
│  │ (local)  │ │ API      │ │ Scripts   │       │
│  └──────────┘ └──────────┘ └───────────┘       │
└─────────────────────────────────────────────────┘
```

## 3. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + Framer Motion 12 |
| Charts | Recharts (ligero, React-native) |
| Data Fetching | SWR (stale-while-revalidate) |
| Auth | JWT httpOnly cookie (mismo patrón NPC Workers) |
| Deploy | Vercel (parzival33s-projects) |
| Fonts | Playfair Display + Inter |
| Theme | Dark cinematic (#0a0a0b, accent #ff6b35) |

## 4. API Routes

### `/api/agents`
Lee el estado de todos los agentes desde:
- Hermes cron job database (via hermes CLI)
- Shared filesystem `/root/life/ceo-coordination/shared/broadcast.md`
- Fact store (última actividad por agente)

**Response:**
```json
{
  "agents": [
    {
      "id": "felix-heartbeat",
      "name": "FELIX",
      "role": "CEO Coordinator",
      "status": "alive|warning|dead",
      "lastHeartbeat": "2026-05-11T16:23:00+02:00",
      "uptime": "99.2%",
      "tasksCompleted": 47,
      "errors": 0
    }
  ],
  "summary": {
    "total": 24,
    "alive": 22,
    "warning": 1,
    "dead": 1
  }
}
```

### `/api/revenue`
Lee datos de Stripe:
- Pagos recientes (últimos 30 días)
- MRR calculado
- Conversion funnel
- Productos más vendidos

### `/api/system`
Ejecuta health checks:
- RAM usage
- Disk usage
- Load average
- Gateway status
- Active cron count

### `/api/knowledge`
Lee del knowledge graph:
- Total nodes/edges
- Communities count
- Recent additions

## 5. UI Components

### Layout
- Sidebar navigation (collapsible)
- Main content area
- Top bar: logo, time, alerts bell

### Pages
1. **Dashboard** (`/`) — Vista ejecutiva completa
2. **Agents** (`/agents`) — Grid detallado de agentes
3. **Revenue** (`/revenue`) — Charts de ingresos
4. **System** (`/system`) — Métricas de infraestructura
5. **Knowledge** (`/knowledge`) — Graph visualization

### Components
- `AgentCard` — Status indicator, name, role, last heartbeat, uptime
- `RevenueChart` — Line chart de ingresos diarios
- `SystemGauge` — Circular progress para RAM/disk/load
- `AlertBanner` — Notificaciones críticas
- `StatCard` — Número grande con label y trend
- `ActivityFeed` — Timeline de eventos recientes

## 6. Design System

```css
--bg-primary: #0a0a0b;
--bg-secondary: #111114;
--bg-card: #16161a;
--accent: #ff6b35;
--accent-glow: rgba(255, 107, 53, 0.15);
--text-primary: #f0f0f0;
--text-secondary: #888888;
--success: #22c55e;
--warning: #eab308;
--danger: #ef4444;
--border: rgba(255, 255, 255, 0.06);
```

## 7. Fases de Construcción

### Fase 1 — MVP (2-3 horas)
- [ ] Scaffold Next.js project
- [ ] API routes: agents, system
- [ ] Dashboard layout + Agent grid
- [ ] System health panel
- [ ] Deploy Vercel

### Fase 2 — Revenue (1-2 horas)
- [ ] Stripe API integration
- [ ] Revenue charts
- [ ] Conversion funnel

### Fase 3 — Knowledge + Polish (1-2 horas)
- [ ] Knowledge graph metrics
- [ ] Activity feed
- [ ] Animaciones Framer Motion
- [ ] Responsive design

## 8. Deployment

```bash
cd /root/life/zoo-command-center
vercel link --project zoo-command-center
vercel deploy --prod
```

Dominio: `command.zootechnologies.com` (a configurar en Cloudflare)

## 9. Métricas de Éxito

- Dashboard carga en <2 segundos
- Datos se refrescan cada 30 segundos (SWR)
- 100% datos reales (no mock)
- Diseño cinematic premium (estándar ZOO)
- Mobile responsive
