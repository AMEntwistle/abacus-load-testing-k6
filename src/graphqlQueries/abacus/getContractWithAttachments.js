export const getContractWithAttachmentsQuery = `
  query GetContractWithAttachments($contractId: ID) {
    abacusContract(contractId: $contractId) {
      account {
        accountId
        __typename
      }
      contractId
      contractName
      contractTerms {
        attachments
        attachmentsRelations {
          labelIds
          upcs
          __typename
        }
        contractTermId
        isBaseTerm
        termType
        __typename
      }
      __typename
    }
  }
`
