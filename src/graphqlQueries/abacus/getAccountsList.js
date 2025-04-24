export const getAccountsListQuery = `
    query GetAccountsList($limit: Int, $offset: Int, $searchTerm: String, $skipContracts: Boolean = false) {
  abacusAccounts(limit: $limit, offset: $offset, searchTerm: $searchTerm) {
    totalCount
    items {
      accountId
      accountName
      accountPaymentTerm {
        accountPaymentTermId
        paymentEntity {
          paymentEntityName
          referencePaymentEntityId
          __typename
        }
        __typename
      }
      contracts @skip(if: $skipContracts) {
        contractId
        lifecycle {
          lifecycleStatus
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`
