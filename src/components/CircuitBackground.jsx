import { motion } from 'framer-motion'
import './CircuitBackground.css'

// ============================================================================
// DATA-DRIVEN PCB TRACE DEFINITIONS (SINGLE SOURCE OF TRUTH)
// ============================================================================

const FAINT_TRACES = [
  { d: 'M -20 95 L 140 95 L 185 50 L 330 50', w: 1.5, pad: [330, 50, 5] },
  { d: 'M -20 220 L 210 220 L 260 170 L 420 170 L 455 205 L 540 205', w: 1.5, pad: [540, 205, 5.5] },
  { d: 'M -20 355 L 195 355 L 255 295 L 470 295', w: 2, pad: [470, 295, 6] },
  { d: 'M 60 1020 L 60 830 L 245 645 L 365 645 L 430 580 L 535 580', w: 1.5, pad: [535, 580, 5] },
  { d: 'M 190 1020 L 190 885 L 395 680 L 515 680 L 595 600 L 680 600', w: 1.5, pad: [680, 600, 5] },
  { d: 'M 285 1020 L 285 910 L 460 735 L 610 735', w: 1.25, pad: [610, 735, 4.5] },
  { d: 'M 1620 160 L 1380 160 L 1330 210 L 1160 210', w: 1.5, pad: [1160, 210, 5] },
  { d: 'M 1620 420 L 1410 420 L 1350 360 L 1190 360', w: 1.5, pad: [1190, 360, 5.5] },
  { d: 'M 1490 1020 L 1490 850 L 1320 680 L 1180 680', w: 1.5, pad: [1180, 680, 5] },
]

const SECONDARY_TRACES = [
  { d: 'M -20 62 L 42 62', w: 2, via: [52, 62, 8.5, 2] },
  { d: 'M 62 62 L 105 62 L 132 35 L 250 35', w: 1.75, pad: [250, 35, 5.5] },
  { d: 'M -20 262 L 52 262', w: 2, via: [62, 262, 9, 2] },
  { d: 'M -20 315 L 48 315 L 82 281 L 245 281 L 285 321', w: 2, via: [292, 328, 9, 2] },
  { d: 'M -20 550 L 58 472 L 135 472 L 178 429', w: 2.2, via: [185, 422, 8.5, 2] },
  { d: 'M -20 790 L 45 790 L 180 655 L 180 570 L 235 515', w: 1.75, via: [242, 508, 8.5, 1.75] },
  { d: 'M -20 910 L 85 910 L 210 785 L 295 700', w: 2, via: [302, 693, 8.5, 2] },
  { d: 'M 135 1020 L 135 845 L 215 765 L 215 710 L 340 585 L 395 585', w: 1.75, via: [405, 585, 8, 1.75] },
  { d: 'M 1620 115 L 1465 115 L 1425 75 L 1310 75', w: 1.75, via: [1300, 75, 8.5, 1.75] },
  { d: 'M 1620 295 L 1480 295 L 1435 340 L 1325 340', w: 2, via: [1315, 340, 9, 2] },
  { d: 'M 1620 640 L 1510 640 L 1395 525 L 1310 525', w: 1.75, via: [1300, 525, 8.5, 1.75] },
  { d: 'M 1420 1020 L 1420 875 L 1295 750 L 1220 750', w: 1.75, via: [1210, 750, 8, 1.75] },
]

const PRIMARY_TRACES = [
  { d: 'M -20 108 L 118 108', w: 3.2, via: [132, 108, 12.5, 2.6] },
  { d: 'M -20 158 L 148 158 L 188 198 L 228 198', w: 3.2, via: [242, 198, 12, 2.5], accent: true },
  { d: 'M -20 192 L 112 192 L 154 234 L 228 234', w: 2, via: [238, 234, 8.5, 2] },
  { d: 'M -20 625 L 95 510 L 95 455 L 122 428', w: 2.8, via: [130, 420, 9, 2.2] },
  { d: 'M -20 695 L 118 557', w: 3.2, via: [128, 547, 11.5, 2.5] },
  { d: 'M -20 745 L 40 685 L 40 535 L 70 505', w: 2.2, via: [78, 497, 10.5, 2.2] },
  { d: 'M -20 845 L 258 567', w: 3.4, via: [268, 557, 11.5, 2.5], accent: true },
  { d: 'M 35 840 L 292 583', w: 2, via: [300, 575, 8.5, 2] },
  { d: 'M 55 1020 L 55 920 L 175 800 L 175 725', w: 2.2, via: [175, 715, 9.5, 2.2] },
  { d: 'M 95 1020 L 95 885 L 258 722', w: 2.2, via: [266, 714, 9.5, 2.2] },
  { d: 'M 1620 205 L 1445 205 L 1405 245 L 1355 245', w: 2.8, via: [1342, 245, 11, 2.4], accent: true },
  { d: 'M 1620 515 L 1495 515 L 1385 405', w: 2.8, via: [1375, 395, 10.5, 2.3] },
  { d: 'M 1620 780 L 1475 635 L 1365 635', w: 2.5, via: [1353, 635, 10, 2.2] },
]

