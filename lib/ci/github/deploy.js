import core from '@actions/core'
import github from '@actions/github'
import { isSpeculative } from '../../../util.js'
import { getChallenges } from '../../../challenges.js'
import * as rctf from './rctf.js'
import * as kubernetes from './kubernetes.js'
import * as adminbot from './adminbot.js'
import * as monitoring from './monitoring.js'

if (!isSpeculative) {
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
  const { data } = await octokit.rest.git.getRef({
    owner: github.context.payload.repository.owner.login,
    repo: github.context.payload.repository.name,
    ref: github.context.ref.slice('refs/'.length)
  })
  if (data.object.sha !== github.context.sha) {
    core.warning('old deploy; skipping')
    process.exit()
  }
}

const { challenges, errors } = await getChallenges()
if (errors.length > 0) {
  for (const error of errors) {
    core.error(error)
  }
  throw new Error('challenge read errors')
}
core.info('planning')
const [rctfPlan, kubernetesPlan, adminbotPlan, monitoringPlan] =
  await Promise.all([
    rctf.createPlan(challenges),
    kubernetes.createPlan(challenges),
    adminbot.createPlan(challenges),
    monitoring.createPlan(challenges)
  ])
const formatted = `## rCTF
${rctf.formatPlan(rctfPlan)}
<hr>

## Kubernetes
${kubernetes.formatPlan(kubernetesPlan)}
<hr>

## adminbot
${adminbot.formatPlan(adminbotPlan)}
<hr>

## monitoring
${monitoring.formatPlan(monitoringPlan)}
`
core.info(formatted)
if (!isSpeculative) {
  await core.summary.addRaw(formatted).write()
  core.info('applying')
  await Promise.all([
    rctf.applyPlan(rctfPlan),
    kubernetes.applyPlan(kubernetesPlan),
    adminbot.applyPlan(adminbotPlan),
    monitoring.applyPlan(monitoringPlan)
  ])
}
