# AmoCRM Account

NodeJS библиотека для программного создания и получения списка аккаунтов AmoCRM.

Данный проект является экспериментальным и не рекомендуется для использования в production.


## Установка

Yarn:

```bash
yarn add --dev amocrm-account
```

npm:

```bash
npm i -D amocrm-account
```

## Использование

### Создание клиента

```javascript
import { Client } from 'amocrm-account';

const client = new Client({
    domain: 'amocrm.ru', // необязательный параметр, домен amocrm, по умолчанию amocrm.ru
    auth: {
        username: 'AmoCRM email',
        password: 'AmoCRM password'
    },
    session: '/home/amocrm/session.txt' // путь к файлу сессии. Хранит cookies авторизации
})
```

### Получение списка аккаунтов
```javascript
const accounts = await client.getAccounts(); // массив текущих аккаунтов, к которым пользователь имеет доступ
```

### Проверка аккаунта на существование

```javascript
// проверит, доступен ли для создания портал my-account.amocrm.ru
const result = await client.isAccountAvailable('my-account'); // false/true
```

### Создание аккаунта

```javascript
const result = await client.createAccount({
    subdomain: 'subdomain', // в итоге будет subdomain.amocrm.ru
    account_name: 'Account name' // имя аккаунта
});
```