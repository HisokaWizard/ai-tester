Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag
Вот компонент формы авторизации на React с использованием стилей из предоставленных примеров:

```tsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход в систему</h2>
        
        <div className="form-group">
          <label htmlFor="login" className="form-label">Логин</label>
          <input
            id="login"
            type="text"
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div className="form-footer">
          <button type="button" className="forgot-password">
            Забыли пароль?
          </button>
          
          <button type="submit" className="submit-button">
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.login-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
}

.forgot-password {
  background: none;
  border: none;
  color: #4a90e2;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.forgot-password:hover {
  text-decoration: underline;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  background-color: #2c6aa5;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .form-footer {
    flex-direction: column;
    gap: 1rem;
  }
  
  .forgot-password {
    order: 2;
  }
  
  .submit-button {
    order: 1;
    width: 100%;
  }
}
```

Основные особенности компонента:

1. **Адаптивный дизайн** - форма корректно отображается на мобильных устройствах
2. **Современный внешний вид** - используется мягкая тень, скругленные углы, плавные переходы
3. **Интерактивность** - визуальная обратная связь при фокусе и наведении
4. **Доступность** - правильная семантическая разметка с label для полей ввода
5. **Валидация** - обязательные поля с атрибутом required
6. **Чистый код** - компонент легко читается и поддерживается

Компонент включает:
- Поля ввода для логина и пароля
- Кнопку "Забыли пароль?" 
- Кнопку отправки формы "Войти"
- Адаптивную верстку для мобильных устройств
- Эффекты при наведении и фокусе
- Типографику в стиле предоставленных примеров

Для использования компонента просто импортируйте его в ваше приложение. Логика обработки данных формы реализуется в функции `handleSubmit`.
Удали кнопку забыли пароль
Вот обновленный компонент формы авторизации без кнопки "Забыли пароль":

```tsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход в систему</h2>
        
        <div className="form-group">
          <label htmlFor="login" className="form-label">Логин</label>
          <input
            id="login"
            type="text"
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div className="form-footer">
          <button type="submit" className="submit-button">
            Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css):

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.login-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  background-color: #2c6aa5;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .form-footer {
    margin-top: 1.5rem;
  }
  
  .submit-button {
    width: 100%;
    max-width: none;
  }
}
```

Основные изменения:
1. Удалена кнопка "Забыли пароль?"
2. Обновлена стилизация контейнера кнопки submit - теперь она центрирована
3. Добавлена ширина для кнопки submit с ограничением максимума
4. Адаптивность сохранена - на мобильных устройствах кнопка растягивается на всю ширину

Компонент теперь содержит только необходимые элементы:
- Заголовок формы
- Поле ввода логина
- Поле ввода пароля
- Кнопку отправки формы "Войти"
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению
Вот обновленный компонент формы авторизации с кнопкой авторизации через крипто-кошелек:

```tsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const handleCryptoWalletLogin = () => {
    // Триггерим событие для подключения к крипто-кошелькам
    // Это стандартный способ взаимодействия с кошельками через window.ethereum
    if (typeof window !== 'undefined') {
      // Если используете Ethereum кошельки (MetaMask и др.)
      if (window.ethereum) {
        // Запрашиваем подключение к кошельку
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then((accounts: string[]) => {
            console.log('Подключенные аккаунты:', accounts);
            // Здесь будет логика авторизации через кошелек
          })
          .catch((error: any) => {
            console.error('Ошибка подключения к кошельку:', error);
          });
      } else {
        // Если кошелек не установлен
        alert('Пожалуйста, установите крипто-кошелек (например, MetaMask)');
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход в систему</h2>
        
        <div className="form-group">
          <label htmlFor="login" className="form-label">Логин</label>
          <input
            id="login"
            type="text"
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div className="form-footer">
          <button type="submit" className="submit-button">
            Войти
          </button>
        </div>
        
        <div className="divider">
          <span className="divider-text">или</span>
        </div>
        
        <div className="crypto-login">
          <button 
            type="button" 
            className="crypto-button"
            onClick={handleCryptoWalletLogin}
          >
            <svg className="crypto-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Подключить крипто-кошелек
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css):

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.login-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  background-color: #2c6aa5;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider-text {
  padding: 0 1rem;
  color: #777;
  font-size: 0.875rem;
}

.crypto-login {
  display: flex;
  justify-content: center;
}

.crypto-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.crypto-button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.crypto-button:active {
  background-color: #d0d0d0;
}

.crypto-icon {
  color: #4a90e2;
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .form-footer {
    margin-top: 1.5rem;
  }
  
  .submit-button {
    width: 100%;
    max-width: none;
  }
}
```

