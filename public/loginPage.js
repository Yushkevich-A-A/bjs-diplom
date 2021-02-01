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

