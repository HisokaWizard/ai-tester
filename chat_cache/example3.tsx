Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag
Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag, Цена биткоина: 111999.8050924653 в подарок!
Напиши компонент формы авторизации в приложение, компонент на react, нужно вводить логин и пароль, также кнопка забыли пароль и кнопка сабмита, стили используй исходя из примеров в rag, Цена биткоина: 111999.8050924653 в подарок!. 📭 [RAG] Ничего не найдено по запросу
Я создам компонент формы авторизации для вас. Поскольку в RAG не было найдено примеров, я реализую современный дизайн с использованием Tailwind CSS:

```tsx
// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onForgotPassword: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onForgotPassword, 
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войдите в аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={onForgotPassword}
                className="font-medium text-blue-600 hover:text-blue-500"
                disabled={isLoading}
              >
                Забыли пароль?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
```

Пример использования компонента:

```tsx
// App.tsx
import React from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt:', credentials);
    // Здесь будет логика авторизации
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password page');
    // Переход на страницу восстановления пароля
  };

  return (
    <div className="App">
      <LoginForm 
        onSubmit={handleLogin}
        onForgotPassword={handleForgotPassword}
        isLoading={false}
      />
    </div>
  );
}

export default App;
```

Основные особенности компонента:

1. **Современный дизайн** - используется карточка с тенями, скругленные углы
2. **Адаптивность** - корректно отображается на разных устройствах
3. **Интерактивность**:
   - Анимация при наведении на кнопки
   - Состояние загрузки для кнопки submit
   - Валидация полей формы
4. **Доступность**:
   - Правильная семантика HTML
   - Скрытие label для screen readers через `sr-only`
   - Фокус состояния для элементов управления
5. **Типизация** - полностью типизирован с помощью TypeScript
6. **Гибкость** - принимает обработчики событий как пропсы

Компонент использует Tailwind CSS классы для стилизации. Если вы не используете Tailwind, могу адаптировать под другие подходы (CSS Modules, Styled Components и т.д.).
Удали кнопку забыли пароль
Удали кнопку забыли пароль, Цена биткоина: 111999.8050924653 в подарок!
Удали кнопку забыли пароль, Цена биткоина: 111999.8050924653 в подарок!. 📭 [RAG] Ничего не найдено по запросу
Вот компонент формы авторизации без кнопки "Забыли пароль":

```tsx
// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войдите в аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
```

Изменения:
1. Удалена кнопка "Забыли пароль"
2. Удален проп `onForgotPassword` из интерфейса
3. Упрощена структура формы
4. Удалены соответствующие обработчики и стили

Пример использования:

```tsx
// App.tsx
import React from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt:', credentials);
    // Здесь будет логика авторизации
  };

  return (
    <div className="App">
      <LoginForm 
        onSubmit={handleLogin}
        isLoading={false}
      />
    </div>
  );
}

export default App;
```
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению, Цена биткоина: 111999.8050924653 в подарок!
Добавь кнопку авторизации через крипто-кошелек, также при клике на эту кнопку, нужно тригерить ивент по которым кошельки среагируют и попробуют подключиться к приложению, Цена биткоина: 111999.8050924653 в подарок!. 📭 [RAG] Ничего не найдено по запросу
Вот обновленный компонент с кнопкой авторизации через крипто-кошелек:

```tsx
// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onCryptoLogin: () => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onCryptoLogin,
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войдите в аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Или продолжить с
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onCryptoLogin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <svg className="h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path d="M313.4 9.4c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80zm-192 96c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80z"/>
              <path d="M232 224c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88z"/>
              <path d="M384 312c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z"/>
            </svg>
            <span>Крипто-кошелек</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
```

Пример использования:

```tsx
// App.tsx
import React from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt:', credentials);
    // Здесь будет логика авторизации
  };

  const handleCryptoLogin = () => {
    console.log('Crypto wallet login initiated');
    // Триггер события для подключения крипто-кошелька
    window.dispatchEvent(new Event('cryptoWalletLogin'));
    
    // Альтернативно, можно вызвать библиотеку подключения к кошелькам, например:
    // if (window.ethereum) {
    //   window.ethereum.request({ method: 'eth_requestAccounts' });
    // }
  };

  return (
    <div className="App">
      <LoginForm 
        onSubmit={handleLogin}
        onCryptoLogin={handleCryptoLogin}
        isLoading={false}
      />
    </div>
  );
}

export default App;
```

