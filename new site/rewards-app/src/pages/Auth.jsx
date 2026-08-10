import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const { signInWithOtp, verifyOtp } = useApp()
  const [stage, setStage] = useState('email')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [otp, setOtp] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (stage === 'email') {
        await signInWithOtp(email, fullName)
        setStage('code')
      } else {
        await verifyOtp(email, otp)
      }
    } catch (err) {
      setError(err.message ?? String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-wordmark">MeritOne</div>
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="eyebrow">{stage === 'email' ? 'SIGN IN' : 'ENTER CODE'}</div>

        {stage === 'email' ? (
          <>
            <h2 style={{ fontSize: 22 }}>Welcome back</h2>
            <input
              className="auth-input"
              type="text"
              placeholder="Full name (first time only)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 22 }}>Check your email</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-muted)' }}>We sent a 6-digit code to {email}</p>
            <input
              className="auth-input"
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </>
        )}

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? 'Please wait…' : stage === 'email' ? 'Continue' : 'Verify & Sign In'}
        </button>
      </form>
    </div>
  )
}
