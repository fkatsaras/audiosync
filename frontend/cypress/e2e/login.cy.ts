describe('Login Page Tests', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/login');
    });

    it('should render the login form correctly', () => {
        cy.get('form#loginForm').should('exist');
        cy.get('input#username').should('exist').and('have.attr', 'placeholder', '');
        cy.get('input#password').should('exist').and('have.attr', 'placeholder', '');
        cy.get('button.login-button').should('exist').and('contain', 'Login');
    });

    it('should allow typing in the username and password fields', () => {
        cy.get('input#username')
            .type('testuser')
            .should('have.value', 'testuser');
        cy.get('input#password')
            .type('password123')
            .should('have.value', 'password123');
    });

    it('should display an error message on invalid credentials', () => {
        cy.intercept('POST', '/api/v1/users/login', {
            statusCode: 401,
            body: { message: 'Invalid username or password' },
        });

        cy.get('input#username').type('wronguser');
        cy.get('input#password').type('wrongpass');
        cy.get('form#loginForm').submit();

        cy.get('.error-message')
            .should('exist')
            .and('contain', 'Invalid username and password');
    });

    it('should redirect to the home page on successful login', () => {
        cy.intercept('POST', '/api/v1/users/login', {
            statusCode: 200,
            body: {
                body: {
                    token: 'mock-token'
                },
            },
        }).as('loginRequest');

        cy.get('input#username').type('testuser');
        cy.get('input#password').type('password123');
        cy.get('form#loginForm').submit();

        cy.url().should('include', '/home'); // Ensure user is redirected
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.equal('mock-token');
        });
    });

    it('should navigate to the Register page when "Register here" link is clicked', () => {
        cy.get('a').contains('Register here').click();
        cy.url().should('include', '/register');
    });

})