Основные изменения:
1. Добавлена кнопка "Крипто-кошелек" с иконкой
2. Добавлен проп `onCryptoLogin` для обработки события подключения
3. Добавлен разделитель между формой и кнопкой крипто-авторизации
4. В обработчике `onCryptoLogin` триггерится событие `cryptoWalletLogin`, на которое могут реагировать крипто-кошельки
5. Также показан альтернативный способ с использованием `window.ethereum` для Ethereum-кошельков

Кнопка крипто-авторизации:
- Использует стандартную иконку крипто-кошелька
- Расположена под формой авторизации
- Визуально отделена от основной формы
- При клике вызывает обработчик, который может инициировать подключение крипто-кошелька

Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom]
Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom], Цена биткоина: 111978.03565940168 в подарок!
Измени кнопку подключения кошельков на конопку которая вызывает всплывающее окно со списком кошельков [metamask, rabby, keplr, phantom], Цена биткоина: 111978.03565940168 в подарок!. 📭 [RAG] Ничего не найдено по запросу
Вот обновленный компонент с кнопкой, вызывающей модальное окно со списком крипто-кошельков:

```tsx
// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onWalletSelect: (wallet: string) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onWalletSelect,
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  const handleWalletSelect = (wallet: string) => {
    setShowWalletModal(false);
    onWalletSelect(wallet);
  };

  // Иконки кошельков
  const walletIcons: Record<string, JSX.Element> = {
    metamask: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#E17726"/>
        <path d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5Z" fill="#F6851B"/>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#FFDFB9"/>
        <path d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z" fill="#E17726"/>
      </svg>
    ),
    rabby: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#181818"/>
        <path d="M17.5 9.5L12 15L6.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    keplr: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#2F80F2"/>
        <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white"/>
      </svg>
    ),
    phantom: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#AB9FF5"/>
        <path d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5Z" fill="white"/>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#AB9FF5"/>
      </svg>
    )
  };

  const wallets = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'rabby', name: 'Rabby Wallet' },
    { id: 'keplr', name: 'Keplr' },
    { id: 'phantom', name: 'Phantom' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войдите в аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Или продолжить с
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowWalletModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <svg className="h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path d="M313.4 9.4c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80zm-192 96c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80z"/>
              <path d="M232 224c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88z"/>
              <path d="M384 312c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z"/>
            </svg>
            <span>Крипто-кошелек</span>
          </button>
        </div>
      </div>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Выберите кошелек
                </h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0">
                      {walletIcons[wallet.id] || (
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{wallet.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
```

Пример использования:

```tsx
// App.tsx
import React from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt:', credentials);
    // Здесь будет логика авторизации
  };

  const handleWalletSelect = (wallet: string) => {
    console.log('Selected wallet:', wallet);
    
    // Триггер события для подключения выбранного кошелька
    window.dispatchEvent(new CustomEvent('cryptoWalletLogin', {
      detail: { wallet }
    }));
    
    // Альтернативно, можно вызвать специфичные методы для каждого кошелька:
    // switch(wallet) {
    //   case 'metamask':
    //     if (window.ethereum) {
    //       window.ethereum.request({ method: 'eth_requestAccounts' });
    //     }
    //     break;
    //   case 'keplr':
    //     // Логика для Keplr
    //     break;
    //   case 'phantom':
    //     // Логика для Phantom
    //     break;
    //   default:
    //     break;
    // }
  };

  return (
    <div className="App">
      <LoginForm 
        onSubmit={handleLogin}
        onWalletSelect={handleWalletSelect}
        isLoading={false}
      />
    </div>
  );
}

export default App;
```

Основные изменения:
1. Добавлено модальное окно со списком кошельков (MetaMask, Rabby, Keplr, Phantom)
2. Кнопка "Крипто-кошелек" теперь открывает модальное окно
3. Добавлены SVG иконки для каждого кошелька
4. При выборе кошелька вызывается обработчик `onWalletSelect` с ID выбранного кошелька
5. Модальное окно можно закрыть через кнопку закрытия или кнопку "Отмена"
6. Добавлены стили для модального окна с затемненным фоном
7. При выборе кошелька триггерится событие `cryptoWalletLogin` с деталями выбранного кошелька

