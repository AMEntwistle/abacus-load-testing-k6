import { Counter, Trend } from 'k6/metrics'

export async function setupMetrics(requests) {
  const gqlTrends = {}
  const gqlFailures = {}
  await Object.keys(requests).forEach((query) => {
    gqlTrends[query] = new Trend(`gql_${query}_duration`, true)
    gqlFailures[query] = new Counter(`gql_${query}_failures`)
  })
  const frontendFailures = new Counter('frontend_failures')
  return { gqlTrends, gqlFailures, frontendFailures }
}
