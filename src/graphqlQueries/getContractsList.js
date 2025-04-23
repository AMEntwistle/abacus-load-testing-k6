export const getContractsListQuery = `
    query GetContractsList($limit: Int, $offset: Int, $searchTerm: String, $contractName: String, $contractType: AbacusContractType, $accountIds: [Int!]) {
  abacusContracts(
    limit: $limit
    offset: $offset
    searchTerm: $searchTerm
    contractName: $contractName
    contractType: $contractType
    accountIds: $accountIds
  ) {
    totalCount
    items {
      account {
        accountId
        accountName
        __typename
      }
      contractId
      contractName
      contractType
      isExcludedFromAccountingRun
      runController {
        runControllerName
        __typename
      }
      lifecycle {
        lifecycleStatus
        __typename
      }
      __typename
    }
    __typename
  }
}
`;