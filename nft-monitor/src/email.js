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
async function sendEmail(subject, text, html = null, to = null) {
  try {
    const mailOptions = {
      from: emailConfig.auth.user,
      to: to || process.env.EMAIL_RECIPIENT,
      subject,
      text,
    };
    if (html) {
      mailOptions.html = html;
    }
    await transporter.sendMail(mailOptions);
    console.log('Email отправлен');
  } catch (error) {
    console.error('Ошибка отправки email:', error);
  }
}

// Функция отправки алерта при изменении >10%
async function sendAlertReport(significantChanges, to = null) {
  if (significantChanges.length === 0) return;

  const message = significantChanges
    .map(([slug, data]) => {
      const change = data.fourHourChange > 0 ? '+' : '';
      return `${slug}: ${change}${data.fourHourChange.toFixed(2)}% (текущая цена: ${data.current})`;
    })
    .join('\n');

  await sendEmail(
    'Значительные изменения цен NFT',
    `Обнаружены изменения >10% за 4 часа:\n\n${message}`,
    null,
    to
  );
}

// Функция отправки ежедневного отчета
async function sendDailyReport(changes, to = null) {
  const validChanges = Object.entries(changes).filter(
    ([slug, data]) => data.dailyChange !== null
  );
  const totalChange =
    validChanges.length > 0
      ? validChanges.reduce((sum, [slug, data]) => sum + data.dailyChange, 0) /
        validChanges.length
      : 0;

  const htmlTable = `
    <h2>Ежедневный отчет по ценам NFT</h2>
    <p><strong>Среднее изменение за день: ${totalChange.toFixed(2)}%</strong></p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="padding: 8px; text-align: left;">Название коллекции</th>
          <th style="padding: 8px; text-align: left;">Текущая цена</th>
          <th style="padding: 8px; text-align: left;">Изменение</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(changes)
          .map(([slug, data]) => {
            const currentPrice = data.current
              ? parseFloat(data.current).toFixed(4)
              : 'N/A';
            const change = data.dailyChange !== null ? data.dailyChange : 0;
            const changeStr =
              change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
            const changeColor =
              change > 0 ? 'green' : change < 0 ? 'red' : 'black';
            return `
              <tr>
                <td style="padding: 8px;">${slug}</td>
                <td style="padding: 8px;">${currentPrice}</td>
                <td style="padding: 8px; color: ${changeColor};">${changeStr}</td>
              </tr>
            `;
          })
          .join('')}
      </tbody>
    </table>
  `;

  const textSummary = `Среднее изменение за день: ${totalChange.toFixed(2)}%\n\nДетали:\n${Object.entries(
    changes
  )
    .map(([slug, data]) => {
      if (data.dailyChange === null) return `${slug}: Нет данных за день`;
      const change = data.dailyChange > 0 ? '+' : '';
      return `${slug}: ${change}${data.dailyChange.toFixed(2)}% (текущая цена: ${data.current})`;
    })
    .join('\n')}`;

  await sendEmail('Ежедневный отчет по ценам NFT', textSummary, htmlTable, to);
}

module.exports = { sendEmail, sendAlertReport, sendDailyReport };
