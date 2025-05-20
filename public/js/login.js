async function userLogin(e) {
    e.preventDefault();
    let user = {
        "email": document.getElementById('user-email').value,
        "password": document.getElementById('user-password').value
    };
    let id = 'users/login';
    let address = `http://localhost:3000/${id}`;
    let res = await fetch(address,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }
    )
    let result = await res.json();
    if (result.isUser) {
        localStorage.clear();
        localStorage.setItem('isLogin', true);
        location.href = '/';
    }
    else {
        document.querySelector('#errorMessage').innerHTML = `Invalid email or password!`;
    }
};

function logout() {
    if (confirm('Are you sure you want to log out?')) {
        location.href = '/users/logout';
    };
};