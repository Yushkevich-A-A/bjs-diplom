'use strict'

const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();
const minute = 60000;

let messageSuccessfulDepositOfBalance = 'Пополнение баланса выполнено успешно';
let messageSuccessfulConvertationOfValuence = 'Конвертация валюты выполнена успешно';
let messageSuccessfulTransferOfValuence = 'Отправка денег другому пользователю выполнена успешно';
let messageSuccessfulAddUser = 'Пользователь успешно добавлен в список';
let messageSuccessfulRemovaleUser = 'Пользователь успешно удален из списка';


// функция вывода сообщения об успехе или ошибке и обновления данных

function managerMessagesAndReloadModule (objectData, message) {
    if (objectData.success) {
        setTimeout(() => resetCurrentUserDate(), 500);
        moneyManager.setMessage(objectData.success, message)
    } else {
        moneyManager.setMessage(objectData.success, objectData.error);
    }
}

// функция инициализация адресной книги

function managerListAddressBook(data, message) {
    if (data.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data.data);
        moneyManager.updateUsersList(data.data);
    }
    favoritesWidget.setMessage(data.success, message);
}

// Выход из учетной записи по кнопке выход

logoutButton.action = () => ApiConnector.logout(() => location.reload());

// Отображение данных профиля

let resetCurrentUserDate = () => {
    ApiConnector.current(objectProfileData => {
        ProfileWidget.showProfile(objectProfileData.data)
    });
};
resetCurrentUserDate();

// Обновление и отображение курса валют

ApiConnector.getStocks(objectData => {
    const getRates = () => {
        ratesBoard.clearTable();
        ratesBoard.fillTable(objectData.data);
    };
    getRates();
    setInterval(() => getRates(), minute);
});

// Операции с деньгами, пополнение баланса

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, objectData => {
        managerMessagesAndReloadModule(objectData, messageSuccessfulDepositOfBalance);
    });
};

// Конвертация валюты

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, objectData => {
        managerMessagesAndReloadModule(objectData, messageSuccessfulConvertationOfValuence);
    });
};

// Перевод валюты между пользователями

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, objectData => {
        managerMessagesAndReloadModule(objectData, messageSuccessfulTransferOfValuence);
    });
};

// Запрос начального списка избранного

ApiConnector.getFavorites(data => managerListAddressBook(data));

// Добавление пользователя в список избранных

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            managerListAddressBook(response, messageSuccessfulAddUser);
        } else {
            managerListAddressBook(response, response.error);
        }
    });
};

// Удаление пользователя из списка

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => managerListAddressBook(response, messageSuccessfulRemovaleUser));
}