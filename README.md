# 🚀 Hub Authentication Flow Automation

End-to-end automation testing suite built with **Cypress** for the Hub Web Application authentication module.

This project validates critical user authentication workflows including login, logout, forgot password functionality, role-based access control, and profile switching behavior.

---

## 📋 Assignment Overview

The objective of this project is to automate the authentication flow of the Hub Web Application and verify that users experience the correct behavior based on their role and selected profile.

The suite covers:

- ✅ Login & Logout
- ✅ Forgot Password
- ✅ Role-Based Access Control (RBAC)
- ✅ Profile Switching
- ✅ Session Persistence
- ✅ Authorization & Restricted Access

---

## 🛠 Tech Stack

| Tool | Purpose |
|--------|---------|
| Cypress | End-to-End Testing |
| JavaScript | Test Implementation |
| Mocha | Test Runner |
| Chai | Assertions |
| GitHub Actions *(optional)* | CI/CD Integration |

---

## 📂 Project Structure

```text
cypress/
├── e2e/
│   ├── login.cy.js
│   ├── forgot-password.cy.js
│   ├── role-based-login.cy.js
│   └── profile-switching.cy.js
│
├── fixtures/
│   └── testData.json
│
├── support/
│   ├── commands.js
│   └── e2e.js
│
├── screenshots/
├── videos/

cypress.config.js
package.json
README.md
```

---

## 🎯 Test Coverage

### 🔐 Login & Logout

- Successful login
- Invalid password validation
- Invalid email format validation
- Empty field validation
- Logout functionality
- Protected route access after logout
- Session persistence on page refresh

### 🔑 Forgot Password

- Forgot password navigation
- Empty email validation
- Registered email submission
- Password mismatch validation
- Weak password validation

### 👥 Role-Based Access

- Admin login
- Owner login
- Store Manager login
- Role-specific navigation visibility
- Restricted URL access validation
- Switching between user roles

### 🔄 Profile Switching

- Profile selector visibility
- Active profile validation
- Profile switching functionality
- Dashboard update verification
- Session persistence after profile change
- Profile persistence after browser refresh

---

## 🚦 Getting Started

### Clone Repository

```bash
git clone https://github.com/Waqar-Wani/hub-authentication-flow-cypress.git
cd hub-authentication-flow-cypress
```

### Install Dependencies

```bash
npm install
```

### Open Cypress Test Runner

```bash
npx cypress open
```

### Run Tests Headlessly

```bash
npx cypress run
```

---

## 📊 Test Design Approach

This framework follows:

- Page interaction through stable selectors
- Reusable commands for common actions
- Independent test execution
- Clear assertions based on expected business behavior
- Scalable structure for future test expansion

---

## ✅ Latest Test Results

**All tests passing!** ✨

| Spec File | Tests | Passing | Duration |
|-----------|-------|---------|----------|
| 01-login-logout.cy.js | 7 | 7 | 34s |
| 02-forgot-password.cy.js | 5 | 5 | 9s |
| 03-role-based-login.cy.js | 7 | 7 | 36s |
| 04-profile-switching.cy.js | 7 | 7 | 46s |
| **TOTAL** | **26** | **26** | **2m 6s** |

**Cypress**: 13.17.0 | **Browser**: Electron 118 (headless) | **Node**: v22.22.0

---

## ⚠️ Notes

The staging environment credentials used for testing are shared and were provided as part of the assignment.

No user data, passwords, or application configuration were modified during test execution.

---

## 📈 Future Enhancements

- CI/CD integration with GitHub Actions
- Cypress Dashboard reporting
- Allure reporting
- Cross-browser execution
- API interception and validation
- Data-driven testing

---

## 👨‍💻 Author

**Waqar Wani**

QA Automation Engineer

- GitHub: https://github.com/Waqar-Wani
- LinkedIn: *(Add your LinkedIn profile here)*

---

⭐ If you found this project useful, feel free to star the repository.
