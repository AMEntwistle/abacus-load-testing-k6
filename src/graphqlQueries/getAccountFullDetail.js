export const getAccountFullDetailQuery = `
  query GetAccountFullDetail($accountId: ID!) {
    abacusAccount(accountId: $accountId) {
      accountId
      accountName
      accountPayee {
        accountPayeeId
        actionStates {
          abacusStateId
          actionName
          actionStatus
          createdAt
          lastModified
          message
          __typename
        }
        lastModified
        payoneerPayeeId
        payoneerPayeeName
        payoneerProgramId
        payoneerProgram {
          payoneerProgramId
          payoneerProgramName
          __typename
        }
        sapVendorId
        accountPayeeTaxFormInfo {
          expirationDate
          __typename
        }
        referencePaymentType {
        paymentEntity {
          paymentEntityName
          referencePaymentEntityId
          __typename
        }
        paymentMinimum
        paymentSchedule
        paymentType
        __typename
      }
      accountTaxInfo {
        accountId
        accountTaxInfoId
        countryOfTaxResidence
        isSbaSigned
        isTaxTreatyClaimed
        isVatExempt
        __typename
      }
          paymentService
          __typename
        }
        accountPayeeKycNotification {
          fileUploadLink
          __typename
        }
        __typename
      }
      accountPayeeHistory {
        accountPayeeHistoryId
        lastModified
        payoneerPayeeName
        __typename
      }
      accountPaymentTerm {
        accountId
        accountPaymentTermId
        agreementType {
          referenceAgreementTypeId
          agreementType
          __typename
        }
        currencyCode
        signingEntity {
          signingEntityId
          signingEntityName
          legalName
          vatNumber
          sapId
          address
          __typename
        }
      contracts {
        contractId
        contractName
        contractType
        runController {
          runControllerName
          __typename
        }
        __typename
      }
      eligibilityStatus
      payableBalance {
        currencyCode
        payableBalance
        __typename
      }
      paymentHoldHistory {
        createdAt
        createdBy
        lastModified
        lastModifiedBy
        endDate
        isOnHold
        accountId
        paymentHoldHistoryId
        paymentHoldId
        reason
        startDate
        __typename
      }
      accountTaxInfoHistory {
        accountTaxInfoHistoryId
        countryOfTaxResidence
        createdAt
        lastModified
        __typename
      }
      paymentPendingInCurrentStatementPeriod {
        accountId
        __typename
      }
      __typename
    }
  }
`;