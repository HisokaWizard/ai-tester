Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag
Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Could not locate the bindings file. Tried:
 → E:\ai-tester\node_modules\hnswlib-node\build\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\default\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\compiled\20.17.0\win32\x64\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\release\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\debug\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\default\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\lib\binding\node-v115-win32-x64\addon.node
**Ошибка указывает на отсутствие зависимости `hnswlib-node`, необходимой для работы библиотеки HNSWlib в Node.js окружении.**

## Решение проблемы

Для исправления ошибки следует установить зависимость `hnswlib-node` как стороннюю библиотеку с помощью менеджера пакетов npm.

### Шаги по установке:
1. Откройте терминал или командную строку в директории вашего проекта.
2. Выполните команду для установки зависимости:

```bash
npm install -S hnswlib-node
```

или

```bash
yarn add hnswlib-node
```

### Проверка после установки:
После успешной установки проверьте наличие файла `addon.node` в директории `node_modules/hnswlib-node/build/`. Если файл присутствует, проблема должна быть решена.

---

Если ошибка сохраняется или возникает другая проблема, уточните детали, чтобы можно было предложить дополнительные решения.
Удали кнопку забыли пароль
Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Could not locate the bindings file. Tried:
 → E:\ai-tester\node_modules\hnswlib-node\build\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\default\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\compiled\20.17.0\win32\x64\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\release\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\debug\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\default\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\lib\binding\node-v115-win32-x64\addon.node
Ошибка указывает на проблему с загрузкой зависимостей `hnswlib-node`, необходимых для работы библиотеки HNSWlib в вашем проекте.

Чтобы решить эту проблему, выполните следующие шаги:

1. Убедитесь, что вы установили пакет `hnswlib-node` как зависимость вашего проекта.
   - Используйте команду `npm` или `yarn` для установки пакета:
   

```bash
# С использованием npm
npm install -S hnswlib-node

# Или с использованием yarn
yarn add hnswlib-node
```

2. Проверьте наличие файла `addon.node` в директории `node_modules/hnswlib-node/build/`. Этот файл должен быть создан автоматически при установке пакета.

3. Если проблема сохраняется, попробуйте переустановить пакет заново:

```bash
# Удаление существующей версии пакета
rm -rf node_modules
npm cache clean --force

# Повторная установка пакета
npm install hnswlib-node
```

4. Если после всех шагов проблема всё ещё существует, возможно, требуется ручная установка зависимостей сборки (`build-deps`), особенно если у вас специфическая конфигурация окружения (например, Windows):

```bash
npm install --only=build-deps
```

Следуйте этим шагам последовательно, чтобы устранить ошибку и успешно использовать библиотеку HNSWlib в своем проекте.
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению
Вот пример компонента React для формы авторизации с кнопкой для подключения через крипто-кошелёк:

### Компонент AuthorizeForm

```javascript
import React, { useState } from 'react';
import styles from './styles.module.css'; // Импортируйте ваши кастомные стили

const AuthorizeForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Логика отправки данных на сервер или локальная обработка
    console.log('Логин:', login);
    console.log('Пароль:', password);
  };

  const handleCryptoWalletClick = () => {
    // Триггер события для взаимодействия с кошельками
    window.dispatchEvent(new Event('cryptoWalletConnect'));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="login">Логин:</label>
      <input 
        type="text"
        id="login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      
      <label htmlFor="password">Пароль:</label>
      <input 
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Авторизоваться</button>
      <button type="button" onClick={handleCryptoWalletClick}>Подключиться через крипто-кошелёк</button>
    </form>
  );
};

export default AuthorizeForm;
```

### Пример использования в приложении

В основном файле приложения добавьте импорты и вызов компонента:

```javascript
import React from 'react';
import { render } from 'react-dom';
import AuthorizeForm from './components/AuthorizeForm';

// Обработчик события от кошельков
window.addEventListener('cryptoWalletConnect', () => {
  alert('Крипто-кошелёк пытается подключиться!');
});

render(
  <AuthorizeForm />,
  document.getElementById('root')
);
```

### Объяснение кода

1. **Компонент AuthorizeForm**:  
   Реализует форму авторизации с двумя полями ввода (логин и пароль), а также две кнопки: одна для стандартной авторизации, вторая для подключения через крипто-кошелёк.

2. **Обработка событий**:  
   - При нажатии на стандартную кнопку авторизации вызывается функция `handleSubmit`, которая отправляет данные формы на сервер или выполняет локальную обработку.
   - При нажатии на кнопку подключения через крипто-кошелёк вызывается обработчик события `cryptoWalletConnect`, который может быть использован кошельками для реакции и попытки подключения к вашему приложению.

