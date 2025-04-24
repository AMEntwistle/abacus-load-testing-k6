export const getContractAdvancesPendingQuery = `
  query GetContractAdvancesPending($contractId: ID!, $limit: Int, $offset: Int) {
    abacusContractAdvancesPending(
      contractId: $contractId
      limit: $limit
      offset: $offset
    ) {
      items {
        advanceDescription
        advanceStatus
        amount
        amountAfterWithholdingAndVat
        createdAt
        contractAdvanceId
        contractId
        currencyCode
        milestone
        milestoneDate
        milestoneDescription
        note
        referencePaymentType {
          referencePaymentTypeId
          __typename
        }
        usSourceIncomeRate
        vatAmount
        withholdingTaxAmount
        worksheetPaymentContractAdvances(limit: 1, offset: 0) {
          items {
            worksheetPaymentContractAdvanceId
            __typename
          }
          __typename
        }
        __typename
      }
      totalCount
      __typename
    }
  }
`
