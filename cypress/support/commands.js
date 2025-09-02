// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to visit login page
Cypress.Commands.add("visitLogin", () => {
  cy.visit("/");
});

// Custom command to clear localStorage
Cypress.Commands.add("clearAuth", () => {
  cy.window().then((win) => {
    win.localStorage.removeItem("token");
    win.localStorage.removeItem("user");
  });
});

// Custom command to login with credentials
Cypress.Commands.add("login", (email, password) => {
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});