const PULSE_TRACES = [
  { d: 'M -20 158 L 148 158 L 188 198 L 228 198', w: 2.4, className: 'circuit-pulse-trace' },
  { d: 'M -20 845 L 258 567', w: 2.4, className: 'circuit-pulse-trace delay-1' },
  { d: 'M 135 1020 L 135 845 L 215 765 L 215 710 L 340 585 L 395 585', w: 2, className: 'circuit-pulse-trace delay-2' },
  { d: 'M 1620 515 L 1495 515 L 1385 405', w: 2.2, className: 'circuit-pulse-trace delay-3' },
]

// ============================================================================
// REUSABLE PRIMITIVES
// ============================================================================

function ViaNode({ cx, cy, r = 9, strokeWidth = 2, animated = false, delay = 0, accent = false }) {
  const coreRadius = Math.max(2.5, r * 0.44)
  const content = (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        strokeWidth={strokeWidth}
        className="circuit-node-ring"
        style={accent && animated ? { stroke: 'var(--accent, #C85A3C)' } : undefined}
      />
      <circle
        cx={cx}
        cy={cy}
        r={coreRadius}
        className="circuit-node-core"
        style={accent && animated ? { fill: 'var(--accent, #C85A3C)' } : undefined}
      />
    </>
  )

  if (!animated) {
    return <g>{content}</g>
  }

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {content}
    </motion.g>
  )
}

function TraceGroup({ traces, className, animated = false, baseDelay = 0 }) {
  return (
    <g className={className} strokeLinecap="round" strokeLinejoin="round">
      {traces.map((t, index) => {
        const delay = baseDelay + index * 0.045
        return (
          <g key={t.d}>
            {animated ? (
              <motion.path
                d={t.d}
                strokeWidth={t.w}
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2, delay },
                }}
              />
            ) : (
              <path d={t.d} strokeWidth={t.w} />
            )}

            {t.pad && (
              <circle
                cx={t.pad[0]}
                cy={t.pad[1]}
                r={t.pad[2]}
                className="circuit-node-core"
              />
            )}

            {t.via && (
              <ViaNode
                cx={t.via[0]}
                cy={t.via[1]}
                r={t.via[2]}
                strokeWidth={t.via[3]}
                animated={animated}
                delay={delay + 0.72}
                accent={Boolean(t.accent)}
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

/**
 * Shared SVG canvas used by both the persistent background and the opening intro.
 */
export function CircuitCanvas({ animated = false, className = '' }) {
  return (
    <svg
      className={`circuit-svg ${animated ? 'circuit-svg--intro' : ''} ${className}`.trim()}
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <TraceGroup traces={FAINT_TRACES} className="circuit-layer-faint" animated={false} />
      <TraceGroup traces={SECONDARY_TRACES} className="circuit-layer-secondary" animated={animated} baseDelay={0.08} />
      <TraceGroup traces={PRIMARY_TRACES} className="circuit-layer-primary" animated={animated} baseDelay={0.04} />

      {PULSE_TRACES.map((pulse) => (
        <path
          key={pulse.d}
          d={pulse.d}
          strokeWidth={pulse.w}
          className={pulse.className}
        />
      ))}
    </svg>
  )
}

export default function CircuitBackground() {
  return (
    <div className="circuit-bg" aria-hidden="true">
      <CircuitCanvas animated={false} />
    </div>
  )
}
