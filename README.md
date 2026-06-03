# Tiara Auth Flow Automation

End-to-end automation suite built with Cypress for the Tiara Hub authentication flow.

This project validates the core user journeys around authentication, authorization, role-aware access, and admin profile switching against the staging environment.

---

## Overview

The suite automates and verifies:

- Login and Logout
- Forgot Password
- Role-Based Access Control
- Profile Switching
- Session Persistence
- Restricted Access Validation

Latest verified status:

- `26/26` tests passing
- `4/4` specs passing

---

## Target Environment

| Area | URL |
|---|---|
| Auth app | `https://staging-auth.tiara.jewelry` |
| Hub app | `https://staging-hub.tiara.jewelry` |

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Cypress `13.17.0` | End-to-end testing |
| JavaScript | Test implementation |
| Mocha | Test runner |
| Chai | Assertions |
| Node.js | Execution environment |

---

## Highlights

- Reusable Cypress commands for login, logout, and profile switching
- Shared fixture-driven role and profile data
- Role-aware assertions for access validation
- HTML metrics reporting with JSON artifacts
- Browser-printable report page that can be saved as PDF

---

## Project Structure

```text
.
├── cypress.config.js
├── cypress/
│   ├── e2e/
│   │   ├── 01-login-logout.cy.js
│   │   ├── 02-forgot-password.cy.js
│   │   ├── 03-role-based-login.cy.js
│   │   └── 04-profile-switching.cy.js
│   ├── fixtures/
│   │   └── testData.json
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── scripts/
│   ├── cypress.js
│   └── cypress-report.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Test Coverage

### Login and Logout

- Successful login
- Wrong password validation
- Invalid email validation
- Empty form validation
- Logout flow
- Protected route redirect after logout
- Session persistence on refresh

### Forgot Password

- Forgot password navigation
- Empty email validation
- Registered email confirmation
- Password mismatch validation
- Weak password validation

### Role-Based Access

- Admin dashboard validation
- Owner dashboard validation
- Store manager dashboard validation
- Role-specific navigation visibility
- Restricted URL validation
- Switching between roles

### Profile Switching

- Profile switcher visibility
- Active profile validation
- Switching from `QA` to `QA2`
- Dashboard update after switch
- Switching back to `QA`
- Refresh persistence after profile change

---

## Installation

Install dependencies:

```bash
npm install
```

If the Cypress binary is missing:

```bash
npx cypress install
npx cypress verify
```

If macOS blocks the local Cypress launcher:

```bash
chmod +x node_modules/.bin/cypress
chmod +x node_modules/cypress/bin/cypress
```

---

## Running the Tests

Open Cypress UI:

```bash
npm run cy:open
```

Run the full suite headlessly:

```bash
npm run cy:run
```

Run a single spec:

```bash
npm run cy:run -- --spec "cypress/e2e/01-login-logout.cy.js"
```

---

## Reporting

This repo includes a built-in report generator.

Generate an HTML metrics report:

```bash
npm run cy:report
```

Generate a report for one spec:

```bash
npm run cy:report -- --spec "cypress/e2e/02-forgot-password.cy.js"
```

Generated outputs:

- `reports/latest/index.html`
- `reports/latest/results.json`
- `reports/latest/summary.json`

Open `reports/latest/index.html` in a browser and save it as PDF from the print dialog if needed.

---

## Latest Test Results

Latest full-suite verification:

| Spec File | Tests | Passing |
|---|---:|---:|
| `01-login-logout.cy.js` | 7 | 7 |
| `02-forgot-password.cy.js` | 5 | 5 |
| `03-role-based-login.cy.js` | 7 | 7 |
| `04-profile-switching.cy.js` | 7 | 7 |
| **TOTAL** | **26** | **26** |

Environment from latest successful run:

- **Cypress**: `13.17.0`
- **Browser**: `Electron 118 (headless)`

---

## Notes

- The suite is built around the current staging implementation and shared assignment credentials.
- Forgot-password coverage is UI-level only and does not automate mailbox retrieval or actual password reset completion.
- The tests avoid mutating shared staging data beyond the minimum state changes required by the assignment flow.

---

## Future Enhancements

- CI integration with GitHub Actions
- Cypress Dashboard integration
- Richer historical reporting
- API-level validation alongside UI assertions
- Data-driven expansion for more role/profile combinations

---

## Author

Waqar Wani
