import http from 'k6/http';
import { check } from 'k6';
import { loadQuery } from './loadQuery.js';

export async function executeGraphQLRequests(requests, token, user, graphqlUrl) {
    for (const { queryFile, variables } of requests) {
        const query = await loadQuery(queryFile);
        const body = JSON.stringify({ query, variables });

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'apollographql-client-name': 'AbacusPerformanceTest',
            'orchard-profile-type': 'AbacusProfile',
            'orchard-profile-id': user.profileId,
            'orchard-profile-uuid': user.profileUuid,
            'Cache-Control': 'no-cache',
        };

        const res = http.post(`${graphqlUrl}?op=${queryFile}`, body, { headers });

        check(res, {
            'is status 200': (r) => r.status === 200,
            'no GraphQL errors': (r) => {
                const responseJson = r.json();
                return !responseJson.errors;
            },
        });
    }
}