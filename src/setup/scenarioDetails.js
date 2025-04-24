export function createBackendScenario(exec) {
  return {
    exec,
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: __ENV.K6_BACKEND_STAGE_1_DURATION, target: parseInt(__ENV.K6_BACKEND_STAGE_1_VUS) },
      { duration: __ENV.K6_BACKEND_STAGE_2_DURATION, target: parseInt(__ENV.K6_BACKEND_STAGE_2_VUS) },
    ],
  }
}

export function createFrontendScenario(exec) {
  return {
    exec,
    executor: 'constant-vus',
    vus: __ENV.K6_FRONTEND_VUS,
    startTime: __ENV.K6_FRONTEND_START_TIME,
    duration: __ENV.K6_FRONTEND_DURATION,
    options: {
      browser: {
        type: 'chromium',
      },
    },
  }
}
