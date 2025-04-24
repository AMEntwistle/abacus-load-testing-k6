export const getContractPartyListQuery = `
  query GetContractPartyList(
    $contractId: ID!, 
    $limit: Int, 
    $offset: Int, 
    $targetType: AbacusContractPartyTargetType, 
    $includeOnlySchedules: Boolean = false
  ) {
    abacusContractParties(
      contractId: $contractId
      limit: $limit
      offset: $offset
      targetType: $targetType
    ) {
      totalCount
      items {
        contractId
        contractPartyId
        targetId
        targetType
        contractPartyObject {
          ... on NrContributor {
            id
            name
            abacusSchedules(contributorOnlySchedules: $includeOnlySchedules) {
              conditions {
                autoAdd
                __typename
              }
              scheduleId
              scheduleName
              scheduleAttachments {
                totalCount
                __typename
              }
              __typename
            }
            __typename
          }
          ... on Vendor {
            name
            labelId: id {
              vendorId
              __typename
            }
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
