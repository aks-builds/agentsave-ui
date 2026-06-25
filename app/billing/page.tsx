const TIERS = [
  {
    name: 'Free', price: '$0', period: '/mo',
    color: 'rgba(255,255,255,0.07)', highlight: false,
    badge: '',
    features: ['1 project', '7-day history', '1 seat', 'Community support'],
    cta: 'Current plan', ctaDisabled: true,
  },
  {
    name: 'Pro', price: '$29', period: '/mo',
    color: 'rgba(99,102,241,0.3)', highlight: true,
    badge: 'Most popular',
    features: ['Unlimited projects', '90-day history', '5 seats', 'Webhook + email alerts', 'CSV export', 'Email support'],
    cta: 'Upgrade to Pro', ctaDisabled: false,
  },
  {
    name: 'Enterprise', price: '$299', period: '/mo per 10 seats',
    color: 'rgba(139,92,246,0.3)', highlight: false,
    badge: 'Includes InferRoute',
    features: ['Everything in Pro', '1-year history', 'Custom seats', 'SSO / SAML', 'Audit logs', 'InferRoute sidecar (68% TTFT reduction)', 'SLA 99.9%', 'Dedicated Slack'],
    cta: 'Contact sales', ctaDisabled: false,
  },
]

export default function BillingPage() {
  return (
    <main style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4, color: 'var(--text)', letterSpacing: '-0.03em' }}>Billing</h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>Choose the plan that fits your team.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} data-testid="billing-tiers">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            data-testid={`tier-${tier.name.toLowerCase()}`}
            style={{
              background: 'var(--surface)',
              border: `2px solid ${tier.color}`,
              borderRadius: 16,
              padding: 22,
              position: 'relative',
            }}
          >
            {tier.badge && (
              <span style={{
                position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                background: tier.name === 'Enterprise' ? '#8b5cf6' : '#6366f1',
                color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 12px', borderRadius: 99,
                whiteSpace: 'nowrap',
              }}>{tier.badge}</span>
            )}
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }} data-testid={`tier-name-${tier.name.toLowerCase()}`}>{tier.name}</h2>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)' }} data-testid={`tier-price-${tier.name.toLowerCase()}`}>{tier.price}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
              {tier.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text)', marginBottom: 8, lineHeight: 1.4 }}>
                  <span style={{ color: '#10b981', flexShrink: 0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              disabled={tier.ctaDisabled}
              data-testid={`tier-cta-${tier.name.toLowerCase()}`}
              style={{
                width: '100%', padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: tier.ctaDisabled ? 'not-allowed' : 'pointer',
                background: tier.ctaDisabled ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: tier.ctaDisabled ? 'var(--muted)' : '#fff',
                border: 'none',
                opacity: tier.ctaDisabled ? 0.6 : 1,
              }}
            >{tier.cta}</button>
          </div>
        ))}
      </div>
    </main>
  )
}
