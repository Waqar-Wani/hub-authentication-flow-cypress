describe('Section 4 - Profile Switching', () => {
  const profiles = () => Cypress.env('profiles');

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.login('admin');
  });

  it('20. profile switcher is visible after login', () => {
    cy.openProfileSwitcher();
    cy.contains(profiles().primary).should('be.visible');
    cy.get('[role="combobox"]').eq(1).should('be.visible');
    cy.then(() => {
      const signin = Cypress.env('lastSignin');
      const merchant = signin.user.merchant.find((item) => item.id === Cypress.env('merchant')) || signin.user.merchant[0];
      expect(merchant.profile.map((profile) => profile.name)).to.include(profiles().secondary);
    });
  });

  it('21. current profile name QA is displayed after login', () => {
    cy.contains(profiles().primary, { timeout: 30000 }).should('be.visible');
  });

  it('22. switches from QA to QA2 and reloads with QA2 selected', () => {
    cy.switchProfile(profiles().secondary);
    cy.contains(profiles().secondary, { timeout: 30000 }).should('be.visible');
  });

  it('23. profile name updates from QA to QA2 after switching', () => {
    cy.contains(profiles().primary, { timeout: 30000 }).should('be.visible');
    cy.switchProfile(profiles().secondary);
    cy.contains(profiles().secondary, { timeout: 30000 }).should('be.visible');
  });

  it('24. dashboard content changes after profile switch', () => {
    cy.contains(profiles().primary, { timeout: 30000 }).should('be.visible');
    cy.get('main, [role="main"], body').first().invoke('text').then((qaText) => {
      cy.switchProfile(profiles().secondary);
      cy.get('main, [role="main"], body').first().invoke('text').should((qa2Text) => {
        expect(qa2Text.trim()).to.not.equal(qaText.trim());
      });
    });
  });

  it('25. switches back from QA2 to QA and restores QA dashboard data', () => {
    cy.switchProfile(profiles().secondary);
    cy.switchProfile(profiles().primary);
    cy.contains('header span, header div', profiles().primary, { timeout: 30000 }).should('be.visible');
    cy.assertDashboardVisible();
  });

  it('26. refreshing after profile switch keeps QA2 active', () => {
    cy.switchProfile(profiles().secondary);
    cy.reload();
    cy.contains(profiles().secondary, { timeout: 30000 }).should('be.visible');
  });
});
