import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ID, Permission, Query, Role } from 'appwrite'
import { account, databases, functions, DATABASE_ID, PRACTICE_ID } from '../lib/appwriteClient'
import { computeSummary } from '../lib/loyalty'

const AppContext = createContext(null)

// Base44 services with images from Supabase
const BASE44_SERVICES = [
  {"name":"I-Lipo","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/I%20Lipo%20Pakage.jpg","regular_price":85,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a283c"},
  {"name":"I-Lipo Package of 8","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/I%20Lipo%20package%20of%208.jpg","regular_price":700,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a283d"},
  {"name":"I-Lipo Package of 10","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/I%20Lipo%20Package%20of%2010.jpg","regular_price":850,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a283e"},
  {"name":"RF Microneedling - Arms","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/RF%20Microneedling%20Arms.jpg","regular_price":750,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a283f"},
  {"name":"RF Microneedling - Arms Package of 3","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/RF%20Microneedling%20Arms%20package%20of%203.jpg","regular_price":2150,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a2840"},
  {"name":"RF Microneedling - Abdomen","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/RF%20Microneedling%20Abdomen.jpg","regular_price":1000,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a2841"},
  {"name":"RF Microneedling - Abdomen Package of 3","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/RF%20Microneedling%20Abdomen%20Package%20of%203.jpg","regular_price":2850,"member_price":null,"category":"body","id":"6a85073d6d0721f9b19a2842"},
  {"name":"Laser Rosacea Treatment","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/Laser%20Rosacea.jpg","regular_price":550,"member_price":null,"category":"Laser, Rosacea","id":"6a85073d6d0721f9b19a2843"},
  {"name":"Laser Rosacea Treatment Package of 3","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/LaserRosacea%20Treatment%20package%20of%203.jpg","regular_price":1485,"member_price":null,"category":"Laser, Rosacea","id":"6a85073d6d0721f9b19a2844"},
  {"name":"Microneedling + PRP","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/Microneedling%2B%20PRP.jpg","regular_price":650,"member_price":null,"category":"Sunspot/Melasma, Wrinkles/Age Spots","id":"6a8506177997139f0e63ca2d"},
  {"name":"Vit C Injections - Small Area","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/Vit%20C%20Injection%20small.jpg","regular_price":50,"member_price":null,"category":"Sunspot/Melasma","id":"6a850601b540b1424ba31deb"},
  {"name":"Vit C Injections - Medium Area","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/Vit%20C%20Injection%20medium.jpg","regular_price":75,"member_price":null,"category":"Sunspot/Melasma","id":"6a850601b540b1424ba31dec"},
  {"name":"Vit C Injections - Large Area","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/Vit%20C%20Injection%20large.jpg","regular_price":100,"member_price":null,"category":"Sunspot/Melasma","id":"6a850601b540b1424ba31ded"},
  {"name":"NAD","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/NAD.jpg","regular_price":100,"member_price":null,"category":"wellness","id":"6a85049e9ad3e3b8893ccb44"},
  {"name":"B12","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/B12.jpg","regular_price":50,"member_price":null,"category":"wellness","id":"6a85049e9ad3e3b8893ccb45"},
  {"name":"Glutathione","image_url":"https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site/Glutathione.jpg","regular_price":80,"member_price":null,"category":"wellness","id":"6a85049e9ad3e3b8893ccb46"},
]

const list = (collectionId, queries = []) =>
  databases.listDocuments({ databaseId: DATABASE_ID, collectionId, queries: [...queries, Query.limit(500)] })

const randomReferralCode = () =>
  Math.random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0')

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
    if (typeof window !== 'undefined' && window.location.search.includes('demo=true')) {
      setSession({ $id: 'demo-user', email: 'demo@example.com', name: 'Demo User' })
      setAuthLoading(false)
    } else {
      account
        .get()
        .then((user) => setSession(user))
        .catch(() => setSession(null))
        .finally(() => setAuthLoading(false))
    }
  }, [])

  const loadEverything = useCallback(async () => {
    if (!session?.$id) return
    setDataLoading(true)
    setError(null)
    try {
      const userId = session.$id
      if (!userId.startsWith('demo-')) {
        const patientDoc = await getOrCreatePatient(session)
        setPatient(patientDoc)
      }

      // Load base44 services with images
      const servicesData = BASE44_SERVICES.map(s => ({
        ...s,
        $id: s.id,
        price: s.regular_price,
      }))

      setLedger([])
      setMilestones([])
      setRewards([])
      setRedemptions([])
      setServices(servicesData)
      setProducts([])
      setMembership(null)
      setMembershipPlans([])
      setLoyaltySettings(null)
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
    () => computeSummary({ ledger: [], redemptions: [], milestones: [] }),
    [],
  )

  const signInWithOtp = useCallback(async (email) => {
    const token = await account.createEmailToken({ userId: ID.unique(), email })
    return token.userId
  }, [])

  const verifyOtp = useCallback(async (userId, secret, fullName) => {
    await account.createSession({ userId, secret })
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
