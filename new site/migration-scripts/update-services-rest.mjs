#!/usr/bin/env node
// Update services with image URLs using Appwrite REST API

const API_KEY = process.env.APPWRITE_API_KEY
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'
const PROJECT_ID = '6a7c84a300376e2da9e6'
const DATABASE_ID = 'meritone'
const COLLECTION_ID = 'services'

const SUPABASE_BASE = 'https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site'

// Service image mappings
const SERVICE_IMAGES = {
  '6a850601b540b1424ba31deb': `${SUPABASE_BASE}/Vit%20C%20Injection%20small.jpg`,
  '6a850601b540b1424ba31dec': `${SUPABASE_BASE}/Vit%20C%20Injection%20medium.jpg`,
  '6a850601b540b1424ba31ded': `${SUPABASE_BASE}/Vit%20C%20Injection%20large.jpg`,
  '6a8506177997139f0e63ca2d': `${SUPABASE_BASE}/Microneedling%2B%20PRP.jpg`,
  '6a85073d6d0721f9b19a283c': `${SUPABASE_BASE}/I%20Lipo%20Pakage.jpg`,
  '6a85073d6d0721f9b19a283d': `${SUPABASE_BASE}/I%20Lipo%20package%20of%208.jpg`,
  '6a85073d6d0721f9b19a283e': `${SUPABASE_BASE}/I%20Lipo%20Package%20of%2010.jpg`,
  '6a85073d6d0721f9b19a2841': `${SUPABASE_BASE}/RF%20Microneedling%20Abdomen.jpg`,
  '6a85073d6d0721f9b19a2842': `${SUPABASE_BASE}/RF%20Microneedling%20Abdomen%20Package%20of%203.jpg`,
  '6a85049e9ad3e3b8893ccb44': `${SUPABASE_BASE}/NAD.jpg`,
  '6a85049e9ad3e3b8893ccb45': `${SUPABASE_BASE}/B12.jpg`,
  '6a85049e9ad3e3b8893ccb46': `${SUPABASE_BASE}/Glutathione.jpg`,
  '6a85073d6d0721f9b19a2843': `${SUPABASE_BASE}/Laser%20Rosacea.jpg`,
  '6a85073d6d0721f9b19a2844': `${SUPABASE_BASE}/LaserRosacea%20Treatment%20package%20of%203.jpg`,
  '6a85073d6d0721f9b19a283f': `${SUPABASE_BASE}/RF%20Microneedling%20Arms.jpg`,
  '6a85073d6d0721f9b19a2840': `${SUPABASE_BASE}/RF%20Microneedling%20Arms%20package%20of%203.jpg`,
}

if (!API_KEY) {
  console.error('❌ Missing APPWRITE_API_KEY environment variable')
  process.exit(1)
}

async function updateServiceImage(serviceId, imageUrl) {
  try {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${serviceId}`

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          image_url: imageUrl,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return true
  } catch (err) {
    throw err
  }
}

async function migrateAllServices() {
  console.log('🖼️  Starting service image migration...\n')

  let updated = 0
  let errors = 0

  for (const [serviceId, imageUrl] of Object.entries(SERVICE_IMAGES)) {
    try {
      await updateServiceImage(serviceId, imageUrl)
      console.log(`✓ Updated service ${serviceId}`)
      updated++
    } catch (err) {
      console.error(`✗ Failed to update service ${serviceId}: ${err.message}`)
      errors++
    }
  }

  console.log(`\n📊 Migration Summary:`)
  console.log(`  ✓ Updated: ${updated}`)
  console.log(`  ✗ Errors: ${errors}`)
  console.log(`\n✅ Migration complete!`)

  return errors === 0
}

migrateAllServices()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
