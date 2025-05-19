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
        localStorage.setItem('user-name', result.name);
        localStorage.setItem('user-id', result.id);
        location.href = '/';
    }
    else {
        document.querySelector('#errorMessage').innerHTML = `Invalid email or password!`;
    }
}

function displayControls() {
    let isLogin = localStorage.getItem('isLogin');
    let linkLogin = document.getElementById('link-login');
    let linkUser = document.getElementById('link-user');

    let displayLogin = '';
    let displayUser = 'none';

    if (isLogin == 'true') {      //Khi đã đăng nhập tài khoản
        displayLogin = 'none';
        displayUser = '';
    }
    linkLogin.style.display = displayLogin;
    linkUser.style.display = displayUser;
}

function checkLogin() {
    displayControls();
    let userName = localStorage.getItem('user-name');
    document.querySelector('span#user-name').innerHTML = userName;
}

function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất tài khoản?')) {
        localStorage.clear();
        location.href = '/';
    };
}