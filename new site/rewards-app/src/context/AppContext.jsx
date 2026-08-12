import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ID, Permission, Query, Role } from 'appwrite'
import { account, databases, functions, DATABASE_ID, PRACTICE_ID } from '../lib/appwriteClient'
import { computeSummary } from '../lib/loyalty'

const AppContext = createContext(null)

const list = (collectionId, queries = []) =>
  databases.listDocuments({ databaseId: DATABASE_ID, collectionId, queries: [...queries, Query.limit(500)] })

const randomReferralCode = () =>
  Math.random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0')

// Patients migrated from Supabase already have a document keyed by their user
// id; first-time sign-ups create their own, mirroring the old RLS policy
// `patients_insert_self`.
async function getOrCreatePatient(user) {
  try {
    return await databases.getDocument({
      databaseId: DATABASE_ID,
      collectionId: 'patients',
      documentId: user.$id,
    })
  } catch (err) {
    if (err.code !== 404) throw err
    return databases.createDocument({
      databaseId: DATABASE_ID,
      collectionId: 'patients',
      documentId: user.$id,
      data: {
        practice_id: PRACTICE_ID,
        full_name: user.name || user.email.split('@')[0],
        email: user.email,
        referral_code: randomReferralCode(),
        created_at: new Date().toISOString(),
      },
      permissions: [Permission.read(Role.user(user.$id)), Permission.update(Role.user(user.$id))],
    })
  }
}

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
    account
      .get()
      .then((user) => setSession(user))
      .catch(() => setSession(null))
      .finally(() => setAuthLoading(false))
  }, [])

  const loadEverything = useCallback(async () => {
    if (!session?.$id) return
    setDataLoading(true)
    setError(null)
    try {
      const userId = session.$id
      const patientDoc = await getOrCreatePatient(session)
      setPatient(patientDoc)

      const practiceId = patientDoc.practice_id
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
        list('points_ledger', [Query.equal('patient_id', userId), Query.orderDesc('created_at')]),
        list('milestones', [Query.equal('practice_id', practiceId), Query.equal('active', true), Query.orderAsc('visit_count')]),
        list('rewards', [Query.equal('practice_id', practiceId), Query.equal('active', true), Query.orderAsc('points_cost')]),
        list('redemptions', [Query.equal('patient_id', userId), Query.orderDesc('created_at')]),
        list('services', [Query.equal('practice_id', practiceId), Query.equal('active', true)]),
        list('products', [Query.equal('practice_id', practiceId), Query.equal('active', true)]),
        list('patient_memberships', [Query.equal('patient_id', userId), Query.equal('status', 'active')]),
        list('membership_plans', [Query.equal('practice_id', practiceId), Query.equal('active', true)]),
        list('loyalty_settings', [Query.equal('practice_id', practiceId)]),
      ])

      setLedger(ledgerRes.documents)
      setMilestones(milestonesRes.documents)
      setRewards(rewardsRes.documents)
      setRedemptions(redemptionsRes.documents)
      setServices(servicesRes.documents)
      setProducts(productsRes.documents)
      setMembership(membershipRes.documents[0] ?? null)
      setMembershipPlans(membershipPlansRes.documents)
      setLoyaltySettings(loyaltySettingsRes.documents[0] ?? null)
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
      // Balance check and point deduction happen server-side so a client can't
      // mint a redemption without spending points.
      const execution = await functions.createExecution({
        functionId: 'redeemReward',
        body: JSON.stringify({ rewardId: reward.$id }),
      })
      let result
      try {
        result = JSON.parse(execution.responseBody || '{}')
      } catch {
        setError('Redemption failed: unexpected response')
        return
      }
      if (result.error) {
        setError(result.error)
        return
      }
      await loadEverything()
    },
    [patient, loadEverything],
  )

  const summary = useMemo(
    () => computeSummary({ ledger, redemptions, milestones }),
    [ledger, redemptions, milestones],
  )

  const signInWithOtp = useCallback(async (email) => {
    // If the email already has an account the passed userId is ignored, so a
    // fresh unique id is only used for genuinely new patients.
    const token = await account.createEmailToken({ userId: ID.unique(), email })
    return token.userId
  }, [])

  const verifyOtp = useCallback(async (userId, secret, fullName) => {
    await account.createSession({ userId, secret })
    // Email-token sign-up leaves the account nameless; capture it before the
    // patient document is created from it.
    if (fullName) await account.updateName({ name: fullName })
    setSession(await account.get())
  }, [])

  const signOut = useCallback(async () => {
    try {
      await account.deleteSession({ sessionId: 'current' })
    } finally {
      setSession(null)
      setPatient(null)
    }
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
