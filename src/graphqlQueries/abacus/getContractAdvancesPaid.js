export const getContractAdvancesPaidQuery = `
  query GetContractAdvancesPaid($contractId: ID!, $limit: Int, $offset: Int) {
    abacusContractAdvancesPaid(
      contractId: $contractId
      limit: $limit
      offset: $offset
    ) {
      items {
        contractAdvanceId
        contractId
        statementPeriod {
          statementPeriodId
          statementPeriodName
          __typename
        }
        amount
        currencyCode
        advanceAmountPayeeCurrency
        advancePayeeCurrencyCode
        advanceStatus
        amountAfterWithholdingAndVat
        milestone
        milestoneDate
        advanceDescription
        milestoneDescription
        datePaid
        createdAt
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
`;