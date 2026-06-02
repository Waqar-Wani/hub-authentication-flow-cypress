describe('Section 1 - Login & Logout', () => {
  const user = () => Cypress.env('users').admin;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('1. successful login with valid credentials redirects to the Hub dashboard', () => {
    cy.login('admin');
  });

  it('2. login with wrong password shows an error and stays on login page', () => {
    cy.visitLogin();
    cy.fillEmail(user().email);
    cy.fillPassword('wrong-password');
    cy.submitAuthForm();

    cy.assertLoginVisible();
    cy.assertFieldError(/invalid|incorrect|wrong|failed|email|password/i);
  });

  it('3. login with invalid email format shows email validation', () => {
    cy.visitLogin();
    cy.fillEmail('not-an-email');
    cy.fillPassword(user().password);
    cy.submitAuthForm();

    cy.assertLoginVisible();
    cy.assertFieldError(/valid email|invalid email|email/i);
  });

  it('4. submitting the empty login form shows required field errors', () => {
    cy.visitLogin();
    cy.submitAuthForm();

    cy.assertLoginVisible();
    cy.assertFieldError(/required|email/i);
    cy.assertFieldError(/required|password/i);
  });

  it('5. user logs out and is redirected back to login page', () => {
    cy.login('admin');
    cy.logout();
    cy.assertLoginVisible();
  });

  it('6. accessing Hub directly after logout redirects to login page', () => {
    cy.login('admin');
    cy.logout();
    cy.visit('/');
    cy.assertLoginVisible();
  });

  it('7. refreshing while logged in keeps the dashboard visible', () => {
    cy.login('admin');
    cy.reload();
    cy.assertDashboardVisible();
  });
});