Основные изменения:

1. **Добавлена кнопка авторизации через крипто-кошелек** под основной формой
2. **Реализована функция `handleCryptoWalletLogin`** которая:
   - Проверяет наличие объекта `window.ethereum` (стандарт для Ethereum кошельков)
   - Вызывает метод `eth_requestAccounts` для подключения к кошельку
   - Обрабатывает успешное подключение и ошибки
   - Показывает уведомление если кошелек не установлен

3. **Добавлены стили**:
   - Разделитель "или" между формой и кнопкой кошелька
   - Стилизация кнопки крипто-кошелька с иконкой
   - Адаптивность сохранена

4. **Иконка кошелька** реализована через SVG для независимости от внешних ресурсов

Функция `handleCryptoWalletLogin` использует стандартный API Ethereum (`window.ethereum`), который поддерживают большинство крипто-кошельков (MetaMask, Trust Wallet, Coinbase Wallet и др.). При клике на кнопку кошелек автоматически откроется и предложит пользователю подключиться к приложению.
Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]
Вот обновленный компонент с кнопкой, вызывающей всплывающее окно выбора кошелька:

```tsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const handleWalletSelect = (wallet: string) => {
    console.log(`Выбран кошелек: ${wallet}`);
    setShowWalletModal(false);
    
    // Здесь будет логика подключения к конкретному кошельку
    switch(wallet) {
      case 'metamask':
        // Логика для MetaMask
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          (window as any).ethereum.request({ method: 'eth_requestAccounts' })
            .then((accounts: string[]) => {
              console.log('MetaMask подключен:', accounts);
            })
            .catch((error: any) => {
              console.error('Ошибка подключения MetaMask:', error);
            });
        }
        break;
        
      case 'rabby':
        // Логика для Rabby
        console.log('Подключение к Rabby');
        break;
        
      case 'keplr':
        // Логика для Keplr
        if (typeof window !== 'undefined' && (window as any).keplr) {
          (window as any).keplr.enable('cosmoshub-4')
            .then(() => {
              console.log('Keplr подключен');
            })
            .catch((error: any) => {
              console.error('Ошибка подключения Keplr:', error);
            });
        }
        break;
        
      case 'phantom':
        // Логика для Phantom
        if (typeof window !== 'undefined' && (window as any).solana) {
          (window as any).solana.connect()
            .then(() => {
              console.log('Phantom подключен');
            })
            .catch((error: any) => {
              console.error('Ошибка подключения Phantom:', error);
            });
        }
        break;
        
      default:
        console.log('Неизвестный кошелек');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход в систему</h2>
        
        <div className="form-group">
          <label htmlFor="login" className="form-label">Логин</label>
          <input
            id="login"
            type="text"
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div className="form-footer">
          <button type="submit" className="submit-button">
            Войти
          </button>
        </div>
        
        <div className="divider">
          <span className="divider-text">или</span>
        </div>
        
        <div className="crypto-login">
          <button 
            type="button" 
            className="crypto-button"
            onClick={() => setShowWalletModal(true)}
          >
            <svg className="crypto-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Подключить крипто-кошелек
          </button>
        </div>
      </form>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Выберите кошелек</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowWalletModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="wallet-list">
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('metamask')}
              >
                <div className="wallet-icon metamask"></div>
                <span>MetaMask</span>
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('rabby')}
              >
                <div className="wallet-icon rabby"></div>
                <span>Rabby</span>
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('keplr')}
              >
                <div className="wallet-icon keplr"></div>
                <span>Keplr</span>
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('phantom')}
              >
                <div className="wallet-icon phantom"></div>
                <span>Phantom</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css):

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.login-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  background-color: #2c6aa5;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider-text {
  padding: 0 1rem;
  color: #777;
  font-size: 0.875rem;
}

.crypto-login {
  display: flex;
  justify-content: center;
}

.crypto-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.crypto-button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.crypto-button:active {
  background-color: #d0d0d0;
}

.crypto-icon {
  color: #4a90e2;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.wallet-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 350px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background-color: #f0f0f0;
  color: #333;
}

.wallet-list {
  padding: 1rem;
}

.wallet-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  background: white;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 1rem;
  color: #333;
}

.wallet-option:hover {
  border-color: #4a90e2;
  background-color: #f8fbff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wallet-option:last-child {
  margin-bottom: 0;
}

.wallet-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
}

.wallet-icon.metamask {
  background: linear-gradient(135deg, #f6851b 0%, #e2761b 100%);
}

.wallet-icon.rabby {
  background: linear-gradient(135deg, #768bf9 0%, #5d77f0 100%);
}

.wallet-icon.keplr {
  background: linear-gradient(135deg, #ff5f5f 0%, #ff4d4d 100%);
}

.wallet-icon.phantom {
  background: linear-gradient(135deg, #ab9ff5 0%, #9a8af0 100%);
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .form-footer {
    margin-top: 1.5rem;
  }
  
  .submit-button {
    width: 100%;
    max-width: none;
  }
  
  .wallet-modal {
    margin: 1rem;
  }
}
```

