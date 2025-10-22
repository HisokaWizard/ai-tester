const nodemailer = require('nodemailer');

// Конфигурация email из переменных окружения
const emailConfig = {
  host: 'smtp.yandex.ru',
  port: 587,
  requireTLS: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// Функция отправки email
async function sendEmail(subject, text) {
  try {
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: process.env.EMAIL_RECIPIENT,
      subject,
      text,
    });
    console.log('Email отправлен');
  } catch (error) {
    console.error('Ошибка отправки email:', error);
  }
}

// Функция отправки алерта при изменении >10%
async function sendAlertReport(significantChanges) {
  if (significantChanges.length === 0) return;

  const message = significantChanges
    .map(([slug, data]) => {
      const change = data.fourHourChange > 0 ? '+' : '';
      return `${slug}: ${change}${data.fourHourChange.toFixed(2)}% (текущая цена: ${data.current})`;
    })
    .join('\n');

  await sendEmail(
    'Значительные изменения цен NFT',
    `Обнаружены изменения >10% за 4 часа:\n\n${message}`
  );
}

// Функция отправки ежедневного отчета
async function sendDailyReport(changes) {
  const dailyChanges = Object.entries(changes)
    .map(([slug, data]) => {
      if (data.dailyChange === null) return `${slug}: Нет данных за день`;
      const change = data.dailyChange > 0 ? '+' : '';
      return `${slug}: ${change}${data.dailyChange.toFixed(2)}% (текущая цена: ${data.current})`;
    })
    .join('\n');

  const totalChange =
    Object.values(changes).reduce((sum, data) => {
      return sum + (data.dailyChange || 0);
    }, 0) / Object.keys(changes).length; // Среднее изменение

  const summary = `Среднее изменение за день: ${totalChange.toFixed(2)}%\n\nДетали:\n${dailyChanges}`;

  await sendEmail('Ежедневный отчет по ценам NFT', summary);
}

module.exports = { sendEmail, sendAlertReport, sendDailyReport };
