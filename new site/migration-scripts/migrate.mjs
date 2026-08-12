import { readFileSync } from 'node:fs'
import { Client, Databases, Users, Permission, Role } from 'node-appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY, DATABASE_ID } from './config.mjs'
import { COLLECTIONS } from './schema.mjs'

// Source data is a dump taken via a privileged Supabase connection. The anon
// key can't be used here: RLS on patients/practices requires an authenticated
// role, and the patients policy calls is_staff(), which anon can no longer
// execute after the RPC grants were tightened.
const dump = JSON.parse(readFileSync(new URL('./supabase-dump.json', import.meta.url), 'utf8'))

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_API_KEY)
const databases = new Databases(client)
const users = new Users(client)

// Supabase returns timestamps Appwrite accepts as-is (ISO 8601); nulls must be
// omitted rather than sent, and numerics arrive as strings for numeric columns.
function toDocument(row, def) {
  const doc = {}
  for (const attr of def.attributes) {
    const value = row[attr.key]
    if (value === null || value === undefined) continue
    if (attr.type === 'float') doc[attr.key] = Number(value)
    else if (attr.type === 'integer') doc[attr.key] = Number(value)
    else doc[attr.key] = value
  }
  return doc
}

function permissionsFor(row, def) {
  if (def.access !== 'owned') return undefined
  const ownerId = def.ownerField ? row[def.ownerField] : row.id
  if (!ownerId) return undefined
  return [Permission.read(Role.user(ownerId))]
}

async function migrateCollection(def) {
  const data = dump[def.key] ?? []

  let created = 0
  let skipped = 0
  for (const row of data) {
    // loyalty_settings is keyed by practice_id (no id column) in Supabase.
    const documentId = row.id ?? row.practice_id
    try {
      await databases.createDocument({
        databaseId: DATABASE_ID,
        collectionId: def.key,
        documentId,
        data: toDocument(row, def),
        permissions: permissionsFor(row, def),
      })
      created++
    } catch (err) {
      if (String(err.message).includes('already exists')) {
        skipped++
        continue
      }
      throw new Error(`Failed writing ${def.key}/${documentId}: ${err.message}`)
    }
  }
  console.log(`${def.key.padEnd(22)} supabase=${String(data.length).padEnd(3)} created=${created} skipped=${skipped}`)
  return { table: def.key, source: data.length, created, skipped }
}

// Patients need matching Appwrite Auth users so the same people can sign in.
// The Appwrite user $id is set to the Supabase patient id, keeping the
// patients document $id == auth user $id invariant the apps rely on.
async function migrateAuthUsers() {
  const data = dump.patients ?? []

  let created = 0
  let skipped = 0
  for (const patient of data) {
    try {
      await users.create({ userId: patient.id, email: patient.email, name: patient.full_name })
      created++
    } catch (err) {
      if (String(err.message).includes('already exists')) {
        skipped++
        continue
      }
      throw err
    }
  }
  console.log(`auth users${' '.repeat(12)} supabase=${String(data.length).padEnd(3)} created=${created} skipped=${skipped}`)
}

async function main() {
  console.log('Migrating collections:\n')
  const results = []
  for (const def of COLLECTIONS) {
    results.push(await migrateCollection(def))
  }
  console.log('\nMigrating auth users:\n')
  await migrateAuthUsers()

  const mismatches = results.filter((r) => r.created + r.skipped !== r.source)
  if (mismatches.length) {
    console.error('\nRow count mismatches:', mismatches)
    process.exit(1)
  }
  console.log('\nMigration complete — all row counts match.')
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
