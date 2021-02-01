'use strict'

const userForm = new UserForm();

//аутентификация при входе на сайт

userForm.loginFormCallback = data => ApiConnector.login(data, response => {
    if (response.success){
        location.reload();
    } else {
        userForm.setLoginErrorMessage(response.error);
    }
});

//регистрация на сайте

userForm.registerFormCallback = data => ApiConnector.register(data, response => {
    if (response.success){
        location.reload();
    } else {
        userForm.setRegisterErrorMessage(response.error);
    }
});