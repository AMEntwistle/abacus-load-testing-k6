import * as queries from '../graphqlQueries/index.js';

export function loadQuery(queryFileName, application) {
    const query = queries[`${application}Queries`][`${queryFileName}Query`];
    if (!query) {
        throw new Error(`Query not found: ${queryFileName}`);
    }
    return query;
}