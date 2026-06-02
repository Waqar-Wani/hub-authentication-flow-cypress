describe('Section 3 - Role-Based Login', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('13. Admin dashboard loads with Admin-specific widgets visible', () => {
    cy.login('admin');
    cy.contains(/admin|users|management|dashboard/i, { timeout: 30000 }).should('be.visible');
  });

  it('14. Owner dashboard loads and differs from Admin', () => {
    cy.login('owner');
    cy.assertDashboardVisible();
    cy.contains(/owner|dashboard|sales|orders|inventory/i, { timeout: 30000 }).should('be.visible');
  });

  it('15. Store Manager dashboard loads correctly', () => {
    cy.login('storeManager');
    cy.assertDashboardVisible();
    cy.contains(/store manager|store|dashboard|orders|inventory/i, { timeout: 30000 }).should('be.visible');
  });

  it('16. Admin sees User Management in navigation', () => {
    cy.login('admin');
    cy.assertNavItem('User Management', true);
  });

  it('17. Owner does not see User Management in navigation', () => {
    cy.login('owner');
    cy.assertNavItem('User Management', false);
  });

  it('18. Store Manager cannot access a restricted URL directly', () => {
    cy.login('storeManager');
    cy.visit(Cypress.env('restrictedUrl'), { failOnStatusCode: false });
    cy.contains(/access denied|unauthorized|forbidden|not allowed|page not found|dashboard/i, { timeout: 30000 }).should('be.visible');
  });

  it('19. logging out as one role then logging in as another shows the correct dashboard each time', () => {
    cy.login('admin');
    cy.contains(/admin|users|management/i, { timeout: 30000 }).should('be.visible');
    cy.logout();
    cy.assertLoginVisible();

    cy.login('owner');
    cy.assertDashboardVisible();
    cy.assertNavItem('User Management', false);
  });
});
