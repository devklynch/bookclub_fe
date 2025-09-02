describe("Login Page", () => {
  beforeEach(() => {
    // Clear any existing auth data
    cy.clearAuth();

    // Visit the login page
    cy.visitLogin();
  });

  it('should display the word "Login"', () => {
    // Check that the page contains the word "Login"
    cy.contains("Login").should("be.visible");

    // More specifically, check for the heading with Login text
    cy.get("h2").should("contain.text", "Login");
  });

  it("should have an email input field", () => {
    // Check for email input field
    cy.get('input[type="email"]').should("be.visible");

    // Check for email label
    cy.contains("label", "Email").should("be.visible");

    // Check placeholder text
    cy.get('input[type="email"]').should(
      "have.attr",
      "placeholder",
      "Enter your email"
    );

    // Verify it's required
    cy.get('input[type="email"]').should("have.attr", "required");
  });

  it("should have a password input field", () => {
    // Check for password input field
    cy.get('input[type="password"]').should("be.visible");

    // Check for password label
    cy.contains("label", "Password").should("be.visible");

    // Check placeholder text
    cy.get('input[type="password"]').should(
      "have.attr",
      "placeholder",
      "Enter your password"
    );

    // Verify it's required
    cy.get('input[type="password"]').should("have.attr", "required");
  });

  it("should have a link to create an account", () => {
    // Check for the "Create one here" link
    cy.contains("a", "Create one here").should("be.visible");

    // Verify the link has the correct href
    cy.contains("a", "Create one here").should(
      "have.attr",
      "href",
      "/create_account"
    );

    // Check the full text context
    cy.contains("Don't have an account?").should("be.visible");
  });

  it("should have a forgot password link", () => {
    // Check for the "Forgot your password?" link
    cy.contains("a", "Forgot your password?").should("be.visible");

    // Verify the link has the correct href
    cy.contains("a", "Forgot your password?").should(
      "have.attr",
      "href",
      "/forgot_password"
    );
  });

  it("should have all required elements together", () => {
    // Comprehensive test to ensure all elements are present
    cy.contains("Login").should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("a", "Create one here").should("be.visible");
    cy.contains("a", "Forgot your password?").should("be.visible");

    // Also check for the login button
    cy.get('button[type="submit"]')
      .should("be.visible")
      .should("contain.text", "Log In");
  });

  it("should allow typing in email and password fields", () => {
    // Test functionality of input fields
    const testEmail = "test@example.com";
    const testPassword = "testpassword123";

    cy.get('input[type="email"]')
      .type(testEmail)
      .should("have.value", testEmail);
    cy.get('input[type="password"]')
      .type(testPassword)
      .should("have.value", testPassword);
  });

  it("should successfully login with valid credentials", () => {
    // TODO: Replace these with actual credentials from your dev database
    const validEmail = "user1@bookclub.com"; // Replace with real user email
    const validPassword = "Password123"; // Replace with real user password

    // Fill in the login form
    cy.get('input[type="email"]').type(validEmail);
    cy.get('input[type="password"]').type(validPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify successful login by checking redirect to dashboard
    cy.url().should("include", "/dashboard");

    // Verify user is authenticated by checking localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.not.be.null;
      expect(win.localStorage.getItem("user")).to.not.be.null;
    });

    // Optional: Check for dashboard elements that confirm login
    cy.contains("☕ Booked & Busy 📚").should("be.visible");
  });

  it("should show error message with invalid credentials", () => {
    const invalidEmail = "invalid@example.com";
    const invalidPassword = "wrongpassword";

    // Fill in the login form with invalid credentials
    cy.get('input[type="email"]').type(invalidEmail);
    cy.get('input[type="password"]').type(invalidPassword);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Verify error message appears
    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain.text", "Invalid email or password");

    // Verify user remains on login page
    cy.url().should("not.include", "/dashboard");

    // Verify no authentication tokens are stored
    cy.window().then((win) => {
      expect(win.localStorage.getItem("token")).to.be.null;
      expect(win.localStorage.getItem("user")).to.be.null;
    });
  });

  it("should show validation message when email field is empty", () => {
    // Leave email field empty, fill password
    cy.get('input[type="password"]').type("somepassword");

    // Try to submit the form
    cy.get('button[type="submit"]').click();

    // Check that the email field shows the required validation message
    cy.get('input[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.contain(
        "Please fill out this field"
      );
    });

    // Verify we're still on the login page
    cy.url().should("not.include", "/dashboard");
  });

  it("should show validation message when password field is empty", () => {
    // Fill email field, leave password empty
    cy.get('input[type="email"]').type("test@example.com");

    // Try to submit the form
    cy.get('button[type="submit"]').click();

    // Check that the password field shows the required validation message
    cy.get('input[type="password"]').then(($input) => {
      expect($input[0].validationMessage).to.contain(
        "Please fill out this field"
      );
    });

    // Verify we're still on the login page
    cy.url().should("not.include", "/dashboard");
  });

  it("should show validation message when both fields are empty", () => {
    // Try to submit the form without filling any fields
    cy.get('button[type="submit"]').click();

    // Check that the email field (first required field) shows validation message
    cy.get('input[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.contain(
        "Please fill out this field"
      );
    });

    // Verify we're still on the login page
    cy.url().should("not.include", "/dashboard");
  });

  it("should clear validation message when field is filled", () => {
    // Try to submit with empty email first to trigger validation
    cy.get('input[type="password"]').type("somepassword");
    cy.get('button[type="submit"]').click();

    // Verify validation message exists
    cy.get('input[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.contain(
        "Please fill out this field"
      );
    });

    // Now fill the email field
    cy.get('input[type="email"]').type("test@example.com");

    // Check that validation message is cleared
    cy.get('input[type="email"]').then(($input) => {
      expect($input[0].validationMessage).to.equal("");
    });
  });
});
