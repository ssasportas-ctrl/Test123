import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activePage, setActivePage] = useState('home')

  const [patient, setPatient] = useState(null)
  const [ledger, setLedger] = useState([])
  const [milestones, setMilestones] = useState([])
  const [rewards, setRewards] = useState([])
  const [redemptions, setRedemptions] = useState([])
  const [services, setServices] = useState([])
  const [products, setProducts] = useState([])
  const [membership, setMembership] = useState(null)
  const [membershipPlans, setMembershipPlans] = useState([])
  const [loyaltySettings, setLoyaltySettings] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const loadEverything = useCallback(async () => {
    if (!session?.user?.id) return
    setDataLoading(true)
    setError(null)
    try {
      const userId = session.user.id
      const { data: patientRow, error: patientErr } = await supabase
        .from('patients')
        .select()
        .eq('id', userId)
        .single()
      if (patientErr) throw patientErr
      setPatient(patientRow)

      const practiceId = patientRow.practice_id
      const [
        ledgerRes,
        milestonesRes,
        rewardsRes,
        redemptionsRes,
        servicesRes,
        productsRes,
        membershipRes,
        membershipPlansRes,
        loyaltySettingsRes,
      ] = await Promise.all([
        supabase.from('points_ledger').select().eq('patient_id', userId).order('created_at', { ascending: false }),
        supabase.from('milestones').select().eq('practice_id', practiceId).eq('active', true).order('visit_count'),
        supabase.from('rewards').select().eq('practice_id', practiceId).eq('active', true).order('points_cost'),
        supabase.from('redemptions').select().eq('patient_id', userId).order('created_at', { ascending: false }),
        supabase.from('services').select().eq('practice_id', practiceId).eq('active', true),
        supabase.from('products').select().eq('practice_id', practiceId).eq('active', true),
        supabase.from('patient_memberships').select().eq('patient_id', userId).eq('status', 'active').maybeSingle(),
        supabase.from('membership_plans').select().eq('practice_id', practiceId).eq('active', true),
        supabase.from('loyalty_settings').select().eq('practice_id', practiceId).maybeSingle(),
      ])

      if (ledgerRes.error) throw ledgerRes.error
      if (milestonesRes.error) throw milestonesRes.error
      if (rewardsRes.error) throw rewardsRes.error
      if (redemptionsRes.error) throw redemptionsRes.error
      if (servicesRes.error) throw servicesRes.error
      if (productsRes.error) throw productsRes.error
      if (membershipPlansRes.error) throw membershipPlansRes.error

      setLedger(ledgerRes.data ?? [])
      setMilestones(milestonesRes.data ?? [])
      setRewards(rewardsRes.data ?? [])
      setRedemptions(redemptionsRes.data ?? [])
      setServices(servicesRes.data ?? [])
      setProducts(productsRes.data ?? [])
      setMembership(membershipRes.data ?? null)
      setMembershipPlans(membershipPlansRes.data ?? [])
      setLoyaltySettings(loyaltySettingsRes.data ?? null)
    } catch (err) {
      setError(err.message ?? String(err))
    } finally {
      setDataLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (session) loadEverything()
  }, [session, loadEverything])

  const redeem = useCallback(
    async (reward) => {
      if (!patient) return
      const { data, error: redeemErr } = await supabase.rpc('redeem_reward', { p_reward_id: reward.id })
      if (redeemErr) {
        setError(redeemErr.message)
        return
      }
      setRedemptions((prev) => [data, ...prev])
      // Balance changed server-side (points deducted); re-sync the ledger.
      await loadEverything()
    },
    [patient, loadEverything],
  )

  const summary = useMemo(() => {
    const pointsBalance = Math.max(0, ledger.reduce((sum, entry) => sum + entry.points, 0))
    const visitCount = ledger.filter((entry) => entry.entry_type === 'earn').length
    const creditBalance = redemptions
      .filter((r) => r.status === 'active')
      .reduce((sum, r) => sum + Number(r.credit_value), 0)
    const nextMilestone = milestones.find((m) => m.visit_count > visitCount) ?? null
    return {
      pointsBalance,
      creditBalance,
      visitCount,
      tierLabel: 'Insider',
      nextMilestone,
    }
  }, [ledger, redemptions, milestones])

  const signInWithOtp = useCallback(async (email, fullName) => {
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { data: { role: 'patient', full_name: fullName ?? '' } },
    })
    if (err) throw err
  }, [])

  const verifyOtp = useCallback(async (email, token) => {
    const { error: err } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
    if (err) throw err
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setPatient(null)
  }, [])

  const value = {
    session,
    authLoading,
    activePage,
    setActivePage,
    patient,
    ledger,
    milestones,
    rewards,
    redemptions,
    services,
    products,
    membership,
    membershipPlans,
    loyaltySettings,
    dataLoading,
    error,
    summary,
    redeem,
    signInWithOtp,
    verifyOtp,
    signOut,
    reload: loadEverything,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
