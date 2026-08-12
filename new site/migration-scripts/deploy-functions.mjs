import { execFileSync } from 'node:child_process'
import { existsSync, rmSync, readFileSync } from 'node:fs'
import { Client, Functions } from 'node-appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY } from './config.mjs'

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_API_KEY)
const functions = new Functions(client)

const FUNCTIONS = [{ id: 'redeemReward', name: 'Redeem Reward', dir: 'functions/redeemReward' }]

async function ensureFunction(def) {
  try {
    await functions.get(def.id)
    console.log(`function ${def.id} already exists`)
  } catch {
    await functions.create({
      functionId: def.id,
      name: def.name,
      runtime: 'node-22',
      execute: ['users'],
      entrypoint: 'src/main.js',
      commands: 'npm install',
    })
    console.log(`created function ${def.id}`)
  }
}

async function deploy(def) {
  const tarball = `/tmp/${def.id}.tar.gz`
  if (existsSync(tarball)) rmSync(tarball)
  execFileSync('tar', ['-czf', tarball, '-C', def.dir, '.'])

  const deployment = await functions.createDeployment({
    functionId: def.id,
    code: new File([readFileSync(tarball)], `${def.id}.tar.gz`, { type: 'application/gzip' }),
    activate: true,
  })
  console.log(`  deployment ${deployment.$id} status=${deployment.status}`)
  return deployment.$id
}

async function main() {
  for (const def of FUNCTIONS) {
    await ensureFunction(def)
    await deploy(def)
  }
  console.log('\nDeployed. Builds run async — check status before invoking.')
}

main().catch((err) => {
  console.error('Deploy failed:', err)
  process.exit(1)
})
