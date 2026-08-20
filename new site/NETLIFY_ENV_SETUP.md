# Netlify Environment Variables Setup

## Required Variables for meritone.app

To connect the rewards-app to Appwrite, you need to set these environment variables on Netlify.

### Steps:

1. **Go to Netlify Dashboard**
   - https://app.netlify.com

2. **Select Your Site**
   - Click on "Test123" project

3. **Navigate to Environment Settings**
   - Site Settings → Build & Deploy → Environment

4. **Add Environment Variables**

Click "Add environment variable" and add these:

| Key | Value |
|-----|-------|
| `VITE_APPWRITE_ENDPOINT` | `https://nyc.cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | `6a7c84a300376e2da9e6` |
| `VITE_APPWRITE_DATABASE_ID` | `meritone` |

**Optional (if public key auth needed):**
| `VITE_APPWRITE_API_KEY` | `standard_5ddd98b0c8bc10e31d40322d055db752383986cb7888990f643d6119346daac4cf48992fccc6f040248cb0674cd3a446839a2e2b773cff563225b93a40aa965fe0f17699342e46df5eb750dbb37dedcd9de81e8e08c8914147b108c45e1b7a2dc0f1e18bcd6e844f7a6122380406eb9db08fbe1a0f0593167236778ab6ef4096` |

5. **Trigger Redeploy**
   - Go to Deploys
   - Click "Trigger deploy" on latest commit
   - Or push a new commit to main

## Verification

After deployment, meritone.app should:
- ✅ Load with no 401 errors
- ✅ Show services from Appwrite
- ✅ Display all 16 medical services with images
- ✅ Allow navigation through services

## What These Variables Do

- `VITE_APPWRITE_ENDPOINT` - Appwrite server location
- `VITE_APPWRITE_PROJECT_ID` - Which Appwrite project to connect to
- `VITE_APPWRITE_DATABASE_ID` - Which database (meritone) to use
- `VITE_APPWRITE_API_KEY` - Optional: API key for server-side operations

The app will now be able to:
- Load services from Appwrite database
- Display service images from Supabase URLs
- Support authentication and loyalty features

## Next Steps

1. Set variables on Netlify
2. Trigger redeploy
3. Visit https://meritone.app
4. Verify services load with images