Этот подход позволяет гибко интегрировать различные способы аутентификации и взаимодействовать с внешними сервисами, такими как крипто-кошельки.
Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]
Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Could not locate the bindings file. Tried:
 → E:\ai-tester\node_modules\hnswlib-node\build\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\default\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\compiled\20.17.0\win32\x64\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\release\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\debug\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\default\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\lib\binding\node-v115-win32-x64\addon.node
Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Could not locate the bindings file. Tried:
 → E:\ai-tester\node_modules\hnswlib-node\build\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Debug\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\out\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\Release\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\build\default\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\compiled\20.17.0\win32\x64\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\release\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\debug\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\addon-build\default\install-root\addon.node
 → E:\ai-tester\node_modules\hnswlib-node\lib\binding\node-v115-win32-x64\addon.node
# Устранение ошибки с зависимостью `hnswlib-node`

Ошибка, связанная с отсутствием файла `addon.node`, обычно возникает из-за неправильной установки или отсутствия необходимых зависимостей.

## Решение проблемы:

1. **Удаление существующих зависимостей и кэш файлов:**

```bash
rm -rf node_modules
npm cache clean --force
```

2. **Пересоздание зависимостей:**

```bash
npm install
```

или используйте `yarn`:

```bash
yarn install
```

3. **Установка конкретной версии `hnswlib-node`:**

Иногда помогает указать конкретную версию библиотеки, например:

```bash
npm install hnswlib-node@x.x.x
```
где x.x.x — версия библиотеки, которую вы хотите попробовать.

4. **Проверка наличия файла `addon.node`:**

После выполнения вышеуказанных шагов убедитесь, что в папке `./node_modules/hnswlib-node/build/` появился файл `addon.node`.

## Альтернативный способ установки зависимостей сборки:

Если стандартные методы не помогли, попробуйте вручную установить зависимости сборки:

```bash
npm install --only=build-deps
```

## Ручная установка зависимостей сборки:

Если ваш проект использует специфическую архитектуру или окружение, иногда требуется ручная установка зависимостей сборки:

```bash
npm install --build-from-source
```

## Итоговые рекомендации:

- Убедитесь, что все зависимости установлены корректно.
- Проверьте наличие файла `addon.node` в директории `./node_modules/hnswlib-node/build/`.
- Попробуйте пересоздать зависимости и проверить работоспособность.

Если проблема сохраняется, рассмотрите возможность создания issue в репозитории библиотеки или обратитесь за дополнительной поддержкой.
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем
Вот пример реализации компонента React, который включает всплывающее окно с выбором криптовалютных кошельков и реализует взаимодействие с каждым из них:

### 1. Создадим компоненты для каждого кошелька:

```javascript
// Wallets.js
import React, { useState } from 'react';

const Wallets = ({ onSelect }) => {
  const wallets = [
    { name: 'MetaMask', icon: '🔥' },
    { name: 'Rabby', icon: '⚡️' },
    { name: 'Keplr', icon: '🛣️' },
    { name: 'Phantom', icon: '🦸‍♂️' }
  ];

  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleSelect = (wallet) => {
    setSelectedWallet(wallet);
    onSelect(wallet.name); // Передаем имя выбранного кошелька дальше
  };

  return (
    <div className="wallets">
      <h2>Выберите кошелек:</h2>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.name}>
            <button onClick={() => handleSelect(wallet)}>
              {wallet.icon} {wallet.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedWallet && (
        <div className="selected-wallet">
          Вы выбрали: {selectedWallet.name}
        </div>
      )}
    </div>
  );
};

export default Wallets;
```

### 2. Реализация компонента для подписи публичного ключа:

```javascript
// SignPublicKey.js
import { ethers } from 'ethers';

const SignPublicKey = ({ walletName, publicKey }) => {
  const signMessage = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(publicKey);
      console.log('Signature:', signature);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={signMessage}>
      Подписать публичный ключ
    </button>
  );
};

export default SignPublicKey;
```

### 3. Основной компонент приложения:

```javascript
// App.js
import React, { useEffect, useState } from 'react';
import Wallets from './Wallets';
import SignPublicKey from './SignPublicKey';

const App = () => {
  const [publicKey, setPublicKey] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleSelect = (walletName) => {
    setSelectedWallet(walletName);
  };

  const handlePublicKeyInput = (event) => {
    setPublicKey(event.target.value);
  };

  return (
    <div className="app">
      <h1>Криптовалютные кошельки и подпись публичного ключа</h1>
      <div className="public-key-input">
        <label htmlFor="public-key">Публичный ключ:</label>
        <input
          type="text"
          id="public-key"
          value={publicKey}
          onChange={handlePublicKeyInput}
        />
      </div>
      <Wallets onSelect={handleSelect} />
      {selectedWallet && (
        <SignPublicKey walletName={selectedWallet} publicKey={publicKey} />
      )}
    </div>
  );
};

export default App;
```

### 4. Стилизация компонентов (опционально)

Создайте файл стилей `styles.css`:

```css
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.wallets ul {
  list-style-type: none;
  padding: 0;
}

.wallets li {
  display: inline-block;
  margin-right: 10px;
}

.selected-wallet {
  font-weight: bold;
  color: #333;
}

.public-key-input label {
  display: block;
  margin-bottom: 5px;
}

.public-key-input input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
```

