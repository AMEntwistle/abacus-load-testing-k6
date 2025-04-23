export const canPerformQuery = `
query CanPerform($identityId: String, $resourceTypeActions: [PPResourceTypeActionInput!]!) {
  identityById(identityId: $identityId) {
    canPerform(resourceTypeActions: $resourceTypeActions) {
      action
      decision
      resourceType
      __typename
    }
    __typename
  }
}
`