Основные изменения:

1. **Добавлено модальное окно** с выбором кошельков, которое появляется при клике на кнопку
2. **Список кошельков** включает: MetaMask, Rabby, Keplr, Phantom
3. **Каждый кошелек** имеет свою уникальную цветовую схему и иконку
4. **Реализована логика подключения** для каждого типа кошелька:
   - MetaMask: через `window.ethereum`
   - Keplr: через `window.keplr` 
   - Phantom: через `window.solana`
   - Rabby: заглушка (можно расширить по аналогии)
5. **Модальное окно** можно закрыть кликом на крестик или вне области окна
6. **Адаптивный дизайн** сохранен для мобильных устройств

Компонент теперь:
- Открывает модальное окно при клике на кнопку подключения
- Показывает список из 4 популярных кошельков
- При выборе кошелька вызывает соответствующую логику подключения
- Имеет современный и интуитивно понятный интерфейс
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем
Вот обновленный компонент с полной логикой подключения и подписания для каждого кошелька:

```tsx
import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const signMessage = async (message: string, walletType: string): Promise<string | null> => {
    try {
      switch(walletType) {
        case 'metamask':
        case 'rabby':
          // Для Ethereum-совместимых кошельков
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const from = accounts[0];
            
            const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
            const signature = await (window as any).ethereum.request({
              method: 'personal_sign',
              params: [msg, from]
            });
            return signature;
          }
          break;
          
        case 'keplr':
          // Для Cosmos кошельков (Keplr)
          if (typeof window !== 'undefined' && (window as any).keplr) {
            await (window as any).keplr.enable('cosmoshub-4');
            const offlineSigner = (window as any).keplr.getOfflineSigner('cosmoshub-4');
            const accounts = await offlineSigner.getAccounts();
            const signer = accounts[0].address;
            
            const signDoc = {
              chain_id: 'cosmoshub-4',
              account_number: '0',
              sequence: '0',
              fee: {
                gas: '0',
                amount: [],
              },
              msgs: [],
              memo: message,
            };
            
            const signResponse = await (window as any).keplr.signAmino('cosmoshub-4', signer, signDoc);
            return signResponse.signature.signature;
          }
          break;
          
        case 'phantom':
          // Для Solana кошельков (Phantom)
          if (typeof window !== 'undefined' && (window as any).solana) {
            const provider = (window as any).solana;
            if (provider.isPhantom) {
              await provider.connect();
              const encodedMessage = new TextEncoder().encode(message);
              const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
              return Buffer.from(signedMessage.signature).toString('hex');
            }
          }
          break;
          
        default:
          throw new Error('Неизвестный тип кошелька');
      }
      return null;
    } catch (error) {
      console.error(`Ошибка подписания для ${walletType}:`, error);
      throw error;
    }
  };

  const handleWalletSelect = async (wallet: string) => {
    setLoading(true);
    try {
      console.log(`Выбран кошелек: ${wallet}`);
      
      // Сообщение для подписания (обычно это nonce или timestamp)
      const messageToSign = `Авторизация в приложении: ${new Date().toISOString()}`;
      
      // Подписываем сообщение
      const signature = await signMessage(messageToSign, wallet);
      
      if (signature) {
        console.log(`${wallet} подпись:`, signature);
        // Здесь будет логика авторизации через подпись
        // Отправка signature и публичного ключа на сервер для верификации
        
        // Закрываем модальное окно
        setShowWalletModal(false);
        
        // Показываем успешное подключение (в реальном приложении здесь будет редирект)
        alert(`Успешная авторизация через ${wallet}!`);
      } else {
        throw new Error('Не удалось получить подпись');
      }
    } catch (error: any) {
      console.error('Ошибка подключения к кошельку:', error);
      alert(`Ошибка: ${error.message || 'Не удалось подключиться к кошельку'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход в систему</h2>
        
        <div className="form-group">
          <label htmlFor="login" className="form-label">Логин</label>
          <input
            id="login"
            type="text"
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div className="form-footer">
          <button type="submit" className="submit-button">
            Войти
          </button>
        </div>
        
        <div className="divider">
          <span className="divider-text">или</span>
        </div>
        
        <div className="crypto-login">
          <button 
            type="button" 
            className="crypto-button"
            onClick={() => setShowWalletModal(true)}
          >
            <svg className="crypto-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Подключить крипто-кошелек
          </button>
        </div>
      </form>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowWalletModal(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Выберите кошелек</h3>
              <button 
                className="modal-close" 
                onClick={() => !loading && setShowWalletModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className="wallet-list">
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('metamask')}
                disabled={loading}
              >
                <div className="wallet-icon metamask"></div>
                <span>MetaMask</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('rabby')}
                disabled={loading}
              >
                <div className="wallet-icon rabby"></div>
                <span>Rabby</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('keplr')}
                disabled={loading}
              >
                <div className="wallet-icon keplr"></div>
                <span>Keplr</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('phantom')}
                disabled={loading}
              >
                <div className="wallet-icon phantom"></div>
                <span>Phantom</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css) с добавлением стилей для индикатора загрузки:

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
}

