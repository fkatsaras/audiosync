document.getElementById('loginForm').addEventListener('submit', async function(e) {
    console.log('D> JavaScript is linked and running!');
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    });

    console.log('D> Starting login process...');

    if (response.status === 200) {
        const data = await response.json();
        console.log('D> Login successful, storing token...');
        localStorage.setItem('token', data.token);  // Store the token
        console.log('D> Token stored:', data.token);
        console.log('D> Redirecting to /home...');
        window.location.href = '/home';  // Redirect to the home page
    } else {
        console.log('D> Login failed');
        const data = await response.json();
        console.log(data.message || 'D> Login failed');
        alert('Login failed. Please check your credentials.');
    }
});