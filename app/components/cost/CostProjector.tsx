'use client'

import { useState } from 'react'

const labelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '13px',
  color: 'var(--text)',
  marginBottom: '8px',
}

const valueSpanStyle: React.CSSProperties = {
  color: '#a78bfa',
  fontWeight: 600,
  fontFamily: 'JetBrains Mono, monospace',
}

const rangeStyle: React.CSSProperties = { width: '100%' }

const endLabelStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '10px',
  color: 'var(--muted)',
  marginTop: '4px',
}

export default function CostProjector() {
  const [runs, setRuns] = useState(500)
  const [tokensPerRun, setTokensPerRun] = useState(10000)
  const [costPerMillion, setCostPerMillion] = useState(3.0)

  const tokensReduced = runs * tokensPerRun * 0.3
  const monthlySavings = (tokensReduced / 1_000_000) * costPerMillion
  const annualSavings = monthlySavings * 12

  const money = (n: number) =>
    n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div data-testid="cost-projector">
      {/* Slider: monthly runs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={labelStyle}>
          <span>Monthly agent runs</span>
          <span style={valueSpanStyle}>{runs.toLocaleString()}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={10}
          max={10000}
          step={10}
          value={runs}
          onChange={(e) => setRuns(Number(e.target.value))}
          style={rangeStyle}
          data-testid="slider-runs"
        />
        <div style={endLabelStyle}>
          <span>10</span>
          <span>10,000</span>
        </div>
      </div>

      {/* Slider: tokens per run */}
      <div style={{ marginBottom: '24px' }}>
        <div style={labelStyle}>
          <span>Avg tokens per run</span>
          <span style={valueSpanStyle}>{tokensPerRun.toLocaleString()}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={1000}
          max={100000}
          step={1000}
          value={tokensPerRun}
          onChange={(e) => setTokensPerRun(Number(e.target.value))}
          style={rangeStyle}
          data-testid="slider-tokens"
        />
        <div style={endLabelStyle}>
          <span>1,000</span>
          <span>100,000</span>
        </div>
      </div>

      {/* Slider: cost per 1M tokens */}
      <div style={{ marginBottom: '24px' }}>
        <div style={labelStyle}>
          <span>Model cost per 1M tokens</span>
          <span style={valueSpanStyle}>${costPerMillion.toFixed(2)}</span>
        </div>
        <input
          type="range"
          className="slider"
          min={1}
          max={30}
          step={0.5}
          value={costPerMillion}
          onChange={(e) => setCostPerMillion(Number(e.target.value))}
          style={rangeStyle}
          data-testid="slider-cost"
        />
        <div style={endLabelStyle}>
          <span>$1</span>
          <span>$30</span>
        </div>
      </div>

      {/* Result box */}
      <div
        data-testid="cost-projector-result"
        style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.20)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--muted)' }}>Tokens reduced (30%)</span>
          <span style={{ color: '#a78bfa', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
            {Math.round(tokensReduced).toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '13px',
          }}
        >
          <span style={{ color: 'var(--muted)' }}>Monthly savings</span>
          <span style={{ color: '#34d399', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>
            ${money(monthlySavings)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '10px',
            borderTop: '1px solid rgba(99,102,241,0.15)',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          <span style={{ color: '#34d399' }}>Annual savings</span>
          <span style={{ color: '#34d399', fontWeight: 700, fontSize: '18px', fontFamily: 'JetBrains Mono, monospace' }}>
            ${money(annualSavings)}
          </span>
        </div>
      </div>
    </div>
  )
}
