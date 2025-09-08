Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag

Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from /Users/hisokawizard/Projects/ai-tester/node_modules/@langchain/community/dist/vectorstores/hnswlib.js
К сожалению, возникла проблема при попытке получить примеры стилей для React-компонента формы авторизации через систему поиска RAG (Retrieval-Augmented Generation). 

Тем не менее, я могу предоставить вам пример реализации компонента формы авторизации без использования конкретных стилей из базы данных:

```javascript
import React, { useState } from "react";
import "./LoginForm.css"; // Подключите ваш файл CSS

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { login, password });
    // Здесь можно добавить логику отправки данных на сервер или другие действия
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="submit-button">
          Войти
        </button>
        <a href="/forgot-password" className="forgot-link">
          Забыли пароль?
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Пример файла стилей (`LoginForm.css`):

```css
.login-form-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form-container label,
.login-form-container input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.submit-button:hover {
  background-color: #0056b3;
}

.forgot-link {
  text-decoration: underline;
  color: #007bff;
  float: right;
  margin-top: -15px;
}

.forgot-link:hover {
  color: #0056b3;
}
```

Этот пример демонстрирует базовую структуру формы авторизации с использованием React Hooks и простейшими стилями. Если у вас есть конкретные требования к стилю или функционалу — сообщите мне!
Удали кнопку забыли пароль

Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from /Users/hisokawizard/Projects/ai-tester/node_modules/@langchain/community/dist/vectorstores/hnswlib.js
Вот обновлённый вариант компонента формы авторизации без кнопки «Забыли пароль»:

```jsx
import React, { useState } from "react";
import "./LoginForm.css"; // Подключите ваш файл CSS

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { login, password });
    // Логика обработки данных после успешной отправки формы
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="submit-button">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Файл стилей (`LoginForm.css`) остался прежним за исключением удаления ссылки на забытый пароль:

```css
.login-form-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form-container label,
.login-form-container input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
}

.submit-button:hover {
  background-color: #0056b3;
}
```

Теперь форма выглядит так же, но уже без ссылки на восстановление пароля.
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению

Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from /Users/hisokawizard/Projects/ai-tester/node_modules/@langchain/community/dist/vectorstores/hnswlib.js
Давайте добавим возможность авторизоваться через криптокошелёк. Для этого мы создадим отдельную кнопку, которая будет вызывать событие подключения кошелька. Обычно это реализуется через JavaScript API популярных криптовалютных кошельков вроде MetaMask или WalletConnect.

Пример ниже предполагает использование **MetaMask** как основного провайдера кошелька Ethereum. При нажатии на кнопку будет вызываться метод `window.ethereum.request({ method: 'eth_requestAccounts' })`, который инициирует запрос доступа к аккаунтам пользователя.

## Компонент формы авторизации с кнопкой входа через криптокошелек:

```jsx
import React, { useState } from "react";
import "./LoginForm.css"; // Подключите ваш файл CSS

// Проверяем наличие Web3 провайдера (например, MetaMask)
if (!window.ethereum) {
  alert('Пожалуйста установите расширение MetaMask.');
}

const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { login, password });
    // Логика обработки данных после успешной отправки формы
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Подключение успешно!');
      } else {
        alert('Не удалось найти кошелек');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Логин:</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="submit-button">
          Войти
        </button>
        <button type="button" className="wallet-button" onClick={connectWallet}>
          Авторизация через Crypto Кошелёк
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Стили (`LoginForm.css`)

```css
.login-form-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form-container label,
.login-form-container input {
  display: block;
  width: 100%;
  margin-bottom: 15px;
}

.submit-button,
.wallet-button {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  display: inline-block; /* чтобы кнопки были рядом */
  margin-right: 10px;
}

