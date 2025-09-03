Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag
Для создания компонента формы авторизации в React, я сначала выполню поиск в базе знаний, чтобы получить информацию о стилях и возможных примерах компонентов. Это поможет мне создать компонент, соответствующий принятым стандартам.


Ошибка загрузки RAG: Could not import hnswlib-node. Please install hnswlib-node as a dependency with, e.g. `npm install -S hnswlib-node`.

Error: Cannot find package 'hnswlib-node' imported from E:\ai-tester\node_modules\@langchain\community\dist\vectorstores\hnswlib.js
Понимаю, что возникла проблема с RAG. Напишу компонент формы авторизации в стандартном стиле, без использования RAG.

```jsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const handleForgotPassword = () => {
    // Логика восстановления пароля
    console.log('Forgot password clicked');
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вход в приложение</h2>
        
        <div className="form-group">
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <div className="form-footer">
          <button 
            type="button" 
            className="forgot-password-btn"
            onClick={handleForgotPassword}
          >
            Забыли пароль?
          </button>
          
          <button type="submit" className="submit-btn">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
```

Стили для компонента (LoginForm.css):

```css
.login-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.forgot-password-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
 
Удали кнопку забыли пароль
Вот обновленный компонент формы авторизации без кнопки "Забыли пароль":

```jsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вход в приложение</h2>
        
        <div className="form-group">
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css):

```css
.login-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.submit-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
```
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению
Вот обновленный компонент формы авторизации с кнопкой подключения крипто-кошелька:

```jsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const handleWalletConnect = async () => {
    // Проверяем наличие Ethereum provider (MetaMask и другие)
    if (window.ethereum) {
      try {
        // Запрашиваем подключение к кошельку
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        // Получаем первый аккаунт
        const walletAddress = accounts[0];
        console.log('Подключен кошелек:', walletAddress);
        
        // Здесь можно добавить логику авторизации через кошелек
        // Например, отправку адреса на сервер для проверки
        
      } catch (error) {
        console.error('Ошибка подключения кошелька:', error);
      }
    } else {
      // Если кошелек не найден, показываем сообщение
      alert('Кошелек не найден. Установите MetaMask или другой Ethereum кошелек.');
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вход в приложение</h2>
        
        <div className="form-group">
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Войти
        </button>
        
        <div className="divider">
          <span>или</span>
        </div>
        
        <button 
          type="button" 
          className="wallet-connect-btn"
          onClick={handleWalletConnect}
        >
          Подключить крипто-кошелек
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css):

```css
.login-form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color
Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]
Вот обновленный компонент с всплывающим окном выбора кошелька:

```jsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const handleWalletSelect = async (walletType) => {
    setShowWalletModal(false);
    
    try {
      switch(walletType) {
        case 'metamask':
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            console.log('MetaMask подключен:', accounts[0]);
          } else {
            alert('MetaMask не установлен');
          }
          break;
          
        case 'rabby':
          if (window.ethereum && window.ethereum.isRabby) {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            console.log('Rabby подключен:', accounts[0]);
          } else {
            alert('Rabby не установлен');
          }
          break;
          
        case 'keplr':
          if (window.keplr) {
            // Для Keplr нужно сначала получить chainId
            // Пример для cosmoshub
            await window.keplr.enable('cosmoshub-4');
            const offlineSigner = window.keplr.getOfflineSigner('cosmoshub-4');
            const accounts = await offlineSigner.getAccounts();
            console.log('Keplr подключен:', accounts[0].address);
          } else {
            alert('Keplr не установлен');
          }
          break;
          
        case 'phantom':
          if (window.solana && window.solana.isPhantom) {
            const response = await window.solana.connect();
            console.log('Phantom подключен:', response.publicKey.toString());
          } else {
            alert('Phantom не установлен');
          }
          break;
          
        default:
          console.log('Неизвестный кошелек');
      }
    } catch (error) {
      console.error('Ошибка подключения кошелька:', error);
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Вход в приложение</h2>
        
        <div className="form-group">
          <label htmlFor="login">Логин</label>
          <input
            type="text"
            id="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Войти
        </button>
        
        <div className="divider">
          <span>или</span>
        </div>
        
        <button 
          type="button" 
          className="wallet-connect-btn"
          onClick={() => setShowWalletModal(true)}
        >
          Подключить крипто-кошелек
        </button>
      </form>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем
Вот обновленный компонент с реализацией подключения и подписи для каждого кошелька:

```jsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const signMessage = async (walletType, account) => {
    const message = "Подтвердите владение кошельком для входа в приложение";
    
    try {
      switch(walletType) {
        case 'metamask':
        case 'rabby':
          if (window.ethereum) {
            const hexMessage = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [hexMessage, account]
            });
            console.log('Подпись:', signature);
            return signature;
          }
          break;
          
        case 'keplr':
          if (window.keplr) {
            const signer = window.keplr.getOfflineSigner('cosmoshub-4');
            const signResult = await signer.signAmino(account, {
              chain_id: 'cosmoshub-4',
              account_number: '0',
              sequence: '0',
              fee: { amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' },
              msgs: [{
                type: 'sign/MsgSignData',
                value: {
                  signer: account,
                  data: btoa(message)
                }
              }],
              memo: ''
            });
            console.log('Подпись:', signResult.signature);
            return signResult.signature;
          }
          break;
          
        case 'phantom':
          if (window.solana && window.solana.isPhantom) {
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
            console.log('Подпись:', signedMessage.signature);
            return signedMessage.signature;
          }
          break;
          
        default:
          console.log('Неизвестный кошелек');
      }
    } catch (error) {
      console.error('Ошибка подписи сообщения:', error);
    }
  };

  const handleWalletSelect = async (walletType) => {
    setShowWalletModal(false);
    
    try {
      switch(walletType) {
        case 'metamask':
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            const account = accounts[0];
            console.log('MetaMask подключен:', account);
            
            // Подписываем сообщение
            const signature = await signMessage('metamask', account);
            if (signature) {
              console.log('Успешная авторизация через MetaMask');
              // Здесь можно отправить account и signature на сервер для проверки
            }
          } else {
            alert('MetaMask не установлен');
          }
          break;
          
        case 'rabby':
          if (window.ethereum && window.ethereum.isRabby) {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            const account = accounts[0];
            console.log('Rabby подключен:', account);
            
            // Подписываем сообщение
            const signature = await signMessage('rabby', account);
            if (signature) {
              console.log('Успешная авторизация через Rab
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу
Вот обновленный компонент с отображением подключенного кошелька и кнопкой disconnect:

```jsx
import React, { useState, useEffect } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');

  // Проверяем, есть ли уже подключенный кошелек при загрузке компонента
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    const savedAddress = localStorage.getItem('walletAddress');
    
    if (savedWallet && savedAddress) {
      setConnectedWallet(savedWallet);
      setWalletAddress(savedAddress);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const signMessage = async (walletType, account) => {
    const message = "Подтвердите владение кошельком для входа в приложение";
    
    try {
      switch(walletType) {
        case 'metamask':
        case 'rabby':
          if (window.ethereum) {
            const hexMessage = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [hexMessage, account]
            });
            return signature;
          }
          break;
          
        case 'keplr':
          if (window.keplr) {
            const signer = window.keplr.getOfflineSigner('cosmoshub-4');
            const signResult = await signer.signAmino(account, {
              chain_id: 'cosmoshub-4',
              account_number: '0',
              sequence: '0',
              fee: { amount: [{ denom: 'uatom', amount: '500' }], gas: '200000' },
              msgs: [{
                type: 'sign/MsgSignData',
                value: {
                  signer: account,
                  data: btoa(message)
                }
              }],
              memo: ''
            });
            return signResult.signature;
          }
          break;
          
        case 'phantom':
          if (window.solana && window.solana.isPhantom) {
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
            return signedMessage.signature;
          }
          break;
          
        default:
          console.log('Неизвестный кошелек');
      }
    } catch (error) {
      console.error('Ошибка подписи сообщения:', error);
    }
  };

  const handleWalletSelect = async (walletType) => {
    setShowWalletModal(false);
    
    try {
      switch(walletType) {
        case 'metamask':
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
            });
            const account = accounts[0];
            console.log('MetaMask подключен:', account);
            
            // Подписываем сообщение
            const signature = await signMessage('metamask', account);
            if (signature) {
              setConnectedWallet('metamask');
              setWalletAddress(account);
              localStorage.setItem('connectedWallet', 'metamask');
              localStorage.setItem('walletAddress', account);
              
              // Редирект на главную страницу
              onLoginSuccess && onLoginSuccess();
            }
          } else {
            alert