import { Client, Databases, Permission, Role } from 'node-appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY, DATABASE_ID } from './config.mjs'

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_API_KEY)
const databases = new Databases(client)

// Mirrors the old Supabase RLS policy `patients_insert_self`: a signed-in user
// may create their own patient row on first sign-in.
await databases.updateCollection({
  databaseId: DATABASE_ID,
  collectionId: 'patients',
  name: 'Patients',
  permissions: [
    Permission.create(Role.users()),
    Permission.read(Role.team('staff')),
    Permission.create(Role.team('staff')),
    Permission.update(Role.team('staff')),
    Permission.delete(Role.team('staff')),
  ],
  documentSecurity: true,
})
console.log('patients collection permissions updated')
