import { Client, Functions } from 'node-appwrite'
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_API_KEY } from './config.mjs'

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_API_KEY)
const functions = new Functions(client)

// Functions receive a dynamic API key whose permissions come from the
// function's declared scopes, not from the deploying key.
await functions.update({
  functionId: 'redeemReward',
  name: 'Redeem Reward',
  runtime: 'node-22',
  execute: ['users'],
  entrypoint: 'src/main.js',
  scopes: ['documents.read', 'documents.write'],
})
console.log('redeemReward scopes updated')
