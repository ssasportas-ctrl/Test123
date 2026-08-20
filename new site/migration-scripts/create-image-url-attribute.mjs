#!/usr/bin/env node
// Create image_url attribute in services collection

const API_KEY = process.env.APPWRITE_API_KEY
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'
const PROJECT_ID = '6a7c84a300376e2da9e6'
const DATABASE_ID = 'meritone'
const COLLECTION_ID = 'services'

if (!API_KEY) {
  console.error('❌ Missing APPWRITE_API_KEY environment variable')
  process.exit(1)
}

async function createAttribute() {
  try {
    console.log('📝 Creating image_url attribute in services collection...\n')

    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/attributes`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: 'image_url',
        type: 'string',
        size: 1024,
        required: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()

      // If attribute already exists, that's fine
      if (response.status === 409) {
        console.log('ℹ️  image_url attribute already exists')
        return true
      }

      throw new Error(error.message || `HTTP ${response.status}`)
    }

    console.log('✅ image_url attribute created successfully!')
    return true
  } catch (err) {
    console.error('❌ Failed to create attribute:', err.message)
    return false
  }
}

createAttribute()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
