export const getContractQuery = `
  fragment TransactionTypesV2 on AbacusContractTermConditionSet {
    transactionTypesV2 {
      txnTypeCode
      txnTypeId
      txnTypeName
      transactionTypeGroup(groupAdmin: $groupAdmin) {
        referenceTransactionTypeGroupId
        transactionTypeGroupName
        __typename
      }
      __typename
    }
    __typename
  }

  query GetContract($contractId: ID, $groupAdmin: TransactionTypeGroupAdmin!) {
    abacusContract(contractId: $contractId) {
      account {
        accountId
        accountName
        accountPaymentTerm {
          accountPaymentTermId
          currencyCode
          paymentEntity {
            paymentEntityName
            referencePaymentEntityId
            __typename
          }
          __typename
        }
        __typename
      }
      contractFlowthrough {
        contract {
          contractId
          contractName
          __typename
        }
        contractFlowthroughId
        flowthroughRate
        flowthroughStatus
        hasAutomaticShutoff
        recoupmentCap
        referenceFlowthroughCalculation {
          flowthroughCalculation
          referenceFlowthroughCalculationId
          __typename
        }
        statusLastModified
        statusLastModifiedBy
        statusLastModifiedByIdentity {
          name
          __typename
        }
        __typename
      }
      contractId
      contractName
      contractTerms {
        attachments
        attachmentsRelations {
          labelIds
          upcs
          contributors {
            name
            id
            __typename
          }
          __typename
        }
        conditions {
          conditions {
            countries
            stores
            transactionTypes
            ...TransactionTypesV2
            __typename
          }
          contractTermConditionId
          contractTermConditionName
          contractTermId
          priority
          termRate
          commission
          __typename
        }
        contract {
          contractId
          __typename
        }
        contractTermId
        contractTermName
        isBaseTerm
        termType
        contractTermSchedules {
          ... on AbacusSchedule {
            scheduleId
            scheduleName
            scheduleAttachments {
              totalCount
              __typename
            }
            conditions {
              autoAdd
              __typename
            }
            __typename
          }
          ... on NrContributor {
            name
            __typename
          }
          __typename
        }
        __typename
      }
      contractType
      contractExclusion {
        contractExclusionId
        contractId
        exclusions {
          countries
          stores
          __typename
        }
        __typename
      }
      executionDate
      generalNote
      initialStartDate
      isExcludedFromAccountingRun
      lifecycle {
        collectionEnd
        collectionStart
        contractLifecycleId
        lifecycleStatus
        lifecycleTermEnd
        lifecycleTermStart
        renewalEffective
        terminationEffective
        terminationNoticeDeadline
        terminationNoticeReceived
        __typename
      }
      lifecycleSchedules {
        collectionPeriodDetail {
          contractLifecycleScheduleDetailId
          periodInterval
          periodType
          __typename
        }
        contractLifecycleScheduleId
        renewalOffsetDetail {
          contractLifecycleScheduleDetailId
          periodInterval
          periodType
          __typename
        }
        renewalType
        scheduleEnd
        terminationNoticeDetail {
          contractLifecycleScheduleDetailId
          periodInterval
          periodType
          __typename
        }
        __typename
      }
      mechanicalDeductions {
        adminFee
        adminType
        contractId
        contractMechanicalDeductionId
        mechanicalType
        territory
        __typename
      }
      oaContractId
      reserve {
        contractId
        contractReserveId
        installmentsInMonths
        reserveRate
        reserveReleaseOffsetInMonths
        __typename
      }
      runController {
        runControllerId
        runControllerName
        __typename
      }
      sapProfitCenter {
        referenceSapProfitCenterId
        profitCenter
        __typename
      }
      referenceSigningEntity {
        referenceSigningEntityId
        legalName
        referencePaymentEntity {
          referencePaymentEntityId
          __typename
        }
        __typename
      }
      summaryNote
      termEnd
      termStart
      __typename
    }
  }
`;