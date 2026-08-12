# MeritOne Supabase → Appwrite migration

One-off scripts used to move the MeritOne backend from Supabase to Appwrite Cloud.
Kept in the repo so the provisioning is reproducible, not because they run routinely.

Every script needs an Appwrite API key with database/user scopes:

```bash
export APPWRITE_API_KEY=...   # never commit this
```

| Script | Purpose |
| --- | --- |
| `provision.mjs` | Creates the `meritone` database, all collections, attributes, indexes, permissions, and the `staff` team. Idempotent. |
| `migrate.mjs` | Writes `supabase-dump.json` into Appwrite, preserving original UUIDs as document ids, and creates matching auth users. Idempotent (skips existing). |
| `update-permissions.mjs` | Grants `Role.users()` create on `patients`, mirroring the old `patients_insert_self` RLS policy. |
| `deploy-functions.mjs` | Packages and deploys `functions/*` to Appwrite. |
| `update-function-scopes.mjs` | Sets the scopes on the dynamic API key Appwrite injects into functions. Required — without it functions get no database access. |

`supabase-dump.json` is gitignored: it contains patient names and email
addresses. Regenerate it from a privileged Supabase connection if needed — the
anon key cannot read `patients` (its RLS policy calls `is_staff()`, which anon
may not execute).

## Notes

- Documents keep their original Supabase UUIDs as Appwrite `$id`, so every
  stored foreign key stayed valid with no remapping.
- `redeem_reward` became the `redeemReward` function; the balance check must
  stay server-side so a client cannot mint redemptions without spending points.
- `award_points` and `fulfill_redemption` are **not** yet ported. They were
  staff-only and no staff UI exists (the `staff` table is empty), so nothing
  currently calls them.
