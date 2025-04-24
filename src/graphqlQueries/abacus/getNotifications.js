export const getNotificationsQuery = `
    query getNotifications($identityId: String!) {
  identityById(identityId: $identityId) {
    id
    notifications {
      items {
        message
        ... on BankingAndTaxDetailsRequiredNotification {
          link
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
