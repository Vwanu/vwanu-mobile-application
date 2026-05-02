import { config } from 'dotenv'
import { resolve } from 'path'
import { readFile } from 'fs'
import * as envfile from 'envfile'
import { writeFileSync } from 'fs'
const envPath = resolve(__dirname, '../.env.local')
config({ path: envPath })
/**
 * Helper utility to generate a CLI command
 *
 * Wraps command in a transaction so that any errors are aborted
 *
 * @param fn command function to run, receives a map of services to interact with the system
 */
export const runCommand = async (fn: () => Promise<void>) => {
  console.log(`${fn.name} -- START: ${new Date()}`)
  //   try {
  //     await dataSource.transaction(async (manager) => {
  //       const services = bootstrapServices(manager);
  //       await fn(services);
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  await fn()
  console.log(`${fn.name} -- END:   ${new Date()}`)
}

/**
 * Helper utility to update the .env file
 *
 * @param envVariables array, with a key and value
 */
export const writeEnvToFile = (envVariables: Record<string, string>): void => {
  const path = resolve(__dirname, '../.env.local')
  readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(JSON.stringify(err))
      return
    }

    const parsedFile = envfile.parse(data)
    const updatedFile = { ...parsedFile, ...envVariables }

    writeFileSync(path, envfile.stringify(updatedFile))
    console.log('Updated .env.local with', envVariables)
  })
}
