# GraphQL Performance Testing with k6

This project is designed to test the performance of GraphQL APIs and frontend page loads using the k6 performance testing tool. It includes scripts for backend GraphQL requests and frontend page visits, with metrics tracking for trends, failures, and successes.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Project Overview
The project includes:
- Backend GraphQL API performance testing.
- Frontend page load testing with Puppeteer.
- Metrics tracking for request durations, failures, and successes.

## Technologies Used
- **Languages**: JavaScript, TypeScript
- **Tools**: k6, Puppeteer
- **Package Manager**: npm

## Setup
1. Clone the repository

2. Install dependencies:
   ```bash
   npm install
   ``` 
3. Ensure you have k6 installed. You can download it from the [k6 website](https://k6.io/docs/getting-started/installation/).

4. Create a `.env` file in the root directory and set the required environment variables from .env.shadow.

5. Add a src/variables/user-data.json file using the user-data.shadow.json as a template.

## Usage
Run the tests with make e.g:

    make run_k6_test TEST_FILE=abacus/contract-page-test.js
    