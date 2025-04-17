export const getAccountByIdQuery = `
  query GetAccountById($accountId: ID!) {
    abacusAccount(accountId: $accountId) {
      accountId
      accountName
      __typename
    }
  }
`;