.login-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  background-color: #2c6aa5;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider-text {
  padding: 0 1rem;
  color: #777;
  font-size: 0.875rem;
}

.crypto-login {
  display: flex;
  justify-content: center;
}

.crypto-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.crypto-button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.crypto-button:active {
  background-color: #d0d0d0;
}

.crypto-icon {
  color: #4a90e2;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.wallet-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 350px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover:not(:disabled) {
  background-color: #f0f0f0;
  color: #333;
}

.modal-close:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.wallet-list {
  padding: 1rem;
}

.wallet-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  background: white;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 1rem;
  color: #333;
  position: relative;
}

.wallet-option:hover:not(:disabled) {
  border-color: #4a90e2;
  background-color: #f8fbff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wallet-option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.wallet-option:last-child {
  margin-bottom: 0;
}

.wallet-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.wallet-icon.metamask {
  background: linear-gradient(135deg, #f6851b 0%, #e2761b 100%);
}

.wallet-icon.rabby {
  background: linear-gradient(135deg, #768bf9 0%, #5d77f0 100%);
}

.wallet-icon.keplr {
  background: linear-gradient(135deg, #ff5f5f 0%, #ff4d4d 100%);
}

.wallet-icon.phantom {
  background: linear-gradient(135deg, #ab9ff5 0%, #9a8af0 100%);
}

/* Индикатор загрузки */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1.5rem;
  }
  
  .form-footer {
    margin-top: 1.5rem;
  }
  
  .submit-button {
    width: 100%;
    max-width: none;
  }
  
  .wallet-modal {
    margin: 1rem;
  }
}
```

Основные изменения и реализации:

1. **Полная логика подписания для каждого кошелька**:
   - **MetaMask/Rabby**: Используют `personal_sign` для подписания сообщений
   - **Keplr**: Используют `signAmino` для подписания в Cosmos сети
   - **Phantom**: Используют `signMessage` для подписания в Solana

2. **Обработка состояния загрузки**:
   - Индикатор загрузки при подключении
   - Блокировка кнопок во время операций
   - Предотвращение закрытия модального окна во время загрузки

3. **Обработка ошибок**:
   - Проверка наличия кошельков в браузере
   - Обработка ошибок подключения и подписания
   - Пользовательские уведомления об ошибках

4. **Безопасность**:
   - Использование уникальных сообщений для подписания
   - Правильная кодировка сообщений для каждого кошелька
   - Обработка приватных данных

5. **UX улучшения**:
   - Анимированный индикатор загрузки
   - Визуальная обратная связь при взаимодействии
   - Плавные переходы и анимации

Компонент теперь полностью функционален для авторизации через крипто-кошельки с подписанием сообщений.
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу
Вот обновленный компонент с кнопкой disconnect, отображением адреса кошелька и редиректом на главную:

```tsx
import React, { useState, useEffect } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<{
    type: string;
    address: string;
  } | null>(null);
  const [redirect, setRedirect] = useState(false);

  // Проверяем наличие подключения при загрузке компонента
  useEffect(() => {
    const savedWallet = localStorage.getItem('connectedWallet');
    if (savedWallet) {
      try {
        const parsed = JSON.parse(savedWallet);
        setConnectedWallet(parsed);
      } catch (e) {
        localStorage.removeItem('connectedWallet');
      }
    }
  }, []);

  // Редирект после подключения
  useEffect(() => {
    if (redirect) {
      window.location.href = '/';
    }
  }, [redirect]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки формы
    console.log('Login:', login, 'Password:', password);
  };

  const signMessage = async (message: string, walletType: string): Promise<{signature: string, address: string} | null> => {
    try {
      switch(walletType) {
        case 'metamask':
        case 'rabby':
          // Для Ethereum-совместимых кошельков
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const from = accounts[0];
            
            const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
            const signature = await (window as any).ethereum.request({
              method: 'personal_sign',
              params: [msg, from]
            });
            
            return { signature, address: from };
          }
          break;
          
        case 'keplr':
          // Для Cosmos кошельков (Keplr)
          if (typeof window !== 'undefined' && (window as any).keplr) {
            await (window as any).keplr.enable('cosmoshub-4');
            const offlineSigner = (window as any).keplr.getOfflineSigner('cosmoshub-4');
            const accounts = await offlineSigner.getAccounts();
            const signer = accounts[0].address;
            
            const signDoc = {
              chain_id: 'cosmoshub-4',
              account_number: '0',
              sequence: '0',
              fee: {
                gas: '0',
                amount: [],
              },
              msgs: [],
              memo: message,
            };
            
            const signResponse = await (window as any).keplr.signAmino('cosmoshub-4', signer, signDoc);
            return { 
              signature: signResponse.signature.signature,
              address: signer
            };
          }
          break;
          
        case 'phantom':
          // Для Solana кошельков (Phantom)
          if (typeof window !== 'undefined' && (window as any).solana) {
            const provider = (window as any).solana;
            if (provider.isPhantom) {
              await provider.connect();
              const publicKey = provider.publicKey.toString();
              const encodedMessage = new TextEncoder().encode(message);
              const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
              return {
                signature: Buffer.from(signedMessage.signature).toString('hex'),
                address: publicKey
              };
            }
          }
          break;
          
        default:
          throw new Error('Неизвестный тип кошелька');
      }
      return null;
    } catch (error) {
      console.error(`Ошибка подписания для ${walletType}:`, error);
      throw error;
    }
  };

  const handleWalletSelect = async (wallet: string) => {
    setLoading(true);
    try {
      console.log(`Выбран кошелек: ${wallet}`);
      
      // Сообщение для подписания (обычно это nonce или timestamp)
      const messageToSign = `Авторизация в приложении: ${new Date().toISOString()}`;
      
      // Подписываем сообщение
      const result = await signMessage(messageToSign, wallet);
      
      if (result) {
        console.log(`${wallet} подпись:`, result.signature);
        console.log(`Адрес кошелька: ${result.address}`);
        
        // Сохраняем информацию о подключенном кошельке
        const walletInfo = {
          type: wallet,
          address: result.address
        };
        localStorage.setItem('connectedWallet', JSON.stringify(walletInfo));
        setConnectedWallet(walletInfo);
        
        // Закрываем модальное окно
        setShowWalletModal(false);
        
        // Редирект на главную страницу
        setRedirect(true);
      } else {
        throw new Error('Не удалось получить подпись');
      }
    } catch (error: any) {
      console.error('Ошибка подключения к кошельку:', error);
      alert(`Ошибка: ${error.message || 'Не удалось подключиться к кошельку'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('connectedWallet');
    setConnectedWallet(null);
  };

  return (
    <div className="login-container">
      {/* Header с информацией о подключении */}
      {connectedWallet && (
        <div className="wallet-header">
          <div className="wallet-info">
            <span className="wallet-address">
              {connectedWallet.address.substring(0, 6)}...
              {connectedWallet.address.substring(connectedWallet.address.length - 4)}
            </span>
            <span className="wallet-type">{connectedWallet.type}</span>
          </div>
          <button className="disconnect-button" onClick={handleDisconnect}>
            Отключить
          </button>
        </div>
      )}
      
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Вход в систему</h2>
        
        <div className="form-group">
          <label htmlFor="login" className="form-label">Логин</label>
          <input
            id="login"
            type="text"
            className="form-input"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>
        
        <div className="form-footer">
          <button type="submit" className="submit-button">
            Войти
          </button>
        </div>
        
        <div className="divider">
          <span className="divider-text">или</span>
        </div>
        
        <div className="crypto-login">
          <button 
            type="button" 
            className="crypto-button"
            onClick={() => setShowWalletModal(true)}
          >
            <svg className="crypto-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Подключить крипто-кошелек
          </button>
        </div>
      </form>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => !loading && setShowWalletModal(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Выберите кошелек</h3>
              <button 
                className="modal-close" 
                onClick={() => !loading && setShowWalletModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className="wallet-list">
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('metamask')}
                disabled={loading}
              >
                <div className="wallet-icon metamask"></div>
                <span>MetaMask</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('rabby')}
                disabled={loading}
              >
                <div className="wallet-icon rabby"></div>
                <span>Rabby</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('keplr')}
                disabled={loading}
              >
                <div className="wallet-icon keplr"></div>
                <span>Keplr</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
              
              <button 
                className="wallet-option"
                onClick={() => handleWalletSelect('phantom')}
                disabled={loading}
              >
                <div className="wallet-icon phantom"></div>
                <span>Phantom</span>
                {loading && <div className="loading-spinner"></div>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
```

Обновленные стили (LoginForm.css) с добавлением стилей для header:

```css
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 1rem;
  position: relative;
}

/* Header с информацией о подключении */
.wallet-header {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.wallet-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.wallet-address {
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.wallet-type {
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
}

.disconnect-button {
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.disconnect-button:hover {
  background: #ff3333;
}

.login-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-footer {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 200px;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:active {
  background-color: #2c6aa5;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider-text {
  padding: 0 1rem;
  color: #777;
  font-size: 0.875rem;
}

.crypto-login {
  display: flex;
  justify-content: center;
}

.crypto-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.crypto-button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.crypto-button:active {
  background-color: #d0d0d0;
}

.crypto-icon {
  color: #4a90e2;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.wallet-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 350px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close:hover:not(:disabled) {
  background-color: #f0f0f0;
  color: #333;
}

.modal-close:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.wallet-list {
  padding: 1rem;
}

.wallet-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
  background: white;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 1rem;
  color: #333;
  position: relative;
}

.wallet-option:hover:not(:disabled) {
  border-color: #4a90e2;
  background-color: #f8fbff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wallet-option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.wallet-option:last-child {
  margin-bottom: 0;
}

.wallet-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
}

.wallet-icon.metamask {
  background: linear-gradient(135deg, #f6851b 0%, #e2761b 100%);
}

.wallet-icon.rabby {
  background: linear-gradient(135deg, #768bf9 0%, #5d77f0 100%);
}

.wallet-icon.keplr {
  background: linear-gradient(135deg, #ff5f5f 0%, #ff4d4d 100%);
}

.wallet-icon.phantom {
  background: linear-gradient(135deg, #ab9ff5 0%, #9a8af0 100%);
}

/* Индикатор загрузки */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0.5rem;
  }
  
  .wallet-header {
    top: 10px;
    right: 10px;
    padding: 0.5rem 1rem;
    gap: 0.75rem;
  }
  
  .wallet-address {
    font-size: 0.75rem;
  }
  
  .wallet-type {
    font-size: 0.65rem;
  }
  
  .disconnect-button {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .login-form {
    padding: 1.5rem;
  }
  
  .form-footer {
    margin-top: 1.5rem;
  }
  
  .submit-button {
    width: 100%;
    max-width: none;
  }
  
  .wallet-modal {
    margin: 1rem;
  }
}
```

Основные изменения:

1. **Header с информацией о подключении**:
   - Расположен в правом верхнем углу
   - Отображает сокращенный адрес кошелька
   - Показывает тип подключенного кошелька
   - Кнопка "Отключить" для разрыва соединения

2. **Логика подключения и отключения**:
   - Сохранение информации о подключении в localStorage
   - Проверка подключения при загрузке компонента
   - Возможность отключения через кнопку "Отключить"

3. **Редирект на главную страницу**:
   - После успешного подключения происходит редирект на "/"
   - Используется `window.location.href` для полного редиректа

4. **Улучшенная логика подписания**:
   - Возвращается как подпись, так и адрес кошелька
   - Каждый кошелек возвращает свой адрес в соответствующем формате

5. **UX улучшения**:
   - Адаптивный дизайн для мобильных устройств
   - Сокращенное отображение адреса кошелька
   - Чистый и современный интерфейс

Компонент теперь полностью функционален для авторизации через крипто-кошельки с отображением статуса подключения и возможностью отключения.
