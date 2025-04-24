export const getContractAdvancesByStatusQuery = `
  query GetContractAdvancesByStatus($limit: Int!, $offset: Int!, $status: ContractAdvanceStatus, $contractId: ID) {
    abacusContract(contractId: $contractId) {
      contractId
      contractAdvances(limit: $limit, offset: $offset, status: $status) {
        items {
          advanceDescription
          advanceStatus
          amount
          amountAfterWithholdingAndVat
          contractAdvanceId
          contractId
          createdAt
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
              actionStates {
                abacusStateId
                actionName
                actionStatus
                __typename
              }
              paymentName
              amount {
                convertedAmount {
                  amount
                  currencyCode
                  __typename
                }
                originalAmount {
                  amount
                  currencyCode
                  __typename
                }
                rate
                __typename
              }
              withholdingTaxAmount {
                convertedAmount {
                  amount
                  currencyCode
                  __typename
                }
                originalAmount {
                  amount
                  currencyCode
                  __typename
                }
                rate
                __typename
              }
              vatAmount {
                convertedAmount {
                  amount
                  currencyCode
                  __typename
                }
                originalAmount {
                  amount
                  currencyCode
                  __typename
                }
                rate
                __typename
              }
              amountAfterWithholdingAndVat {
                convertedAmount {
                  amount
                  currencyCode
                  __typename
                }
                originalAmount {
                  amount
                  currencyCode
                  __typename
                }
                rate
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        totalCount
        __typename
      }
      __typename
    }
  }
`
