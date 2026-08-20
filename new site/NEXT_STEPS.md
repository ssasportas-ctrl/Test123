# Base44 Image Migration - Next Steps

## Completed ✅
- Schema updated with `image_url` field in Appwrite
- 16 medical services seeded into Appwrite database
- AppContext updated to load services from Appwrite (with Supabase fallback)
- All changes pushed to GitHub

## Remaining Steps

### 1. Create `image_url` Attribute in Appwrite Dashboard
This must be done manually via the Appwrite console:

1. Go to: https://nyc.cloud.appwrite.io
2. Navigate to: Database → meritone → services → Attributes
3. Click "Create Attribute"
4. Fill in:
   - **Key:** `image_url`
   - **Type:** String
   - **Size:** 1024
   - **Required:** OFF
5. Click "Create"

### 2. Run Image Migration Script
Once the attribute exists, run:

```bash
cd /Users/sageysasportas/Desktop/new\ site
export APPWRITE_API_KEY="standard_5ddd98b0c8bc10e31d40322d055db752383986cb7888990f643d6119346daac4cf48992fccc6f040248cb0674cd3a446839a2e2b773cff563225b93a40aa965fe0f17699342e46df5eb750dbb37dedcd9de81e8e08c8914147b108c45e1b7a2dc0f1e18bcd6e844f7a6122380406eb9db08fbe1a0f0593167236778ab6ef4096"
node migration-scripts/update-services-rest.mjs
```

This will populate all 16 services with their Supabase image URLs.

### 3. Verify in App
- Services load from Appwrite with `image_url` field
- Fallback to Supabase URLs still works
- All medical images display correctly in rewards-app

## Scripts Available

- `migration-scripts/create-image-url-attribute.mjs` - Creates attribute via API (if dashboard access unavailable)
- `migration-scripts/update-services-rest.mjs` - Updates services with image URLs
- `migration-scripts/seed-appwrite-services.mjs` - Seeds services (already run)

## Current Status

All services are seeded but don't have `image_url` populated yet. App displays fallback Supabase URLs from hardcoded BASE44_SERVICES array until migration completes.

**Timeline:** Steps 1-2 should take ~10 minutes to complete.
