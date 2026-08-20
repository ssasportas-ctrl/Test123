#!/usr/bin/env node
// Migration script: Add image_url field to existing services in Appwrite

import { Client, Databases } from 'node-appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY, DATABASE_ID } from './config.mjs'

const SUPABASE_BASE = 'https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site'

// Service image mappings from Supabase
const SERVICE_IMAGES = {
  '6a850601b540b1424ba31deb': `${SUPABASE_BASE}/Vit%20C%20Injection%20small.jpg`, // Vit C - Small
  '6a850601b540b1424ba31dec': `${SUPABASE_BASE}/Vit%20C%20Injection%20medium.jpg`, // Vit C - Medium
  '6a850601b540b1424ba31ded': `${SUPABASE_BASE}/Vit%20C%20Injection%20large.jpg`, // Vit C - Large
  '6a8506177997139f0e63ca2d': `${SUPABASE_BASE}/Microneedling%2B%20PRP.jpg`, // Microneedling + PRP
  '6a85073d6d0721f9b19a283c': `${SUPABASE_BASE}/I%20Lipo%20Pakage.jpg`, // I-Lipo
  '6a85073d6d0721f9b19a283d': `${SUPABASE_BASE}/I%20Lipo%20package%20of%208.jpg`, // I-Lipo Package of 8
  '6a85073d6d0721f9b19a283e': `${SUPABASE_BASE}/I%20Lipo%20Package%20of%2010.jpg`, // I-Lipo Package of 10
  '6a85073d6d0721f9b19a2841': `${SUPABASE_BASE}/RF%20Microneedling%20Abdomen.jpg`, // RF Microneedling Abdomen
  '6a85073d6d0721f9b19a2842': `${SUPABASE_BASE}/RF%20Microneedling%20Abdomen%20Package%20of%203.jpg`, // RF Microneedling Abdomen Package of 3
  '6a85049e9ad3e3b8893ccb44': `${SUPABASE_BASE}/NAD.jpg`, // NAD
  '6a85049e9ad3e3b8893ccb45': `${SUPABASE_BASE}/B12.jpg`, // B12
  '6a85049e9ad3e3b8893ccb46': `${SUPABASE_BASE}/Glutathione.jpg`, // Glutathione
  '6a85073d6d0721f9b19a2843': `${SUPABASE_BASE}/Laser%20Rosacea.jpg`, // Laser Rosacea
  '6a85073d6d0721f9b19a2844': `${SUPABASE_BASE}/LaserRosacea%20Treatment%20package%20of%203.jpg`, // Laser Rosacea Package of 3
  '6a85073d6d0721f9b19a283f': `${SUPABASE_BASE}/RF%20Microneedling%20Arms.jpg`, // RF Microneedling Arms
  '6a85073d6d0721f9b19a2840': `${SUPABASE_BASE}/RF%20Microneedling%20Arms%20package%20of%203.jpg`, // RF Microneedling Arms Package of 3
}

async function migrateServiceImages() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT)
    .setKey(APPWRITE_API_KEY)

  const databases = new Databases(client)

  console.log('🖼️  Starting service image migration to Appwrite...\n')

  let updated = 0
  let skipped = 0
  let errors = 0

  for (const [serviceId, imageUrl] of Object.entries(SERVICE_IMAGES)) {
    try {
      await databases.updateDocument(DATABASE_ID, 'services', serviceId, {
        image_url: imageUrl,
      })
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
  console.log(`\n✅ Service image migration complete!`)

  if (errors > 0) {
    process.exit(1)
  }
}

migrateServiceImages().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
