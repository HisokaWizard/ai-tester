Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag

Ошибка загрузки RAG: Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from E:\ai-tester\node_modules\@langchain\community\dist\vectorstores\hnswlib.js
Вот простой пример компонента формы авторизации на React с использованием стилей, которые обычно применяются в таких случаях:

```javascript
import React, { useState } from 'react';
import './LoginForm.css'; // Подключаем файл стилей

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Логин:', login);
    console.log('Пароль:', password);
    // Здесь можно добавить обработку отправки данных
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Авторизация</h2>
        
        <label htmlFor="login">Логин:</label>
        <input 
          type="text" 
          id="login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label htmlFor="password">Пароль:</label>
        <input 
          type="password" 
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Войти</button>
        <a href="/forgot-password" className="forgot-link">Забыли пароль?</a>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Стили (LoginForm.css):

```css
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-container h2 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.login-container label {
  display: block;
  margin-top: 10px;
  color: #777;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.forgot-link {
  display: block;
  text-align: right;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}
```

Этот код создает простую форму авторизации с полями ввода логина и пароля, кнопкой "Забыли пароль?" и кнопкой сабмита "Войти". Стили оформлены так, чтобы форма выглядела аккуратно и современно.
Удали кнопку забыли пароль

Ошибка загрузки RAG: Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from E:\ai-tester\node_modules\@langchain\community\dist\vectorstores\hnswlib.js
Вот обновленный код компонента формы авторизации без кнопки «Забыли пароль?»:

```javascript
import React, { useState } from 'react';
import './LoginForm.css'; // Подключаем файл стилей

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Логин:', login);
    console.log('Пароль:', password);
    // Здесь можно добавить обработку отправки данных
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Авторизация</h2>
        
        <label htmlFor="login">Логин:</label>
        <input 
          type="text" 
          id="login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label htmlFor="password">Пароль:</label>
        <input 
          type="password" 
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Войти</button>
      </form>
    </div>
  );
};

export default LoginForm;
```

### Стили остаются прежними (`LoginForm.css`), но теперь они соответствуют упрощенной форме:

```css
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.login-container h2 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.login-container label {
  display: block;
  margin-top: 10px;
  color: #777;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #0056b3;
}
```

Теперь у вас есть простая форма авторизации с двумя полями ввода и одной кнопкой "Войти".
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению

Ошибка загрузки RAG: Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from E:\ai-tester\node_modules\@langchain\community\dist\vectorstores\hnswlib.js

Ошибка загрузки RAG: Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from E:\ai-tester\node_modules\@langchain\community\dist\vectorstores\hnswlib.js

Ошибка загрузки RAG: Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from E:\ai-tester\node_modules\@langchain\community\dist\vectorstores\hnswlib.js
Для того, чтобы добавить кнопку авторизации через криптокошелек в вашу форму авторизации на React, вам потребуется вызвать специальный JavaScript API, который инициирует подключение кошелька. Обычно это делается путем вызова события `ethereum#request`, если вы работаете с Ethereum или совместимыми блокчейнами.

Ниже приведён пример реализации такой функциональности:

```javascript
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Логин:', login);
    console.log('Пароль:', password);
    // Добавьте здесь свою логику обработки входа
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Кошелек успешно подключен');
      } catch (error) {
        console.error('Пользователь отменил подключение кошелька', error);
      }
    } else {
      alert('Пожалуйста, установите MetaMask или другой совместимый кошелек.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Авторизация</h2>
        
        <label htmlFor="login">Логин:</label>
        <input 
          type="text" 
          id="login" 
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />

        <label htmlFor="password">Пароль:</label>
        <input 
          type="password" 
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Войти</button>
      </form>
      
      <button onClick={connectWallet} className="wallet-connection-btn">
        Войти через криптокошелек
      </button>
    </div>
  );
};

export default LoginForm;
```

### CSS-стили (LoginForm.css):

```css
.wallet-connection-btn {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #29ab87; /* Цвет для кнопки подключения кошелька */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.wallet-connection-btn:hover {
  background-color: #218c6d;
}
```

### Как это работает:

1. **Форма авторизации**: Обычная форма с полями логина и пароля.
2. **Кнопка подключения кошелька**: При нажатии вызывает метод `ethereum.request({ method: 'eth_requestAccounts' })`, что инициирует стандартное окно MetaMask или другого поддерживаемого кошелька для выбора аккаунта.
3. **Проверка наличия кошелька**: Проверяет наличие объекта `window.ethereum`, который предоставляется расширением MetaMask или другими совместимыми кошельками.

Таким образом, пользователи смогут войти в ваше приложение как традиционным способом (логин/пароль), так и через свои криптокошельки.