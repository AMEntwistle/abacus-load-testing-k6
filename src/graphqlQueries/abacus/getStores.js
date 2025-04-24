export const getStoresQuery = `
  query GetStores {
    deliveryStoresV2 {
      totalCount
      items {
        id
        name
        __typename
      }
      __typename
    }
  }
`
