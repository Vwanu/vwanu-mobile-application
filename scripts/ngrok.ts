#!/usr/bin/env -S node -r ts-node/register

import { runCommand, writeEnvToFile } from './helpers'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const EXPO_PUBLIC_API_URL = 'EXPO_PUBLIC_API_URL'

void runCommand(async function () {
  if (!process.env.NGROK_TOKEN) {
    throw new Error('NGROK_TOKEN is not set')
  }

  if (!process.env.NGROK_API_KEY) {
    throw new Error('NGROK_API_KEY is not set')
  }

  console.log('Checking for existing ngrok tunnels...')

  try {
    const { stdout } = await execAsync(
      `ngrok api tunnels list --api-key ${process.env.NGROK_API_KEY}`
    )
    const tunnels = JSON.parse(stdout).tunnels

    if (tunnels.length === 0) {
      console.log(
        'No active ngrok tunnels found. Please start an ngrok tunnel manually.'
      )
      return
    }

    const httpsTunnel = tunnels.find(
      (tunnel: { proto: string; public_url: string }) =>
        tunnel.proto === 'https'
    )

    if (!httpsTunnel) {
      console.log(
        'No HTTPS ngrok tunnel found. Please start an HTTPS ngrok tunnel manually.'
      )
      return
    }

    const ngrokUrl = httpsTunnel.public_url
    console.log(`Found active ngrok tunnel: ${ngrokUrl}`)
    writeEnvToFile({ [EXPO_PUBLIC_API_URL]: ngrokUrl })
  } catch (error) {
    console.error('[ngrok] Error checking ngrok tunnels:', error)
  }
})
