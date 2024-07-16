import yaml from 'yaml'
import { auth as googleAuth } from 'google-auth-library'
import { UptimeCheckServiceClient } from '@google-cloud/monitoring'
import config from '../../../config.js'
import { compareMaps, deepCompare } from '../../../util.js'

const uptimeClient = new UptimeCheckServiceClient({ authClient: googleAuth })

const getConfigChecks = (challenges) => {
  const checks = new Map()
  for (const challenge of challenges) {
    if (challenge.instancer) {
      continue
    }
    for (const [containerName, exposes] of Object.entries(challenge.expose)) {
      for (const [i, expose] of exposes.entries()) {
        const check = {
          period: { seconds: '60', nanos: 0 },
          timeout: { seconds: '10', nanos: 0 },
          selectedRegions: ['USA'],
          monitoredResource: {
            type: 'uptime_url',
            labels: { project_id: config.googleProject }
          },
          contentMatchers: []
        }
        if (expose.healthContent) {
          check.contentMatchers.push({
            content: expose.healthContent,
            matcher: 'CONTAINS_STRING'
          })
        }
        if (expose.tcp) {
          check.displayName = `jsrcds Check ${challenge.id} ${containerName}-${i} (nc ${expose.host} ${expose.tcp})`
          check.tcpCheck = { port: expose.tcp }
          check.monitoredResource.labels.host = expose.host
        }
        const addHttp = (host) => {
          check.displayName = `jsrcds Check ${challenge.id} ${containerName}-${i} (https://${host})`
          check.httpCheck = {
            useSsl: true,
            path: '/',
            validateSsl: true
          }
          check.monitoredResource.labels.host = host
        }
        if (expose.tls?.entrypoint === 'https') {
          addHttp(expose.tls.hostname)
        }
        if (expose.http) {
          addHttp(expose.http)
        }
        if (!check.monitoredResource.labels.host) {
          continue
        }
        checks.set(check.displayName, check)
      }
    }
  }
  return checks
}

const convertCheck = (check) => {
  return {
    name: check.name,
    displayName: check.displayName,
    period: check.period,
    timeout: check.timeout,
    selectedRegions: check.selectedRegions,
    monitoredResource: check.monitoredResource,
    contentMatchers: check.contentMatchers,
    httpCheck: check.httpCheck
      ? {
          useSsl: check.httpCheck?.useSsl,
          path: check.httpCheck?.path,
          validateSsl: check.httpCheck?.validateSsl
        }
      : undefined,
    tcpCheck: check.tcpCheck
      ? {
          port: check.tcpCheck?.port
        }
      : undefined
  }
}

const parent = uptimeClient.projectPath(config.googleProject)

export const createPlan = async (challenges) => {
  const [uptimeChecks] = await uptimeClient.listUptimeCheckConfigs(
    { parent },
    { autoPaginate: true }
  )
  const stateChecks = new Map(
    uptimeChecks
      .filter((check) => check.displayName.startsWith('jsrcds'))
      .map((check) => [check.displayName, convertCheck(check)])
  )
  let configChecks = new Map()
  if (config.monitoring.enable) {
    configChecks = getConfigChecks(challenges.filter((c) => c.deployed))
  }
  const [added, removed, common] = compareMaps(stateChecks, configChecks)
  const plan = []
  for (const [, check] of removed) {
    plan.push({ type: 'delete', check })
  }
  for (const [, check] of added) {
    plan.push({ type: 'create', check })
  }
  for (const [, [{ name, ...oldCheck }, newCheck]] of common) {
    if (!deepCompare(oldCheck, newCheck)) {
      plan.push({ type: 'update', check: { name, ...newCheck } })
    }
  }
  return plan
}

const formatCheck = (check) => `
<details>
  <summary>${check.displayName}</summary>

\`\`\`yaml
${yaml.stringify(check)}
\`\`\`

</details>
`

export const formatPlan = (plan) => {
  if (plan.length === 0) {
    return 'No changes'
  }
  const deleted = []
  const updated = []
  const created = []
  for (const { type, check } of plan) {
    if (type === 'delete') {
      deleted.push(`- ${check.displayName}`)
    } else if (type === 'update') {
      updated.push(formatCheck(check))
    } else if (type === 'create') {
      created.push(formatCheck(check))
    }
  }
  return [
    deleted.length > 0 ? '### Delete' : '',
    ...deleted,
    updated.length > 0 ? '### Update' : '',
    ...updated,
    created.length > 0 ? '### Create' : '',
    ...created
  ].join('\n')
}

export const applyPlan = async (plan) => {
  for (const { type, check } of plan) {
    if (type === 'delete') {
      await uptimeClient.deleteUptimeCheckConfig({ name: check.name })
    } else if (type === 'create') {
      await uptimeClient.createUptimeCheckConfig({
        parent,
        uptimeCheckConfig: check
      })
    } else if (type === 'update') {
      await uptimeClient.updateUptimeCheckConfig({ uptimeCheckConfig: check })
    }
  }
}
