document.getElementById('logoutLink').addEventListener('click', function(e) {
    e.preventDefault();
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application-json'
        }
    }).then(response => {
        if (response.status === 200) {
            window.location.href = '/login';
        } else {
            console.error('Logout failed');
        }
    })
})