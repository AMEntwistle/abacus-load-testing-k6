import * as queries from './graphqlQueries/index.js';

export function loadQuery(queryFileName) {
    const query = queries[`${queryFileName}Query`];
    if (!query) {
        throw new Error(`Query not found: ${queryFileName}`);
    }
    return query;
}