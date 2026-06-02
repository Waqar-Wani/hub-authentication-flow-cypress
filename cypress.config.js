const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://staging-auth.tiara.jewelry',
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 90000,
    viewportWidth: 1440,
    viewportHeight: 900,
    video: false,
    screenshotOnRunFailure: true,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    env: {
      merchant: 'Sneha K',
      users: {
        admin: {
          email: 'cypress.admin@irysgroup.com',
          password: 'teamwork'
        },
        owner: {
          email: 'cypress.owner@irysgroup.com',
          password: 'teamwork'
        },
        storeManager: {
          email: 'cypress.storemanager@irysgroup.com',
          password: 'teamwork'
        }
      },
      profiles: {
        primary: 'QA',
        secondary: 'QA2'
      },
      restrictedUrl: 'https://staging-hub.tiara.jewelry/management/roles'
    }
  }
});
