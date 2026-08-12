import { Client, Databases, Query, ID, Permission, Role } from 'node-appwrite'

const DATABASE_ID = 'meritone'

// Port of the Supabase redeem_reward() SECURITY DEFINER function. Runs with an
// API key so the balance check can't be bypassed by a client crafting its own
// redemption document.
export default async ({ req, res, log, error }) => {
  const userId = req.headers['x-appwrite-user-id']
  if (!userId) return res.json({ error: 'Not signed in' }, 401)

  let rewardId
  try {
    rewardId = JSON.parse(req.bodyRaw || '{}').rewardId
  } catch {
    return res.json({ error: 'Invalid request body' }, 400)
  }
  if (!rewardId) return res.json({ error: 'Missing rewardId' }, 400)

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY)
  const databases = new Databases(client)

  try {
    const patient = await databases.getDocument(DATABASE_ID, 'patients', userId)

    const reward = await databases.getDocument(DATABASE_ID, 'rewards', rewardId)
    if (reward.practice_id !== patient.practice_id || !reward.active) {
      return res.json({ error: 'Reward not found or unavailable' }, 404)
    }

    const ledger = await databases.listDocuments(DATABASE_ID, 'points_ledger', [
      Query.equal('patient_id', userId),
      Query.limit(5000),
    ])
    const balance = ledger.documents.reduce((sum, entry) => sum + entry.points, 0)
    if (balance < reward.points_cost) {
      return res.json({ error: `Not enough points: have ${balance}, need ${reward.points_cost}` }, 400)
    }

    let code
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = Math.random().toString(16).slice(2, 10).toUpperCase().padEnd(8, '0')
      const clash = await databases.listDocuments(DATABASE_ID, 'redemptions', [
        Query.equal('code', candidate),
        Query.limit(1),
      ])
      if (clash.total === 0) {
        code = candidate
        break
      }
    }
    if (!code) return res.json({ error: 'Could not allocate a redemption code' }, 500)

    const now = new Date().toISOString()
    const redemption = await databases.createDocument(
      DATABASE_ID,
      'redemptions',
      ID.unique(),
      {
        patient_id: userId,
        reward_id: reward.$id,
        points_spent: reward.points_cost,
        credit_value: reward.credit_value,
        code,
        status: 'active',
        created_at: now,
      },
      [Permission.read(Role.user(userId))],
    )

    await databases.createDocument(
      DATABASE_ID,
      'points_ledger',
      ID.unique(),
      {
        patient_id: userId,
        practice_id: patient.practice_id,
        entry_type: 'redeem',
        points: -reward.points_cost,
        reference_id: redemption.$id,
        note: `Redeemed: ${reward.title}`,
        created_at: now,
      },
      [Permission.read(Role.user(userId))],
    )

    return res.json(redemption)
  } catch (err) {
    error(`redeemReward failed: ${err.message}`)
    return res.json({ error: err.message }, 500)
  }
}
