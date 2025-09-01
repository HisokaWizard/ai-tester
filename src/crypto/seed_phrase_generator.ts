// Импортируем необходимые компоненты из библиотеки ethers
import { ethers } from 'ethers';

// --- Основная асинхронная функция для генерации ---
async function generateWallet() {
  console.log('🚀 Начинаем генерацию кошелька...');

  // 1. ГЕНЕРАЦИЯ SEED-ФРАЗЫ (МНЕМОНИКА)
  // Для 24 слов необходима энтропия 256 бит (32 байта)
  const entropy = ethers.randomBytes(32);
  const mnemonic = ethers.Mnemonic.fromEntropy(entropy);

  console.log('\n✅ Сгенерирована новая seed-фраза:');
  console.log(
    '========================================================================================'
  );
  console.log(mnemonic.phrase);
  console.log(
    '========================================================================================'
  );

  // 2. ОПРЕДЕЛЕНИЕ ПУТИ ДЕРИВАЦИИ
  // Стандартный путь для Ethereum - m/44'/60'/0'/0/x
  // Мы используем ваш индекс 4493
  const derivationPath = `m/44'/60'/0'/0/4493`;
  console.log(`\nℹ️ Используется путь деривации: ${derivationPath}`);

  // 3. СОЗДАНИЕ КОШЕЛЬКА ИЗ SEED-ФРАЗЫ И ПОЛУЧЕНИЕ КЛЮЧЕЙ
  // Создаем HD-узел (Hierarchical Deterministic Wallet) на основе мнемоники
  const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonic, derivationPath);

  // Получаем приватный и публичный ключи для указанного пути
  const privateKey = hdNode.privateKey;
  const publicKey = hdNode.publicKey;
  const address = hdNode.address; // Адрес кошелька, который виден всем

  console.log('\n✅ Ключи для индекса 4493 успешно сгенерированы:');
  console.log('-----------------------------------------------------');

  console.log('🔒 Приватный ключ (Private Key):');
  console.log(privateKey);

  console.log('\n🔑 Публичный ключ (Public Key):');
  console.log(publicKey);

  console.log('\n📫 Адрес кошелька (Address):');
  console.log(address);

  console.log('\n-----------------------------------------------------');
  console.log('✨ Генерация завершена!');
}

// Запускаем основную функцию и ловим возможные ошибки
generateWallet().catch((error) => {
  console.error('Произошла ошибка при генерации кошелька:', error);
});
