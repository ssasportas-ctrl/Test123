import { Client, Account, Databases, Functions } from 'appwrite'

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'
// Project id is public by design; access is enforced by Appwrite permissions.
const PROJECT_ID = '6a7c84a300376e2da9e6'

export const DATABASE_ID = 'meritone'

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)
export const functions = new Functions(client)

// Every patient belongs to this practice. Supabase seeded a single practice row
// and derived it from the patient record; new sign-ups need it up front.
export const PRACTICE_ID = '00000000-0000-0000-0000-000000000001'
