// import github from '@actions/github'
// import childProcess from 'child_process'
// import path from 'path'
// import { fileURLToPath } from 'url'

import yaml from "yaml";
import fs from "fs";

// const resolveRef = async (ref) => new Promise((resolve, reject) => {
//   const proc = childProcess.spawn('git', ['rev-parse', ref])
//   const stdout = []
//   proc.stdout.on('data', (data) => stdout.push(data))
//   proc.on('exit', (code) => {
//     if (code !== 0) {
//       reject(new Error(`git exited: ${code}`))
//       return
//     }
//     resolve(Buffer.concat(stdout).toString().trim())
//   })
// })

// // treat as production deploy; might be speculative
// export let isPrd
// // speculative, local build
// export let isSpeculative
// // tag for staging deploy previews
// export let deployTag
// // base git ref for cache comparisons
// export let baseRef
// if (github.context.eventName === 'push') {
//   // push to main; production deploy
//   isPrd = true
//   isSpeculative = false
//   deployTag = 'prd'
//   baseRef = github.context.payload.before
// } else if (github.context.eventName === 'pull_request') {
//   // pull request; deploy preview
//   isPrd = false
//   isSpeculative = false
//   deployTag = `pull${github.context.payload.number}`
//   const { action } = github.context.payload
//   if (action === 'opened' || action === 'reopened') {
//     baseRef = github.context.payload.pull_request.base.sha
//   } else if (action === 'synchronize') {
//     baseRef = github.context.payload.before
//   }
// } else {
//   // local; run speculative deploy
//   isPrd = true
//   isSpeculative = true
//   deployTag = 'prd'
//   baseRef = await resolveRef('HEAD')
// }

// export const repoRoot = path.join(fileURLToPath(import.meta.url), '../../..')
// export const tlsPort = 1

// export const deepCompare = (a, b) => {
//   if (a === b) {
//     return true
//   }
//   if (Array.isArray(a) && Array.isArray(b)) {
//     if (a.length !== b.length) {
//       return false
//     }
//     return a.every((v, i) => deepCompare(v, b[i]))
//   }
//   if (a != null && b != null && Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
//     const keys = new Set([...Object.keys(a), ...Object.keys(b)])
//     return [...keys].every(k => deepCompare(a[k], b[k]))
//   }
//   return false
// }

// export const compareMaps = (oldMap, newMap) => {
//   const added = new Map()
//   const removed = new Map()
//   const common = new Map()
//   for (const [k, v] of oldMap) {
//     if (!newMap.has(k)) {
//       removed.set(k, v)
//     }
//   }
//   for (const [k, v] of newMap) {
//     if (!oldMap.has(k)) {
//       added.set(k, v)
//     } else {
//       common.set(k, [oldMap.get(k), v])
//     }
//   }
//   return [added, removed, common]
// }

export async function loadYaml(yamlPath: string): Promise<any> {
  return yaml.parse(await fs.promises.readFile(yamlPath, "utf8"));
}