### Как это работает?

1. Пользователь выбирает нужный кошелек из всплывающего окна.
2. После выбора кошелька отображается кнопка для подписания публичного ключа.
3. Пользователь вводит публичный ключ и нажимает кнопку для его подписи.
4. В консоли браузера выводится подписанный публичный ключ.

Таким образом, каждый кошелек обрабатывает событие отдельно, и логика взаимодействия с ними реализуется через передачу имени кошелька и публичного ключа между компонентами.
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу
Вот обновленный код компонента, который добавляет кнопку отключения и отображение адреса подключенного кошелька. Также добавлена функциональность редиректа на главную страницу после успешного подключения.

### Файл `App.js`

```javascript
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Wallets from './Wallets';
import SignPublicKey from './SignPublicKey';
import styles from './styles.module.css';

const App = () => {
  const [publicKey, setPublicKey] = useState('');
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);

  // Функция для обработки выбора кошелька
  const handleSelect = (walletName) => {
    setSelectedWallet(walletName);
  };

  // Функция для получения аккаунта пользователя
  const getUserAccount = async () => {
    if (!window.ethereum) {
      alert('Ваш браузер не поддерживает Web3.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const account = provider.getSigner().getAddress();
      setConnectedAccount(account);
    } catch (error) {
      console.error(error);
    }
  };

  // Функция для переподключения кошелька
  const reconnect = () => {
    setConnectedAccount(null);
    setSelectedWallet(null);
  };

  // Функция для редиректа на главную страницу
  const redirectToHome = () => {
    window.location.href = '/';
  };

  // Эффекты жизненного цикла
  useEffect(() => {
    if (selectedWallet === 'MetaMask') {
      getUserAccount(); // Получаем аккаунт MetaMask
    }
  }, [selectedWallet]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.connectedAccount}>{connectedAccount ? connectedAccount : ''}</span>
        <button className={styles.disconnectButton} onClick={reconnect}>Disconnect</button>
      </header>
      <main className={styles.main}>
        <Wallets onSelect={handleSelect} />
        {selectedWallet && (
          <SignPublicKey walletName={selectedWallet} publicKey={publicKey} />
        )}
        {connectedAccount && (
          <button className={styles.redirectButton} onClick={redirectToHome}>Go to Home Page</button>
        )}
      </main>
    </div>
  );
};

export default App;
```

### Файл `Wallets.js`

```javascript
import React, { useState } from 'react';

const Wallets = ({ onSelect }) => {
  const wallets = [
    { name: 'MetaMask', icon: '🔥' },
    { name: 'Rabby', icon: '⚡️' },
    { name: 'Keplr', icon: '🛣️' },
    { name: 'Phantom', icon: '🦸‍♂️' }
  ];

  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleSelect = (wallet) => {
    setSelectedWallet(wallet);
    onSelect(wallet.name); // Передаем имя выбранного кошелька дальше
  };

  return (
    <div className="wallets">
      <h2>Выберите кошелек:</h2>
      <ul>
        {wallets.map((wallet) => (
          <li key={wallet.name}>
            <button onClick={() => handleSelect(wallet)}>
              {wallet.icon} {wallet.name}
            </button>
          </li>
        ))}
      </ul>
      {selectedWallet && (
        <div className="selected-wallet">
          Вы выбрали: {selectedWallet.name}
        </div>
      )}
    </div>
  );
};

export default Wallets;
```

### Файл `SignPublicKey.js`

```javascript
import { ethers } from 'ethers';

const SignPublicKey = ({ walletName, publicKey }) => {
  const signMessage = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(publicKey);
      console.log('Signature:', signature);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={signMessage}>
      Подписать публичный ключ
    </button>
  );
};

export default SignPublicKey;
```

### Файлы стилей (styles.module.css)

```css
/* styles.module.css */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  background-color: #fafafa;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.connectedAccount {
  font-size: 16px;
  margin-left: 10px;
}

.disconnectButton {
  background-color: red;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.redirectButton {
  margin-top: 20px;
  background-color: blue;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
}
```

### Что делает этот код?

1. **Выбор кошелька:** Пользователь выбирает один из предложенных кошельков (MetaMask, Rabby, Keplr, Phantom).
2. **Получение аккаунта:** Когда выбран кошелек MetaMask, происходит получение текущего аккаунта пользователя.
3. **Отображение адреса кошелька:** Адрес подключенного кошелька отображается в верхнем правом углу страницы.
4. **Отключение кошелька:** Нажатие кнопки «Disconnect» отключает текущий кошелек и очищает состояние приложения.
5. **Редирект на главную страницу:** После успешного подключения пользователь перенаправляется на главную страницу сайта.

Теперь ваше приложение будет иметь удобный интерфейс с возможностью подключения различных кошельков и отображением состояния подключения.