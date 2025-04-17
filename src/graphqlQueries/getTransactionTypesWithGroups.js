export const getTransactionTypesWithGroupsQuery = `
  query GetTransactionTypesWithGroups($groupAdmin: TransactionTypeGroupAdmin!) {
    transactionTypes {
      txnTypeCode
      txnTypeId
      txnTypeName
      transactionTypeGroup(groupAdmin: $groupAdmin) {
        referenceTransactionTypeGroupId
        transactionTypeGroupName
        __typename
      }
      __typename
    }
  }
`;