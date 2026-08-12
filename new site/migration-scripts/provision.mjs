import { Client, Databases, Teams, Permission, Role, DatabasesIndexType } from 'node-appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY, DATABASE_ID } from './config.mjs'
import { COLLECTIONS } from './schema.mjs'

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_API_KEY)
const databases = new Databases(client)
const teams = new Teams(client)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Appwrite rejects writes to a collection whose attributes are still building.
async function waitForAttributes(collectionId, expectedCount) {
  for (let i = 0; i < 60; i++) {
    const list = await databases.listAttributes(DATABASE_ID, collectionId)
    const ready = list.attributes.filter((a) => a.status === 'available').length
    if (ready >= expectedCount) return
    await sleep(1000)
  }
  throw new Error(`Attributes for ${collectionId} did not become available in time`)
}

function permissionsFor(access, staffTeamId) {
  const staff = [
    Permission.read(Role.team(staffTeamId)),
    Permission.create(Role.team(staffTeamId)),
    Permission.update(Role.team(staffTeamId)),
    Permission.delete(Role.team(staffTeamId)),
  ]
  if (access === 'catalog') return [Permission.read(Role.users()), ...staff]
  // 'owned' collections get per-document read grants at write time; 'staff' gets nothing extra.
  return staff
}

async function ensureTeam() {
  try {
    const existing = await teams.list()
    const found = existing.teams.find((t) => t.name === 'staff')
    if (found) {
      console.log(`team "staff" already exists (${found.$id})`)
      return found.$id
    }
  } catch {
    // fall through to create
  }
  const created = await teams.create({ teamId: 'staff', name: 'staff' })
  console.log(`created team "staff" (${created.$id})`)
  return created.$id
}

async function ensureDatabase() {
  try {
    await databases.get(DATABASE_ID)
    console.log(`database "${DATABASE_ID}" already exists`)
  } catch {
    await databases.create({ databaseId: DATABASE_ID, name: 'MeritOne' })
    console.log(`created database "${DATABASE_ID}"`)
  }
}

async function createAttribute(collectionId, attr) {
  const base = { databaseId: DATABASE_ID, collectionId, key: attr.key, required: attr.required }
  switch (attr.type) {
    case 'string':
      return databases.createStringAttribute({ ...base, size: attr.size })
    case 'integer':
      return databases.createIntegerAttribute(base)
    case 'float':
      return databases.createFloatAttribute(base)
    case 'boolean':
      return databases.createBooleanAttribute(base)
    case 'datetime':
      return databases.createDatetimeAttribute(base)
    default:
      throw new Error(`Unknown attribute type: ${attr.type}`)
  }
}

async function ensureCollection(def, staffTeamId) {
  const permissions = permissionsFor(def.access, staffTeamId)
  let exists = true
  try {
    await databases.getCollection(DATABASE_ID, def.key)
  } catch {
    exists = false
  }

  if (!exists) {
    await databases.createCollection({
      databaseId: DATABASE_ID,
      collectionId: def.key,
      name: def.name,
      permissions,
      documentSecurity: true,
    })
    console.log(`  created collection ${def.key}`)
  } else {
    console.log(`  collection ${def.key} already exists`)
  }

  const current = await databases.listAttributes(DATABASE_ID, def.key)
  const currentKeys = new Set(current.attributes.map((a) => a.key))
  for (const attr of def.attributes) {
    if (currentKeys.has(attr.key)) continue
    await createAttribute(def.key, attr)
    console.log(`    + attribute ${attr.key} (${attr.type})`)
  }
  await waitForAttributes(def.key, def.attributes.length)

  for (const idx of def.indexes ?? []) {
    try {
      await databases.createIndex({
        databaseId: DATABASE_ID,
        collectionId: def.key,
        key: idx.key,
        type: DatabasesIndexType.Key,
        attributes: idx.attributes,
      })
      console.log(`    + index ${idx.key}`)
    } catch (err) {
      if (!String(err.message).includes('already exists')) throw err
    }
  }
}

async function main() {
  const staffTeamId = await ensureTeam()
  await ensureDatabase()
  for (const def of COLLECTIONS) {
    console.log(`\n${def.key}:`)
    await ensureCollection(def, staffTeamId)
  }
  console.log('\nProvisioning complete.')
}

main().catch((err) => {
  console.error('Provisioning failed:', err)
  process.exit(1)
})