Модальное окно:
- Центрировано на экране
- Имеет полупрозрачный затемненный фон
- Содержит список кошельков с иконками
- Каждый кошелек можно выбрать кликом
- Есть кнопка закрытия и кнопка отмены
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем, Цена биткоина: 111978.03565940168 в подарок!
Для каждого кошелька из списка реализуй логику работы с кошельком по клику, а также подпись публичным ключем, Цена биткоина: 111978.03565940168 в подарок!. 📭 [RAG] Ничего не найдено по запросу
Вот обновленный компонент с реализацией логики подключения и подписания для каждого кошелька:

```tsx
// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onWalletConnect: (walletData: { 
    walletType: string; 
    address: string; 
    signature: string;
    publicKey?: string;
  }) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onWalletConnect,
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletLoading, setWalletLoading] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  // Подключение к MetaMask (EVM)
  const connectMetaMask = async (): Promise<{ address: string; signature: string } | null> => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask не установлен!');
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      const account = accounts[0];
      
      // Подписание сообщения для получения подписи
      const message = `Подтвердите владение кошельком ${account}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      });

      return { address: account, signature };
    } catch (error) {
      console.error('Ошибка подключения к MetaMask:', error);
      alert('Не удалось подключиться к MetaMask');
      return null;
    }
  };

  // Подключение к Rabby (EVM)
  const connectRabby = async (): Promise<{ address: string; signature: string } | null> => {
    // Rabby использует тот же API что и MetaMask
    return connectMetaMask();
  };

  // Подключение к Keplr (Cosmos)
  const connectKeplr = async (): Promise<{ address: string; signature: string; publicKey: string } | null> => {
    if (typeof window.keplr === 'undefined') {
      alert('Keplr не установлен!');
      return null;
    }

    try {
      // Подключение к цепочке (например, cosmoshub)
      await window.keplr.enable('cosmoshub-4');
      
      const offlineSigner = window.keplr.getOfflineSigner('cosmoshub-4');
      const accounts = await offlineSigner.getAccounts();
      const account = accounts[0];
      
      // Подписание сообщения
      const message = `Подтвердите владение кошельком ${account.address}`;
      const signDoc = {
        chain_id: 'cosmoshub-4',
        account_number: '0',
        sequence: '0',
        fee: {
          gas: '0',
          amount: [],
        },
        msgs: [
          {
            type: 'sign/MsgSignData',
            value: {
              signer: account.address,
              data: Buffer.from(message).toString('base64'),
            },
          },
        ],
        memo: '',
      };

      const signResponse = await window.keplr.signAmino(
        'cosmoshub-4',
        account.address,
        signDoc
      );

      return {
        address: account.address,
        signature: JSON.stringify(signResponse.signature),
        publicKey: Buffer.from(account.pubkey).toString('hex')
      };
    } catch (error) {
      console.error('Ошибка подключения к Keplr:', error);
      alert('Не удалось подключиться к Keplr');
      return null;
    }
  };

  // Подключение к Phantom (Solana)
  const connectPhantom = async (): Promise<{ address: string; signature: string } | null> => {
    if (typeof window.solana === 'undefined' || !window.solana.isPhantom) {
      alert('Phantom не установлен!');
      return null;
    }

    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      
      // Подписание сообщения
      const message = `Подтвердите владение кошельком ${publicKey}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
      
      return {
        address: publicKey,
        signature: Buffer.from(signedMessage.signature).toString('hex')
      };
    } catch (error) {
      console.error('Ошибка подключения к Phantom:', error);
      alert('Не удалось подключиться к Phantom');
      return null;
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    setWalletLoading(walletId);
    
    try {
      let result = null;
      
      switch (walletId) {
        case 'metamask':
          result = await connectMetaMask();
          break;
        case 'rabby':
          result = await connectRabby();
          break;
        case 'keplr':
          result = await connectKeplr();
          break;
        case 'phantom':
          result = await connectPhantom();
          break;
        default:
          throw new Error('Неизвестный кошелек');
      }

      if (result) {
        setShowWalletModal(false);
        onWalletConnect({
          walletType: walletId,
          address: result.address,
          signature: result.signature,
          publicKey: (result as any).publicKey
        });
      }
    } catch (error) {
      console.error(`Ошибка подключения к ${walletId}:`, error);
    } finally {
      setWalletLoading(false);
    }
  };

  // Иконки кошельков
  const walletIcons: Record<string, JSX.Element> = {
    metamask: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#E17726"/>
        <path d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5Z" fill="#F6851B"/>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#FFDFB9"/>
        <path d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z" fill="#E17726"/>
      </svg>
    ),
    rabby: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#181818"/>
        <path d="M17.5 9.5L12 15L6.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    keplr: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#2F80F2"/>
        <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white"/>
      </svg>
    ),
    phantom: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#AB9FF5"/>
        <path d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5Z" fill="white"/>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#AB9FF5"/>
      </svg>
    )
  };

  const wallets = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'rabby', name: 'Rabby Wallet' },
    { id: 'keplr', name: 'Keplr' },
    { id: 'phantom', name: 'Phantom' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войдите в аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Или продолжить с
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowWalletModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <svg className="h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path d="M313.4 9.4c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80zm-192 96c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80z"/>
              <path d="M232 224c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88z"/>
              <path d="M384 312c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z"/>
            </svg>
            <span>Крипто-кошелек</span>
          </button>
        </div>
      </div>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Выберите кошелек
                </h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    disabled={walletLoading === wallet.id}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                      walletLoading === wallet.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {walletIcons[wallet.id] || (
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{wallet.name}</span>
                    {walletLoading === wallet.id && (
                      <svg className="animate-spin ml-auto h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
```

Пример использования:

```tsx
// App.tsx
import React from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt:', credentials);
    // Здесь будет логика авторизации
  };

  const handleWalletConnect = (walletData: { 
    walletType: string; 
    address: string; 
    signature: string;
    publicKey?: string;
  }) => {
    console.log('Wallet connected:', walletData);
    
    // Здесь будет логика авторизации через кошелек
    // Например, отправка данных на сервер для верификации
    /*
    fetch('/api/auth/wallet-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(walletData)
    })
    .then(response => response.json())
    .then(data => {
      // Обработка результата авторизации
    });
    */
  };

  return (
    <div className="App">
      <LoginForm 
        onSubmit={handleLogin}
        onWalletConnect={handleWalletConnect}
        isLoading={false}
      />
    </div>
  );
}

export default App;
```

Реализованная функциональность:

1. **MetaMask/Rabby (EVM)**:
   - Подключение через `eth_requestAccounts`
   - Подписание сообщения через `personal_sign`
   - Получение адреса и подписи

2. **Keplr (Cosmos)**:
   - Подключение к Cosmos chain
   - Получение аккаунта и публичного ключа
   - Подписание данных через `signAmino`

3. **Phantom (Solana)**:
   - Подключение через `window.solana.connect()`
   - Подписание сообщения через `signMessage`
   - Получение адреса и подписи

4. **Общая логика**:
   - Проверка наличия кошелька в браузере
   - Обработка ошибок подключения
   - Индикатор загрузки во время подключения
   - Передача данных о подключении родительскому компоненту

5. **Безопасность**:
   - Подписание уникальных сообщений для подтверждения владения
   - Передача подписи и публичного ключа для верификации на сервере

Для работы требуются глобальные типы:
```bash
npm install @types/window.ethereum @types/window.keplr
```
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу, Цена биткоина: 111938.5694662402 в подарок!
Вывод и в верхнем правом углу кнопку disconnect, и адрес подключенного кошелька, после подключения нужно редиректить на главную страницу, Цена биткоина: 111938.5694662402 в подарок!. 📭 [RAG] Ничего не найдено по запросу

Вот обновленный компонент с отображением подключенного кошелька и кнопкой disconnect:

```tsx
// Header.tsx - Компонент заголовка с информацией о кошельке
import React from 'react';

interface HeaderProps {
  walletInfo: {
    walletType: string;
    address: string;
  } | null;
  onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ walletInfo, onDisconnect }) => {
  if (!walletInfo) return null;

  // Форматирование адреса для отображения
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Иконки кошельков
  const walletIcons: Record<string, JSX.Element> = {
    metamask: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#E17726"/>
      </svg>
    ),
    rabby: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#181818"/>
      </svg>
    ),
    keplr: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#2F80F2"/>
      </svg>
    ),
    phantom: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#AB9FF5"/>
      </svg>
    )
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Мое приложение</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-3 bg-gray-100 rounded-full py-1 px-3">
                <div className="flex-shrink-0">
                  {walletIcons[walletInfo.walletType] || (
                    <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatAddress(walletInfo.address)}
                </span>
                <button
                  onClick={onDisconnect}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

```tsx
// App.tsx - Основное приложение с роутингом
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Header from './components/Header';

// Типы для данных кошелька
interface WalletInfo {
  walletType: string;
  address: string;
  signature: string;
  publicKey?: string;
}

function App() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt:', credentials);
    // Здесь будет логика авторизации
    setIsAuthenticated(true);
  };

  const handleWalletConnect = (walletData: WalletInfo) => {
    console.log('Wallet connected:', walletData);
    setWalletInfo(walletData);
    setIsAuthenticated(true);
    
    // Редирект на главную страницу
    window.location.href = '/';
  };

  const handleDisconnect = () => {
    // Отключение кошелька
    if (window.ethereum && typeof window.ethereum.request === 'function') {
      // Для EVM кошельков
      window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }]
      }).catch(console.error);
    }
    
    // Очистка состояния
    setWalletInfo(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && (
          <Header 
            walletInfo={walletInfo ? { 
              walletType: walletInfo.walletType, 
              address: walletInfo.address 
            } : null} 
            onDisconnect={handleDisconnect} 
          />
        )}
        
        <main>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginForm 
                    onSubmit={handleLogin}
                    onWalletConnect={handleWalletConnect}
                    isLoading={false}
                  />
                )
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Главная страница</h2>
                        <p className="text-gray-600">
                          Добро пожаловать в приложение! Вы успешно вошли в систему.
                        </p>
                        {walletInfo && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800">Информация о кошельке:</h3>
                            <p className="text-blue-700">Тип: {walletInfo.walletType}</p>
                            <p className="text-blue-700">Адрес: {walletInfo.address}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

```tsx
// LoginForm.tsx - Обновленная форма логина
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
  onWalletConnect: (walletData: { 
    walletType: string; 
    address: string; 
    signature: string;
    publicKey?: string;
  }) => void;
  isLoading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onWalletConnect,
  isLoading = false 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletLoading, setWalletLoading] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  // Подключение к MetaMask (EVM)
  const connectMetaMask = async (): Promise<{ address: string; signature: string } | null> => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask не установлен!');
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      const account = accounts[0];
      
      // Подписание сообщения для получения подписи
      const message = `Подтвердите владение кошельком ${account}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      });

      return { address: account, signature };
    } catch (error) {
      console.error('Ошибка подключения к MetaMask:', error);
      alert('Не удалось подключиться к MetaMask');
      return null;
    }
  };

  // Подключение к Rabby (EVM)
  const connectRabby = async (): Promise<{ address: string; signature: string } | null> => {
    // Rabby использует тот же API что и MetaMask
    return connectMetaMask();
  };

  // Подключение к Keplr (Cosmos)
  const connectKeplr = async (): Promise<{ address: string; signature: string; publicKey: string } | null> => {
    if (typeof window.keplr === 'undefined') {
      alert('Keplr не установлен!');
      return null;
    }

    try {
      // Подключение к цепочке (например, cosmoshub)
      await window.keplr.enable('cosmoshub-4');
      
      const offlineSigner = window.keplr.getOfflineSigner('cosmoshub-4');
      const accounts = await offlineSigner.getAccounts();
      const account = accounts[0];
      
      // Подписание сообщения
      const message = `Подтвердите владение кошельком ${account.address}`;
      const signDoc = {
        chain_id: 'cosmoshub-4',
        account_number: '0',
        sequence: '0',
        fee: {
          gas: '0',
          amount: [],
        },
        msgs: [
          {
            type: 'sign/MsgSignData',
            value: {
              signer: account.address,
              data: Buffer.from(message).toString('base64'),
            },
          },
        ],
        memo: '',
      };

      const signResponse = await window.keplr.signAmino(
        'cosmoshub-4',
        account.address,
        signDoc
      );

      return {
        address: account.address,
        signature: JSON.stringify(signResponse.signature),
        publicKey: Buffer.from(account.pubkey).toString('hex')
      };
    } catch (error) {
      console.error('Ошибка подключения к Keplr:', error);
      alert('Не удалось подключиться к Keplr');
      return null;
    }
  };

  // Подключение к Phantom (Solana)
  const connectPhantom = async (): Promise<{ address: string; signature: string } | null> => {
    if (typeof window.solana === 'undefined' || !window.solana.isPhantom) {
      alert('Phantom не установлен!');
      return null;
    }

    try {
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      
      // Подписание сообщения
      const message = `Подтвердите владение кошельком ${publicKey}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
      
      return {
        address: publicKey,
        signature: Buffer.from(signedMessage.signature).toString('hex')
      };
    } catch (error) {
      console.error('Ошибка подключения к Phantom:', error);
      alert('Не удалось подключиться к Phantom');
      return null;
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    setWalletLoading(walletId);
    
    try {
      let result = null;
      
      switch (walletId) {
        case 'metamask':
          result = await connectMetaMask();
          break;
        case 'rabby':
          result = await connectRabby();
          break;
        case 'keplr':
          result = await connectKeplr();
          break;
        case 'phantom':
          result = await connectPhantom();
          break;
        default:
          throw new Error('Неизвестный кошелек');
      }

      if (result) {
        setShowWalletModal(false);
        onWalletConnect({
          walletType: walletId,
          address: result.address,
          signature: result.signature,
          publicKey: (result as any).publicKey
        });
      }
    } catch (error) {
      console.error(`Ошибка подключения к ${walletId}:`, error);
    } finally {
      setWalletLoading(false);
    }
  };

  // Иконки кошельков
  const walletIcons: Record<string, JSX.Element> = {
    metamask: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#E17726"/>
        <path d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5Z" fill="#F6851B"/>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#FFDFB9"/>
        <path d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z" fill="#E17726"/>
      </svg>
    ),
    rabby: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#181818"/>
        <path d="M17.5 9.5L12 15L6.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    keplr: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#2F80F2"/>
        <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white"/>
      </svg>
    ),
    phantom: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#AB9FF5"/>
        <path d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5Z" fill="white"/>
        <path d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z" fill="#AB9FF5"/>
      </svg>
    )
  };

  const wallets = [
    { id: 'metamask', name: 'MetaMask' },
    { id: 'rabby', name: 'Rabby Wallet' },
    { id: 'keplr', name: 'Keplr' },
    { id: 'phantom', name: 'Phantom' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Войдите в аккаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Логин"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Или продолжить с
            </span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowWalletModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <svg className="h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
              <path d="M313.4 9.4c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80zm-192 96c-12.5-12.5-32.8-12.5-45.3 0l-80 80c-12.5 12.5-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l80-80c12.5-12.5 12.5-32.8 0-45.3l-80-80z"/>
              <path d="M232 224c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88z"/>
              <path d="M384 312c0 22.1-17.9 40-40 40s-40-17.9-40-40 17.9-40 40-40 40 17.9 40 40z"/>
            </svg>
            <span>Крипто-кошелек</span>
          </button>
        </div>
      </div>

      {/* Модальное окно выбора кошелька */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Выберите кошелек
                </h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 space-y-3">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                    disabled={walletLoading === wallet.id}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                      walletLoading === wallet.id ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {walletIcons[wallet.id] || (
                        <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{wallet.name}</span>
                    {walletLoading === wallet.id && (
                      <svg className="animate-spin ml-auto h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
```

Основные изменения:

1. **Header компонент**:
   - Отображает информацию о подключенном кошельке в правом верхнем углу
   - Показывает сокращенный адрес кошелька (первые 6 и последние 4 символа)
   - Отображает иконку типа кошелька
   - Кнопка "disconnect" для отключения кошелька

2. **App компонент**:
   - Добавлен роутинг с помощью react-router-dom
   - Состояние `isAuthenticated` для управления доступом
   - После подключения кошелька происходит редирект на главную страницу
   - Главная страница отображается только для авторизованных пользователей
   - Кнопка disconnect вызывает функцию отключения и очистки состояния

3. **Функциональность**:
   - При подключении кошелька пользователь перенаправляется на главную страницу
   - На главной странице отображается информация о подключенном кошельке
   - Кнопка disconnect очищает состояние и возвращает пользователя на страницу логина
   - Для EVM кошельков (MetaMask, Rabby) добавлена попытка отключения через wallet_requestPermissions

Для работы необходимы зависимости:
```bash
npm install react-router-dom
```