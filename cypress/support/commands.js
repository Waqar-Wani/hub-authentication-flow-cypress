const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const fieldSelector = (name) => [
  `[data-cy="${name}"]`,
  `[data-testid="${name}"]`,
  `[name="${name}"]`,
  `#${name}`,
  `input[type="${name}"]`,
  `input[autocomplete="${name}"]`
].join(',');

const submitSelector = [
  '[data-cy="login-submit"]',
  '[data-testid="login-submit"]',
  'button[type="submit"]',
  'input[type="submit"]'
].join(',');

Cypress.Commands.add('getBySel', (selector) => {
  return cy.get(`[data-cy="${selector}"], [data-testid="${selector}"]`);
});

Cypress.Commands.add('fillEmail', (email) => {
  cy.get(fieldSelector('email')).first().clear().type(email, { log: false });
});

Cypress.Commands.add('fillPassword', (password) => {
  cy.get(fieldSelector('password')).first().clear().type(password, { log: false });
});

Cypress.Commands.add('submitAuthForm', () => {
  cy.get(submitSelector).filter(':visible').first().click();
});

Cypress.Commands.add('visitLogin', () => {
  cy.visit('/');
  cy.location('pathname', { timeout: 30000 }).should('match', /login|signin|auth|^\/$/i);
});

Cypress.Commands.add('login', (role = 'admin') => {
  const user = Cypress.env('users')[role];

  cy.intercept('POST', '/api/signin').as('signin');
  cy.visitLogin();
  cy.fillEmail(user.email);
  cy.fillPassword(user.password);
  cy.submitAuthForm();

  cy.wait('@signin').then(({ response }) => {
    expect(response?.statusCode).to.eq(200);
    const body = response.body;
    Cypress.env('lastSignin', body);

    if (body.signedIn) {
      if (body.redirectTo) {
        cy.visit(body.redirectTo);
      }
      return;
    }

    expect(body.user, 'signin user payload').to.exist;
    expect(body.accessToken, 'signin access token').to.exist;

    const merchantName = Cypress.env('merchant');
    const profileName = Cypress.env('profiles').primary;
    const merchant = body.user.merchant.find((item) => item.id === merchantName) || body.user.merchant[0];
    const profile = merchant.profile.find((item) => item.name === profileName) || merchant.profile[0];
    const store = profile.stores?.[0];

    cy.request('POST', '/api/updateMPS', {
      merchantID: merchant.id,
      profile: profile.name,
      sid: store?.code || '',
      accessToken: body.accessToken
    }).then(({ body: updateBody }) => {
      if (updateBody.redirectTo) {
        cy.visit(updateBody.redirectTo);
      }
    });
  }).then(() => {
    cy.assertDashboardVisible();
  });
});

Cypress.Commands.add('sessionLogin', (role = 'admin') => {
  const user = Cypress.env('users')[role];

  cy.session(
    [role, user.email],
    () => {
      cy.login(role);
    },
    {
      validate() {
        cy.visit('/');
        cy.assertDashboardVisible();
      }
    }
  );
});

Cypress.Commands.add('assertDashboardVisible', () => {
  cy.location('pathname', { timeout: 30000 }).should('not.match', /login|signin/i);
  cy.get('body').should('be.visible');
  cy.get('body', { timeout: 30000 }).should(($body) => {
    expect($body.text().toLowerCase()).to.match(/dashboard|overview|orders|sales|inventory|customers|catalog|appointments|analytics|reports|karigar|metal/i);
  });
});

Cypress.Commands.add('completeMerchantSelection', () => {
  const merchant = Cypress.env('merchant');
  const primaryProfile = Cypress.env('profiles').primary;

  return cy.get('body', { timeout: 30000 }).then(($body) => {
    if (!$body.text().match(/proceed to login/i)) {
      return;
    }

    const merchantSelect = $body.find('select').filter((_, el) => el.innerText.includes('Select Merchant')).eq(0);
    const profileSelect = $body.find('select').filter((_, el) => el.innerText.includes('Select Profile')).eq(0);

    if (merchantSelect.length) {
      cy.wrap(merchantSelect).select(merchant, { force: true });
    }

    if (profileSelect.length) {
      cy.wrap(profileSelect).select(primaryProfile, { force: true });
    }

    return cy.get('form').submit().then(() => {
      cy.contains('button[type="submit"]', /proceed to login/i, { timeout: 30000 }).should('not.exist');
    });
  });
});

Cypress.Commands.add('assertLoginVisible', () => {
  cy.location('pathname', { timeout: 30000 }).should('match', /login|signin|auth|^\/$/i);
  cy.get(fieldSelector('email')).should('be.visible');
  cy.get(fieldSelector('password')).should('be.visible');
});

Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    const directLogout = $body.find('[data-cy="logout"], [data-testid="logout"], button:contains("Logout"), a:contains("Logout"), button:contains("Sign out"), a:contains("Sign out")');

    if (directLogout.length) {
      cy.wrap(directLogout.first()).click({ force: true });
      return;
    }

    cy.contains('header div, header span, header button', Cypress.env('merchant'))
      .should('be.visible')
      .click({ force: true });
    cy.contains('button, a, [role="menuitem"]', /log ?out|sign ?out/i).click({ force: true });
  });
});

Cypress.Commands.add('openForgotPassword', () => {
  cy.contains('a,button', /forgot password|reset password/i).click();
  cy.contains(/forgot password|password reset|reset password|recover password/i, { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('assertFieldError', (messagePattern = /required|invalid|valid|match|weak|short/i) => {
  cy.contains(messagePattern, { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('assertNavItem', (label, shouldBeVisible = true) => {
  const navPattern = new RegExp(escapeRegExp(label), 'i');

  if (shouldBeVisible) {
    cy.contains('nav a, nav button, aside a, aside button, [role="navigation"] a, [role="navigation"] button', navPattern).should('be.visible');
  } else {
    cy.contains('nav a, nav button, aside a, aside button, [role="navigation"] a, [role="navigation"] button', navPattern).should('not.exist');
  }
});

Cypress.Commands.add('openProfileSwitcher', () => {
  cy.get('body').then(($body) => {
    const switcher = $body.find('[data-cy="profile-switcher"], [data-testid="profile-switcher"]');

    if (switcher.length) {
      cy.wrap(switcher.first()).click({ force: true });
      return;
    }

    cy.contains('header div, header span', Cypress.env('merchant')).click({ force: true });
  });
  cy.contains(/quick account switch|quick switch|quick view/i, { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('switchProfile', (profileName) => {
  const admin = Cypress.env('users').admin;
  const udid = `cypress-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  cy.request('POST', 'https://staging-auth.tiara.jewelry/api/signin', {
    email: admin.email,
    password: admin.password,
    udid
  }).then(({ body: signin }) => {
    expect(signin?.accessToken, 'fresh signin access token').to.exist;

    const merchantName = Cypress.env('merchant');
    const merchant = signin.user.merchant.find((item) => item.id === merchantName) || signin.user.merchant[0];
    const profile = merchant.profile.find((item) => item.name === profileName);

    expect(profile, `profile ${profileName}`).to.exist;

    cy.request('POST', 'https://staging-auth.tiara.jewelry/api/updateMPS', {
      merchantID: merchant.id,
      profile: profile.name,
      sid: profile.stores?.[0]?.code || '',
      accessToken: signin.accessToken
    }).then(({ body }) => {
      if (body.redirectTo) {
        cy.visit(body.redirectTo);
      } else {
        cy.visit('https://staging-hub.tiara.jewelry/');
      }
    });
  });
  cy.contains('header span, header div', profileName, { timeout: 30000 }).should('be.visible');
});