.submit-button:hover,
.wallet-button:hover {
  background-color: #0056b3;
}
```

### Что происходит при клике на кнопку "Авторизация через Crypto Кошелёк":

Когда пользователь нажимает на кнопку, запускается функция `connectWallet`. Она вызывает метод `window.ethereum.request({ method: 'eth_requestAccounts' })`, что приводит к тому, что MetaMask запрашивает разрешение на доступ к вашему адресу Ethereum. После успешного разрешения вы можете использовать этот адрес для аутентификации пользователя.

Если у вас другой кошелёк (например, Trust Wallet), логика аналогична, просто используйте его API вместо MetaMask.

Таким образом, теперь ваша форма включает стандартную регистрацию через логин и пароль, а также дополнительную опцию авторизации через криптокошелёк.
Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]

Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from /Users/hisokawizard/Projects/ai-tester/node_modules/@langchain/community/dist/vectorstores/hnswlib.js
Давай реализуем форму авторизации с кнопкой, которая открывает модальное окно выбора доступных криптокошельков (Metamask, Rabby, Keplr, Phantom).

Для начала нам понадобится создать само модальное окно и реализовать функционал открытия окна по клику на кнопку.

### Шаг 1: Реализуем компонент ModalWindow

Создадим простой компонент модального окна, которое отображает список поддерживаемых кошельков:

```jsx
import React from "react";
import "./ModalWindow.css";

const ModalWindow = ({ isOpen, closeModal, selectWallet }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Выберите свой кошелек</h2>
        <ul className="wallet-list">
          <li><button onClick={() => selectWallet('metamask')}>Metamask</button></li>
          <li><button onClick={() => selectWallet('rabby')}>Rabby</button></li>
          <li><button onClick={() => selectWallet('keplr')}>Keplr</button></li>
          <li><button onClick={() => selectWallet('phantom')}>Phantom</button></li>
        </ul>
        <button className="close-modal-btn" onClick={closeModal}>Закрыть</button>
      </div>
    </div>
  );
};

export default ModalWindow;
```

### Шаг 2: Добавляем модальное окно в основной компонент формы авторизации

Обновим наш компонент формы авторизации, добавив кнопку вызова модального окна и обработчики событий:

```jsx
import React, { useState } from "react";
import ModalWindow from './ModalWindow';
import "./LoginForm.css";

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false); // состояние видимости модального окна

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { login, password });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const selectWallet = (walletType) => {
    console.log(`Selected ${walletType}`);
    closeModal(); // закрываем модальное окно после выбора кошелька
  };

  return (
    <>
      <div className="login-form-container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="login">Логин:</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          <button type="submit" className="submit-button">
            Войти
          </button>
          <button type="button" className="wallet-button" onClick={openModal}>
            Авторизация через кошелек
          </button>
        </form>
      </div>
      
      {/* Модальное окно */}
      <ModalWindow isOpen={showModal} closeModal={closeModal} selectWallet={selectWallet}/>
    </>
  );
};

export default LoginForm;
```

### Шаг 3: Добавление стилей

В файле стилей `LoginForm.css` добавьте следующие правила для оформления модального окна:

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.wallet-list li {
  list-style-type: none;
  margin-bottom: 10px;
}

.close-modal-btn {
  background-color: #ccc;
  color: black;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.close-modal-btn:hover {
  background-color: #aaa;
}

.wallet-button {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  margin-left: 10px;
}

.wallet-button:hover {
  background-color: #0056b3;
}
```

---

### Итоговый результат:

При клике на кнопку "Авторизация через кошелек", открывается модальное окно с выбором одного из четырёх кошельков (Metamask, Rabby, Keplr, Phantom). Выбор конкретного кошелька выводит сообщение о выбранном типе кошелька в консоли браузера.

После того, как выбор сделан, модальное окно автоматически закрывается. В дальнейшем вы сможете интегрировать реальную логику взаимодействия с каждым конкретным кошельком отдельно.
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем

Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from /Users/hisokawizard/Projects/ai-tester/node_modules/@langchain/community/dist/vectorstores/hnswlib.js
Произошла ошибка при обращении к модели: timeout of 30000ms exceeded
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу

Ошибка загрузки RAG: ❌ Ошибка загрузки VDB:' Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from /Users/hisokawizard/Projects/ai-tester/node_modules/@langchain/community/dist/vectorstores/hnswlib.js
Произошла ошибка при обращении к модели: timeout of 30000ms exceeded