# Cypress Testing Setup

## Overview

This project now includes Cypress for end-to-end testing. Currently, tests are set up for the login page functionality.

## Running Tests

### Prerequisites

1. Make sure the development server is running:
   ```bash
   npm run dev
   ```
   The app should be accessible at `http://localhost:5173`

### Running Tests in Interactive Mode

```bash
npm run cypress:open
```

This opens the Cypress Test Runner where you can see and run tests interactively.

### Running Tests Headlessly

```bash
npm run cypress:run
```

This runs all tests in headless mode (useful for CI/CD).

### Running Tests Headlessly with More Control

```bash
npm run cypress:run:headless
```

## Current Tests

### Login Page Tests (`cypress/e2e/login.cy.js`)

These tests verify that the login page:

- ✅ Displays the word "Login"
- ✅ Has an email input field with proper attributes
- ✅ Has a password input field with proper attributes
- ✅ Contains a "Create one here" link to `/create_account`
- ✅ Contains a "Forgot your password?" link to `/forgot_password`
- ✅ Allows typing in both input fields
- ✅ Has all elements present together
- ✅ Successfully logs in with valid credentials
- ✅ Shows error message with invalid credentials
- ✅ Shows validation message when email field is empty
- ✅ Shows validation message when password field is empty
- ✅ Shows validation message when both fields are empty
- ✅ Clears validation message when field is filled

**Note for login testing**: You'll need to update the credentials in the test file with actual user accounts from your development database.

## Test Structure

- `cypress/e2e/` - Contains all end-to-end test files
- `cypress/support/` - Contains support files and custom commands
- `cypress.config.js` - Main Cypress configuration

## Custom Commands

- `cy.visitLogin()` - Navigates to the login page
- `cy.clearAuth()` - Clears authentication data from localStorage
- `cy.login(email, password)` - Fills in login form and submits

## Adding More Tests

To add more tests, create new `.cy.js` files in the `cypress/e2e/` directory following the existing pattern.
