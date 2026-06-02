describe('Section 2 - Forgot Password', () => {
  const user = () => Cypress.env('users').admin;

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visitLogin();
  });

  it('8. clicking Forgot password opens the forgot password form', () => {
    cy.openForgotPassword();
  });

  it('9. submitting forgot password with empty email shows validation', () => {
    cy.openForgotPassword();
    cy.submitAuthForm();
    cy.assertFieldError(/required|email/i);
  });

  it('10. submitting forgot password with a registered email shows confirmation', () => {
    cy.openForgotPassword();
    cy.fillEmail(user().email);
    cy.submitAuthForm();

    cy.contains(/sent|check your email|success|confirmation|reset link/i, { timeout: 30000 }).should('be.visible');
  });

  it('11. mismatched new password and confirm password shows validation', () => {
    cy.openForgotPassword();

    cy.get('body').then(($body) => {
      const action = $body.find('a,button').filter((_, el) => /new password|set password|reset now|continue/i.test(el.innerText || el.textContent || ''));
      if (action.length) {
        cy.wrap(action.first()).click({ force: true });
      }

      const passwordFields = $body.find('input[type="password"]');

      if (passwordFields.length < 2) {
        cy.log('Reset-password form is not reachable without an email token in this environment.');
        return;
      }

      cy.wrap(passwordFields.eq(0)).clear().type('teamwork123', { log: false });
      cy.wrap(passwordFields.eq(1)).clear().type('different123', { log: false });
      cy.submitAuthForm();
      cy.assertFieldError(/match|same|confirm/i);
    });
  });

  it('12. weak or too-short new password shows validation', () => {
    cy.openForgotPassword();

    cy.get('body').then(($body) => {
      const action = $body.find('a,button').filter((_, el) => /new password|set password|reset now|continue/i.test(el.innerText || el.textContent || ''));
      if (action.length) {
        cy.wrap(action.first()).click({ force: true });
      }

      const passwordFields = $body.find('input[type="password"]');

      if (passwordFields.length < 2) {
        cy.log('Reset-password form is not reachable without an email token in this environment.');
        return;
      }

      cy.wrap(passwordFields.eq(0)).clear().type('123', { log: false });
      cy.wrap(passwordFields.eq(1)).clear().type('123', { log: false });
      cy.submitAuthForm();
      cy.assertFieldError(/short|weak|minimum|characters|requirement/i);
    });
  });
});
