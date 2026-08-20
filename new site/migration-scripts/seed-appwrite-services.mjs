#!/usr/bin/env node
// Seed services into Appwrite database

const API_KEY = process.env.APPWRITE_API_KEY
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1'
const PROJECT_ID = '6a7c84a300376e2da9e6'
const DATABASE_ID = 'meritone'
const COLLECTION_ID = 'services'
const PRACTICE_ID = '00000000-0000-0000-0000-000000000001'

const SUPABASE_BASE = 'https://cbdekqzzxysxachifevr.supabase.co/storage/v1/object/public/Azar%20Photo%20Site'

// 16 Services with all details
const SERVICES = [
  // Sunspot/Melasma
  {
    id: '6a850601b540b1424ba31deb',
    name: 'Vit C Injections - Small Area',
    description: 'Vitamin C injections for small treatment areas',
    price: 50,
    member_price: null,
    image_url: `${SUPABASE_BASE}/Vit%20C%20Injection%20small.jpg`,
    category: 'Sunspot/Melasma',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a850601b540b1424ba31dec',
    name: 'Vit C Injections - Medium Area',
    description: 'Vitamin C injections for medium treatment areas',
    price: 75,
    member_price: null,
    image_url: `${SUPABASE_BASE}/Vit%20C%20Injection%20medium.jpg`,
    category: 'Sunspot/Melasma',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a850601b540b1424ba31ded',
    name: 'Vit C Injections - Large Area',
    description: 'Vitamin C injections for large treatment areas',
    price: 100,
    member_price: null,
    image_url: `${SUPABASE_BASE}/Vit%20C%20Injection%20large.jpg`,
    category: 'Sunspot/Melasma',
    featured: true,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a8506177997139f0e63ca2d',
    name: 'Microneedling + PRP',
    description: 'Microneedling combined with platelet-rich plasma for enhanced results',
    price: 650,
    member_price: 585,
    image_url: `${SUPABASE_BASE}/Microneedling%2B%20PRP.jpg`,
    category: 'Sunspot/Melasma',
    featured: true,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },

  // Body Contouring
  {
    id: '6a85073d6d0721f9b19a283c',
    name: 'I-Lipo',
    description: 'Non-invasive body contouring treatment',
    price: 85,
    member_price: null,
    image_url: `${SUPABASE_BASE}/I%20Lipo%20Pakage.jpg`,
    category: 'Body Contouring',
    featured: true,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85073d6d0721f9b19a283d',
    name: 'I-Lipo Package of 8',
    description: 'Package of 8 I-Lipo treatments for optimal results',
    price: 700,
    member_price: 630,
    image_url: `${SUPABASE_BASE}/I%20Lipo%20package%20of%208.jpg`,
    category: 'Body Contouring',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85073d6d0721f9b19a283e',
    name: 'I-Lipo Package of 10',
    description: 'Package of 10 I-Lipo treatments for maximum body contouring',
    price: 850,
    member_price: 765,
    image_url: `${SUPABASE_BASE}/I%20Lipo%20Package%20of%2010.jpg`,
    category: 'Body Contouring',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85073d6d0721f9b19a2841',
    name: 'RF Microneedling - Abdomen',
    description: 'Radiofrequency microneedling treatment for abdominal area',
    price: 1000,
    member_price: 900,
    image_url: `${SUPABASE_BASE}/RF%20Microneedling%20Abdomen.jpg`,
    category: 'Body Contouring',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85073d6d0721f9b19a2842',
    name: 'RF Microneedling - Abdomen Package of 3',
    description: 'Package of 3 RF Microneedling treatments for abdomen',
    price: 2850,
    member_price: 2565,
    image_url: `${SUPABASE_BASE}/RF%20Microneedling%20Abdomen%20Package%20of%203.jpg`,
    category: 'Body Contouring',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },

  // Wellness
  {
    id: '6a85049e9ad3e3b8893ccb44',
    name: 'NAD',
    description: 'NAD+ IV therapy for cellular energy and anti-aging',
    price: 100,
    member_price: 90,
    image_url: `${SUPABASE_BASE}/NAD.jpg`,
    category: 'Wellness',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85049e9ad3e3b8893ccb45',
    name: 'B12',
    description: 'Vitamin B12 injection for energy and metabolism',
    price: 50,
    member_price: 45,
    image_url: `${SUPABASE_BASE}/B12.jpg`,
    category: 'Wellness',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85049e9ad3e3b8893ccb46',
    name: 'Glutathione',
    description: 'Glutathione injection for skin brightening and detoxification',
    price: 80,
    member_price: 72,
    image_url: `${SUPABASE_BASE}/Glutathione.jpg`,
    category: 'Wellness',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },

  // Rosacea
  {
    id: '6a85073d6d0721f9b19a2843',
    name: 'Laser Rosacea Treatment',
    description: 'Laser treatment for rosacea and redness reduction',
    price: 550,
    member_price: 495,
    image_url: `${SUPABASE_BASE}/Laser%20Rosacea.jpg`,
    category: 'Rosacea',
    featured: true,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85073d6d0721f9b19a2844',
    name: 'Laser Rosacea Treatment Package of 3',
    description: 'Package of 3 laser treatments for rosacea',
    price: 1485,
    member_price: 1336,
    image_url: `${SUPABASE_BASE}/LaserRosacea%20Treatment%20package%20of%203.jpg`,
    category: 'Rosacea',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },

  // Wrinkles/Age Spots
  {
    id: '6a85073d6d0721f9b19a283f',
    name: 'RF Microneedling - Arms',
    description: 'Radiofrequency microneedling treatment for arms',
    price: 750,
    member_price: 675,
    image_url: `${SUPABASE_BASE}/RF%20Microneedling%20Arms.jpg`,
    category: 'Wrinkles/Age Spots',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
  {
    id: '6a85073d6d0721f9b19a2840',
    name: 'RF Microneedling - Arms Package of 3',
    description: 'Package of 3 RF Microneedling treatments for arms',
    price: 2150,
    member_price: 1935,
    image_url: `${SUPABASE_BASE}/RF%20Microneedling%20Arms%20package%20of%203.jpg`,
    category: 'Wrinkles/Age Spots',
    featured: false,
    active: true,
    booking_url: 'https://azardermatology.com/book',
  },
]

if (!API_KEY) {
  console.error('❌ Missing APPWRITE_API_KEY environment variable')
  process.exit(1)
}

async function seedService(service) {
  try {
    const url = `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Appwrite-Project': PROJECT_ID,
        'X-Appwrite-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        documentId: service.id,
        data: {
          practice_id: PRACTICE_ID,
          name: service.name,
          description: service.description,
          price: service.price,
          member_price: service.member_price,
          category: service.category,
          featured: service.featured,
          active: service.active,
          booking_url: service.booking_url,
          created_at: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      // If document already exists, skip (409 conflict)
      if (response.status === 409) {
        return 'exists'
      }
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return 'created'
  } catch (err) {
    throw err
  }
}

async function seedAllServices() {
  console.log('🌱 Seeding services into Appwrite...\n')

  let created = 0
  let exists = 0
  let errors = 0

  for (const service of SERVICES) {
    try {
      const result = await seedService(service)
      if (result === 'created') {
        console.log(`✓ Created service: ${service.name}`)
        created++
      } else if (result === 'exists') {
        console.log(`ℹ Service already exists: ${service.name}`)
        exists++
      }
    } catch (err) {
      console.error(`✗ Failed to seed service "${service.name}": ${err.message}`)
      errors++
    }
  }

  console.log(`\n📊 Seeding Summary:`)
  console.log(`  ✓ Created: ${created}`)
  console.log(`  ℹ Already exist: ${exists}`)
  console.log(`  ✗ Errors: ${errors}`)
  console.log(`\n✅ Seeding complete!`)

  return errors === 0
}

seedAllServices()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
