export const getAccountLedgerListQuery = `
  query GetAccountLedgerList($accountId: ID!, $limit: Int!, $offset: Int!) {
    abacusAccountLedgerList(accountId: $accountId, limit: $limit, offset: $offset) {
      items {
        account {
          accountId
          __typename
        }
        accountingPeriod {
          accountingPeriodId
          accountingPeriodName
          __typename
        }
        amount
        contract {
          contractId
          contractName
          __typename
        }
        currencyCode
        date
        endingBalance
        ledgerAccountId
        openingBalance
        statementPeriod {
          statementPeriodId
          statementPeriodName
          __typename
        }
        transactionType
        __typename
      }
      totalCount
      __typename
    }
  }
`
