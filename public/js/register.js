function checkPasswordConfirm(formId) {
    let password = document.querySelector(`#${formId} [name=password]`);
    let passwordConfirm = document.querySelector(`#${formId} [name=confirmPassword]`);
    if (password.value != passwordConfirm.value) {
        passwordConfirm.setCustomValidity('Xác nhận mật khẩu không trùng khớp!');
        passwordConfirm.reportValidity();
    }
    else {
        passwordConfirm.setCustomValidity('');
    }
}

async function userRegister(e) {
    e.preventDefault();
    let user = {
        "name": document.querySelector('#registerForm [name=name]').value,
        "email": document.querySelector('#registerForm [name=email]').value,
        "password": document.querySelector('#registerForm [name=password]').value,
        "confirmPassword": document.querySelector('#registerForm [name=confirmPassword]').value
    };
    let id = 'users/register';
    let address = `http://localhost:3000/${id}`;
    let res = await fetch(address,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }
    );
    let result = await res.json();
    if (result.isUser) {
        let message = `<div class='horizontal-center'><h4>Tạo tài khoản thành công. <a href="/login" style="color:red; text-decoration: none;">Đăng nhập</a> ngay với tài khoản mới!</h4></div>`
        document.querySelector('#register').innerHTML = message;
    }
    else {
        document.querySelector('#errorMessage').innerHTML = `Tài khoản người dùng đã tồn tại!`;
    }
}