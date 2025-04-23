import http from 'k6/http';
import { check, fail } from 'k6';
import { loadQuery } from './loadQuery.js';


export async function executeGraphQLRequests(requests, token, user, graphqlUrl, metrics) {
    for (const queryFile in requests) {
        const query = await loadQuery(queryFile);
        const body = JSON.stringify({ query, variables: requests[queryFile] });
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'apollographql-client-name': 'AbacusPerformanceTest',
            'orchard-profile-type': 'AbacusProfile',
            'orchard-profile-id': user.profileId,
            'orchard-profile-uuid': user.profileUuid,
            'Cache-Control': 'no-cache',
        };

        const start = Date.now();
        const res = http.post(`${graphqlUrl}?op=${queryFile}`, body, { headers });
        const duration = Date.now() - start;

        metrics.gqlTrends[queryFile].add(duration);

        const success = check(res, {
            'is status 200': (r) => r.status === 200,
            'no GraphQL errors': (r) => {
                if (r.body.includes('403: Grass does not authorize this request.')) {
                    fail('Grass does not authorize this request.');
                }
                const responseJson = r.json();
                return !responseJson.errors;
            },
        });

        if (!success) {
            metrics.gqlFailures[queryFile].add(1); // Increment failure counter
            console.error(`Request failed for query: ${queryFile}, Response: ${res.body}`);
        }
    }
}